import {
  GoalId,
  GenderType,
  ExperienceLevel,
  TrainingEnvironment,
  TrainingTime,
  DietType,
  BudgetTier,
  OnboardingData,
} from "../types/onboarding";
import { generateBlueprint } from "../engine";
import { generateMealPlan, DayMeal } from "../engine/mealGenerator";
import { SavedPlanData, setCachedActivePlan, getCachedActivePlan } from "../supabase/planSync";
import { getSupabase } from "../supabase/client";

export interface UserProfileData {
  displayName: string;
  email?: string;
  phone?: string;
  gender: GenderType;
  age: number | "";
  heightCm: number | "";
  weightKg: number | "";
  targetWeightKg: number | "";
  goal: GoalId;
  experience: ExperienceLevel;
  daysPerWeek: number;
  equipment: TrainingEnvironment;
  sessionDuration: number;
  trainingTime: TrainingTime;
  dietType: DietType;
  mealsPerDay: number;
  budget: BudgetTier;
  allergies: string[];
}

export interface ParameterChange {
  field: string;
  label: string;
  oldValue: string | number;
  newValue: string | number;
}

const PROFILE_CACHE_KEY = "ironsync_user_profile_cache";

/**
 * Loads profile data from Supabase or local cache/active plan fallback.
 */
export async function fetchUserProfile(
  userId: string,
  emailFallback?: string
): Promise<UserProfileData> {
  const activePlan = getCachedActivePlan();

  // Default fallback values
  let profileData: UserProfileData = {
    displayName: activePlan?.displayName || emailFallback?.split("@")[0] || "Athlete",
    email: emailFallback || undefined,
    phone: "",
    gender: "prefer_not_to_say",
    age: 26,
    heightCm: activePlan?.heightCm || 175,
    weightKg: activePlan?.weightKg || 75,
    targetWeightKg: activePlan?.targetWeightKg || 70,
    goal: (activePlan?.goal as GoalId) || "muscle_gain",
    experience: (activePlan?.experience as ExperienceLevel) || "intermediate",
    daysPerWeek: activePlan?.trainingDays || 4,
    equipment: (activePlan?.equipment as TrainingEnvironment) || "commercial_gym",
    sessionDuration: activePlan?.sessionDuration || 60,
    trainingTime: "morning",
    dietType: (activePlan?.dietType as DietType) || "eggetarian",
    mealsPerDay: activePlan?.meals?.length || 3,
    budget: (activePlan?.budget as BudgetTier) || "balanced",
    allergies: activePlan?.foodRestrictions || [],
  };

  // Check localStorage cache first
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(`${PROFILE_CACHE_KEY}_${userId}`);
      if (cached) {
        profileData = { ...profileData, ...JSON.parse(cached) };
      }
    } catch (err) {
      console.warn("Could not parse profile cache:", err);
    }
  }

  // Fetch from Supabase if available
  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        profileData = {
          displayName: data.display_name || profileData.displayName,
          email: emailFallback || profileData.email,
          phone: profileData.phone,
          gender: (data.gender as GenderType) || profileData.gender,
          age: typeof data.age === "number" ? data.age : profileData.age,
          heightCm: typeof data.height === "number" ? data.height : profileData.heightCm,
          weightKg: typeof data.weight === "number" ? data.weight : profileData.weightKg,
          targetWeightKg: typeof data.target_weight === "number" ? data.target_weight : profileData.targetWeightKg,
          goal: (data.goal as GoalId) || profileData.goal,
          experience: (data.experience as ExperienceLevel) || profileData.experience,
          daysPerWeek: data.days_per_week || profileData.daysPerWeek,
          equipment: (data.equipment as TrainingEnvironment) || profileData.equipment,
          sessionDuration: data.session_duration || profileData.sessionDuration,
          trainingTime: (data.training_time as TrainingTime) || profileData.trainingTime,
          dietType: (data.diet_type as DietType) || profileData.dietType,
          mealsPerDay: data.meals_per_day || profileData.mealsPerDay,
          budget: (data.budget as BudgetTier) || profileData.budget,
          allergies: data.food_restrictions || profileData.allergies,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(`${PROFILE_CACHE_KEY}_${userId}`, JSON.stringify(profileData));
        }
      }
    } catch (err) {
      console.warn("Could not query profiles from Supabase:", err);
    }
  }

  return profileData;
}

/**
 * Saves updated profile information without mutating active plan.
 */
