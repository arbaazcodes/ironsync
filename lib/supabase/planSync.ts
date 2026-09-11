import { CalculatedBlueprint, OnboardingData, DietType, BudgetTier } from "../types/onboarding";
import { getSupabase } from "./client";
import { generateMealPlan, DayMeal } from "../engine/mealGenerator";
import { trackEvent } from "../analytics";

export const PENDING_BLUEPRINT_KEY = "ironsync_pending_blueprint";
export const ONBOARDING_DATA_KEY = "ironsync_onboarding_data";
export const ACTIVE_PLAN_CACHE_KEY = "ironsync_cached_active_plan";

export interface SavedPlanData {
  id: string;
  userId: string;
  version: number;
  goal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  trainingDays: number;
  status: "active" | "archived";
  createdAt: string;
  splitName: string;
  schedule: CalculatedBlueprint["schedule"];
  meals: DayMeal[];
  recoveryProtocol: CalculatedBlueprint["recoveryProtocol"];
  dietStrategyNotes: string;
  displayName?: string;
  dietType?: DietType | null;
  budget?: BudgetTier | null;
  foodRestrictions?: string[];
  weightKg?: number | null;
  targetWeightKg?: number | null;
  heightCm?: number | null;
  sessionDuration?: number | null;
  equipment?: string | null;
  experience?: string | null;
}

export function cachePendingBlueprint(
  data: OnboardingData,
  blueprint: CalculatedBlueprint
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(PENDING_BLUEPRINT_KEY, JSON.stringify(blueprint));
  } catch (err) {
    console.error("Failed to cache pending blueprint:", err);
  }
}

export function getPendingBlueprint(): {
  data: OnboardingData;
  blueprint: CalculatedBlueprint;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const rawData = localStorage.getItem(ONBOARDING_DATA_KEY);
    const rawBlueprint = localStorage.getItem(PENDING_BLUEPRINT_KEY);
    if (rawData && rawBlueprint) {
      return {
        data: JSON.parse(rawData),
        blueprint: JSON.parse(rawBlueprint),
      };
    }
  } catch (err) {
    console.error("Failed to parse pending blueprint:", err);
  }
  return null;
}

export function clearPendingBlueprint() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ONBOARDING_DATA_KEY);
    localStorage.removeItem(PENDING_BLUEPRINT_KEY);
  } catch (err) {
    console.error("Failed to clear pending blueprint:", err);
  }
}

export function getCachedActivePlan(): SavedPlanData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_PLAN_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read cached active plan:", err);
  }
  return null;
}

export function setCachedActivePlan(plan: SavedPlanData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_PLAN_CACHE_KEY, JSON.stringify(plan));
  } catch (err) {
    console.error("Failed to save cached active plan:", err);
  }
}

export function clearActivePlanCache() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_PLAN_CACHE_KEY);
  } catch (err) {
    console.error("Failed to clear cached plan:", err);
  }
}

/**
 * Synchronizes client-side pending blueprint to Supabase upon authentication.
 * Implements strict plan versioning:
 * - Previous active plans are updated to 'archived'
 * - New plan receives version = max(versions) + 1 with 'active' status
 * - If save fails, does NOT clear pending blueprint so progress is preserved.
 */
