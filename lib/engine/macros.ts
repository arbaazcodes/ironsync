import { GoalId, MacroTargets } from "../types/onboarding";

/**
 * Calculates macronutrient distribution isolated from UI.
 * 
 * Rules:
 * - Protein is goal-aware (g per kg of bodyweight).
 * - Fat adheres to hormonal safety minimums (~22-25% of total calories).
 * - Carbohydrates receive the remaining metabolic energy budget.
 */
export function calculateMacros(
  calories: number,
  weightKg: number,
  goal: GoalId
): MacroTargets {
  // 1. Goal-aware Protein multiplier (g/kg)
  let proteinPerKg = 2.0;

  switch (goal) {
    case "fat_loss":
      // Higher protein to spare lean muscle mass in a deficit
      proteinPerKg = 2.1;
      break;
    case "muscle_gain":
      proteinPerKg = 2.0;
      break;
    case "recomp":
      proteinPerKg = 2.0;
      break;
    case "strength":
      proteinPerKg = 1.9;
      break;
    case "endurance":
      proteinPerKg = 1.6;
      break;
    case "posture_mobility":
    default:
      proteinPerKg = 1.6;
      break;
  }

  const rawProteinGrams = Math.round(weightKg * proteinPerKg);
  // Cap protein safely between 80g and 280g
  const protein = Math.max(80, Math.min(rawProteinGrams, 280));
  const proteinCalories = protein * 4;

  // 2. Fat allocation: 25% of calories or min 0.8g/kg
  const fatCaloriesFromPercentage = calories * 0.25;
  const fatCaloriesFromWeight = weightKg * 0.85 * 9;
  const targetFatCalories = Math.max(fatCaloriesFromPercentage, fatCaloriesFromWeight);
  const rawFatGrams = Math.round(targetFatCalories / 9);
  // Cap fat between 45g and 120g
  const fat = Math.max(45, Math.min(rawFatGrams, 120));
  const fatCalories = fat * 9;

  // 3. Carbohydrates: remaining calories
  const remainingCalories = calories - (proteinCalories + fatCalories);
  const carbs = Math.max(50, Math.round(remainingCalories / 4));

  // Balanced caloric sum
  return {
    calories,
    protein,
    carbs,
    fat,
  };
}
