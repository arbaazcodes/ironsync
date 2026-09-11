import { CalculatedBlueprint, OnboardingData } from "../types/onboarding";
import { calculateBMR, getActivityMultiplier, calculateTargetCalories } from "./bmrTdee";
import { calculateMacros } from "./macros";
import { generateWorkoutSchedule } from "./workoutSplit";

export { calculateBMR, getActivityMultiplier, calculateTargetCalories };
export { calculateMacros };
export { generateWorkoutSchedule };

/**
 * Master calculation engine that orchestrates the entire deterministic blueprint computation.
 */
export function generateBlueprint(data: OnboardingData): CalculatedBlueprint {
  // Normalize parameters with fallbacks
  const weight = typeof data.weightKg === "number" ? data.weightKg : 75;
  const height = typeof data.heightCm === "number" ? data.heightCm : 175;
  const age = typeof data.age === "number" ? data.age : 26;
  const gender = data.gender || "prefer_not_to_say";
  const goal = data.goal || "muscle_gain";
  const days = data.daysPerWeek || 4;
  const duration = data.sessionDuration || 60;
  const equipment = data.equipment || "commercial_gym";
  const experience = data.experience || "intermediate";

  // 1. Calculate BMR & TDEE
  const bmr = calculateBMR(weight, height, age, gender);
  const activityMultiplier = getActivityMultiplier(days, duration);
  const { tdee, targetCalories } = calculateTargetCalories(
    bmr,
    activityMultiplier,
    goal,
    gender
  );

  // 2. Calculate Macronutrient targets
  const macros = calculateMacros(targetCalories, weight, goal);

  // 3. Generate Workout Schedule
  const { splitName, schedule } = generateWorkoutSchedule(
    goal,
    days,
    equipment,
    experience
  );

  // 4. Formulate Diet Strategy Note based on dietType & budget
  let dietStrategyNotes = "Balanced whole-food nutrient timing with 1.8-2.1g/kg protein distribution.";
  if (data.dietType === "vegetarian") {
    dietStrategyNotes = "Plant-rich staples (paneer, lentils, pulses, soy) optimized for complete amino acid profiling.";
  } else if (data.dietType === "eggetarian") {
    dietStrategyNotes = "Egg-white and dairy protein architecture paired with complex carbohydrates for sustained energy.";
  } else if (data.dietType === "vegan") {
    dietStrategyNotes = "Bioavailable plant proteins (tofu, tempeh, pea-rice isolates) with micro-nutrient timing.";
  } else if (data.dietType === "non_vegetarian") {
    dietStrategyNotes = "High-satiety lean poultry, fish, and whole eggs with strategic carb loading around training.";
  }

  // 5. Recovery Protocol
  const hydration = (weight * 0.04).toFixed(1); // 40ml per kg of bodyweight
  const sleepHours = days >= 5 ? "8h 00m" : "7h 30m";

  return {
    bmr,
    tdee,
    macros,
    splitName,
    schedule,
    recoveryProtocol: {
      sleepTarget: sleepHours,
      hydrationTarget: `${hydration} Liters`,
      mobilityWindow: "15 min Daily",
    },
    dietStrategyNotes,
  };
}
