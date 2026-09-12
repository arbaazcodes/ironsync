import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { getMemberById } from "@/lib/services/memberService";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, member: null }, { status: 401 });
    }

    const payload = verifyMemberSessionToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, member: null }, { status: 401 });
    }

    // Verify member is still active in database
    const member = await getMemberById(payload.id);
    if (!member) {
      return NextResponse.json(
        { authenticated: false, error: "Member not found", member: null },
        { status: 404 }
      );
    }

    if (member.status !== "active") {
      return NextResponse.json(
        { authenticated: false, error: `Account status is ${member.status}`, member: null },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      member: {
        id: member.id,
        memberId: member.memberId,
        fullName: member.fullName,
        phone: member.phone,
        email: member.email,
        status: member.status,
        planId: member.planId,
        startDate: member.startDate,
        expiryDate: member.expiryDate,
        fitnessGoal: member.fitnessGoal,
      },
    });
  } catch (err: any) {
    console.error("Member session error:", err);
    return NextResponse.json(
      { authenticated: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
