"use client";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useProgram } from "./ProgramProvider";
import { useWorkoutState } from "@/components/workout/WorkoutProvider";
import { calendarDay, type DayState } from "@/lib/program/calendar";
import {
  dateInZone,
  monthRange,
  shiftDate,
  weekdayOf,
} from "@/lib/program/types";
import {
  remoteWorkoutSchema,
  workoutTotals,
  type Workout,
} from "@/lib/workouts/model";
import { PageHeading, Panel, primary, secondary } from "./ui";
const labels: Record<DayState, string> = {
  completed: "Completed",
  skipped: "Skipped",
  not_logged: "Not logged",
  planned: "Planned",
  rest: "Rest day",
  before_plan: "No plan yet",
};
export function CalendarPage() {
  const { program, programs, overrides, markDay } = useProgram();
  const workout = useWorkoutState();
  const params = useSearchParams();
  const today = dateInZone(new Date(), program?.preferences.timeZone || "UTC");
  const requested = params.get("date");
  const initial =
    requested && z.iso.date().safeParse(requested).success ? requested : today;
  const [selected, setSelected] = useState(initial);
  const [month, setMonth] = useState(initial.slice(0, 7));
  const [sessions, setSessions] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const range = monthRange(month);
    const query = new URLSearchParams({
      from: shiftDate(range.first, -1) + "T00:00:00Z",
      to: shiftDate(range.last, 2) + "T00:00:00Z",
    });
    void fetch("/api/workouts?" + query, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setSessions(
          result.sessions.map(
            (row: unknown) => remoteWorkoutSchema.parse(row).session,
          ),
        );
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            "Workout history could not be loaded. Retry before interpreting this calendar.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [month, retry, workout.history]);
  if (!program) return null;
  const merged = new Map(sessions.map((s) => [s.id, s]));
  if (workout.draft)
    merged.set(workout.draft.session.id, workout.draft.session);
  const all = [...merged.values()];
  const range = monthRange(month);
  const offset = (weekdayOf(range.first) + 6) % 7;
  const days = Number(range.last.slice(-2));
  const dates = Array.from(
    { length: days },
    (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
  );
  const get = (date: string) =>
    calendarDay(
      date,
      today,
      programs,
      all,
      overrides,
      program.preferences.timeZone,
    );
  const selectedDay = get(selected);
  function move(delta: number) {
    const d = new Date(month + "-15T12:00:00Z");
    d.setUTCMonth(d.getUTCMonth() + delta);
    const next = d.toISOString().slice(0, 7);
    setMonth(next);
    setSelected(next + "-01");
  }
  async function mark() {
    setSaving(true);
    setError("");
    try {
      await markDay(
        selected,
        selectedDay.state === "skipped" ? "planned" : "skipped",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <PageHeading eyebrow="Every session counts" title="Your calendar." />
      <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <button
              className={secondary + " !px-3"}
              aria-label="Previous month"
              onClick={() => move(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold">
              {new Date(month + "-15T12:00:00Z").toLocaleDateString("en", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </h2>
            <button
              className={secondary + " !px-3"}
              aria-label="Next month"
              onClick={() => move(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {loading ? (
            <p className="py-16 text-center text-sm" role="status">
              Loading your workouts…
            </p>
          ) : error ? (
            <div className="py-8">
              <p role="alert" className="text-sm">
                {error}
              </p>
              <button
                className={secondary + " mt-4"}
                onClick={() => setRetry((n) => n + 1)}
              >
                Retry history
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-7 text-center text-xs text-primary-muted">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <span key={i} className="py-2">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: offset }, (_, i) => (
                  <span key={"blank" + i} />
                ))}
                {dates.map((date) => {
                  const status = get(date).state;
                  return (
                    <button
                      key={date}
                      aria-label={`${date}: ${labels[status]}`}
                      aria-pressed={selected === date}
                      onClick={() => setSelected(date)}
                      className={
                        "relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border text-sm " +
                        (selected === date
                          ? "border-primary"
                          : "border-transparent") +
                        " " +
                        (status === "completed"
                          ? "bg-primary text-background"
                          : status === "skipped"
                            ? "bg-accent/10 text-accent"
                            : date === today
                              ? "bg-surface-elevated"
                              : "")
                      }
                    >
                      <span>{date.slice(-2).replace(/^0/, "")}</span>
                      {status === "completed" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span
                          className={
                            "h-1 w-1 rounded-full " +
                            (status === "planned" || status === "not_logged"
                              ? "bg-accent"
                              : status === "skipped"
                                ? "bg-accent"
                                : "bg-transparent")
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-primary-muted">
                <span>● Completed</span>
                <span className="text-accent">● Skipped</span>
                <span>· Scheduled</span>
              </div>
              <div className="mt-6 grid grid-cols-3 border-t border-border pt-5 text-center">
                {(["completed", "skipped", "not_logged"] as DayState[]).map(
                  (status) => (
                    <div key={status}>
                      <p className="text-2xl font-semibold">
                        {
                          dates.filter((date) => get(date).state === status)
                            .length
                        }
                      </p>
                      <p className="mt-1 text-xs text-primary-muted">
                        {labels[status]}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
          <p className="mt-5 text-xs leading-relaxed text-primary-muted">
            Calendar timezone: {program.preferences.timeZone}. “Not logged”
            means a past planned day has no completed workout; it is not
            automatically marked skipped.
          </p>
        </Panel>
        <Panel>
          <p className="text-xs text-primary-muted">
            {new Date(selected + "T12:00:00Z").toLocaleDateString("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {loading || error ? "Workout history" : labels[selectedDay.state]}
          </h2>
          {!loading && !error && (
            <>
              <p className="mt-3 text-sm text-primary-muted">
                {selectedDay.day?.title ||
                  "No training plan was active on this date."}
              </p>
              {selectedDay.completed.map((session) => (
                <details
                  key={session.id}
                  className="mt-5 border-t border-border pt-4"
                >
                  <summary className="cursor-pointer text-sm font-semibold">
                    {session.title} · {workoutTotals(session).sets} sets
                  </summary>
                  <ul className="mt-3 space-y-3 text-sm">
                    {session.exercises.map((e) => (
                      <li key={e.id}>
                        <p className="font-medium">{e.name}</p>
                        <p className="mt-1 text-primary-muted">
                          {e.sets
                            .filter((s) => s.completed)
                            .map((s) =>
                              e.measure === "seconds"
                                ? `${s.reps}s hold`
                                : `${s.weight} ${session.unit} × ${s.reps}`,
                            )
                            .join(" · ") || "No completed sets"}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {workout.draft?.dirty &&
                    workout.draft.session.id === session.id && (
                      <p className="mt-3 text-xs">
                        Saved on this device · cloud sync pending
                      </p>
                    )}
                </details>
              ))}
              {selected <= today &&
                selectedDay.day?.kind === "training" &&
                selectedDay.state !== "completed" && (
                  <button
                    disabled={saving}
                    className={primary + " mt-6 w-full"}
                    onClick={() => void mark()}
                  >
                    {saving
                      ? "Saving…"
                      : selectedDay.state === "skipped"
                        ? "Undo skipped day"
                        : "Mark as skipped"}
                  </button>
                )}
            </>
          )}
        </Panel>
      </div>
    </>
  );
}
