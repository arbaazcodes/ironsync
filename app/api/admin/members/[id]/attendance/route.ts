import { NextResponse, type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/security/adminAuth";
import {
  getMemberAttendance,
  markAttendance,
  getAttendanceWeekSummary,
} from "@/lib/services/attendanceService";
import { getMemberById, getMemberDashboardData } from "@/lib/services/memberService";
import { AttendanceStatus } from "@/lib/types/attendance";
import { getTodayDateIST } from "@/lib/utils/dateIST";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    const member = await getMemberById(id);
    if (!member) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get("range") || "30", 10);

    const history = await getMemberAttendance(member.id, range);
    const dashData = await getMemberDashboardData(member.memberId);
    const schedule = dashData?.assignedPlan?.schedule || [];

    const weekSummary = await getAttendanceWeekSummary(
      member.id,
      schedule,
      member.startDate
    );

    const todayIST = getTodayDateIST();
    const todayRecord = history.find((r) => r.day === todayIST);

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        memberId: member.memberId,
        fullName: member.fullName,
      },
      today: todayRecord ? todayRecord.status : "unmarked",
      weekSummary,
      history,
    });
  } catch (err: any) {
    console.error("Admin member attendance GET error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;
    const member = await getMemberById(id);
    if (!member) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const rawStatus = body?.status || "present";
    const day = body?.day; // optional date override (e.g. YYYY-MM-DD)

    if (!["present", "missed", "skipped"].includes(rawStatus)) {
      return NextResponse.json(
        { error: "Invalid attendance status. Must be 'present', 'missed', or 'skipped'." },
        { status: 400 }
      );
    }

    const status = rawStatus as AttendanceStatus;
    const result = await markAttendance(member.id, status, "admin", day);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to mark attendance." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      status,
      record: result.record,
      message: `Attendance updated to '${status}' by front desk.`,
    });
  } catch (err: any) {
    console.error("Admin member attendance POST error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
