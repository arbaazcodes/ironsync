import "server-only";
import type { PublicExercise } from "./types";
import { EXERCISE_CONTENT } from "./content";

// This is the only public publishing boundary. Legacy workout demo media is never imported.
export const PUBLISHED_EXERCISES: PublicExercise[] = EXERCISE_CONTENT
  .filter(exercise => exercise.publication.status === "published")
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const byId = new Map(PUBLISHED_EXERCISES.map(exercise => [exercise.id, exercise]));
export function getPublicExercise(id: string) { return byId.get(id); }
export function relatedExercises(exercise: PublicExercise) {
  return PUBLISHED_EXERCISES.filter(item => item.id !== exercise.id && item.muscleGroup === exercise.muscleGroup).slice(0, 3);
}
