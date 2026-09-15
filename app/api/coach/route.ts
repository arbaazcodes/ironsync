import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";

// Rate limiter: 20 messages per member per hour
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const coachRateLimits = new Map<string, RateLimitEntry>();
const HOURLY_LIMIT = 20;
const ONE_HOUR_MS = 60 * 60 * 1000;

function checkHourlyRateLimit(memberKey: string): { allowed: boolean; remaining: number; resetInMinutes: number } {
  const now = Date.now();
  const entry = coachRateLimits.get(memberKey);

  if (!entry || now > entry.resetAt) {
    coachRateLimits.set(memberKey, { count: 1, resetAt: now + ONE_HOUR_MS });
    return { allowed: true, remaining: HOURLY_LIMIT - 1, resetInMinutes: 60 };
  }

  if (entry.count >= HOURLY_LIMIT) {
    const resetInMinutes = Math.max(1, Math.ceil((entry.resetAt - now) / (60 * 1000)));
    return { allowed: false, remaining: 0, resetInMinutes };
  }

  entry.count += 1;
  const resetInMinutes = Math.max(1, Math.ceil((entry.resetAt - now) / (60 * 1000)));
  return { allowed: true, remaining: HOURLY_LIMIT - entry.count, resetInMinutes };
}

interface CoachMessageHistory {
  sender: "user" | "coach";
  text: string;
}

interface CoachRequestBody {
  message: string;
  history?: CoachMessageHistory[];
  context?: {
    memberName?: string;
    goal?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    split?: string;
    diet?: string;
    todayWorkout?: string;
    todayExercises?: string[];
    injuries?: string;
    experienceLevel?: string;
    daysPerWeek?: number;
    weightKg?: number;
  };
}

