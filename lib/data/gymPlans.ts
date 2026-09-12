import { generateBlueprint } from "../engine/index";
import { CalculatedBlueprint } from "../types/onboarding";

export interface GymPlanTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  goal: string;
  splitName: string;
  trainingDays: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  blueprint: CalculatedBlueprint;
}

// 1. Hypertrophy PPL Blueprint
const hypertrophyBlueprint = generateBlueprint({
  gender: "male",
  age: 26,
  weightKg: 78,
  heightCm: 178,
  goal: "muscle_gain",
  daysPerWeek: 4,
  sessionDuration: 60,
  equipment: "commercial_gym",
  experience: "intermediate",
  dietType: "non_vegetarian",
  mealsPerDay: 4,
  budget: "balanced",
  allergies: [],
  deliverables: ["workout", "nutrition"],
  trainingTime: "evening",
});

// 2. Fat Loss Blueprint
const fatLossBlueprint = generateBlueprint({
  gender: "male",
  age: 28,
  weightKg: 85,
  heightCm: 175,
  goal: "fat_loss",
  daysPerWeek: 4,
  sessionDuration: 60,
  equipment: "commercial_gym",
  experience: "intermediate",
  dietType: "non_vegetarian",
  mealsPerDay: 4,
  budget: "balanced",
  allergies: [],
  deliverables: ["workout", "nutrition"],
  trainingTime: "morning",
});

// 3. Strength Foundation Blueprint
const strengthBlueprint = generateBlueprint({
  gender: "male",
  age: 25,
  weightKg: 82,
  heightCm: 180,
  goal: "strength",
  daysPerWeek: 4,
  sessionDuration: 75,
  equipment: "commercial_gym",
  experience: "intermediate",
  dietType: "non_vegetarian",
  mealsPerDay: 4,
  budget: "balanced",
  allergies: [],
  deliverables: ["workout", "nutrition"],
  trainingTime: "evening",
});

// 4. Recomposition Blueprint
const recompBlueprint = generateBlueprint({
  gender: "male",
  age: 27,
  weightKg: 75,
  heightCm: 176,
  goal: "recomp",
  daysPerWeek: 3,
  sessionDuration: 60,
  equipment: "commercial_gym",
  experience: "intermediate",
  dietType: "non_vegetarian",
  mealsPerDay: 3,
  budget: "balanced",
  allergies: [],
  deliverables: ["workout", "nutrition"],
  trainingTime: "evening",
});

export const GYM_PLAN_TEMPLATES: GymPlanTemplate[] = [
  {
    id: "plan-hypertrophy-ppl",
    name: "Hypertrophy Push / Pull / Legs",
    category: "Muscle Building",
    description: "4-day athletic hypertrophy split targeting mechanical tension and progressive double progression.",
    goal: "muscle_gain",
    splitName: hypertrophyBlueprint.splitName,
    trainingDays: 4,
    calories: hypertrophyBlueprint.macros.calories,
    protein: hypertrophyBlueprint.macros.protein,
    carbs: hypertrophyBlueprint.macros.carbs,
    fat: hypertrophyBlueprint.macros.fat,
    blueprint: hypertrophyBlueprint,
  },
  {
    id: "plan-fat-loss-conditioning",
    name: "Fat Loss & Metabolic Conditioning",
    category: "Fat Loss & Shred",
    description: "Moderate 20% caloric deficit with high protein distribution to spare lean tissue while maximizing fat oxidation.",
    goal: "fat_loss",
    splitName: fatLossBlueprint.splitName,
    trainingDays: 4,
    calories: fatLossBlueprint.macros.calories,
    protein: fatLossBlueprint.macros.protein,
    carbs: fatLossBlueprint.macros.carbs,
    fat: fatLossBlueprint.macros.fat,
    blueprint: fatLossBlueprint,
  },
  {
    id: "plan-strength-foundation",
    name: "Strength & Power Protocol",
    category: "Powerlifting & Strength",
    description: "Heavy compound linear progression focused on squat, bench press, and deadlift kinetic mastery.",
    goal: "strength",
    splitName: strengthBlueprint.splitName,
    trainingDays: 4,
    calories: strengthBlueprint.macros.calories,
    protein: strengthBlueprint.macros.protein,
    carbs: strengthBlueprint.macros.carbs,
    fat: strengthBlueprint.macros.fat,
    blueprint: strengthBlueprint,
  },
  {
    id: "plan-metabolic-recomp",
    name: "Athletic Body Recomposition",
    category: "Recomposition",
    description: "Full-body 3-day split balancing simultaneous fat loss and localized muscular development at near-maintenance energy.",
    goal: "recomp",
    splitName: recompBlueprint.splitName,
    trainingDays: 3,
    calories: recompBlueprint.macros.calories,
    protein: recompBlueprint.macros.protein,
    carbs: recompBlueprint.macros.carbs,
    fat: recompBlueprint.macros.fat,
    blueprint: recompBlueprint,
  },
];

export function getGymPlanTemplate(idOrName: string): GymPlanTemplate | undefined {
  if (!idOrName) return undefined;
  const normalized = idOrName.toLowerCase().trim();
  return (
    GYM_PLAN_TEMPLATES.find((p) => p.id === normalized) ||
    GYM_PLAN_TEMPLATES.find((p) => p.name.toLowerCase().includes(normalized)) ||
    GYM_PLAN_TEMPLATES[0]
  );
}
