import { createServiceClient } from "../supabase/admin";
import {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSource,
  DayAttendanceSummary,
} from "../types/attendance";
import {
  getTodayDateIST,
  getDateOffsetIST,
  getDayOfWeekIST,
  formatReadableDateIST,
  getPastDatesRangeIST,
} from "../utils/dateIST";
import { getMemberById } from "./memberService";
import { WorkoutDayPlan } from "../types/onboarding";

// In-memory store for fallback if Supabase is offline in dev
const MEMORY_ATTENDANCE: Map<string, AttendanceRecord> = new Map();

function makeMemoryKey(memberUuid: string, day: string): string {
  return `${memberUuid}_${day}`;
}

function mapRowToRecord(row: any): AttendanceRecord {
  return {
    id: row.id,
    memberUuid: row.member_uuid,
    day: row.day,
    status: row.status as AttendanceStatus,
    source: row.source as AttendanceSource,
    createdAt: row.created_at,
  };
}

/**
 * Marks attendance for a member for a given calendar day (defaults to today in IST).
 * Expired or suspended members are blocked if source is "member".
 */
export async function markAttendance(
  memberUuid: string,
  status: AttendanceStatus,
  source: AttendanceSource = "member",
  day?: string
): Promise<{ success: boolean; record?: AttendanceRecord; error?: string }> {
  const targetDay = day || getTodayDateIST();
  const todayIST = getTodayDateIST();

  // Validate member status
  const member = await getMemberById(memberUuid);
  if (!member) {
    return { success: false, error: "Member not found." };
  }

  // Member initiated: verify membership is currently active
  if (source === "member") {
    if (member.status === "expired" || member.status === "suspended" || member.status === "inactive") {
      return {
        success: false,
        error: `Membership is ${member.status}. Please visit the front desk to renew your access.`,
      };
    }

    if (member.expiryDate && member.expiryDate < todayIST) {
      return {
        success: false,
        error: "Membership has expired. Please visit the front desk to renew your access.",
      };
    }
  }

  const supabase = createServiceClient();

  if (supabase) {
    try {
      const { data, error } = await (supabase as any)
        .from("attendance")
        .upsert(
          {
            member_uuid: memberUuid,
            day: targetDay,
            status,
            source,
            created_at: new Date().toISOString(),
          },
          { onConflict: "member_uuid,day" }
        )
        .select()
        .single();

      if (error) {
        console.error("Attendance upsert error in Supabase:", error);
        return { success: false, error: error.message };
      }

      const record = mapRowToRecord(data);
      MEMORY_ATTENDANCE.set(makeMemoryKey(memberUuid, targetDay), record);
      return { success: true, record };
    } catch (err: any) {
      console.error("Attendance service exception:", err);
      return { success: false, error: err?.message || "Database connection error" };
    }
  }

  // Local in-memory fallback
  const memoryRecord: AttendanceRecord = {
    id: `att-${Date.now()}`,
    memberUuid,
    day: targetDay,
    status,
    source,
    createdAt: new Date().toISOString(),
  };
  MEMORY_ATTENDANCE.set(makeMemoryKey(memberUuid, targetDay), memoryRecord);
  return { success: true, record: memoryRecord };
}

/**
 * Retrieves attendance records for a member over the specified past range in days.
 */
