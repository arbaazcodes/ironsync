export type GoalId =
  | "muscle_gain"
  | "fat_loss"
  | "recomp"
  | "strength"
  | "posture_mobility"
  | "endurance";

export type GenderType = "male" | "female" | "prefer_not_to_say";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingEnvironment = "commercial_gym" | "home_gym" | "bodyweight";

export type TrainingTime = "morning" | "afternoon" | "evening";

export type DietType = "vegetarian" | "eggetarian" | "non_vegetarian" | "vegan";

export type BudgetTier = "budget" | "balanced" | "flexible";

export type DeliverableId =
  | "workout"
  | "nutrition"
  | "supplements"
  | "recovery";

export interface OnboardingData {
  goal: GoalId | null;
  age: number | "";
  gender: GenderType | null;
  heightCm: number | "";
  weightKg: number | "";
  targetWeightKg?: number | "";
  experience: ExperienceLevel | null;
  equipment: TrainingEnvironment | null;
  daysPerWeek: number; // 3, 4, 5, 6
  sessionDuration: number; // 45, 60, 90
  trainingTime: TrainingTime | null;
  dietType: DietType | null;
  mealsPerDay: number; // 3, 4, 5
  budget: BudgetTier | null;
  allergies: string[];
  deliverables: DeliverableId[];
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WorkoutExercise {
  name: string;
  setsReps: string;
  rpe?: string;
  rest?: string;
  primaryMuscles?: string[];
  executionCue?: string;
  commonMistake?: string;
  notes?: string;
  locked?: boolean;
}

export interface WorkoutDayPlan {
  dayName: string;
  focus: string;
  type: "workout" | "recovery";
  tag: string;
  exercises?: WorkoutExercise[];
}

export interface CalculatedBlueprint {
  bmr: number;
  tdee: number;
  macros: MacroTargets;
  splitName: string;
  schedule: WorkoutDayPlan[];
  recoveryProtocol: {
    sleepTarget: string;
    hydrationTarget: string;
    mobilityWindow: string;
  };
  dietStrategyNotes: string;
}
