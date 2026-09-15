/**
 * Utility functions for Indian Standard Time (IST, UTC+5:30)
 * Ensures consistent calendar day boundaries across all server runtimes.
 */

export function getTodayDateIST(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

export function getDateOffsetIST(daysOffset: number): string {
  const now = new Date();
  const d = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(d);
}

export function getDayOfWeekIST(dateStr?: string): string {
  // Use noon to avoid any timezone boundary slips
  const date = dateStr ? new Date(`${dateStr}T12:00:00+05:30`) : new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  });
  return formatter.format(date).toUpperCase(); // e.g. "MON", "TUE"
}

export function getPastDatesRangeIST(days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(getDateOffsetIST(-i));
  }
  return dates;
}

export function formatReadableDateIST(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00+05:30`);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(date);
}
