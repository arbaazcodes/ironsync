import { GenderType, GoalId } from "../types/onboarding";

/**
 * Calculates Basal Metabolic Rate using the Mifflin-St Jeor equation.
 * Weight in kg, Height in cm, Age in years.
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: GenderType
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  switch (gender) {
    case "male":
      return Math.round(base + 5);
    case "female":
      return Math.round(base - 161);
    case "prefer_not_to_say":
    default:
      // Acknowledged neutral offset: midpoint between male (+5) and female (-161)
      return Math.round(base - 78);
  }
}

/**
 * Maps training frequency and session duration to an activity multiplier.
 */
export function getActivityMultiplier(
  daysPerWeek: number,
  sessionDuration: number = 60
): number {
  let multiplier = 1.375;

  if (daysPerWeek <= 3) {
    multiplier = 1.375;
  } else if (daysPerWeek === 4) {
    multiplier = 1.45;
  } else if (daysPerWeek === 5) {
    multiplier = 1.55;
  } else {
    multiplier = 1.65;
  }

  // Duration modifier
  if (sessionDuration >= 90) {
    multiplier += 0.04;
  } else if (sessionDuration <= 45) {
    multiplier -= 0.02;
  }

  return Number(multiplier.toFixed(3));
}

/**
 * Computes Total Daily Energy Expenditure and adjusts for fitness goal.
 */
export function calculateTargetCalories(
  bmr: number,
  activityMultiplier: number,
  goal: GoalId,
  gender: GenderType
): { tdee: number; targetCalories: number } {
  const tdee = Math.round(bmr * activityMultiplier);
  let adjusted = tdee;

  switch (goal) {
    case "fat_loss":
      // Moderate ~20% deficit
      adjusted = Math.round(tdee * 0.8);
      break;
    case "muscle_gain":
      // Moderate ~12% surplus
      adjusted = Math.round(tdee * 1.12);
      break;
    case "recomp":
      // Slight 3% deficit / near maintenance
      adjusted = Math.round(tdee * 0.97);
      break;
    case "strength":
      // +5% slight surplus for heavy CNS loading
      adjusted = Math.round(tdee * 1.05);
      break;
    case "endurance":
      // +5% for glycogen replenishing
      adjusted = Math.round(tdee * 1.05);
      break;
    case "posture_mobility":
    default:
      adjusted = tdee;
      break;
  }

  // Safety boundaries: Avoid harmful starvation floors or excessive spikes
  const minSafeFloor = gender === "female" ? 1350 : 1550;
  const targetCalories = Math.max(minSafeFloor, Math.min(adjusted, 4500));

  return { tdee, targetCalories };
}
