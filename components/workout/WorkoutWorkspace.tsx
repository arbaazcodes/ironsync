"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  newWorkout,
  newSet,
  workoutTotals,
  type Workout,
} from "@/lib/workouts/model";
import { WorkoutStore } from "@/lib/workouts/store";
import { useWorkoutStore } from "./WorkoutProvider";
import { useProgram } from "@/components/consumer/ProgramProvider";
import { TRAINING_EXERCISES, trainingExercise } from "@/lib/program/exercises";
import { ExerciseGuide } from "@/components/consumer/ExerciseGuide";
import Image from "next/image";
import { equipmentLabels, dateInZone, weekdayNames } from "@/lib/program/types";

export function WorkoutWorkspace() {
  return <WorkoutEditor store={useWorkoutStore()} />;
}

/** The same editor and persistence controller are exercised by integration tests. */
export function WorkoutEditor({ store }: { store: WorkoutStore }) {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  const { program } = useProgram();
  const [planDay, setPlanDay] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [title, setTitle] = useState("My workout");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [formError, setFormError] = useState("");
  const [now, setNow] = useState(Date.now());
  const session = state.draft?.session;
  const finished = session?.status === "completed";
  const totals = session ? workoutTotals(session) : null;
  const days = program?.schedule.filter((day) => day.kind === "training") || [];
  const input =
    "rounded-lg border border-border bg-background p-2 min-h-12 text-base text-primary w-full min-w-0";
  const button =
    "rounded-xl border border-border px-4 py-3 text-sm disabled:opacity-40";
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  function act(fn: () => void) {
    setFormError("");
    try {
      fn();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not save this change.",
      );
    }
  }
  function change(next: Workout) {
    act(() => store.edit(next));
  }
  function changeSet(
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: string,
  ) {
    if (!session) return;
    const number = value === "" ? null : Number(value);
    if (
      number !== null &&
      (!Number.isFinite(number) ||
        number < 0 ||
        number > 1000 ||
        (field === "reps" && !Number.isInteger(number)))
    ) {
      setFormError("Use a value from 0 to 1000, and whole numbers for reps.");
      return;
    }
    const next = structuredClone(session);
    const set = next.exercises[exerciseIndex].sets[setIndex];
    set[field] = number;
    if (set.weight === null || !set.reps) set.completed = false;
    change(next);
  }
  function exportDraft() {
    if (!session) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(session, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "ironsync-workout-" + session.id + ".json";
    link.click();
    URL.revokeObjectURL(url);
  }
  if (!state.ready)
    return (
      <p className="p-8" role="status">
        Restoring your workout…
      </p>
    );
  const rest = session?.restEndsAt
    ? Math.max(0, Math.ceil((Date.parse(session.restEndsAt) - now) / 1000))
    : 0;
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">
            One set at a time
          </p>
          <h1 className="mt-2 text-3xl font-bold">Your workout</h1>
        </div>
        <Link href="/dashboard/plan" className={button}>
          Your plan
        </Link>
      </header>
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-border bg-surface p-4 text-sm"
      >
        {state.saving
          ? "Saving to your account…"
          : state.draft?.dirty
            ? state.storageError
              ? "Cloud save pending."
              : "Saved on this device · cloud sync pending"
            : state.draft
              ? "Saved to your account"
              : "Start a workout to begin logging."}
        {state.draft?.dirty && !state.blocked && (
          <button
            className="ml-3 underline"
            onClick={() => void store.sync()}
            disabled={state.saving}
          >
            Sync now
          </button>
        )}
      </div>
      {(state.error || state.storageError || formError) && (
        <div
          role="alert"
          className="space-y-2 rounded-xl border border-amber-500/50 p-4 text-sm"
        >
          {state.error && <p>{state.error}</p>}
          {state.storageError && <p>{state.storageError}</p>}
          {formError && <p>{formError}</p>}
          {session && (
            <button className="underline" onClick={exportDraft}>
              Export device copy
            </button>
          )}
          {state.blocked && state.conflict && (
            <div className="space-y-3">
              <p>
                Cloud version: {state.conflict.session.title},{" "}
                {workoutTotals(state.conflict.session).sets} completed sets,{" "}
                {state.conflict.session.status}.
              </p>
              <button
                className={button}
                onClick={() => act(() => store.useCloudVersion())}
              >
                Use cloud version
              </button>{" "}
              {state.conflict.session.id === session?.id &&
                state.conflict.session.status === "active" && (
                  <button
                    className={button}
                    onClick={() => act(() => store.keepDeviceVersion())}
                  >
                    Keep this device&apos;s version
                  </button>
                )}
            </div>
          )}
        </div>
      )}
      {(!session || finished) && (
        <section className="space-y-4 rounded-2xl border border-border bg-surface p-5">
          {finished && totals && (
            <div>
              <h2 className="text-xl font-bold">Workout complete</h2>
              <p>
                {totals.sets} sets · {totals.reps} reps ·{" "}
                {totals.volume.toLocaleString()} {session.unit} lifted ·{" "}
                {Math.floor(totals.seconds / 60)} min
              </p>
              <p className="text-sm text-primary-muted">
                {state.draft?.dirty
                  ? "Keep this device copy until cloud sync completes."
                  : "Your completed workout is saved."}
              </p>
            </div>
          )}
          <h2 className="text-xl font-bold">Start your next session</h2>
          <label className="block">
            Workout name
            <input
              className={input}
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block">
            Routine
            <select
              aria-label="Routine"
              className={input}
              value={planDay}
              onChange={(e) => setPlanDay(e.target.value)}
            >
              <option value="">
                Empty workout — choose exercises yourself
              </option>
              {days.map((day, i) => (
                <option key={day.weekday + i} value={String(i)}>
                  {weekdayNames[day.weekday]}: {day.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Weight unit
            <select
              aria-label="Weight unit"
              className={input}
              value={unit}
              onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lb">Pounds (lb)</option>
            </select>
          </label>
          <button
            className="rounded-xl bg-accent px-6 py-3 font-bold text-white disabled:opacity-40"
            disabled={Boolean(state.draft?.dirty)}
            onClick={() =>
              act(() => {
                const day = planDay !== "" ? days[Number(planDay)] : null;
                const workout = newWorkout(
                  title.trim() || day?.title || "My workout",
                  (day?.exercises || []).map((p) => {
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
                  unit,
                  scheduledFor: dateInZone(
                    new Date(),
                    program?.preferences.timeZone || "UTC",
                  ),
                });
              })
            }
          >
            Start workout
          </button>
        </section>
      )}
      {session && !finished && (
        <section className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-xl font-bold">{session.title}</h2>
            <p className="mt-2">
              {totals?.sets} completed sets · {totals?.volume.toLocaleString()}{" "}
              {session.unit} lifted ·{" "}
              {Math.floor(
                Math.max(0, now - Date.parse(session.startedAt)) / 60000,
              )}{" "}
              min
            </p>
            <p className="mt-2 text-sm text-primary-muted">
              Enter 0 weight for bodyweight or timed holds. Log the seconds you
              held when shown.
            </p>
            {rest > 0 && (
              <div className="mt-3 flex items-center gap-3">
                <span role="timer">Rest: {rest}s</span>
                <button
                  className="underline"
                  onClick={() => change({ ...session, restEndsAt: null })}
                >
                  Skip rest
                </button>
              </div>
            )}
          </div>
          {session.exercises.length === 0 && (
            <p>Add your first exercise below.</p>
          )}
          {session.exercises.map((exercise, ei) => (
            <fieldset
              key={exercise.id}
              className="rounded-2xl border border-border bg-surface p-4 space-y-3"
            >
              <legend className="px-2 font-bold">{exercise.name}</legend>
              {exercise.catalogId && trainingExercise(exercise.catalogId) && (
                <ExerciseGuide
                  exerciseId={exercise.catalogId}
                  className="mb-3 flex w-full items-center gap-3 text-left"
                >
                  <Image
                    src={trainingExercise(exercise.catalogId)!.images[0]}
                    width={72}
                    height={72}
                    alt={exercise.name}
                    className="h-16 w-16 rounded-lg border border-border bg-white object-contain"
                  />
                  <span className="text-sm">
                    <span className="block font-semibold">
                      See how to do it
                    </span>
                    <span className="mt-1 block text-primary-muted">
                      {exercise.target || "Movement photos and instructions"}
                    </span>
                  </span>
                </ExerciseGuide>
              )}
              <div
                className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_3rem_1.75rem] items-center gap-2 text-xs text-primary-muted"
                aria-hidden="true"
              >
                <span>Set</span>
                <span>Weight ({session.unit})</span>
                <span>
                  {exercise.measure === "seconds" ? "Seconds" : "Reps"}
                </span>
                <span>Done</span>
                <span />
              </div>
              {exercise.sets.map((set, si) => (
                <div
                  key={set.id}
                  className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_3rem_1.75rem] items-center gap-2"
                >
                  <span>{si + 1}</span>
                  <input
                    aria-label={exercise.name + " set " + (si + 1) + " weight"}
                    className={input}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={1000}
                    step="any"
                    value={set.weight ?? ""}
                    onChange={(e) =>
                      changeSet(ei, si, "weight", e.target.value)
                    }
                  />
                  <input
                    aria-label={
                      exercise.name +
                      " set " +
                      (si + 1) +
                      (exercise.measure === "seconds" ? " seconds" : " reps")
                    }
                    className={input}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={1000}
                    step={1}
                    value={set.reps ?? ""}
                    onChange={(e) => changeSet(ei, si, "reps", e.target.value)}
                  />
                  <button
                    aria-label={
                      exercise.name + " set " + (si + 1) + " complete"
                    }
                    aria-pressed={set.completed}
                    className={
                      "h-11 rounded-lg border " +
                      (set.completed
                        ? "bg-accent text-white border-accent"
                        : "border-border")
                    }
                    onClick={() => {
                      if (
                        !set.completed &&
                        (set.weight === null || !set.reps)
                      ) {
                        setFormError(
                          "Enter weight (0 for bodyweight) and reps before completing a set.",
                        );
                        return;
                      }
                      const next = structuredClone(session);
                      next.exercises[ei].sets[si].completed = !set.completed;
                      next.restEndsAt = !set.completed
                        ? new Date(
                            Date.now() + (exercise.restSeconds || 90) * 1000,
                          ).toISOString()
                        : null;
                      change(next);
                    }}
                  >
                    {set.completed ? "✓" : "Done"}
                  </button>
                  <button
                    aria-label={"Remove " + exercise.name + " set " + (si + 1)}
                    className="h-11"
                    onClick={() => {
                      if (
                        set.completed &&
                        !window.confirm("Remove this completed set?")
                      )
                        return;
                      const next = structuredClone(session);
                      next.exercises[ei].sets.splice(si, 1);
                      change(next);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <button
                  className={button}
                  disabled={exercise.sets.length >= 30}
                  onClick={() => {
                    const next = structuredClone(session);
                    next.exercises[ei].sets.push(newSet());
                    change(next);
                  }}
                >
                  Add set
                </button>
                <button
                  className={button}
                  onClick={() => {
                    if (
                      exercise.sets.some((s) => s.completed) &&
                      !window.confirm(
                        "Remove this exercise and its completed sets?",
                      )
                    )
                      return;
                    change({
                      ...session,
                      exercises: session.exercises.filter(
                        (e) => e.id !== exercise.id,
                      ),
                    });
                  }}
                >
                  Remove exercise
                </button>
              </div>
            </fieldset>
          ))}
          <div className="space-y-3 rounded-2xl border border-border bg-surface p-4">
            <label className="block">
              Exercise
              <select
                aria-label="Exercise"
                className={input}
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
              >
                <option value="">Choose an exercise</option>
                {TRAINING_EXERCISES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ·{" "}
                    {e.equipment
                      .map((item) => equipmentLabels[item])
                      .join(" + ") || "Bodyweight"}
                  </option>
                ))}
              </select>
            </label>
            <button
              className={button}
              disabled={!exerciseId || session.exercises.length >= 30}
              onClick={() => {
                const exercise = TRAINING_EXERCISES.find(
                  (e) => e.id === exerciseId,
                );
                if (!exercise) return;
                change({
                  ...session,
                  exercises: [
                    ...session.exercises,
                    {
                      id: crypto.randomUUID(),
                      catalogId: exercise.id,
                      name: exercise.name,
                      measure: exercise.measure,
                      sets: [newSet(), newSet(), newSet()],
                    },
                  ],
                });
                setExerciseId("");
              }}
            >
              Add exercise
            </button>
          </div>
          <button
            className="w-full rounded-xl bg-accent p-4 font-bold text-white disabled:opacity-40"
            disabled={!totals?.sets || state.blocked}
            onClick={() =>
              change({
                ...session,
                status: "completed",
                completedAt: new Date().toISOString(),
                restEndsAt: null,
              })
            }
          >
            Finish workout
          </button>
        </section>
      )}
      {state.history.some((row) => row.session.status === "completed") && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Recent workouts</h2>
          {state.history
            .filter((row) => row.session.status === "completed")
            .map((row) => (
              <details
                key={row.session.id}
                className="rounded-xl border border-border p-4"
              >
                <summary className="cursor-pointer">
                  {row.session.title} ·{" "}
                  {new Date(row.session.startedAt).toLocaleDateString()} ·{" "}
                  {workoutTotals(row.session).sets} sets
                </summary>
                <ul className="mt-3 space-y-2 text-sm">
                  {row.session.exercises.map((e) => (
                    <li key={e.id}>
                      {e.name}:{" "}
                      {e.sets
                        .filter((s) => s.completed)
                        .map(
                          (s) =>
                            e.measure === "seconds"
                              ? `${s.reps}s hold`
                              : s.weight + " " + row.session.unit + " × " + s.reps,
                        )
                        .join(", ") || "No completed sets"}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
        </section>
      )}
    </div>
  );
}
