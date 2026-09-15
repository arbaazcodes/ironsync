import { NextResponse, type NextRequest } from "next/server";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { getExerciseMedia } from "@/lib/data/exerciseMedia";
import { getMealMedia } from "@/lib/data/mealMedia";

// In-memory rate limit store: key -> { count: number, date: string }
const rateLimitMap = new Map<string, { count: number; date: string }>();
const MAX_DAILY_GENERATIONS = 10;

function checkRateLimit(clientId: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().split("T")[0];
  const record = rateLimitMap.get(clientId);

  if (!record || record.date !== today) {
    rateLimitMap.set(clientId, { count: 1, date: today });
    return { allowed: true, remaining: MAX_DAILY_GENERATIONS - 1 };
  }

  if (record.count >= MAX_DAILY_GENERATIONS) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_DAILY_GENERATIONS - record.count };
}

export async function GET() {
  return NextResponse.json({
    enabled: Boolean(process.env.GEMINI_API_KEY),
    dailyLimit: MAX_DAILY_GENERATIONS,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type = "meal", title = "Fitness Meal", prompt } = body;

    // Identify user for rate limiting
    let clientId = "anonymous";
    const token = request.cookies.get(MEMBER_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyMemberSessionToken(token);
      if (payload?.memberId) {
        clientId = payload.memberId;
      }
    } else {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "anonymous";
      clientId = ip;
    }

    // Curated high-resolution fallback
    const fallbackUrl =
      type === "exercise"
        ? getExerciseMedia(title).imageUrl
        : getMealMedia(title).imageUrl;

    const geminiKey = process.env.GEMINI_API_KEY;

    // If Gemini key is not configured, silently return curated fallback
    if (!geminiKey) {
      return NextResponse.json({
        success: true,
        isGenerated: false,
        imageUrl: fallbackUrl,
        reason: "KEY_NOT_CONFIGURED",
        remaining: MAX_DAILY_GENERATIONS,
      });
    }

    // Check rate limit (10 / day)
    const { allowed, remaining } = checkRateLimit(clientId);
    if (!allowed) {
      return NextResponse.json({
        success: false,
        isGenerated: false,
        imageUrl: fallbackUrl,
        reason: "RATE_LIMIT_EXCEEDED",
        message: "Daily limit of 10 generations reached. Showing curated photo.",
        remaining: 0,
      });
    }

    // Attempt generation via Gemini Imagen if available
    try {
      const imagePrompt =
        prompt ||
        "High-end professional fitness photography of " + title + ", clean studio lighting, 8k resolution, authentic gym aesthetic, highly detailed.";

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": geminiKey,
          },
          body: JSON.stringify({
            instances: [{ prompt: imagePrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "1:1",
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
        if (b64) {
          return NextResponse.json({
            success: true,
            isGenerated: true,
            imageUrl: "data:image/jpeg;base64," + b64,
            remaining,
          });
        }
      }
    } catch {
      // Graceful fallback if model API fails or has quota limits
    }

    // Graceful fallback to curated library
    return NextResponse.json({
      success: true,
      isGenerated: false,
      imageUrl: fallbackUrl,
      reason: "FALLBACK_USED",
      remaining,
    });
  } catch (error) {
    // Never crash the UI
    return NextResponse.json(
      {
        success: false,
        imageUrl:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
        reason: "INTERNAL_FALLBACK",
      },
      { status: 200 }
    );
  }
}