export async function getMemberAttendance(
  memberUuid: string,
  days: number = 30
): Promise<AttendanceRecord[]> {
  const startDate = getDateOffsetIST(-days);
  const supabase = createServiceClient();

  if (supabase) {
    try {
      const { data, error } = await (supabase as any)
        .from("attendance")
        .select("*")
        .eq("member_uuid", memberUuid)
        .gte("day", startDate)
        .order("day", { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(mapRowToRecord);
      }
    } catch (err) {
      console.error("Error fetching member attendance from Supabase:", err);
    }
  }

  // Memory fallback
  const records: AttendanceRecord[] = [];
  for (const record of MEMORY_ATTENDANCE.values()) {
    if (record.memberUuid === memberUuid && record.day >= startDate) {
      records.push(record);
    }
  }
  return records.sort((a, b) => b.day.localeCompare(a.day));
}

/**
 * Synchronizes auto-missed attendance records for past scheduled training days.
 * Rule:
 * - If a past calendar day (yesterday or earlier, up to 7 days ago) was a scheduled workout day
 *   and has NO attendance record, automatically upsert status="missed", source="auto".
 * - Scheduled rest days are never marked as missed.
 */
export async function syncMissedAttendanceForMember(
  memberUuid: string,
  schedule: WorkoutDayPlan[],
  memberStartDate?: string
): Promise<void> {
  const todayIST = getTodayDateIST();
  const pastDates = getPastDatesRangeIST(7).filter((d) => d < todayIST);
  const supabase = createServiceClient();

  // Fetch existing attendance for these past dates
  const existingRecords = await getMemberAttendance(memberUuid, 8);
  const existingDaysSet = new Set(existingRecords.map((r) => r.day));

  const missedToInsert: Array<{
    member_uuid: string;
    day: string;
    status: "missed";
    source: "auto";
    created_at: string;
  }> = [];

  for (const dateStr of pastDates) {
    // Never auto-miss dates before the member enrolled
    if (memberStartDate && dateStr < memberStartDate) {
      continue;
    }

    // If day already has an attendance record (present, skipped, missed), skip
    if (existingDaysSet.has(dateStr)) {
      continue;
    }

    // Check if this date was a scheduled workout day in the plan
    const dayOfWeek = getDayOfWeekIST(dateStr); // e.g. "MON", "TUE"
    const scheduledDay = findScheduledDayForDate(dayOfWeek, schedule);

    // Only scheduled workouts trigger auto-missed (Rest days are ignored)
    if (scheduledDay && scheduledDay.type === "workout") {
      missedToInsert.push({
        member_uuid: memberUuid,
        day: dateStr,
        status: "missed",
        source: "auto",
        created_at: new Date().toISOString(),
      });
    }
  }

  if (missedToInsert.length > 0 && supabase) {
    try {
      await (supabase as any)
        .from("attendance")
        .upsert(missedToInsert, { onConflict: "member_uuid,day" });
    } catch (err) {
      console.warn("Could not upsert auto-missed attendance:", err);
    }
  }
}

/**
 * Generates an 7-day attendance summary (past 6 days + today) for dashboard visualization.
 */
export async function getAttendanceWeekSummary(
  memberUuid: string,
  schedule: WorkoutDayPlan[],
  memberStartDate?: string
): Promise<DayAttendanceSummary[]> {
  // Sync auto-missed first
  await syncMissedAttendanceForMember(memberUuid, schedule, memberStartDate);

  const todayIST = getTodayDateIST();
  const dates = getPastDatesRangeIST(7); // e.g. [6 days ago, ..., today]
  const records = await getMemberAttendance(memberUuid, 8);
  const recordsMap = new Map<string, AttendanceRecord>(records.map((r) => [r.day, r]));

  return dates.map((dateStr) => {
    const isToday = dateStr === todayIST;
    const isPast = dateStr < todayIST;
    const dayOfWeek = getDayOfWeekIST(dateStr);
    const scheduledDay = findScheduledDayForDate(dayOfWeek, schedule);
    const isRest = scheduledDay?.type === "recovery";
    const existing = recordsMap.get(dateStr);

    let status: AttendanceStatus | "rest" | "unmarked";
    if (existing) {
      status = existing.status;
    } else if (isRest) {
      status = "rest";
    } else {
      status = "unmarked";
    }

    return {
      date: dateStr,
      dayOfWeek,
      formattedDate: formatReadableDateIST(dateStr),
      status,
      isToday,
      isPast,
      record: existing,
    };
  });
}

/**
 * Batch retrieves the last 7 days of attendance for a list of members.
 * Used by the Admin Members roster table.
 */
export async function getAttendanceForMembersBatch(
  memberUuids: string[]
): Promise<Record<string, AttendanceRecord[]>> {
  const result: Record<string, AttendanceRecord[]> = {};
  memberUuids.forEach((id) => (result[id] = []));

  if (memberUuids.length === 0) return result;

  const startDate = getDateOffsetIST(-7);
  const supabase = createServiceClient();

  if (supabase) {
    try {
      const { data, error } = await (supabase as any)
        .from("attendance")
        .select("*")
        .in("member_uuid", memberUuids)
        .gte("day", startDate)
        .order("day", { ascending: false });

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          const rec = mapRowToRecord(row);
          if (result[rec.memberUuid]) {
            result[rec.memberUuid].push(rec);
          }
        }
      }
    } catch (err) {
      console.warn("Error fetching batch member attendance:", err);
    }
  }

  return result;
}

/**
 * Resolves a scheduled day from a plan schedule by 3-letter weekday abbreviation or day index.
 */
export function findScheduledDayForDate(
  dayOfWeek: string, // "MON", "TUE", etc.
  schedule: WorkoutDayPlan[]
): WorkoutDayPlan | undefined {
  if (!schedule || schedule.length === 0) return undefined;

  // 1. Direct day name match ("MON", "TUE", etc.)
  const directMatch = schedule.find(
    (s) => s.dayName.toUpperCase() === dayOfWeek.toUpperCase()
  );
  if (directMatch) return directMatch;

  // 2. Map dayOfWeek to standard 7-day week index (MON=0, TUE=1, ... SUN=6)
  const weekMap: Record<string, number> = {
    MON: 0,
    TUE: 1,
    WED: 2,
    THU: 3,
    FRI: 4,
    SAT: 5,
    SUN: 6,
  };
  const targetIndex = weekMap[dayOfWeek.toUpperCase()] ?? 0;

  if (schedule.length === 7) {
    return schedule[targetIndex];
  }

  // If schedule has fewer or more days, use modular mapping
  return schedule[targetIndex % schedule.length];
}
