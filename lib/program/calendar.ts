import type { Workout } from "@/lib/workouts/model";
import { dateInZone, weekdayOf, type ProgramRecord } from "./types";
export type DayState =
  | "completed"
  | "skipped"
  | "not_logged"
  | "planned"
  | "rest"
  | "before_plan";
export function programForDate(programs: ProgramRecord[], date: string) {
  return (
    programs
      .filter((p) => p.program.startsOn <= date)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null
  );
}
export function calendarDay(
  date: string,
  today: string,
  programs: ProgramRecord[],
  sessions: Workout[],
  overrides: Record<string, "skipped" | "planned">,
  timeZone: string,
) {
  const completed = sessions.filter(
    (s) =>
      s.status === "completed" &&
      (s.scheduledFor || dateInZone(new Date(s.startedAt), timeZone)) === date,
  );
  const record = programForDate(programs, date);
  const day = record?.program.schedule.find(
    (d) => d.weekday === weekdayOf(date),
  );
  const state: DayState = completed.length
    ? "completed"
    : !record
      ? "before_plan"
      : day?.kind !== "training"
        ? "rest"
        : overrides[date] === "skipped"
          ? "skipped"
          : date < today
            ? "not_logged"
            : "planned";
  return { state, day, completed };
}
