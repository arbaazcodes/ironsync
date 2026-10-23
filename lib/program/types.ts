import { z } from "zod";

export const goalLabels = {
  fat_loss: "Lose weight",
  muscle_gain: "Build muscle",
  strength: "Get stronger",
  general: "Stay active",
} as const;
export const equipmentLabels = {
  dumbbells: "Dumbbells",
  bench: "Bench",
  barbell: "Barbell + rack",
  cable: "Cable machines",
  leg_press: "Leg press",
} as const;
export const dietLabels = {
  vegetarian: "Vegetarian",
  eggetarian: "Vegetarian + eggs",
  non_vegetarian: "Non-vegetarian",
  vegan: "Vegan",
} as const;
export const allergyLabels = {
  milk: "Milk",
  egg: "Eggs",
  soy: "Soy",
  gluten: "Gluten / oats",
  legumes: "Lentils / chickpeas",
  other: "Other or severe allergy",
} as const;
export const weekdayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const preferencesSchema = z
  .object({
    goal: z.enum(["fat_loss", "muscle_gain", "strength", "general"]),
    age: z.number().int().min(18).max(75),
    heightCm: z.number().min(120).max(230),
    weightKg: z.number().min(40).max(220),
    sex: z.enum(["male", "female", "skip"]),
    experience: z.enum(["beginner", "intermediate", "advanced"]),
    equipment: z
      .array(z.enum(["dumbbells", "bench", "barbell", "cable", "leg_press"]))
      .max(5),
    trainingDays: z
      .array(z.number().int().min(0).max(6))
      .min(2)
      .max(5)
      .refine((a) => new Set(a).size === a.length, "Choose different days"),
    duration: z.union([z.literal(30), z.literal(45), z.literal(60)]),
    activity: z.enum(["seated", "mixed", "active"]),
    diet: z.enum(["vegetarian", "eggetarian", "non_vegetarian", "vegan"]),
    meals: z.union([z.literal(3), z.literal(4)]),
    allergies: z
      .array(z.enum(["milk", "egg", "soy", "gluten", "legumes", "other"]))
      .max(6),
    needsProfessionalGuidance: z.boolean(),
    timeZone: z
      .string()
      .max(80)
      .refine((value) => {
        try {
          new Intl.DateTimeFormat("en", { timeZone: value });
          return true;
        } catch {
          return false;
        }
      }, "Choose a valid timezone"),
  })
  .strict();
export type Preferences = z.infer<typeof preferencesSchema>;
export interface TrainingExercise {
  id: string;
  name: string;
  muscle: string;
  equipment: (keyof typeof equipmentLabels)[];
  pattern: "squat" | "hinge" | "push" | "pull" | "shoulders" | "arms" | "core";
  level: "beginner" | "intermediate";
  measure: "reps" | "seconds";
  images: [string, string];
  steps: string[];
  cue: string;
  sourceId: string;
  guideSlug?: string;
}
export interface Prescription {
  exerciseId: string;
  sets: number;
  target: string;
  restSeconds: number;
}
export interface ProgramDay {
  weekday: number;
  title: string;
  kind: "training" | "rest";
  exercises: Prescription[];
  minutes: number;
}
export interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
export interface Food {
  id: string;
  name: string;
  fdcId: number;
  description: string;
  per100g: Nutrients;
  basis: string;
  allergens: string[];
  diets: Preferences["diet"][];
}
export interface Meal {
  name: string;
  ingredients: { foodId: string; grams: number }[];
  totals: Nutrients;
  preparation: string;
}
export interface MealDay {
  weekday: number;
  meals: Meal[];
  totals: Nutrients;
}
export interface Program {
  version: 1;
  preferences: Preferences;
  createdAt: string;
  startsOn: string;
  title: string;
  schedule: ProgramDay[];
  rationale: string[];
  nutrition: {
    targetCalories: number | null;
    proteinGuide: number | null;
    days: MealDay[];
    notes: string[];
    unavailable: string | null;
  };
}
export interface ProgramRecord {
  id: string;
  program: Program;
  createdAt: string;
}
export function dateInZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function weekdayOf(date: string) {
  return new Date(date + "T12:00:00Z").getUTCDay();
}
export function shiftDate(date: string, days: number) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  return {
    first: month + "-01",
    last: new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10),
  };
}
