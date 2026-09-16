import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import { getMemberById } from "@/lib/services/memberService";
import { getMemberAuditLog } from "@/lib/services/auditLogService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const member = await getMemberById(id);

    if (!member) {
      return NextResponse.json(
        { error: "Member not found." },
        { status: 404 }
      );
    }

    // Retrieve latest 50 audit records for this member
    const auditLog = await getMemberAuditLog(member.id, 50);

    return NextResponse.json({
      success: true,
      memberId: member.memberId,
      fullName: member.fullName,
      auditLog,
    });
  } catch (err: any) {
    console.error("GET /api/admin/members/[id]/audit error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