export async function saveUserProfile(
  userId: string,
  profile: UserProfileData
): Promise<{ success: boolean; error?: string }> {
  // Update local cache
  if (typeof window !== "undefined") {
    localStorage.setItem(`${PROFILE_CACHE_KEY}_${userId}`, JSON.stringify(profile));
  }

  // Update active plan cache fields
  const activePlan = getCachedActivePlan();
  if (activePlan) {
    activePlan.displayName = profile.displayName;
    activePlan.weightKg = typeof profile.weightKg === "number" ? profile.weightKg : null;
    activePlan.targetWeightKg = typeof profile.targetWeightKg === "number" ? profile.targetWeightKg : null;
    activePlan.heightCm = typeof profile.heightCm === "number" ? profile.heightCm : null;
    setCachedActivePlan(activePlan);
  }

  // Persist to Supabase
  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        user_id: userId,
        display_name: profile.displayName,
        gender: profile.gender,
        age: typeof profile.age === "number" ? profile.age : null,
        height: typeof profile.heightCm === "number" ? profile.heightCm : null,
        weight: typeof profile.weightKg === "number" ? profile.weightKg : null,
        target_weight: typeof profile.targetWeightKg === "number" ? profile.targetWeightKg : null,
        goal: profile.goal,
        experience: profile.experience,
        days_per_week: profile.daysPerWeek,
        equipment: profile.equipment,
        session_duration: profile.sessionDuration,
        training_time: profile.trainingTime,
        diet_type: profile.dietType,
        meals_per_day: profile.mealsPerDay,
        budget: profile.budget,
        food_restrictions: profile.allergies,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn("Supabase profile upsert warning:", error.message);
      }
    } catch (err: any) {
      console.warn("Supabase profile save error:", err?.message || err);
    }
  }

  return { success: true };
}

/**
 * Detects whether any core blueprint-governing parameters changed.
 */
export function detectCoreParameterChanges(
  oldProfile: UserProfileData,
  newProfile: UserProfileData
): { hasChanged: boolean; changes: ParameterChange[] } {
  const changes: ParameterChange[] = [];

  if (oldProfile.goal && newProfile.goal && oldProfile.goal !== newProfile.goal) {
    changes.push({
      field: "goal",
      label: "Primary Goal",
      oldValue: (oldProfile.goal || "").replace("_", " "),
      newValue: (newProfile.goal || "").replace("_", " "),
    });
  }

  const hasWeightChanged = () => {
    const w1 = oldProfile.weightKg != null && !isNaN(Number(oldProfile.weightKg)) ? Number(oldProfile.weightKg) : null;
    const w2 = newProfile.weightKg != null && !isNaN(Number(newProfile.weightKg)) ? Number(newProfile.weightKg) : null;
    return w1 !== w2;
  };

  if (hasWeightChanged()) {
    changes.push({
      field: "weightKg",
      label: "Current Weight",
      oldValue: `${oldProfile.weightKg || "--"} kg`,
      newValue: `${newProfile.weightKg || "--"} kg`,
    });
  }

  const hasTargetWeightChanged = () => {
    const tw1 = oldProfile.targetWeightKg != null && !isNaN(Number(oldProfile.targetWeightKg)) ? Number(oldProfile.targetWeightKg) : null;
    const tw2 = newProfile.targetWeightKg != null && !isNaN(Number(newProfile.targetWeightKg)) ? Number(newProfile.targetWeightKg) : null;
    return tw1 !== tw2;
  };

  if (hasTargetWeightChanged()) {
    changes.push({
      field: "targetWeightKg",
      label: "Target Weight",
      oldValue: `${oldProfile.targetWeightKg || "--"} kg`,
      newValue: `${newProfile.targetWeightKg || "--"} kg`,
    });
  }

  const hasHeightChanged = () => {
    const h1 = oldProfile.heightCm != null && !isNaN(Number(oldProfile.heightCm)) ? Number(oldProfile.heightCm) : null;
    const h2 = newProfile.heightCm != null && !isNaN(Number(newProfile.heightCm)) ? Number(newProfile.heightCm) : null;
    return h1 !== h2;
  };

  if (hasHeightChanged()) {
    changes.push({
      field: "heightCm",
      label: "Height",
      oldValue: `${oldProfile.heightCm || "--"} cm`,
      newValue: `${newProfile.heightCm || "--"} cm`,
    });
  }

  if (oldProfile.daysPerWeek !== newProfile.daysPerWeek) {
    changes.push({
      field: "daysPerWeek",
      label: "Training Frequency",
      oldValue: `${oldProfile.daysPerWeek} days/wk`,
      newValue: `${newProfile.daysPerWeek} days/wk`,
    });
  }

  if (oldProfile.equipment !== newProfile.equipment) {
    changes.push({
      field: "equipment",
      label: "Training Environment",
      oldValue: oldProfile.equipment.replace("_", " "),
      newValue: newProfile.equipment.replace("_", " "),
    });
  }

  if (oldProfile.experience !== newProfile.experience) {
    changes.push({
      field: "experience",
      label: "Experience Level",
      oldValue: oldProfile.experience,
      newValue: newProfile.experience,
    });
  }

  if (oldProfile.dietType !== newProfile.dietType) {
    changes.push({
      field: "dietType",
      label: "Diet Type",
      oldValue: oldProfile.dietType.replace("_", " "),
      newValue: newProfile.dietType.replace("_", " "),
    });
  }

  if (oldProfile.mealsPerDay !== newProfile.mealsPerDay) {
    changes.push({
      field: "mealsPerDay",
      label: "Meals Per Day",
      oldValue: `${oldProfile.mealsPerDay} meals`,
      newValue: `${newProfile.mealsPerDay} meals`,
    });
  }

  if (oldProfile.budget !== newProfile.budget) {
    changes.push({
      field: "budget",
      label: "Budget Tier",
      oldValue: oldProfile.budget,
      newValue: newProfile.budget,
    });
  }

  return {
    hasChanged: changes.length > 0,
    changes,
  };
}