export async function syncPendingBlueprintToDatabase(
  userId: string,
  userDisplayName?: string
): Promise<{ plan: SavedPlanData | null; error: Error | null }> {
  const pending = getPendingBlueprint();
  if (!pending) {
    // If no pending blueprint exists, load active plan from database
    const existing = await fetchUserActivePlan(userId);
    return { plan: existing, error: null };
  }

  const { data, blueprint } = pending;
  const meals = generateMealPlan(
    data.dietType,
    blueprint.macros.calories,
    data.mealsPerDay
  );

  const supabase = getSupabase();

  if (supabase) {
    try {
      // 1. Upsert Profile using the authenticated userId
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        user_id: userId,
        display_name: userDisplayName || null,
        goal: data.goal,
        gender: data.gender,
        age: typeof data.age === "number" ? data.age : null,
        height: typeof data.heightCm === "number" ? data.heightCm : null,
        weight: typeof data.weightKg === "number" ? data.weightKg : null,
        target_weight: typeof data.targetWeightKg === "number" ? data.targetWeightKg : null,
        experience: data.experience,
        equipment: data.equipment,
        days_per_week: data.daysPerWeek,
        session_duration: data.sessionDuration,
        training_time: data.trainingTime,
        diet_type: data.dietType,
        meals_per_day: data.mealsPerDay,
        budget: data.budget,
        food_restrictions: data.allergies || [],
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.warn("Profile upsert warning (check schema migration):", profileError.message);
      }

      // 2. Plan Versioning: Look up existing plans for this user
      const { data: existingPlans, error: fetchPlansError } = await supabase
        .from("plans")
        .select("id, version, status")
        .eq("user_id", userId);

      let nextVersion = 1;
      if (!fetchPlansError && existingPlans && existingPlans.length > 0) {
        nextVersion = Math.max(...existingPlans.map((p) => p.version || 1)) + 1;

        // Archive previous active plans
        await supabase
          .from("plans")
          .update({ status: "archived" })
          .eq("user_id", userId)
          .eq("status", "active");
      }

      // 3. Insert new Active Plan
      const { data: insertedPlan, error: planInsertError } = await supabase
        .from("plans")
        .insert({
          user_id: userId,
          version: nextVersion,
          goal: data.goal || "muscle_gain",
          calories: blueprint.macros.calories,
          protein: blueprint.macros.protein,
          carbs: blueprint.macros.carbs,
          fat: blueprint.macros.fat,
          training_days: data.daysPerWeek || 4,
          status: "active",
        })
        .select()
        .single();

      if (planInsertError || !insertedPlan) {
        throw new Error(planInsertError?.message || "Failed to insert plan record.");
      }

      // 4. Insert Workouts for this plan
      const workoutsToInsert = blueprint.schedule.map((day) => ({
        plan_id: insertedPlan.id,
        day: day.dayName,
        title: day.focus,
        exercise_data: day.exercises || [],
      }));
      await supabase.from("plan_workouts").insert(workoutsToInsert);

      // 5. Insert Meals for this plan
      const mealsToInsert = meals.map((m) => ({
        plan_id: insertedPlan.id,
        meal_type: m.name,
        meal_data: m,
      }));
      await supabase.from("plan_meals").insert(mealsToInsert);

      // Successfully saved to Supabase!
      const savedPlan: SavedPlanData = {
        id: insertedPlan.id,
        userId,
        version: insertedPlan.version,
        goal: insertedPlan.goal,
        calories: insertedPlan.calories,
        protein: insertedPlan.protein,
        carbs: insertedPlan.carbs,
        fat: insertedPlan.fat,
        trainingDays: insertedPlan.training_days,
        status: "active",
        createdAt: insertedPlan.created_at,
        splitName: blueprint.splitName,
        schedule: blueprint.schedule,
        meals,
        recoveryProtocol: blueprint.recoveryProtocol,
        dietStrategyNotes: blueprint.dietStrategyNotes,
        displayName: userDisplayName || "Athlete",
        dietType: data.dietType,
        budget: data.budget,
        foodRestrictions: data.allergies || [],
        weightKg: typeof data.weightKg === "number" ? data.weightKg : null,
        targetWeightKg: typeof data.targetWeightKg === "number" ? data.targetWeightKg : null,
        heightCm: typeof data.heightCm === "number" ? data.heightCm : null,
        sessionDuration: data.sessionDuration || null,
        equipment: data.equipment || null,
        experience: data.experience || null,
      };

      setCachedActivePlan(savedPlan);
      // Safe to clear pending blueprint only on success!
      clearPendingBlueprint();

      trackEvent("plan_saved", {
        plan_id: savedPlan.id,
        version: savedPlan.version,
        goal: savedPlan.goal,
        training_days: savedPlan.trainingDays,
      });

      return { plan: savedPlan, error: null };
    } catch (err: any) {
      console.warn("Database save failed (e.g. tables not yet created in Supabase):", err?.message || err);
      // Fallback: If DB table schema hasn't been migrated yet (e.g. PGRST205),
      // still generate the local SavedPlanData so the user can immediately view their dashboard!
      const fallbackPlan: SavedPlanData = {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
        userId,
        version: 1,
        goal: data.goal || "muscle_gain",
        calories: blueprint.macros.calories,
        protein: blueprint.macros.protein,
        carbs: blueprint.macros.carbs,
        fat: blueprint.macros.fat,
        trainingDays: data.daysPerWeek || 4,
        status: "active",
        createdAt: new Date().toISOString(),
        splitName: blueprint.splitName,
        schedule: blueprint.schedule,
        meals,
        recoveryProtocol: blueprint.recoveryProtocol,
        dietStrategyNotes: blueprint.dietStrategyNotes,
        displayName: userDisplayName || "Athlete",
        dietType: data.dietType,
        budget: data.budget,
        foodRestrictions: data.allergies || [],
        weightKg: typeof data.weightKg === "number" ? data.weightKg : null,
        targetWeightKg: typeof data.targetWeightKg === "number" ? data.targetWeightKg : null,
        heightCm: typeof data.heightCm === "number" ? data.heightCm : null,
        sessionDuration: data.sessionDuration || null,
        equipment: data.equipment || null,
        experience: data.experience || null,
      };
      setCachedActivePlan(fallbackPlan);

      trackEvent("plan_saved", {
        plan_id: fallbackPlan.id,
        version: fallbackPlan.version,
        goal: fallbackPlan.goal,
        training_days: fallbackPlan.trainingDays,
      });

      return { plan: fallbackPlan, error: null };
    }
  }

  // Fallback if Supabase is offline / unconfigured
  const localSavedPlan: SavedPlanData = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `plan-${Date.now()}`,
    userId,
    version: 1,
    goal: data.goal || "muscle_gain",
    calories: blueprint.macros.calories,
    protein: blueprint.macros.protein,
    carbs: blueprint.macros.carbs,
    fat: blueprint.macros.fat,
    trainingDays: data.daysPerWeek || 4,
    status: "active",
    createdAt: new Date().toISOString(),
    splitName: blueprint.splitName,
    schedule: blueprint.schedule,
    meals,
    recoveryProtocol: blueprint.recoveryProtocol,
    dietStrategyNotes: blueprint.dietStrategyNotes,
    displayName: userDisplayName || "Athlete",
  };

  setCachedActivePlan(localSavedPlan);
  clearPendingBlueprint();

  trackEvent("plan_saved", {
    plan_id: localSavedPlan.id,
    version: localSavedPlan.version,
    goal: localSavedPlan.goal,
    training_days: localSavedPlan.trainingDays,
  });

  return { plan: localSavedPlan, error: null };
}

