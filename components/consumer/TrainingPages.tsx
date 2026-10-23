"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Clock3, Play, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useProgram } from "./ProgramProvider";
import {
  useWorkoutState,
  useWorkoutStore,
} from "@/components/workout/WorkoutProvider";
import { trainingExercise } from "@/lib/program/exercises";
import { calendarDay } from "@/lib/program/calendar";
import {
  dateInZone,
  goalLabels,
  shiftDate,
  weekdayNames,
  weekdayOf,
  type ProgramDay,
} from "@/lib/program/types";
import { newWorkout } from "@/lib/workouts/model";
import { ExerciseRow } from "./ExerciseGuide";
import { PageHeading, Panel, TextLink, primary, secondary } from "./ui";

export function StartSession({
  day,
  className = "",
}: {
  day: ProgramDay;
  className?: string;
}) {
  const store = useWorkoutStore();
  const state = useWorkoutState();
  const { program } = useProgram();
  const router = useRouter();
  const [error, setError] = useState("");
  const active = state.draft?.session.status === "active";
  return (
    <div className={className}>
      <button
        className={primary + " w-full"}
        disabled={!state.ready || (!active && Boolean(state.draft?.dirty))}
        onClick={() => {
          setError("");
          try {
            if (!active) {
              const workout = newWorkout(
                day.title,
                day.exercises.map((p) => {
                  const e = trainingExercise(p.exerciseId)!;
                  return {
                    name: e.name,
                    catalogId: e.id,
                    sets: p.sets,
                    measure: e.measure,
                    target: p.target,
                    restSeconds: p.restSeconds,
                  };
                }),
              );
              store.start({
                ...workout,
                scheduledFor: dateInZone(
                  new Date(),
                  program?.preferences.timeZone || "UTC",
                ),
              });
            }
            router.push("/dashboard/workout");
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "Could not start your workout.",
            );
          }
        }}
      >
        <Play className="h-4 w-4" />
        {active ? "Continue workout" : "Start workout"}
        <ArrowRight className="ml-auto h-4 w-4" />
      </button>
      {state.draft?.dirty && !active && (
        <p className="mt-2 text-xs text-primary-muted">
          Sync your previous workout before starting another.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
export function TodayPage() {
  const { program, programs, overrides, markDay } = useProgram();
  const state = useWorkoutState();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!program) return null;
  const today = dateInZone(new Date(), program.preferences.timeZone);
  const day = program.schedule[weekdayOf(today)];
  const byId = new Map(state.history.map((r) => [r.session.id, r.session]));
  if (state.draft) byId.set(state.draft.session.id, state.draft.session);
  const sessions = [...byId.values()];
  const status = calendarDay(
    today,
    today,
    programs,
    sessions,
    overrides,
    program.preferences.timeZone,
  );
  const monday = shiftDate(today, -((weekdayOf(today) + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => shiftDate(monday, i));
  const completed = week.filter(
    (date) =>
      calendarDay(
        date,
        today,
        programs,
        sessions,
        overrides,
        program.preferences.timeZone,
      ).state === "completed",
  ).length;
  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const food = program.nutrition.days[weekdayOf(today)];
  async function skip() {
    setBusy(true);
    setError("");
    try {
      await markDay(today, status.state === "skipped" ? "planned" : "skipped");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please retry.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow={new Date(today + "T12:00:00").toLocaleDateString("en", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
        title={`Hey ${name}, let’s move.`}
      />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Panel>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Today’s workout
              </p>
              <span className="text-xs text-primary-muted">
                {goalLabels[program.preferences.goal]}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {day.title}
            </h2>
            {day.kind === "training" ? (
              <>
                <p className="mt-2 flex items-center gap-2 text-sm text-primary-muted">
                  <Clock3 className="h-4 w-4" />
                  About {day.minutes} min · {day.exercises.length} exercises
                </p>
                {status.state === "completed" && (
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    Workout recorded today
                  </p>
                )}
                {status.state === "skipped" && (
                  <p className="mt-4 text-sm text-primary-muted">
                    Marked skipped. Your next session is still waiting for you.
                  </p>
                )}
                <StartSession day={day} className="mt-5" />
                <div className="my-4">
                  {day.exercises.map((p, i) => (
                    <ExerciseRow
                      key={p.exerciseId}
                      prescription={p}
                      index={i}
                    />
                  ))}
                </div>
                {status.state !== "completed" && (
                  <button
                    disabled={busy || !state.ready}
                    className="mt-3 min-h-11 w-full text-sm text-primary-muted underline underline-offset-4"
                    onClick={() => void skip()}
                  >
                    {busy
                      ? "Saving…"
                      : status.state === "skipped"
                        ? "Undo skipped day"
                        : "Skip today"}
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="my-4 text-sm leading-relaxed text-primary-muted">
                  {program.preferences.needsProfessionalGuidance
                    ? "Automatic planning is paused. Log a workout approved for your individual needs."
                    : "Take a break from lifting. A comfortable walk or gentle movement is optional. Come back fresh for your next session."}
                </p>
                <Link
                  href="/dashboard/plan"
                  className={primary + " mt-3 w-full"}
                >
                  See your week
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {state.draft?.session.status === "active" && (
                  <Link
                    href="/dashboard/workout"
                    className={secondary + " mt-3 w-full"}
                  >
                    Continue active workout
                  </Link>
                )}
              </>
            )}
            {error && (
              <p role="alert" className="mt-3 text-sm">
                {error}
              </p>
            )}
          </Panel>
          <p className="px-1 text-xs text-primary-muted">
            Tap an exercise to see photos and learn the movement.
          </p>
        </div>
        <div className="space-y-6">
          <Panel>
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">Your week</h2>
              <span className="text-sm text-primary-muted">
                {state.error
                  ? "History unavailable"
                  : state.ready
                    ? `${completed} ${completed === 1 ? "day" : "days"} trained`
                    : "Loading…"}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-1">
              {week.map((date) => {
                const s = calendarDay(
                  date,
                  today,
                  programs,
                  sessions,
                  overrides,
                  program.preferences.timeZone,
                ).state;
                return (
                  <Link
                    href={`/dashboard/calendar?date=${date}`}
                    key={date}
                    className={
                      "flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl text-xs " +
                      (date === today
                        ? "border border-primary"
                        : "border border-transparent")
                    }
                  >
                    <span className="text-primary-muted">
                      {weekdayNames[weekdayOf(date)].slice(0, 1)}
                    </span>
                    <span
                      className={
                        "flex h-7 w-7 items-center justify-center rounded-full " +
                        (s === "completed"
                          ? "bg-primary text-background"
                          : s === "skipped"
                            ? "bg-accent/10 text-accent"
                            : "bg-surface-elevated")
                      }
                    >
                      {s === "completed" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        Number(date.slice(-2))
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
            <TextLink href="/dashboard/calendar">Open calendar</TextLink>
          </Panel>
          <Panel>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-muted">
              On your plate
            </p>
            <h2 className="mt-3 text-xl font-semibold">Food for your day.</h2>
            {food ? (
              <>
                <p className="mt-3 text-sm text-primary-muted">
                  {food.totals.calories.toLocaleString()} kcal ·{" "}
                  {food.totals.protein}g protein
                </p>
                <p className="mt-1 text-xs text-primary-muted">
                  Suggested menu totals, not food logged.
                </p>
                <div className="mt-4 border-t border-border pt-3">
                  {food.meals.slice(0, 3).map((meal) => (
                    <div
                      key={meal.name}
                      className="flex justify-between py-2 text-sm"
                    >
                      <span>{meal.name}</span>
                      <span className="text-primary-muted">
                        {meal.totals.calories} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-primary-muted">
                {program.nutrition.unavailable}
              </p>
            )}
            <TextLink href="/dashboard/nutrition">View meal plan</TextLink>
          </Panel>
          <div className="flex gap-3 px-2 text-sm leading-relaxed text-primary-muted">
            <Sparkles className="mt-1 h-4 w-4 shrink-0" />
            <p>
              Keep it repeatable. A manageable workout today is a good place to
              start.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
export function PlanPage() {
  const { program } = useProgram();
  const [selected, setSelected] = useState<number | null>(null);
  if (!program) return null;
  const today = dateInZone(new Date(), program.preferences.timeZone);
  const day = program.schedule[selected ?? weekdayOf(today)];
  return (
    <>
      <PageHeading
        eyebrow="Made for your week"
        title="Your training plan."
        action={<TextLink href="/onboarding">Edit</TextLink>}
      />
      <div className="mb-6 flex flex-wrap gap-2 text-xs text-primary-muted">
        <span className="rounded-full border border-border px-3 py-2">
          {goalLabels[program.preferences.goal]}
        </span>
        <span className="rounded-full border border-border px-3 py-2">
          {program.preferences.trainingDays.length} days / week
        </span>
        <span className="rounded-full border border-border px-3 py-2">
          {program.preferences.duration} min / session
        </span>
      </div>
      <div
        className="mb-6 grid grid-cols-7 gap-1 sm:gap-2"
        role="group"
        aria-label="Choose training day"
      >
        {[1, 2, 3, 4, 5, 6, 0].map((d) => (
          <button
            key={d}
            aria-label={weekdayNames[d]}
            aria-pressed={day.weekday === d}
            onClick={() => setSelected(d)}
            className={
              "flex min-h-20 min-w-0 flex-col items-center justify-center gap-2 rounded-xl border text-xs " +
              (day.weekday === d
                ? "border-primary bg-primary text-background"
                : "border-border bg-surface")
            }
          >
            <span>{weekdayNames[d].slice(0, 3)}</span>
            <span
              className={
                "h-1.5 w-1.5 rounded-full " +
                (program.schedule[d].kind === "training"
                  ? "bg-accent"
                  : "bg-primary-muted/30")
              }
            />
            <span className="text-[10px]">
              {program.schedule[d].kind === "training" ? "Train" : "Rest"}
            </span>
          </button>
        ))}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel>
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-xs text-primary-muted">
                {weekdayNames[day.weekday]}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{day.title}</h2>
            </div>
            {day.kind === "training" && (
              <span className="pt-2 text-sm text-primary-muted">
                {day.minutes} min
              </span>
            )}
          </div>
          {day.kind === "training" ? (
            <>
              <p className="mt-4 text-sm text-primary-muted">
                Warm up for 5 minutes. Use a light practice set before
                unfamiliar loaded movements.
              </p>
              <div className="my-4">
                {day.exercises.map((p, i) => (
                  <ExerciseRow key={p.exerciseId} prescription={p} index={i} />
                ))}
              </div>
              <StartSession day={day} />
              <p className="mt-3 text-xs text-primary-muted">
                Starting this session records it against today, {today}.
              </p>
            </>
          ) : (
            <p className="mt-5 text-sm leading-relaxed text-primary-muted">
              No lifting session is scheduled. Rest, or choose comfortable light
              activity.
            </p>
          )}
          <TextLink href="/dashboard/workout">Open training log</TextLink>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">Why this plan?</h2>
          <ul className="mt-4 space-y-4 text-sm leading-relaxed text-primary-muted">
            {program.rationale.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <a
            className="mt-5 inline-flex min-h-11 items-center text-xs underline"
            href="https://acsm.org/resistance-training-guidelines-update-2026/"
            target="_blank"
            rel="noreferrer"
          >
            Training principles · ACSM 2026
          </a>
        </Panel>
      </div>
    </>
  );
}
