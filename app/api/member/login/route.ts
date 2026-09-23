import { NextResponse } from "next/server";
import { authenticateMember } from "@/lib/services/memberService";
import {
  createMemberSessionToken,
  MEMBER_COOKIE_NAME,
  getMemberCookieOptions,
} from "@/lib/security/memberSession";
import {
  isMemberLocked,
  recordFailedAttempt,
  clearRateLimit,
} from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const { memberId, pin } = body;

    if (!memberId || typeof memberId !== "string" || !pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, error: "Member ID and 4-digit PIN are required." },
        { status: 400 }
      );
    }

    const cleanMemberId = memberId.trim().toUpperCase();
    const cleanPin = pin.trim();

    // 1. Check if Member ID is currently locked out
    if (isMemberLocked(cleanMemberId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed attempts. Please try again in 15 minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "900",
          },
        }
      );
    }

    // 2. Authenticate Member ID and PIN
    const authResult = await authenticateMember(cleanMemberId, cleanPin);

    if (!authResult.success || !authResult.member) {
      // Record failed attempt
      recordFailedAttempt(cleanMemberId);

      return NextResponse.json(
        {
          success: false,
          error: authResult.error || "Invalid Member ID or PIN.",
        },
        { status: 401 }
      );
    }

    // 3. Clear rate limit tracking on successful login
    clearRateLimit(cleanMemberId);

    const member = authResult.member;

    // Create cryptographically signed HMAC session token
    const token = createMemberSessionToken({
      id: member.id,
      memberId: member.memberId,
      fullName: member.fullName,
      status: member.status,
      planId: member.planId,
    });

    const response = NextResponse.json({
      success: true,
      member: {
        id: member.id,
        memberId: member.memberId,
        fullName: member.fullName,
        status: member.status,
        planId: member.planId,
        startDate: member.startDate,
        expiryDate: member.expiryDate,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set(MEMBER_COOKIE_NAME, token, getMemberCookieOptions());

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Member login API error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
