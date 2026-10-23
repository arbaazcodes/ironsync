import { z } from "zod";
import { preferencesSchema, type Program } from "./types";
import { trainingExercise } from "./exercises";
import { foodById } from "./foods";

const nutrients = z.object({
  calories: z.number().min(0).max(20000),
  protein: z.number().min(0).max(2000),
  carbs: z.number().min(0).max(5000),
  fat: z.number().min(0).max(2000),
});
const programSchema = z.object({
  version: z.literal(1),
  preferences: preferencesSchema,
  createdAt: z.iso.datetime(),
  startsOn: z.iso.date(),
  title: z.string().max(100),
  schedule: z
    .array(
      z.object({
        weekday: z.number().int().min(0).max(6),
        title: z.string().max(100),
        kind: z.enum(["training", "rest"]),
        minutes: z.number().min(0).max(120),
        exercises: z
          .array(
            z.object({
              exerciseId: z
                .string()
                .refine((id) => Boolean(trainingExercise(id))),
              sets: z.number().int().min(1).max(10),
              target: z.string().max(40),
              restSeconds: z.number().min(20).max(300),
            }),
          )
          .max(12),
      }),
    )
    .length(7)
    .refine((days) => days.every((day, index) => day.weekday === index)),
  rationale: z.array(z.string().max(1000)).max(20),
  nutrition: z.object({
    targetCalories: z.number().min(0).max(10000).nullable(),
    proteinGuide: z.number().min(0).max(1000).nullable(),
    notes: z.array(z.string().max(1000)).max(20),
    unavailable: z.string().max(1000).nullable(),
    days: z
      .array(
        z.object({
          weekday: z.number().int().min(0).max(6),
          totals: nutrients,
          meals: z
            .array(
              z.object({
                name: z.string().max(100),
                preparation: z.string().max(2000),
                totals: nutrients,
                ingredients: z
                  .array(
                    z.object({
                      foodId: z.string().refine((id) => Boolean(foodById(id))),
                      grams: z.number().positive().max(3000),
                    }),
                  )
                  .min(1)
                  .max(20),
              }),
            )
            .min(1)
            .max(6),
        }),
      )
      .max(7)
      .refine(
        (days) =>
          days.length === 0 ||
          (days.length === 7 &&
            days.every((day, index) => day.weekday === index)),
      ),
  }),
});
// The database is also reachable by its owner through PostgREST. Validate stored JSON
// before exposing it to renderers; a malformed owner-written snapshot must fail safely.
export function parseProgram(value: unknown): Program {
  return programSchema.parse(value);
}
