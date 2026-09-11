import { SavedPlanData, setCachedActivePlan, getCachedActivePlan } from "../supabase/planSync";
import { getSupabase } from "../supabase/client";
import { WorkoutExercise, DietType, BudgetTier } from "../types/onboarding";
import { DayMeal } from "../engine/mealGenerator";

export interface ExportRecord {
  id: string;
  userId: string;
  planId?: string | null;
  type: "pdf" | "share_card";
  createdAt: string;
  planVersion?: number;
  planGoal?: string;
}

const EXPORTS_CACHE_PREFIX = "ironsync_exports_";
const PLANS_HISTORY_CACHE_PREFIX = "ironsync_plans_history_";

/**
 * Reads local cached exports for a user.
 */
function getLocalCachedExports(userId: string): ExportRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${EXPORTS_CACHE_PREFIX}${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Could not read cached exports:", err);
  }
  return [];
}

/**
 * Writes exports to local cache.
 */
function setLocalCachedExports(userId: string, records: ExportRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${EXPORTS_CACHE_PREFIX}${userId}`, JSON.stringify(records));
  } catch (err) {
    console.warn("Could not write cached exports:", err);
  }
}

/**
 * Reads local cached historical plans for a user.
 */
function getLocalCachedPlansHistory(userId: string): SavedPlanData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${PLANS_HISTORY_CACHE_PREFIX}${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Could not read cached plan history:", err);
  }
  return [];
}

/**
 * Writes plan history to local cache.
 */
export function setLocalCachedPlansHistory(userId: string, plans: SavedPlanData[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${PLANS_HISTORY_CACHE_PREFIX}${userId}`, JSON.stringify(plans));
  } catch (err) {
    console.warn("Could not write cached plan history:", err);
  }
}

/**
 * Fetches all plans for a user from Supabase (source of truth) with offline resilience.
 * Returns plans sorted descending by version (e.g. v3, v2, v1).
 */
export async function fetchAllUserPlans(userId: string): Promise<SavedPlanData[]> {
  const localHistory = getLocalCachedPlansHistory(userId);
  const activeCached = getCachedActivePlan();
  const combinedLocal: SavedPlanData[] = [...localHistory];

  if (activeCached && !combinedLocal.some((p) => p.id === activeCached.id)) {
    combinedLocal.push(activeCached);
  }

  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { data: dbPlans, error } = await supabase
        .from("plans")
        .select(`
          *,
          plan_workouts (*),
          plan_meals (*)
        `)
        .eq("user_id", userId)
        .order("version", { ascending: false });

      if (!error && dbPlans && dbPlans.length > 0) {
        // Fetch user profile for display name / biometrics
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, diet_type, budget, food_restrictions, weight, target_weight, height, session_duration, equipment, experience")
          .eq("user_id", userId)
          .single();

        const mappedPlans: SavedPlanData[] = dbPlans.map((plan: any) => {
          const schedule =
            plan.plan_workouts?.map((w: any) => ({
              dayName: w.day,
              focus: w.title,
              type: (w.exercise_data && (w.exercise_data as any).length ? "workout" : "recovery") as "workout" | "recovery",
              tag: w.day === "WED" || w.day === "SUN" ? "Recovery" : "Training",
              exercises: w.exercise_data as WorkoutExercise[],
            })) || [];

          const meals: DayMeal[] =
            plan.plan_meals?.map((m: any) => m.meal_data as DayMeal) || [];

          return {
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
            splitName: `${plan.training_days}-Day Structured Split`,
            schedule,
            meals,
            recoveryProtocol: {
              sleepTarget: "7h 45m",
              hydrationTarget: "3.2 Liters",
              mobilityWindow: "15 min Daily",
            },
            dietStrategyNotes: "Balanced energy balance nutrient pacing.",
            displayName: profile?.display_name || activeCached?.displayName || "Athlete",
            dietType: (profile?.diet_type as DietType) || activeCached?.dietType,
            budget: (profile?.budget as BudgetTier) || activeCached?.budget,
            foodRestrictions: profile?.food_restrictions || activeCached?.foodRestrictions,
            weightKg: profile?.weight ?? activeCached?.weightKg ?? null,
            targetWeightKg: profile?.target_weight ?? activeCached?.targetWeightKg ?? null,
            heightCm: profile?.height ?? activeCached?.heightCm ?? null,
            sessionDuration: profile?.session_duration ?? activeCached?.sessionDuration ?? null,
            equipment: profile?.equipment ?? activeCached?.equipment ?? null,
            experience: profile?.experience ?? activeCached?.experience ?? null,
          };
        });

        setLocalCachedPlansHistory(userId, mappedPlans);
        return mappedPlans.sort((a, b) => (b.version || 1) - (a.version || 1));
      }
    } catch (err) {
      console.warn("Could not query Supabase plans history (using local cache):", err);
    }
  }

  return combinedLocal.sort((a, b) => (b.version || 1) - (a.version || 1));
}

