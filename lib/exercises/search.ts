import { DIFFICULTIES, EQUIPMENT, MUSCLE_GROUPS, type Difficulty, type Equipment, type MuscleGroup, type PublicExercise } from "./types";

export type ExerciseSearchParams = Record<string, string | string[] | undefined>;
export interface ExerciseFilters { q: string; muscle: MuscleGroup | ""; equipment: Equipment | ""; difficulty: Difficulty | "" }
export const PAGE_SIZE = 12;
export function parseExerciseSearch(params: ExerciseSearchParams): { filters: ExerciseFilters; page: number; ignoredFilters: boolean } {
  const first = (key: string) => (Array.isArray(params[key]) ? params[key][0] : params[key]) || "";
  const q = first("q").trim().slice(0, 80);
  const muscle = MUSCLE_GROUPS.find(value => value === first("muscle")) || "";
  const equipment = EQUIPMENT.find(value => value === first("equipment")) || "";
  const difficulty = DIFFICULTIES.find(value => value === first("difficulty")) || "";
  const pageValue = first("page");
  const page = /^\d{1,6}$/.test(pageValue) ? Math.max(1, Number(pageValue)) : 1;
  const ignoredFilters = ["muscle", "equipment", "difficulty"].some(key => first(key) && !({ muscle, equipment, difficulty }[key as "muscle" | "equipment" | "difficulty"]));
  return { filters: { q, muscle, equipment, difficulty }, page, ignoredFilters };
}

export function normalizeSearch(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function filterExercises(exercises: PublicExercise[], filters: ExerciseFilters) {
  const tokens = normalizeSearch(filters.q).split(" ").filter(Boolean);
  return exercises.filter(exercise => {
    if (exercise.publication.status !== "published") return false;
    if (filters.muscle && exercise.muscleGroup !== filters.muscle) return false;
    if (filters.equipment && !exercise.equipment.includes(filters.equipment)) return false;
    if (filters.difficulty && exercise.difficulty !== filters.difficulty) return false;
    // Accessories such as a bench must not turn a shoulder press into a "bench press" result.
    const text = normalizeSearch([exercise.name, ...exercise.aliases, exercise.muscleGroup, ...exercise.primaryMuscles, ...exercise.secondaryMuscles].join(" "));
    return tokens.every(token => text.includes(token));
  });
}

export function exerciseListHref(filters: Partial<ExerciseFilters> = {}, page = 1) {
  const params = new URLSearchParams();
  for (const key of ["q", "muscle", "equipment", "difficulty"] as const) if (filters[key]) params.set(key, filters[key]!);
  if (page > 1) params.set("page", String(page));
  return "/exercises" + (params.size ? "?" + params.toString() : "");
}

export function searchExercises(exercises: PublicExercise[], params: ExerciseSearchParams) {
  const parsed = parseExerciseSearch(params);
  const matches = filterExercises(exercises, parsed.filters);
  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(parsed.page, totalPages);
  return { ...parsed, page, total: matches.length, totalPages, exercises: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
}
