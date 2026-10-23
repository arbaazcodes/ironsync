import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import {
  generateProgram,
  mealTotals,
  dailyTotals,
} from "@/lib/program/generate";
import {
  preferencesSchema,
  dateInZone,
  shiftDate,
  monthRange,
  type Preferences,
  type ProgramRecord,
} from "@/lib/program/types";
import { TRAINING_EXERCISES, trainingExercise } from "@/lib/program/exercises";
import { FOODS, foodById } from "@/lib/program/foods";
import { calendarDay } from "@/lib/program/calendar";
import { parseProgram } from "@/lib/program/validate";
import { newWorkout, workoutSchema, workoutTotals } from "@/lib/workouts/model";

export const preferences: Preferences = {
  goal: "muscle_gain",
  age: 28,
  heightCm: 175,
  weightKg: 70,
  sex: "male",
  experience: "beginner",
  equipment: ["dumbbells", "bench", "barbell", "cable", "leg_press"],
  trainingDays: [1, 3, 5],
  duration: 45,
  activity: "mixed",
  diet: "vegetarian",
  meals: 3,
  allergies: [],
  needsProfessionalGuidance: false,
  timeZone: "Asia/Kolkata",
};
const now = new Date("2026-10-19T07:00:00Z");
const program = generateProgram(preferences, now);
const record: ProgramRecord = {
  id: "first",
  program,
  createdAt: program.createdAt,
};

describe("personal training rules", () => {
  it("never prescribes unavailable equipment or advanced movements to beginners across all equipment combinations", () => {
    const equipment = preferences.equipment;
    for (let mask = 0; mask < 32; mask++)
      for (const days of [
        [1, 3],
        [1, 3, 5],
        [1, 2, 4, 5],
        [1, 2, 3, 4, 5],
      ]) {
        const selected = equipment.filter((_, i) => Boolean(mask & (1 << i)));
        const p = generateProgram(
          { ...preferences, equipment: selected, trainingDays: days },
          now,
        );
        expect(
          p.schedule.filter((d) => d.kind === "training").map((d) => d.weekday),
        ).toEqual(days);
        for (const day of p.schedule) {
          expect(new Set(day.exercises.map((e) => e.exerciseId)).size).toBe(
            day.exercises.length,
          );
          for (const exercise of day.exercises) {
            const item = trainingExercise(exercise.exerciseId)!;
            expect(item.equipment.every((e) => selected.includes(e))).toBe(
              true,
            );
            expect(item.level).toBe("beginner");
          }
        }
      }
  });
  it("adapts strength prescriptions and preserves the rest time in the logger", () => {
    const p = generateProgram(
      {
        ...preferences,
        goal: "strength",
        experience: "intermediate",
        duration: 30,
      },
      now,
    );
    const day = p.schedule[1];
    expect(day.exercises).toHaveLength(4);
    expect(
      day.exercises.find((e) => e.exerciseId === "barbell-bench-press"),
    ).toMatchObject({ target: "6–8 reps", sets: 2, restSeconds: 150 });
    const workout = newWorkout(
      day.title,
      day.exercises.map((e) => ({
        name: trainingExercise(e.exerciseId)!.name,
        ...e,
      })),
    );
    expect(workoutSchema.parse(workout).exercises[0].restSeconds).toBe(150);
  });
  it("pauses recommendations for declared medical restrictions and validates supported adult inputs", () => {
    const p = generateProgram(
      { ...preferences, needsProfessionalGuidance: true },
      now,
    );
    expect(p.schedule.every((d) => d.exercises.length === 0)).toBe(true);
    expect(p.nutrition.days).toHaveLength(0);
    for (const changes of [
      { age: 17 },
      { age: 76 },
      { weightKg: -1 },
      { trainingDays: [1, 1] },
      { timeZone: "invalid" },
      { user_id: "injected" },
    ])
      expect(
        preferencesSchema.safeParse({ ...preferences, ...changes }).success,
      ).toBe(false);
  });
  it("ships every promised photo and has unique stable IDs", () => {
    expect(new Set(TRAINING_EXERCISES.map((e) => e.id)).size).toBe(
      TRAINING_EXERCISES.length,
    );
    for (const e of TRAINING_EXERCISES)
      for (const image of e.images)
        expect(existsSync("public" + image)).toBe(true);
    expect(trainingExercise("plank-standard")!.images[0]).toBe(
      "/training/Plank/1.jpg",
    );
  });
});

