export type AttendanceStatus = "present" | "missed" | "skipped";
export type AttendanceSource = "member" | "admin" | "auto";

export interface AttendanceRecord {
  id: string;
  memberUuid: string;
  day: string; // YYYY-MM-DD in IST
  status: AttendanceStatus;
  source: AttendanceSource;
  createdAt: string;
}

export interface DayAttendanceSummary {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // "MON", "TUE", etc.
  formattedDate: string; // "Mon, Sep 15"
  status: AttendanceStatus | "rest" | "unmarked";
  isToday: boolean;
  isPast: boolean;
  record?: AttendanceRecord;
}
