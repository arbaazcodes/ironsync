import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import {
  markAttendance,
  getMemberAttendance,
  getAttendanceWeekSummary,
} from "@/lib/services/attendanceService";
import { getMemberDashboardData } from "@/lib/services/memberService";
import { getTodayDateIST } from "@/lib/utils/dateIST";
import { AttendanceStatus } from "@/lib/types/attendance";
import { createNotification } from "@/lib/services/notificationService";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Member session required." }, { status: 401 });
    }

    const payload = verifyMemberSessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired member session." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get("range") || "30", 10);

    // Fetch member dashboard data to get plan schedule for auto-missed sync
    const dashData = await getMemberDashboardData(payload.memberId);
    const schedule = dashData?.assignedPlan?.schedule || [];

    // Week summary runs auto-missed check and produces 7-day summary
    const weekSummary = await getAttendanceWeekSummary(
      payload.id,
      schedule,
      dashData?.member?.startDate
    );

    // Full history for the requested range (e.g. 30 days)
    const history = await getMemberAttendance(payload.id, range);

    // Today's attendance status
    const todayIST = getTodayDateIST();
    const todayRecord = history.find((r) => r.day === todayIST);

    return NextResponse.json({
      success: true,
      todayDate: todayIST,
      today: todayRecord ? todayRecord.status : "unmarked",
      todayRecord: todayRecord || null,
      weekSummary,
      history,
    });
  } catch (err: any) {
    console.error("Member attendance GET error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Member session required." }, { status: 401 });
    }

    const payload = verifyMemberSessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired member session." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const rawStatus = body?.status || "present";

    if (!["present", "skipped"].includes(rawStatus)) {
      return NextResponse.json(
        { error: "Invalid attendance status. Must be 'present' or 'skipped'." },
        { status: 400 }
      );
    }

    const status = rawStatus as AttendanceStatus;
    const result = await markAttendance(payload.id, status, "member");

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to record attendance." },
        { status: 400 }
      );
    }

    // Realtime In-App Notification to Gym Admin
    createNotification({
      audience: "admin",
      memberUuid: payload.id,
      memberId: payload.memberId,
      type: "attendance_marked",
      title: "Member Check-In",
      body: `Member ${payload.memberId} recorded attendance as '${status}'.`,
      link: "/admin/members",
    }).catch((err) =>
      console.warn("[NotificationService] Failed to notify admin of member attendance:", err)
    );

    return NextResponse.json({
      success: true,
      status,
      record: result.record,
      message:
        status === "present"
          ? "Attendance recorded! Great work today."
          : "Session marked as skipped for today.",
    });
  } catch (err: any) {
    console.error("Member attendance POST error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
