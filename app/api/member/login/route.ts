import { NextResponse } from "next/server";
import { authenticateMember } from "@/lib/services/memberService";
import {
  createMemberSessionToken,
  MEMBER_COOKIE_NAME,
  getMemberCookieOptions,
} from "@/lib/security/memberSession";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { memberId, pin } = body;

    if (!memberId || typeof memberId !== "string" || !pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, error: "Member ID and 4-digit PIN are required." },
        { status: 400 }
      );
    }

    const authResult = await authenticateMember(memberId, pin);

    if (!authResult.success || !authResult.member) {
      return NextResponse.json(
        { success: false, error: authResult.error || "Invalid Member ID or PIN." },
        { status: 401 }
      );
    }

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
  } catch (error: any) {
    console.error("Member login API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
