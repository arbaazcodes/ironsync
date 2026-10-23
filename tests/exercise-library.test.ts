import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { EXERCISE_CONTENT } from "@/lib/exercises/content";
import { getPublicExercise, PUBLISHED_EXERCISES, relatedExercises } from "@/lib/exercises/catalog";
import { exerciseListHref, filterExercises, parseExerciseSearch, searchExercises } from "@/lib/exercises/search";
import { DIFFICULTIES, EQUIPMENT, MUSCLE_GROUPS } from "@/lib/exercises/types";
import sitemap from "@/app/sitemap";

describe("published exercise library", () => {
  it("publishes complete unique guides without legacy demonstration or calorie claims", () => {
    const ids = PUBLISHED_EXERCISES.map(item => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of PUBLISHED_EXERCISES) {
      expect(item.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(item.steps.length).toBeGreaterThanOrEqual(3);
      expect(item.cues.length).toBeGreaterThan(0);
      expect(item.primaryMuscles.length).toBeGreaterThan(0);
      expect(item.equipment.length).toBeGreaterThan(0);
      expect(MUSCLE_GROUPS).toContain(item.muscleGroup);
      expect(DIFFICULTIES).toContain(item.difficulty);
      for (const equipment of item.equipment) expect(EQUIPMENT).toContain(equipment);
      expect(new URL(item.source.url).hostname).toBe("www.acefitness.org");
      expect(item.publication.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.publication.checkMethod).toBe("AI-assisted source comparison");
      expect(item.publication.trainerReviewed).toBe(false);
    }
    expect(JSON.stringify(EXERCISE_CONTENT)).not.toMatch(/gtv-videos|unsplash|caloriesBurnEstimate|videoUrl|imageUrl/);
  });
  it("finds common aliases and ignores case, diacritics, punctuation, and extra spaces", () => {
    for (const q of [" RDL ", "rDl", "RＤL"]) {
      expect(searchExercises(PUBLISHED_EXERCISES, { q }).exercises.map(item => item.id)).toEqual(["romanian-deadlift"]);
    }
    expect(searchExercises(PUBLISHED_EXERCISES, { q: "BÉNCH   press" }).exercises.map(item => item.id)).toEqual(["barbell-bench-press", "close-grip-barbell-bench-press", "flat-dumbbell-press"]);
    expect(searchExercises(PUBLISHED_EXERCISES, { q: "knee pushup" }).exercises[0].id).toBe("bent-knee-push-up");
  });
  it("combines text, muscle, equipment, and difficulty filters with AND semantics", () => {
    const results = searchExercises(PUBLISHED_EXERCISES, { q: "press", muscle: "Chest", equipment: "Dumbbells", difficulty: "Intermediate" });
    expect(results.exercises.map(item => item.id)).toEqual(["flat-dumbbell-press"]);
    expect(searchExercises(PUBLISHED_EXERCISES, { q: "RDL", muscle: "Arms" }).total).toBe(0);
    expect(searchExercises(PUBLISHED_EXERCISES, { equipment: "Bench", q: "dumbbell press" }).exercises[0].id).toBe("flat-dumbbell-press");
  });
  it("never exposes draft or withdrawn entries and does not fuzzy-match unknown detail slugs", () => {
    const item = EXERCISE_CONTENT[0];
    for (const status of ["draft", "withdrawn"] as const) {
      expect(filterExercises([{ ...item, publication: { ...item.publication, status } }], parseExerciseSearch({}).filters)).toEqual([]);
    }
    expect(getPublicExercise("bench")).toBeUndefined();
    expect(getPublicExercise("toString")).toBeUndefined();
    expect(getPublicExercise("../barbell-bench-press")).toBeUndefined();
  });
  it("paginates without duplicates and clamps invalid page numbers", () => {
    const first = searchExercises(PUBLISHED_EXERCISES, {});
    const second = searchExercises(PUBLISHED_EXERCISES, { page: "2" });
    expect(new Set([...first.exercises, ...second.exercises].map(item => item.id)).size).toBe(first.total);
    expect(searchExercises(PUBLISHED_EXERCISES, { page: "999999" }).page).toBe(first.totalPages);
    for (const page of ["-1", "NaN", "Infinity", "1.5", "0"]) expect(searchExercises(PUBLISHED_EXERCISES, { page }).page).toBe(1);
  });
  it("normalizes malformed links, limits query size, and serializes only supported filter keys", () => {
    const parsed = parseExerciseSearch({ q: "x".repeat(200), muscle: ["Chest", "Back"], equipment: "javascript:bad", difficulty: "expert" });
    expect(parsed.filters.q).toHaveLength(80);
    expect(parsed.filters.muscle).toBe("Chest");
    expect(parsed.ignoredFilters).toBe(true);
    expect(parsed.filters.equipment).toBe("");
    const filters = { ...parsed.filters, q: "bench & press" };
    const href = exerciseListHref(filters, 2);
    const roundTrip = parseExerciseSearch(Object.fromEntries(new URL(href, "https://app.test").searchParams));
    expect(roundTrip.filters).toEqual(filters);
    expect(roundTrip.page).toBe(2);
  });
  it("sitemap and related links resolve only to published details", () => {
    const urls = sitemap().map(item => item.url);
    for (const item of PUBLISHED_EXERCISES) {
      expect(urls).toContain(`https://www.ironsync.online/exercises/${item.id}`);
      for (const related of relatedExercises(item)) {
        expect(related.id).not.toBe(item.id);
        expect(getPublicExercise(related.id)).toBeDefined();
        expect(related.muscleGroup).toBe(item.muscleGroup);
      }
    }
    expect(urls).not.toContain(expect.stringContaining("/dashboard"));
  });
});
