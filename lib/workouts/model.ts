import { z } from "zod";
const isoDate = z.string().datetime({ offset: true });
export const workoutSetSchema = z.object({
  id: z.string().uuid(),
  weight: z.number().min(0).max(1000).nullable(),
  reps: z.number().int().min(0).max(1000).nullable(),
  completed: z.boolean(),
}).strict().refine(s => !s.completed || (s.reps !== null && s.reps > 0 && s.weight !== null), "Completed sets need reps and weight (0 for bodyweight).");
export const workoutSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(100),
  unit: z.enum(["kg", "lb"]),
  status: z.enum(["active", "completed"]),
  startedAt: isoDate,
  completedAt: isoDate.nullable(),
  restEndsAt: isoDate.nullable(),
  scheduledFor: z.iso.date().optional(),
  exercises: z.array(z.object({
    id: z.string().uuid(),
    catalogId: z.string().max(200).nullable(),
    name: z.string().trim().min(1).max(120),
    measure: z.enum(["reps", "seconds"]).optional(),
    target: z.string().max(40).optional(),
    restSeconds: z.number().int().min(20).max(300).optional(),
    sets: z.array(workoutSetSchema).max(30),
  }).strict()).max(30),
}).strict().superRefine((s, ctx) => {
  if ((s.status === "completed") !== (s.completedAt !== null)) ctx.addIssue({ code: "custom", message: "Invalid completion state" });
  if (s.completedAt && Date.parse(s.completedAt) < Date.parse(s.startedAt)) ctx.addIssue({ code: "custom", message: "Completion precedes start" });
  const ids = s.exercises.flatMap(e => [e.id, ...e.sets.map(set => set.id)]);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Duplicate exercise or set ID" });
  if (s.status === "completed" && !s.exercises.some(e => e.sets.some(set => set.completed))) ctx.addIssue({ code: "custom", message: "Complete at least one set" });
});
export type Workout = z.infer<typeof workoutSchema>;
export const saveWorkoutSchema = z.object({
  session: workoutSchema, expectedRevision: z.number().int().min(0).max(2147483646), mutationId: z.string().uuid(),
}).strict();
export type SaveWorkout = z.infer<typeof saveWorkoutSchema>;
export const remoteWorkoutSchema = z.object({ session: workoutSchema, revision: z.number().int().positive(), mutationId: z.string().uuid() });
export type RemoteWorkout = z.infer<typeof remoteWorkoutSchema>;
export function newSet(): Workout["exercises"][number]["sets"][number] {
  return { id: crypto.randomUUID(), weight: null, reps: null, completed: false };
}
export function newWorkout(title = "My workout", exercises: { name: string; catalogId?: string; sets?: number; measure?: "reps" | "seconds"; target?: string; restSeconds?: number }[] = []): Workout {
  return { id: crypto.randomUUID(), title, unit: "kg", status: "active", startedAt: new Date().toISOString(), completedAt: null, restEndsAt: null,
    exercises: exercises.map(e => ({ id: crypto.randomUUID(), catalogId: e.catalogId || null, name: e.name, ...(e.measure ? { measure: e.measure } : {}), ...(e.target ? { target: e.target } : {}), ...(e.restSeconds ? { restSeconds: e.restSeconds } : {}), sets: Array.from({ length: Math.min(30, e.sets || 3) }, newSet) })) };
}
export function workoutTotals(session: Workout) {
  const sets = session.exercises.flatMap(e => e.sets).filter(s => s.completed);
  const repetitionSets = session.exercises.filter(e => e.measure !== "seconds").flatMap(e => e.sets).filter(s => s.completed);
  return { sets: sets.length, reps: repetitionSets.reduce((sum, s) => sum + (s.reps || 0), 0),
    volume: repetitionSets.reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0),
    seconds: Math.max(0, Math.floor(((session.completedAt ? Date.parse(session.completedAt) : Date.now()) - Date.parse(session.startedAt)) / 1000)) };
}