/**
 * Fetches user active plan from Supabase (source of truth).
 */
export async function fetchUserActivePlan(userId: string): Promise<SavedPlanData | null> {
  const supabase = getSupabase();
  const cached = getCachedActivePlan();

  if (supabase && userId) {
    try {
      const { data: plan, error } = await supabase
        .from("plans")
        .select(`
          *,
          plan_workouts (*),
          plan_meals (*)
        `)
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && plan) {
        // Fetch profile details if available
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, diet_type, budget, food_restrictions, weight, target_weight, height, session_duration, equipment, experience")
          .eq("user_id", userId)
          .single();

        const schedule = plan.plan_workouts?.map((w: any) => ({
          dayName: w.day,
          focus: w.title,
          type: (w.exercise_data && (w.exercise_data as any).length ? "workout" : "recovery") as "workout" | "recovery",
          tag: w.day === "WED" || w.day === "SUN" ? "Recovery" : "Training",
          exercises: w.exercise_data,
        })) || cached?.schedule || [];

        const meals = plan.plan_meals?.map((m: any) => m.meal_data) || cached?.meals || [];

        const activePlanData: SavedPlanData = {
          id: plan.id,
          userId: plan.user_id,
          version: plan.version,
          goal: plan.goal,
          calories: plan.calories,
          protein: plan.protein,
          carbs: plan.carbs,
          fat: plan.fat,
          trainingDays: plan.training_days,
          status: plan.status as "active" | "archived",
          createdAt: plan.created_at,
          splitName: cached?.splitName || `${plan.training_days}-Day Customized Plan`,
          schedule,
          meals,
          recoveryProtocol: cached?.recoveryProtocol || {
            sleepTarget: "7h 45m",
            hydrationTarget: "3.2 Liters",
            mobilityWindow: "15 min Daily",
          },
          dietStrategyNotes: cached?.dietStrategyNotes || "Structured nutrient timing.",
          displayName: profile?.display_name || cached?.displayName || "Athlete",
          dietType: (profile?.diet_type as DietType) || cached?.dietType || "eggetarian",
          budget: (profile?.budget as BudgetTier) || cached?.budget || "balanced",
          foodRestrictions: (profile?.food_restrictions as string[]) || cached?.foodRestrictions || [],
          weightKg: profile?.weight ?? cached?.weightKg ?? null,
          targetWeightKg: profile?.target_weight ?? cached?.targetWeightKg ?? null,
          heightCm: profile?.height ?? cached?.heightCm ?? null,
          sessionDuration: profile?.session_duration ?? cached?.sessionDuration ?? null,
          equipment: profile?.equipment ?? cached?.equipment ?? null,
          experience: profile?.experience ?? cached?.experience ?? null,
        };

        setCachedActivePlan(activePlanData);
        return activePlanData;
      }
    } catch (err) {
      console.warn("Could not query Supabase plans (using local cache if present):", err);
    }
  }

  return cached;
}