export async function GET() {
  return NextResponse.json({
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hourlyLimit: HOURLY_LIMIT,
  });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session: check Member Cookie FIRST, then Supabase Auth
    let memberName = "Athlete";
    let isMemberAuth = false;
    let memberIdentifier = "anonymous";

    const token = request.cookies.get(MEMBER_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyMemberSessionToken(token);
      if (payload) {
        memberName = payload.fullName || "Athlete";
        memberIdentifier = payload.memberId || payload.id || "member";
        isMemberAuth = true;
      }
    }

    if (!isMemberAuth) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const response = NextResponse.next();
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        });

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          memberName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin Coach";
          memberIdentifier = user.id;
        }
      }
    }

    // Fallback to IP if not authenticated
    if (memberIdentifier === "anonymous") {
      memberIdentifier =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "anonymous";
    }

    // 2. Rate limiting check: 20 messages per member per hour
    const rateCheck = checkHourlyRateLimit(memberIdentifier);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED",
          reply: `Hourly limit reached (20 msgs/hr). Focus on executing your sets on the gym floor and check back in ~${rateCheck.resetInMinutes} min!`,
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // 3. Validate input
    const body = (await request.json().catch(() => ({}))) as CoachRequestBody;
    const rawMessage = body?.message?.trim();

    if (!rawMessage) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    if (rawMessage.length > 600) {
      return NextResponse.json(
        { error: "Query exceeds maximum length of 600 characters." },
        { status: 400 }
      );
    }

    const context = body.context || {};
    const name = context.memberName || memberName;
    const goal = context.goal || "Hypertrophy & Strength";
    const calories = context.calories || 2400;
    const protein = context.protein || 180;
    const carbs = context.carbs || 280;
    const fat = context.fat || 65;
    const split = context.split || "Push / Pull / Legs";
    const diet = context.diet || "non_vegetarian";
    const todayWorkout = context.todayWorkout || "Scheduled Training Session";
    const experience = context.experienceLevel || "Intermediate";
    const daysPerWeek = context.daysPerWeek || 4;
    const injuries = context.injuries || "";
    const exercisesList =
      context.todayExercises && context.todayExercises.length > 0
        ? context.todayExercises.slice(0, 5).join(", ")
        : "Compound & accessory target movements";

    // 4. Call Gemini if GEMINI_API_KEY exists (No OpenAI requirement)
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      // Build conversation history (max 8 messages)
      let historyText = "";
      if (Array.isArray(body.history) && body.history.length > 0) {
        const recent = body.history.slice(-8);
        historyText =
          "Recent conversation:\n" +
          recent
            .map(
              (h) =>
                `${h.sender === "user" ? "Athlete" : "Coach"}: ${h.text}`
            )
            .join("\n") +
          "\n\n";
      }

      const systemPrompt = `You are IronSync Coach, an experienced gym trainer standing right on the floor with your athlete.
Voice: Direct, clear, encouraging, no fluff, no medical diagnosis.
Talk like a coach on the floor: "Do this next session", exact sets/reps/rest, form cues, what to eat today.
Never say "as an AI language model" or refer to yourself as an AI.

Active Athlete Profile (USE ONLY THESE EXACT NUMBERS):
- Athlete Name: ${name}
- Goal: ${goal}
- Caloric Target: ${calories} kcal/day
- Protein Target: ${protein}g/day (Carbs: ${carbs}g, Fats: ${fat}g)
- Diet Type: ${diet}
- Training Split: ${split} (${daysPerWeek} days/week)
- Experience Level: ${experience}
- Today's Workout: ${todayWorkout}
- Today's Exercises: ${exercisesList}
${injuries ? `- Injuries/Physical Notes: ${injuries}` : ""}

STRICT OPERATING RULES:
1. Answer ONLY using that athlete's numbers (${calories} kcal, ${protein}g protein).
2. If they ask "what should I eat" or ask about food, give today's exact meals from their ${calories} kcal and ${protein}g protein target matching their ${diet} diet (e.g. if vegetarian, paneer, lentils, greek yogurt, tofu, oats; no meat).
3. If they ask form (e.g., "bench kaise karun?" or "how to squat"), give EXACTLY:
   - 4 sharp biomechanical form cues
   - 2 critical mistakes to avoid
4. If data is missing to answer safely, ask ONE direct question.
5. Under 160 words total. Use bullet points and end with ONE clear next action.
6. Language: Naturally match the athlete's language and tone. If they ask in Hindi/Hinglish (e.g., "protein kitna khana hai?"), reply in natural Hinglish with their exact ${protein}g protein.
7. Refuse medical diagnosis, steroids, SARMs, or crash-diet advice.`;

      // Try flash models: prefer gemini-2.0-flash / gemini-1.5-flash, fallback to gemini-flash-latest / gemini-3.6-flash
      const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-flash-latest",
        "gemini-3.6-flash",
      ];

      for (const model of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": geminiKey,
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `${systemPrompt}\n\n${historyText}Athlete: ${rawMessage}\n\nCoach:`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  maxOutputTokens: 300,
                  temperature: 0.65,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const gData = await geminiRes.json();
            const reply = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply && reply.trim()) {
              return NextResponse.json({
                success: true,
                reply: reply.trim(),
                source: "gemini",
                model,
                remaining: rateCheck.remaining,
                timestamp: new Date().toISOString(),
              });
            }
          }
        } catch {
          // Try next model in sequence
        }
      }
    }

    // 5. Deterministic Sports Science Engine Fallback (<160 words, bulleted + 1 action)
    const reply = generateDeterministicCoachAdvice(rawMessage, {
      name,
      goal,
      calories,
      protein,
      carbs,
      fat,
      split,
      diet,
      todayWorkout,
      experience,
      todayExercises: context.todayExercises,
    });

    return NextResponse.json({
      success: true,
      reply,
      source: "ironsync-engine",
      isBasicMode: !geminiKey,
      remaining: rateCheck.remaining,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("IRONSync Coach API Error:", error);
    return NextResponse.json(
      { error: "Internal Coach Service failure", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Deterministic sports-science engine fallback.
 * Strictly formatted under 160 words in athletic bullets + 1 next action.
 */
function generateDeterministicCoachAdvice(
  query: string,
  ctx: {
    name: string;
    goal: string;
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
    split: string;
    diet: string;
    todayWorkout: string;
    experience: string;
    todayExercises?: string[];
  }
): string {
  const q = query.toLowerCase();

  // 1. Bench Press / Chest Form (Hindi / Hinglish / English)
  if (q.includes("bench") || q.includes("chest press")) {
    return `### ⚡ BENCH PRESS EXECUTION
4 Form Cues:
- **Scapular Retraction**: Pin shoulder blades back and down hard into the bench pad.
- **Arch & Leg Drive**: Drive heels into the floor to lock pelvis; do not lift glutes.
- **Bar Path**: Lower in a slight diagonal to lower sternum, wrists stacked straight.
- **Elbow Tuck**: Flare at 45–60°, avoid 90° shoulder flare.

2 Mistakes to Avoid:
- Bouncing the bar off ribs to create false momentum.
- Letting wrists bend backward under load.

**Next Action**: Warm up with empty bar, then hit 3 × 6-8 reps at RPE 8.0 today.`;
  }

  // 2. Squat Form
  if (q.includes("squat")) {
    return `### ⚡ SQUAT EXECUTION
4 Form Cues:
- **Tripod Foot**: Grip floor through big toe, pinky toe, and heel.
- **Bracing**: Inhale 360° belly breath into your core before initiating descent.
- **Knee Tracking**: Drive knees out in line with second toe.
- **Depth**: Break parallel with chest proud and spine neutral.

2 Mistakes to Avoid:
- Collapsing knees inward (valgus) on the ascent.
- Shifting weight into toes and raising heels off the floor.

**Next Action**: Take your main squat sets to 3 × 8 at RPE 8.0, resting 120s between sets.`;
  }

  // 3. Deadlift Form
  if (q.includes("deadlift") || q.includes("rdl")) {
    return `### ⚡ DEADLIFT EXECUTION
4 Form Cues:
- **Slack Pull**: Wedge hips down until barbell clicks against plates before floor drive.
- **Lat Lock**: Squeeze armpits shut like protecting a hundred-dollar bill.
- **Leg Press Floor**: Drive feet through the floor instead of yanking with upper back.
- **Bar Proximity**: Keep the bar scraping shins all the way to hip lock.

2 Mistakes to Avoid:
- Rounding lower lumbar spine during floor break.
- Hyperextending lower back at the top lockout.

**Next Action**: Execute 3 working sets of 5 reps at RPE 8.5 with strict 2s eccentric.`;
  }

  // 4. Protein / Diet Inquiry (handles "protein kitna khana hai?", "what to eat")
  if (q.includes("protein") || q.includes("diet") || q.includes("eat") || q.includes("khana")) {
    const isVeg = ctx.diet.includes("veg") && !ctx.diet.includes("non");
    return `### ⚡ DAILY NUTRITION DIRECTIVE
Targets calibrated to your profile:
- **Protein Goal**: Exactly **${ctx.protein}g protein** today.
- **Calorie Anchor**: Exactly **${ctx.calories} kcal/day** (${ctx.goal.replace("_", " ")}).
- **Today's Protein Sources (${ctx.diet.replace("_", " ")})**:
  ${isVeg ? "- 200g low-fat paneer/tofu (36g protein)\n  - 1 bowl yellow moong dal + quinoa (24g protein)\n  - 250g greek yogurt / curd (20g protein)\n  - 1 scoop whey/plant isolate post-workout (25g protein)" : "- 220g grilled chicken/fish (50g protein)\n  - 3 whole eggs + 2 whites (26g protein)\n  - 1 cup Greek yogurt / cottage cheese (22g protein)\n  - 1 scoop whey isolate (25g protein)"}

**Next Action**: Log your post-workout meal within 60 minutes to lock in muscle protein synthesis.`;
  }

  // 5. Swap / Substitution
  if (q.includes("swap") || q.includes("substitute") || q.includes("replace") || q.includes("alternate")) {
    return `### ⚡ MOVEMENT SWAP DIRECTIVE
For your **${ctx.todayWorkout}**:
- **Compound Press**: Swap Barbell Bench with Incline Dumbbell Press or Weighted Dips (reduced shoulder impingement).
- **Leg Compound**: Swap Back Squat with Dumbbell Bulgarian Split Squats or Hack Squats (same quad hypertrophy, zero spinal axial load).
- **Back Pull**: Swap Deadlift or Barbell Row with Chest-Supported Incline Row.

**Next Action**: Pick one substitution and match the prescribed sets/reps (e.g. 3 × 8-10).`;
  }

  // 6. Soreness / Recovery / Joint Strain
  if (q.includes("sore") || q.includes("pain") || q.includes("recovery") || q.includes("sleep")) {
    return `### ⚡ RECOVERY PROTOCOL
- **Active Flush**: 15 minutes of Zone 2 cardio (incline walking) to clear metabolic waste.
- **Sleep Requirement**: 8 hours non-negotiable; 70% of growth hormone releases during Stage 3/4 sleep.
- **Hydration**: Drink 3.5L water today with a pinch of electrolytes.
- **Protein Floor**: Maintain your **${ctx.protein}g protein** to repair microtrauma.

**Next Action**: Complete 10 minutes of hamstring and hip mobility before sleeping tonight.`;
  }

  // 7. Today's Workout Inquiry
  if (q.includes("workout") || q.includes("today") || q.includes("exercise")) {
    const exercises = ctx.todayExercises?.slice(0, 4).join(", ") || "scheduled compound movements";
    return `### ⚡ TODAY'S TRAINING DIRECTIVE
- **Session**: **${ctx.todayWorkout}** under your **${ctx.split}** split.
- **Key Lifts**: ${exercises}.
- **Target Intensity**: All working sets at **RPE 8.0 - 8.5** (1-2 reps in reserve).
- **Rest Period**: 90-120 seconds between compound working sets.

**Next Action**: Hit the gym floor, start your warmup sets, and log each working set in the tracker!`;
  }

  // 8. Default Direct Trainer Advice
  return `### ⚡ COACH DIRECTIVE
Athlete **${ctx.name}** &bull; **${ctx.goal.replace("_", " ")}**:
- **Today's Session**: **${ctx.todayWorkout}** (${ctx.split}).
- **Daily Fuel Anchor**: **${ctx.calories} kcal** and **${ctx.protein}g protein** strictly.
- **Intensity Target**: RPE 8.0 - 8.5 on all working sets.
- **Discipline**: Never sacrifice biomechanical form for heavy weight on the bar.

**Next Action**: Head to the Workout tab, execute your sets, and hit your protein target today.`;
}