/**
 * Duplicates a historical plan as the new active plan (vN+1), safely archiving
 * the current active plan without destroying previous plans.
 */
export async function duplicatePlanAsNewVersion(
  userId: string,
  sourcePlan: SavedPlanData,
  allPlans: SavedPlanData[]
): Promise<{ success: boolean; newPlan?: SavedPlanData; error?: string }> {
  const currentMaxVersion = Math.max(...allPlans.map((p) => p.version || 1), 1);
  const nextVersion = currentMaxVersion + 1;
  const newPlanId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `plan-v${nextVersion}-${Date.now()}`;

  const newPlan: SavedPlanData = {
    ...sourcePlan,
    id: newPlanId,
    userId,
    version: nextVersion,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  // 1. Update local cache
  const updatedAllPlans: SavedPlanData[] = allPlans.map((p) => ({
    ...p,
    status: (p.status === "active" ? "archived" : p.status) as "active" | "archived",
  }));
  updatedAllPlans.unshift(newPlan);
  setLocalCachedPlansHistory(userId, updatedAllPlans);
  setCachedActivePlan(newPlan);

  // 2. Persist to Supabase if connected
  const supabase = getSupabase();
  if (supabase && userId && !sourcePlan.id.startsWith("local-")) {
    try {
      // Archive all previous active plans
      await supabase
        .from("plans")
        .update({ status: "archived" })
        .eq("user_id", userId)
        .eq("status", "active");

      // Insert new plan
      const { data: insertedPlan, error: insertError } = await supabase
        .from("plans")
        .insert({
          id: newPlanId,
          user_id: userId,
          version: nextVersion,
          goal: newPlan.goal,
          calories: newPlan.calories,
          protein: newPlan.protein,
          carbs: newPlan.carbs,
          fat: newPlan.fat,
          training_days: newPlan.trainingDays,
          status: "active",
        })
        .select()
        .single();

      if (insertError) {
        console.warn("Supabase plan duplication warning:", insertError.message);
      } else if (insertedPlan) {
        // Insert cloned workouts
        if (newPlan.schedule && newPlan.schedule.length > 0) {
          const workoutsToInsert = newPlan.schedule.map((day) => ({
            plan_id: insertedPlan.id,
            day: day.dayName,
            title: day.focus,
            exercise_data: day.exercises || [],
          }));
          await supabase.from("plan_workouts").insert(workoutsToInsert);
        }

        // Insert cloned meals
        if (newPlan.meals && newPlan.meals.length > 0) {
          const mealsToInsert = newPlan.meals.map((m) => ({
            plan_id: insertedPlan.id,
            meal_type: m.name,
            meal_data: m,
          }));
          await supabase.from("plan_meals").insert(mealsToInsert);
        }
      }
    } catch (err: any) {
      console.warn("Supabase plan duplication error (active locally):", err?.message || err);
    }
  }

  return { success: true, newPlan };
}

/**
 * Logs an export event (PDF or share card) to Supabase and local cache.
 */
export async function logExport(
  userId: string,
  planId: string | null,
  type: "pdf" | "share_card",
  planVersion?: number,
  planGoal?: string
): Promise<{ record: ExportRecord; error?: string }> {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `exp-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const newRecord: ExportRecord = {
    id,
    userId,
    planId: planId || null,
    type,
    createdAt,
    planVersion,
    planGoal,
  };

  // 1. Update local cache
  const existing = getLocalCachedExports(userId);
  const updated = [newRecord, ...existing];
  setLocalCachedExports(userId, updated);

  // 2. Persist to Supabase
  const supabase = getSupabase();
  if (supabase && userId && planId && !planId.startsWith("local-") && !planId.startsWith("plan-")) {
    try {
      await supabase.from("exports").insert({
        id,
        user_id: userId,
        plan_id: planId,
        type,
        created_at: createdAt,
      });
    } catch (err: any) {
      console.warn("Could not log export to Supabase (saved locally):", err?.message || err);
    }
  }

  return { record: newRecord };
}

/**
 * Fetches user exports history from Supabase and local cache.
 */
export async function fetchUserExports(userId: string): Promise<ExportRecord[]> {
  const localList = getLocalCachedExports(userId);
  const supabase = getSupabase();

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("exports")
        .select(`
          id,
          user_id,
          plan_id,
          type,
          created_at,
          plans (
            version,
            goal
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: ExportRecord[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          planId: row.plan_id,
          type: row.type as "pdf" | "share_card",
          createdAt: row.created_at,
          planVersion: row.plans?.version,
          planGoal: row.plans?.goal,
        }));

        setLocalCachedExports(userId, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("Could not query Supabase exports (using local cache):", err);
    }
  }

  return localList;
}