/**
 * Persists updated workout schedule to active plan in database and local cache
 * without mutating or creating a new plan version.
 */
export async function updatePlanSchedule(
  planId: string,
  updatedSchedule: CalculatedBlueprint["schedule"]
): Promise<{ success: boolean; error?: string }> {
  // 1. Update local cache immediately
  const cached = getCachedActivePlan();
  if (cached) {
    cached.schedule = updatedSchedule;
    setCachedActivePlan(cached);
  }

  // 2. Persist to Supabase if connected
  const supabase = getSupabase();
  if (supabase && planId && !planId.startsWith("local-")) {
    try {
      await supabase.from("plan_workouts").delete().eq("plan_id", planId);
      const workoutsToInsert = updatedSchedule.map((day) => ({
        plan_id: planId,
        day: day.dayName,
        title: day.focus,
        exercise_data: day.exercises || [],
      }));
      await supabase.from("plan_workouts").insert(workoutsToInsert);
    } catch (err: any) {
      console.warn("Could not persist updated schedule to Supabase:", err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  return { success: true };
}

/**
 * Persists updated meals to active plan in database and local cache
 * without mutating or creating a new plan version.
 */
export async function updatePlanMeals(
  planId: string,
  updatedMeals: DayMeal[]
): Promise<{ success: boolean; error?: string }> {
  // 1. Update local cache immediately
  const cached = getCachedActivePlan();
  if (cached) {
    cached.meals = updatedMeals;
    setCachedActivePlan(cached);
  }

  // 2. Persist to Supabase if connected
  const supabase = getSupabase();
  if (supabase && planId && !planId.startsWith("local-")) {
    try {
      await supabase.from("plan_meals").delete().eq("plan_id", planId);
      const mealsToInsert = updatedMeals.map((m) => ({
        plan_id: planId,
        meal_type: m.name,
        meal_data: m,
      }));
      await supabase.from("plan_meals").insert(mealsToInsert);
    } catch (err: any) {
      console.warn("Could not persist updated meals to Supabase:", err?.message || err);
      return { success: false, error: err?.message };
    }
  }

  return { success: true };
}

