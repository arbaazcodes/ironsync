import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { getMemberDashboardData } from "@/lib/services/memberService";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";

export async function GET() {
  try {
    if (!isServiceRoleConfigured()) {
      return NextResponse.json(
        { error: "Server is missing Supabase service configuration" },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyMemberSessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const data = await getMemberDashboardData(payload.memberId);
    if (!data) {
      return NextResponse.json({ error: "Member profile not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Member dashboard API error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