describe("source-backed food portions", () => {
  it("computes exact weighed ingredient totals using the source energy value", () => {
    expect(
      mealTotals([
        { foodId: "rice", grams: 200 },
        { foodId: "olive-oil", grams: 10 },
      ]),
    ).toEqual({ calories: 348, protein: 4.8, carbs: 57.2, fat: 10.4 });
    expect(new Set(FOODS.map((f) => f.fdcId)).size).toBe(FOODS.length);
    expect(() => mealTotals([{ foodId: "invented", grams: 100 }])).toThrow();
  });
  it("respects every combination of declared diet and allergen exclusions without silent substitution", () => {
    const allergies: Preferences["allergies"] = [
      "milk",
      "egg",
      "soy",
      "gluten",
      "legumes",
    ];
    for (const diet of [
      "vegetarian",
      "eggetarian",
      "non_vegetarian",
      "vegan",
    ] as const)
      for (let mask = 0; mask < 32; mask++) {
        const excluded = allergies.filter((_, i) => Boolean(mask & (1 << i)));
        const p = generateProgram(
          { ...preferences, diet, allergies: excluded, meals: 4 },
          now,
        );
        if (!p.nutrition.days.length) {
          expect(p.nutrition.unavailable).toBeTruthy();
          continue;
        }
        for (const day of p.nutrition.days) {
          expect(day.meals).toHaveLength(4);
          expect(day.totals).toEqual(dailyTotals(day.meals));
          for (const meal of day.meals) {
            expect(meal.totals).toEqual(mealTotals(meal.ingredients));
            for (const item of meal.ingredients) {
              const f = foodById(item.foodId)!;
              expect(f.diets).toContain(diet);
              expect(
                f.allergens.some((a) =>
                  excluded.includes(a as (typeof excluded)[number]),
                ),
              ).toBe(false);
              expect(item.grams).toBeGreaterThan(0);
            }
          }
        }
      }
  });
  it("keeps an ordinary menu close to its estimated energy target while counting cooking oil", () => {
    for (const day of program.nutrition.days) {
      expect(
        Math.abs(day.totals.calories - program.nutrition.targetCalories!),
      ).toBeLessThan(60);
      expect(
        day.meals
          .flatMap((m) => m.ingredients)
          .filter((i) => i.foodId === "olive-oil"),
      ).toHaveLength(2);
    }
    expect(
      generateProgram({ ...preferences, sex: "skip" }, now).nutrition
        .targetCalories,
    ).toBeNull();
    expect(
      generateProgram({ ...preferences, allergies: ["other"] }, now).nutrition
        .days,
    ).toHaveLength(0);
    const underweight = generateProgram(
      { ...preferences, goal: "fat_loss", heightCm: 180, weightKg: 50 },
      now,
    );
    expect(
      underweight.nutrition.notes.some((n) =>
        n.includes("deficit was not applied"),
      ),
    ).toBe(true);
  });
  it("rejects malformed stored plans before rendering", () => {
    expect(parseProgram(program)).toEqual(program);
    expect(() => parseProgram({ ...program, schedule: [] })).toThrow();
    expect(() =>
      parseProgram({
        ...program,
        preferences: { ...preferences, timeZone: "invented" },
      }),
    ).toThrow();
  });
});

describe("honest attendance and compatible workout history", () => {
  it("uses local calendar days across UTC midnight and leap years", () => {
    expect(dateInZone(new Date("2026-10-22T20:00:00Z"), "Asia/Kolkata")).toBe(
      "2026-10-23",
    );
    expect(monthRange("2028-02").last).toBe("2028-02-29");
    expect(shiftDate("2026-01-01", -1)).toBe("2025-12-31");
  });
  it("distinguishes not logged, skipped, rest and future days without inventing attendance", () => {
    const get = (date: string, overrides = {}) =>
      calendarDay(
        date,
        "2026-10-23",
        [record],
        [],
        overrides,
        preferences.timeZone,
      ).state;
    expect(get("2026-10-18")).toBe("before_plan");
    expect(get("2026-10-19")).toBe("not_logged");
    expect(get("2026-10-19", { "2026-10-19": "skipped" })).toBe("skipped");
    expect(get("2026-10-19", { "2026-10-19": "planned" })).toBe("not_logged");
    expect(get("2026-10-20")).toBe("rest");
    expect(get("2026-10-26")).toBe("planned");
  });
  it("retains historical schedules and gives actual completion precedence over skip markers", () => {
    const changed = generateProgram(
      { ...preferences, trainingDays: [2, 4] },
      new Date("2026-10-22T07:00:00Z"),
    );
    const history = [
      record,
      { id: "second", program: changed, createdAt: changed.createdAt },
    ];
    expect(
      calendarDay(
        "2026-10-19",
        "2026-10-23",
        history,
        [],
        {},
        preferences.timeZone,
      ).state,
    ).toBe("not_logged");
    expect(
      calendarDay(
        "2026-10-23",
        "2026-10-23",
        history,
        [],
        {},
        preferences.timeZone,
      ).state,
    ).toBe("rest");
    const workout = {
      ...newWorkout(),
      status: "completed" as const,
      startedAt: "2026-10-18T21:00:00Z",
    };
    expect(
      calendarDay(
        "2026-10-19",
        "2026-10-23",
        history,
        [workout],
        { "2026-10-19": "skipped" },
        preferences.timeZone,
      ).state,
    ).toBe("completed");
  });
  it("does not count seconds as repetitions or lifting volume, and still accepts old workouts", () => {
    const w = newWorkout("Mixed", [
      { name: "Row", sets: 1 },
      { name: "Plank", sets: 1, measure: "seconds" },
    ]);
    w.exercises[0].sets[0] = {
      ...w.exercises[0].sets[0],
      weight: 20,
      reps: 10,
      completed: true,
    };
    w.exercises[1].sets[0] = {
      ...w.exercises[1].sets[0],
      weight: 0,
      reps: 30,
      completed: true,
    };
    expect(workoutSchema.safeParse(w).success).toBe(true);
    expect(workoutTotals(w)).toMatchObject({ sets: 2, reps: 10, volume: 200 });
    expect(workoutSchema.safeParse(newWorkout()).success).toBe(true);
  });
});