/**
 * Regenerates an updated blueprint from the calculation engine, archives the
 * previous plan, and activates a new plan version (vN+1).
 */
export async function regenerateBlueprintPlan(
  userId: string,
  currentPlan: SavedPlanData,
  updatedProfile: UserProfileData
): Promise<{ success: boolean; newPlan?: SavedPlanData; error?: string }> {
  // 1. Build onboarding input format
  const onboardingInput: OnboardingData = {
    goal: updatedProfile.goal,
    age: updatedProfile.age,
    gender: updatedProfile.gender,
    heightCm: updatedProfile.heightCm,
    weightKg: updatedProfile.weightKg,
    targetWeightKg: updatedProfile.targetWeightKg,
    experience: updatedProfile.experience,
    equipment: updatedProfile.equipment,
    daysPerWeek: updatedProfile.daysPerWeek,
    sessionDuration: updatedProfile.sessionDuration,
    trainingTime: updatedProfile.trainingTime,
    dietType: updatedProfile.dietType,
    mealsPerDay: updatedProfile.mealsPerDay,
    budget: updatedProfile.budget,
    allergies: updatedProfile.allergies,
    deliverables: ["workout", "nutrition", "supplements", "recovery"],
  };

  // 2. Generate new blueprint through calculation engine
  const newBlueprint = generateBlueprint(onboardingInput);

  // 3. Generate updated meals
  const newMeals: DayMeal[] = generateMealPlan(
    updatedProfile.dietType,
    newBlueprint.macros.calories,
    updatedProfile.mealsPerDay
  );

  const nextVersion = (currentPlan.version || 1) + 1;
  const newPlanId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `plan-v${nextVersion}-${Date.now()}`;

  const newPlan: SavedPlanData = {
    id: newPlanId,
    userId,
    version: nextVersion,
    goal: updatedProfile.goal,
    calories: newBlueprint.macros.calories,
    protein: newBlueprint.macros.protein,
    carbs: newBlueprint.macros.carbs,
    fat: newBlueprint.macros.fat,
    trainingDays: updatedProfile.daysPerWeek,
    status: "active",
    createdAt: new Date().toISOString(),
    splitName: newBlueprint.splitName,
    schedule: newBlueprint.schedule,
    meals: newMeals,
    recoveryProtocol: newBlueprint.recoveryProtocol,
    dietStrategyNotes: newBlueprint.dietStrategyNotes,
    displayName: updatedProfile.displayName,
    dietType: updatedProfile.dietType,
    budget: updatedProfile.budget,
    foodRestrictions: updatedProfile.allergies,
    weightKg: typeof updatedProfile.weightKg === "number" ? updatedProfile.weightKg : null,
    targetWeightKg: typeof updatedProfile.targetWeightKg === "number" ? updatedProfile.targetWeightKg : null,
    heightCm: typeof updatedProfile.heightCm === "number" ? updatedProfile.heightCm : null,
    sessionDuration: updatedProfile.sessionDuration,
    equipment: updatedProfile.equipment,
    experience: updatedProfile.experience,
  };

  // 4. Update profile in database & local storage
  await saveUserProfile(userId, updatedProfile);

  // 5. Update active plan cache
  setCachedActivePlan(newPlan);

  // 6. Persist to Supabase
  const supabase = getSupabase();
  if (supabase && userId && !currentPlan.id.startsWith("local-")) {
    try {
      // Archive current active plan
      await supabase
        .from("plans")
        .update({ status: "archived" })
        .eq("user_id", userId)
        .eq("id", currentPlan.id);

      // Insert new plan
      const { data: insertedPlan, error: planError } = await supabase
        .from("plans")
        .insert({
          id: newPlanId,
          user_id: userId,
          version: nextVersion,
          goal: updatedProfile.goal,
          calories: newBlueprint.macros.calories,
          protein: newBlueprint.macros.protein,
          carbs: newBlueprint.macros.carbs,
          fat: newBlueprint.macros.fat,
          training_days: updatedProfile.daysPerWeek,
          status: "active",
        })
        .select()
        .single();

      if (planError) {
        console.warn("Supabase plan insert warning during regeneration:", planError.message);
      } else if (insertedPlan) {
        // Insert workouts
        const workoutsToInsert = newBlueprint.schedule.map((day) => ({
          plan_id: insertedPlan.id,
          day: day.dayName,
          title: day.focus,
          exercise_data: day.exercises || [],
        }));
        await supabase.from("plan_workouts").insert(workoutsToInsert);

        // Insert meals
        const mealsToInsert = newMeals.map((m) => ({
          plan_id: insertedPlan.id,
          meal_type: m.name,
          meal_data: m,
        }));
        await supabase.from("plan_meals").insert(mealsToInsert);
      }
    } catch (err: any) {
      console.warn("Supabase plan regeneration error (active locally):", err?.message || err);
    }
  }

  return { success: true, newPlan };
}
