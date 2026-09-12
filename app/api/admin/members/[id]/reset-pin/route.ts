import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import { resetMemberPin, getMemberById } from "@/lib/services/memberService";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
    }

    const { id } = await params;
    const member = await getMemberById(id);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const customPin = typeof body?.pin === "string" && /^\d{4}$/.test(body.pin) ? body.pin : undefined;

    const result = await resetMemberPin(id, customPin);

    return NextResponse.json({
      success: true,
      memberId: result.member.memberId,
      fullName: result.member.fullName,
      newPin: result.newPin, // Displayed ONCE to the admin
      message: "PIN successfully reset. Please deliver this temporary PIN securely to the member.",
    });
  } catch (err: any) {
    console.error("Reset PIN error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 400 });
  }
}
