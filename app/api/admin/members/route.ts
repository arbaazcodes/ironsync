import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import { getMembers, createMember } from "@/lib/services/memberService";
import { getAttendanceForMembersBatch } from "@/lib/services/attendanceService";
import { CreateMemberInput, MemberStatus } from "@/lib/types/member";

export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const statusParam = searchParams.get("status");
    const status = (statusParam && ["active", "inactive", "suspended", "expired"].includes(statusParam))
      ? (statusParam as MemberStatus)
      : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as any) || "desc";

    const members = await getMembers({
      search,
      status,
      sortBy,
      sortOrder,
    });

    // Strip pinHash from all responses
    const sanitized = members.map(({ pinHash, ...safeMember }) => safeMember);

    const includeAttendance = searchParams.get("includeAttendance") === "true";
    let attendanceMap: Record<string, any> = {};
    if (includeAttendance && sanitized.length > 0) {
      const memberUuids = sanitized.map((m) => m.id);
      attendanceMap = await getAttendanceForMembersBatch(memberUuids);
    }

    return NextResponse.json({
      success: true,
      count: sanitized.length,
      members: sanitized,
      attendance: attendanceMap,
    });
  } catch (err: any) {
    console.error("Admin members GET error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin authentication required." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as CreateMemberInput;

    if (!body.fullName || typeof body.fullName !== "string" || !body.fullName.trim()) {
      return NextResponse.json({ error: "Member full name is required." }, { status: 400 });
    }

    if (!body.phone || typeof body.phone !== "string" || body.phone.trim().length < 7) {
      return NextResponse.json({ error: "A valid phone number is required." }, { status: 400 });
    }

    const result = await createMember(body, admin.id);

    // Omit pinHash from member object returned
    const { pinHash, ...safeMember } = result.member;

    return NextResponse.json(
      {
        success: true,
        member: safeMember,
        rawPin: result.rawPin, // Displayed ONCE to the admin
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Admin create member POST error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 400 });
  }
}
