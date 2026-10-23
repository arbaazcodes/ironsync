export const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"] as const;
export const EQUIPMENT = ["No equipment", "Dumbbells", "Barbell", "Bench", "Cable machine", "Weight machine", "Kettlebell", "Resistance band", "Pull-up bar"] as const;
export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
export type MuscleGroup = typeof MUSCLE_GROUPS[number];
export type Equipment = typeof EQUIPMENT[number];
export type Difficulty = typeof DIFFICULTIES[number];

export interface PublicExercise {
  id: string;
  name: string;
  aliases: string[];
  muscleGroup: MuscleGroup;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: Equipment[];
  equipmentNote: string;
  difficulty: Difficulty;
  summary: string;
  steps: string[];
  cues: string[];
  source: { title: string; url: string };
  publication: { status: "published" | "draft" | "withdrawn"; checkedAt: string; checkMethod: "AI-assisted source comparison"; trainerReviewed: boolean };
}
