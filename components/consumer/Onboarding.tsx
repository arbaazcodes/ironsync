"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useProgram } from "./ProgramProvider";
import {
  allergyLabels,
  dietLabels,
  equipmentLabels,
  goalLabels,
  preferencesSchema,
  weekdayNames,
  type Preferences,
} from "@/lib/program/types";
import { field, primary, secondary } from "./ui";

type Form = Omit<Preferences, "age" | "heightCm" | "weightKg"> & {
  age: string;
  heightCm: string;
  weightKg: string;
};
const draftSchema = z.object({
  form: preferencesSchema
    .omit({ age: true, heightCm: true, weightKg: true, trainingDays: true })
    .extend({
      age: z.string().max(10),
      heightCm: z.string().max(10),
      weightKg: z.string().max(10),
      trainingDays: z.array(z.number().int().min(0).max(6)).max(7),
    }),
  step: z.number().int().min(0).max(4),
  savedAt: z.number(),
  base: z.string().nullable(),
});
const defaults: Form = {
  goal: "muscle_gain",
  age: "",
  heightCm: "",
  weightKg: "",
  sex: "skip",
  experience: "beginner",
  equipment: ["dumbbells", "bench", "barbell", "cable", "leg_press"],
  trainingDays: [1, 3, 5],
  duration: 45,
  activity: "seated",
  diet: "vegetarian",
  meals: 3,
  allergies: [],
  needsProfessionalGuidance: false,
  timeZone: "Asia/Kolkata",
};
export function ConsumerOnboarding() {
  const { user, isLoading, activePlan } = useAuth();
  const { program, loading, error: loadError, refresh, save } = useProgram();
  const router = useRouter();
  const submitted = useRef(false);
  const [data, setData] = useState<Form>(defaults);
  const [initialized, setInitialized] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isLoading && !user)
      router.replace("/auth?mode=signin&next=/onboarding");
  }, [isLoading, user, router]);
  useEffect(() => {
    if (loading || initialized || !user) return;
    if (program)
      setData({
        ...program.preferences,
        age: String(program.preferences.age),
        heightCm: String(program.preferences.heightCm),
        weightKg: String(program.preferences.weightKg),
      });
    else
      setData((previous) => ({
        ...previous,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(activePlan?.weightKg
          ? { weightKg: String(activePlan.weightKg) }
          : {}),
        ...(activePlan?.heightCm
          ? { heightCm: String(activePlan.heightCm) }
          : {}),
      }));
    try {
      const draft = draftSchema.safeParse(
        JSON.parse(
          sessionStorage.getItem(`ironsync:preferences:${user.id}`) || "null",
        ),
      );
      if (
        draft.success &&
        draft.data.base === (program?.createdAt || null) &&
        Date.now() - draft.data.savedAt < 86400000
      ) {
        setData(draft.data.form);
        setStep(draft.data.step);
      }
    } catch {
      /* A blocked browser store does not prevent cloud saving. */
    }
    setInitialized(true);
  }, [loading, initialized, user, program, activePlan]);
  useEffect(() => {
    if (!initialized || !user || submitted.current) return;
    try {
      sessionStorage.setItem(
        `ironsync:preferences:${user.id}`,
        JSON.stringify({
          form: data,
          step,
          savedAt: Date.now(),
          base: program?.createdAt || null,
        }),
      );
    } catch {
      /* Form remains usable in memory. */
    }
  }, [data, step, initialized, user, program?.createdAt]);
  const update = <K extends keyof Form>(key: K, value: Form[K]) =>
    setData((previous) => ({ ...previous, [key]: value }));
  function toggle<K extends "equipment" | "trainingDays" | "allergies">(
    key: K,
    value: Form[K][number],
  ) {
    setData((previous) => ({
      ...previous,
      [key]: (previous[key] as (string | number)[]).includes(value)
        ? previous[key].filter((item) => item !== value)
        : [...previous[key], value],
    }));
  }
  const parsed = () =>
    preferencesSchema.safeParse({
      ...data,
      age: Number(data.age),
      heightCm: Number(data.heightCm),
      weightKg: Number(data.weightKg),
    });
  function next() {
    setError("");
    if (
      step === 1 &&
      !(
        Number(data.age) >= 18 &&
        Number(data.age) <= 75 &&
        Number(data.heightCm) >= 120 &&
        Number(data.heightCm) <= 230 &&
        Number(data.weightKg) >= 40 &&
        Number(data.weightKg) <= 220
      )
    ) {
      setError(
        "Enter age 18–75, height 120–230 cm and weight 40–220 kg. This automatic planner supports that adult range.",
      );
      return;
    }
    if (
      step === 2 &&
      (data.trainingDays.length < 2 || data.trainingDays.length > 5)
    ) {
      setError("Choose 2 to 5 training days.");
      return;
    }
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  async function submit() {
    setError("");
    const result = parsed();
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      submitted.current = true;
      await save(result.data);
      try {
        sessionStorage.removeItem(`ironsync:preferences:${user?.id}`);
      } catch {
        /* Optional draft storage. */
      }
      router.replace("/dashboard");
    } catch (e) {
      submitted.current = false;
      setError(e instanceof Error ? e.message : "Could not save. Try again.");
    } finally {
      setBusy(false);
    }
  }
  if (isLoading || !user || loading || !initialized)
    return (
      <p className="p-8" role="status">
        Getting your preferences ready…
      </p>
    );
  if (loadError)
    return (
      <div className="mx-auto max-w-lg p-6">
        <h1 className="text-2xl font-semibold">
          Your plan is temporarily unavailable.
        </h1>
        <p className="my-4" role="alert">
          {loadError}
        </p>
        <button className={secondary} onClick={() => void refresh()}>
          Try again
        </button>
      </div>
    );
  const titles = [
    "What are you working toward?",
    "A little about you.",
    "Make room for training.",
    "Food that fits your day.",
    "Your plan, your starting point.",
  ];
  const choice = (selected: boolean) =>
    "flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors " +
    (selected
      ? "border-primary bg-primary text-background"
      : "border-border bg-surface text-primary hover:border-primary-muted");
  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-5 py-6">
        <Link
          href={program ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-lg font-bold"
        >
          <Activity className="h-5 w-5 text-accent" />
          IronSync
        </Link>
        <span className="text-xs text-primary-muted">
          {program ? "Update preferences" : "Your first plan"}
        </span>
      </header>
      <div className="mx-auto max-w-xl px-5 pb-12 pt-4">
        <div className="mb-8 flex gap-2" aria-label={`Step ${step + 1} of 5`}>
          {titles.map((title, i) => (
            <span
              key={title}
              className={
                "h-1 flex-1 rounded-full " +
                (i <= step ? "bg-accent" : "bg-border")
              }
            />
          ))}
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-muted">
          Step {step + 1} of 5
        </p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          {titles[step]}
        </h1>
        <p className="mb-7 text-sm leading-relaxed text-primary-muted">
          {
            [
              "Choose one main goal. You can change it later.",
              "Your measurements help estimate a starting plan. Your information stays with your account.",
              "Choose days you can repeat, and only equipment you can use.",
              "We calculate portions from food records and respect your exclusions.",
              "Review the details below. Your workout history will stay safe when you update a plan.",
            ][step]
          }
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 4) next();
            else void submit();
          }}
          className="space-y-6"
        >
          {step === 0 && (
            <fieldset className="grid gap-3">
              <legend className="sr-only">Main goal</legend>
              {Object.entries(goalLabels).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={data.goal === value}
                  onClick={() => update("goal", value as Preferences["goal"])}
                  className={choice(data.goal === value) + " py-5"}
                >
                  <span className="text-base">{label}</span>
                  {data.goal === value && <Check className="h-5 w-5" />}
                </button>
              ))}
            </fieldset>
          )}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium">
                  Age
                  <input
                    className={field}
                    type="number"
                    inputMode="numeric"
                    value={data.age}
                    onChange={(e) => update("age", e.target.value)}
                    min={18}
                    max={75}
                    required
                  />
                </label>
                <label className="text-sm font-medium">
                  Height (cm)
                  <input
                    className={field}
                    type="number"
                    inputMode="decimal"
                    value={data.heightCm}
                    onChange={(e) => update("heightCm", e.target.value)}
                    min={120}
                    max={230}
                    step="any"
                    required
                  />
                </label>
              </div>
              <label className="block text-sm font-medium">
                Weight (kg)
                <input
                  className={field}
                  type="number"
                  inputMode="decimal"
                  value={data.weightKg}
                  onChange={(e) => update("weightKg", e.target.value)}
                  min={40}
                  max={220}
                  step="any"
                  required
                />
              </label>
              <label className="block text-sm font-medium">
                Sex used for the calorie formula
                <select
                  className={field}
                  value={data.sex}
                  onChange={(e) =>
                    update("sex", e.target.value as Preferences["sex"])
                  }
                >
                  <option value="skip">Skip calorie estimation</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Your usual day
                <select
                  className={field}
                  value={data.activity}
                  onChange={(e) =>
                    update(
                      "activity",
                      e.target.value as Preferences["activity"],
                    )
                  }
                >
                  <option value="seated">Mostly sitting</option>
                  <option value="mixed">Some sitting, some walking</option>
                  <option value="active">
                    Mostly on my feet / physical work
                  </option>
                </select>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  checked={data.needsProfessionalGuidance}
                  onChange={(e) =>
                    update("needsProfessionalGuidance", e.target.checked)
                  }
                  className="mt-1 h-5 w-5 shrink-0 accent-accent"
                />
                I am pregnant/breastfeeding, have an injury or medical
                restriction, or need a clinician-prescribed diet.{" "}
                <span className="sr-only">
                  Automatic planning will be paused
                </span>
              </label>
              <p className="text-xs text-primary-muted">
                If selected, automatic training and diet recommendations pause.
                You can still use the training log.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <label className="block text-sm font-medium">
                Training experience
                <select
                  className={field}
                  value={data.experience}
                  onChange={(e) =>
                    update(
                      "experience",
                      e.target.value as Preferences["experience"],
                    )
                  }
                >
                  <option value="beginner">New or getting back into it</option>
                  <option value="intermediate">Training regularly</option>
                  <option value="advanced">Experienced lifter</option>
                </select>
              </label>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">
                  Training days · choose 2–5
                </legend>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                    <button
                      type="button"
                      key={day}
                      aria-label={weekdayNames[day]}
                      aria-pressed={data.trainingDays.includes(day)}
                      className={
                        choice(data.trainingDays.includes(day)) +
                        " justify-center !px-2"
                      }
                      onClick={() => toggle("trainingDays", day)}
                    >
                      {weekdayNames[day].slice(0, 3)}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">
                  Time per session
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((duration) => (
                    <button
                      type="button"
                      key={duration}
                      aria-pressed={data.duration === duration}
                      className={
                        choice(data.duration === duration) + " justify-center"
                      }
                      onClick={() =>
                        update("duration", duration as 30 | 45 | 60)
                      }
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">
                  Equipment available
                </legend>
                <button
                  type="button"
                  className="mb-3 text-sm underline underline-offset-4"
                  onClick={() =>
                    update(
                      "equipment",
                      data.equipment.length
                        ? []
                        : (Object.keys(
                            equipmentLabels,
                          ) as Preferences["equipment"]),
                    )
                  }
                >
                  {data.equipment.length
                    ? "Use bodyweight only"
                    : "Select gym equipment"}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(equipmentLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={data.equipment.includes(
                        value as Preferences["equipment"][number],
                      )}
                      className={choice(
                        data.equipment.includes(
                          value as Preferences["equipment"][number],
                        ),
                      )}
                      onClick={() =>
                        toggle(
                          "equipment",
                          value as Preferences["equipment"][number],
                        )
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-primary-muted">
                  No selection means bodyweight only. A barbell selection
                  includes access to a safe rack.
                </p>
              </fieldset>
            </>
          )}
          {step === 3 && (
            <>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">
                  Eating preference
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(dietLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={data.diet === value}
                      className={choice(data.diet === value)}
                      onClick={() =>
                        update("diet", value as Preferences["diet"])
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm font-medium">
                Meals per day
                <select
                  className={field}
                  value={data.meals}
                  onChange={(e) =>
                    update("meals", Number(e.target.value) as 3 | 4)
                  }
                >
                  <option value={3}>3 meals</option>
                  <option value={4}>3 meals + a snack</option>
                </select>
              </label>
              <fieldset>
                <legend className="mb-3 text-sm font-medium">
                  Food allergies / exclusions
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(allergyLabels).map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={data.allergies.includes(
                        value as Preferences["allergies"][number],
                      )}
                      className={choice(
                        data.allergies.includes(
                          value as Preferences["allergies"][number],
                        ),
                      )}
                      onClick={() =>
                        toggle(
                          "allergies",
                          value as Preferences["allergies"][number],
                        )
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-primary-muted">
                  None selected means no declared exclusions. Always check
                  packaging and cross-contact warnings. Other/severe allergies
                  require a dietitian-reviewed menu.
                </p>
              </fieldset>
            </>
          )}
          {step === 4 && (
            <>
              <div className="divide-y divide-border rounded-2xl border border-border bg-surface px-5">
                <Review label="Goal" value={goalLabels[data.goal]} />
                <Review
                  label="You"
                  value={`${data.age} years · ${data.heightCm} cm · ${data.weightKg} kg`}
                />
                <Review
                  label="Training"
                  value={`${data.trainingDays.length} days · ${data.duration} min`}
                />
                <Review
                  label="Days"
                  value={[...data.trainingDays]
                    .sort((a, b) => (a || 7) - (b || 7))
                    .map((day) => weekdayNames[day].slice(0, 3))
                    .join(", ")}
                />
                <Review
                  label="Equipment"
                  value={
                    data.equipment
                      .map((item) => equipmentLabels[item])
                      .join(", ") || "Bodyweight"
                  }
                />
                <Review
                  label="Food"
                  value={`${dietLabels[data.diet]} · ${data.meals} meals`}
                />
                <Review
                  label="Exclusions"
                  value={
                    data.allergies
                      .map((item) => allergyLabels[item])
                      .join(", ") || "None declared"
                  }
                />
                <Review label="Calendar timezone" value={data.timeZone} />
              </div>
              <p className="text-sm leading-relaxed text-primary-muted">
                Your plan uses your preferences and a defined set of training
                rules. Energy needs are estimates; food totals use measured
                database records. Start light and ask a qualified trainer to
                check unfamiliar movements.
              </p>
              {data.needsProfessionalGuidance && (
                <p className="rounded-xl border border-border p-4 text-sm">
                  Automatic recommendations are paused. Your account, workout
                  log and calendar will still be available.
                </p>
              )}
            </>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400 p-3 text-sm"
            >
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-3">
            {step > 0 && (
              <button
                type="button"
                disabled={busy}
                className={secondary}
                onClick={() => {
                  setStep(step - 1);
                  setError("");
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button className={primary + " flex-1"} disabled={busy}>
              {busy
                ? "Saving your plan…"
                : step === 4
                  ? "Create my plan"
                  : "Continue"}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-4 text-sm">
      <span className="shrink-0 text-primary-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
