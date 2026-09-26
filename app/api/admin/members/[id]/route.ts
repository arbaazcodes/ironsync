import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import { getMemberById, updateMember } from "@/lib/services/memberService";
import { UpdateMemberInput } from "@/lib/types/member";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isServiceRoleConfigured()) {
      return NextResponse.json(
        { error: "Server is missing Supabase service configuration" },
        { status: 503 }
      );
    }

    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
    }

    const { id } = await params;
    const member = await getMemberById(id);

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const { pinHash, ...safeMember } = member;
    return NextResponse.json({ success: true, member: safeMember });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isServiceRoleConfigured()) {
      return NextResponse.json(
        { error: "Server is missing Supabase service configuration" },
        { status: 503 }
      );
    }

    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json().catch(() => ({}))) as UpdateMemberInput;

    const updated = await updateMember(id, body, {
      id: admin.id,
      email: admin.email,
      type: "admin",
    });
    if (!updated) {
      return NextResponse.json({ error: "Member not found or update failed" }, { status: 404 });
    }

    const { pinHash, ...safeMember } = updated;
    return NextResponse.json({ success: true, member: safeMember });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 400 });
  }
}
