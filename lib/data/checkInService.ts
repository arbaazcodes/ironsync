import { GoalId } from "../types/onboarding";
import { calculateMacros } from "../engine/macros";
import { generateMealPlan, DayMeal } from "../engine/mealGenerator";
import { SavedPlanData, setCachedActivePlan, getCachedActivePlan } from "../supabase/planSync";
import { getSupabase } from "../supabase/client";

export interface CheckInRecord {
  id: string;
  userId: string;
  planId?: string | null;
  weightKg: number;
  createdAt: string;
  notes?: string | null;
}

export type RecalibrationStatus =
  | "insufficient_data"
  | "insufficient_time"
  | "on_track"
  | "adjustment_suggested";

export interface RecalibrationAssessment {
  status: RecalibrationStatus;
  rateKgPerWeek: number;
  daysObserved: number;
  totalDeltaKg: number;
  direction: "losing" | "gaining" | "maintaining";
  suggestedCalories?: number;
  suggestedMacros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  calorieDelta?: number;
  headline?: string;
  reason?: string;
  targetPaceDescription?: string;
  safetyNotes?: string;
}

const CHECK_INS_STORAGE_PREFIX = "ironsync_check_ins_";

/**
 * Reads local cached check-ins for a user.
 */
function getLocalCachedCheckIns(userId: string): CheckInRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${CHECK_INS_STORAGE_PREFIX}${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Failed to read cached check-ins:", err);
  }
  return [];
}

/**
 * Writes check-ins to local cache for a user.
 */
function setLocalCachedCheckIns(userId: string, records: CheckInRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${CHECK_INS_STORAGE_PREFIX}${userId}`, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to write cached check-ins:", err);
  }
}

/**
 * Fetches check-ins for a user from Supabase with localStorage resilience.
 */
export async function fetchUserCheckIns(userId: string): Promise<CheckInRecord[]> {
  const localList = getLocalCachedCheckIns(userId);
  const supabase = getSupabase();

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("check_ins")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        const mapped: CheckInRecord[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          planId: row.plan_id,
          weightKg: Number(row.weight_kg),
          createdAt: row.created_at,
          notes: row.notes,
        }));
        setLocalCachedCheckIns(userId, mapped);
        return mapped;
      }
    } catch (err) {
      console.warn("Could not query Supabase check_ins (using local cache):", err);
    }
  }

  return localList;
}

/**
 * Saves a new check-in record.
 */
export async function saveCheckIn(
  userId: string,
  input: {
    weightKg: number;
    notes?: string;
    planId?: string;
    createdAt?: string;
  }
): Promise<{ record: CheckInRecord; error?: string }> {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ci-${Date.now()}`;
  const createdAt = input.createdAt || new Date().toISOString();

  const newRecord: CheckInRecord = {
    id,
    userId,
    planId: input.planId || null,
    weightKg: Math.min(350, Math.max(20, Number(input.weightKg.toFixed(1)))),
    createdAt,
    notes: input.notes?.trim() ? input.notes.trim().slice(0, 500) : null,
  };

  // 1. Update local cache immediately
  const existing = getLocalCachedCheckIns(userId);
  const updatedList = [...existing, newRecord].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  setLocalCachedCheckIns(userId, updatedList);

  // 2. Also update cached active plan weightKg
  const activePlan = getCachedActivePlan();
  if (activePlan) {
    activePlan.weightKg = newRecord.weightKg;
    setCachedActivePlan(activePlan);
  }

  // 3. Persist to Supabase if connected
  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("check_ins")
        .insert({
          id,
          user_id: userId,
          plan_id: input.planId || null,
          weight_kg: newRecord.weightKg,
          created_at: createdAt,
          notes: newRecord.notes,
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase check_in insert warning (saved locally):", error.message);
      } else if (data) {
        // Also update profile weight if available
        await supabase
          .from("profiles")
          .update({ weight: newRecord.weightKg, updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      }
    } catch (err: any) {
      console.warn("Supabase check_in insert failed (saved locally):", err?.message || err);
    }
  }

  return { record: newRecord };
}

/**
 * Deletes a check-in record.
 */
export async function deleteCheckIn(
  userId: string,
  checkInId: string
): Promise<{ success: boolean; error?: string }> {
  const existing = getLocalCachedCheckIns(userId);
  const filtered = existing.filter((c) => c.id !== checkInId);
  setLocalCachedCheckIns(userId, filtered);

  const supabase = getSupabase();
  if (supabase && userId && !checkInId.startsWith("ci-")) {
    try {
      await supabase.from("check_ins").delete().eq("id", checkInId).eq("user_id", userId);
    } catch (err: any) {
      console.warn("Could not delete from Supabase check_ins:", err?.message || err);
    }
  }

  return { success: true };
}

/**
 * Assesses weight progress against plan goals and recommends conservative recalibration.
 *
 * Rules:
 * - Requires >= 2 check-ins.
 * - Requires >= 3 days elapsed to avoid day-to-day water weight noise.
 * - Conservative adjustments of +/- 100 to 150 kcal.
 * - Enforces minimum safe floor (1400 kcal) and ceiling.
 * - Strictly educational & fitness energy balance tool.
 */
export function assessPlanRecalibration(
  checkIns: CheckInRecord[],
  activePlan: SavedPlanData
): RecalibrationAssessment {
  if (!checkIns || checkIns.length < 2) {
    return {
      status: "insufficient_data",
      rateKgPerWeek: 0,
      daysObserved: 0,
      totalDeltaKg: 0,
      direction: "maintaining",
      headline: "Need More Data",
      reason: "Add another check-in to see your trend.",
    };
  }

  // Sort chronologically
  const sorted = [...checkIns].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];

  const timeDiffMs = new Date(latest.createdAt).getTime() - new Date(first.createdAt).getTime();
  const daysObserved = Math.max(0.1, timeDiffMs / (1000 * 60 * 60 * 24));
  const totalDeltaKg = Number((latest.weightKg - first.weightKg).toFixed(2));

  // If fewer than 3 days apart, don't trigger recalibration due to water weight noise
  if (daysObserved < 3) {
    return {
      status: "insufficient_time",
      rateKgPerWeek: 0,
      daysObserved: Math.round(daysObserved),
      totalDeltaKg,
      direction: totalDeltaKg > 0 ? "gaining" : totalDeltaKg < 0 ? "losing" : "maintaining",
      headline: "Baseline Establishing",
      reason:
        "Check-ins are less than 3 days apart. Track over 7–14 days to observe true energy balance trends without daily fluid fluctuations.",
    };
  }

  const weeksObserved = daysObserved / 7;
  const rateKgPerWeek = Number((totalDeltaKg / weeksObserved).toFixed(2));
  const currentCalories = activePlan.calories;
  const currentWeight = latest.weightKg || activePlan.weightKg || 70;
  const goal = (activePlan.goal || "fat_loss").toLowerCase();

  const direction: "losing" | "gaining" | "maintaining" =
    rateKgPerWeek <= -0.1 ? "losing" : rateKgPerWeek >= 0.1 ? "gaining" : "maintaining";

  // =========================================================================
  // GOAL 1: FAT LOSS / CUT
  // =========================================================================
  if (goal.includes("fat_loss") || goal.includes("cut")) {
    const targetPace = "Target pace: -0.3 to -0.8 kg / week";

    // Scenario A: Stalled (rate is flat, gaining, or losing < 0.1 kg/week over >= 6 days)
    if (rateKgPerWeek > -0.1 && daysObserved >= 6) {
      const suggestedCalories = Math.max(1400, currentCalories - 150);
      const calorieDelta = suggestedCalories - currentCalories;
      const suggestedMacros = calculateMacros(suggestedCalories, currentWeight, "fat_loss");

      return {
        status: "adjustment_suggested",
        rateKgPerWeek,
        daysObserved: Math.round(daysObserved),
        totalDeltaKg,
        direction,
        suggestedCalories,
        suggestedMacros,
        calorieDelta,
        headline: "Fat Loss Plateau Detected",
        reason: `Over the past ${Math.round(daysObserved)} days, your weight has trended at ${rateKgPerWeek >= 0 ? "+" : ""}${rateKgPerWeek} kg/week. A conservative 150 kcal adjustment will help re-stimulate steady fat oxidation without impacting training recovery.`,
        targetPaceDescription: targetPace,
        safetyNotes: "Preserves high protein and respects the 1,400 kcal metabolic safety floor.",
      };
    }

    // Scenario B: Losing too fast (< -1.05 kg/week over >= 6 days)
    if (rateKgPerWeek < -1.05 && daysObserved >= 6) {
      const suggestedCalories = Math.min(4200, currentCalories + 150);
      const calorieDelta = suggestedCalories - currentCalories;
      const suggestedMacros = calculateMacros(suggestedCalories, currentWeight, "fat_loss");

      return {
        status: "adjustment_suggested",
        rateKgPerWeek,
        daysObserved: Math.round(daysObserved),
        totalDeltaKg,
        direction,
        suggestedCalories,
        suggestedMacros,
        calorieDelta,
        headline: "Rapid Weight Loss Warning",
        reason: `Weight is dropping at ${rateKgPerWeek} kg/week, which exceeds the safe fat loss ceiling (-0.8 kg/week). Pacing at this rate risks lean muscle catabolism and metabolic slowdown. Adding 150 kcal stabilizes recovery and preserves muscle tissue.`,
        targetPaceDescription: targetPace,
        safetyNotes: "Protects muscle mass and training energy while maintaining a steady deficit.",
      };
    }

    // Scenario C: On Track (-0.3 to -0.85 kg/week)
    return {
      status: "on_track",
      rateKgPerWeek,
      daysObserved: Math.round(daysObserved),
      totalDeltaKg,
      direction,
      headline: "Fat Loss on Track",
      reason: `Your current deficit is producing an optimal weight trajectory of ${rateKgPerWeek} kg/week. Lean muscle mass is protected while body fat decreases predictably.`,
      targetPaceDescription: targetPace,
    };
  }

  // =========================================================================
  // GOAL 2: MUSCLE GAIN / BULK
  // =========================================================================
  if (goal.includes("muscle") || goal.includes("bulk") || goal.includes("mass")) {
    const targetPace = "Target pace: +0.15 to +0.4 kg / week";

    // Scenario A: Stalled / Under-surplus (rate < +0.05 kg/week over >= 6 days)
    if (rateKgPerWeek < 0.05 && daysObserved >= 6) {
      const suggestedCalories = Math.min(4500, currentCalories + 150);
      const calorieDelta = suggestedCalories - currentCalories;
      const suggestedMacros = calculateMacros(suggestedCalories, currentWeight, "muscle_gain");

      return {
        status: "adjustment_suggested",
        rateKgPerWeek,
        daysObserved: Math.round(daysObserved),
        totalDeltaKg,
        direction,
        suggestedCalories,
        suggestedMacros,
        calorieDelta,
        headline: "Hypertrophy Surplus Below Target",
        reason: `Weight change is tracking at ${rateKgPerWeek >= 0 ? "+" : ""}${rateKgPerWeek} kg/week over ${Math.round(daysObserved)} days. Muscle protein synthesis requires a slight caloric surplus. Adding 150 kcal fuels continued lean tissue accrual.`,
        targetPaceDescription: targetPace,
        safetyNotes: "Scales carbohydrate and protein intake for optimal muscular fullness and training volume.",
      };
    }

    // Scenario B: Gaining too fast (> +0.55 kg/week over >= 6 days)
    if (rateKgPerWeek > 0.55 && daysObserved >= 6) {
      const suggestedCalories = Math.max(1400, currentCalories - 150);
      const calorieDelta = suggestedCalories - currentCalories;
      const suggestedMacros = calculateMacros(suggestedCalories, currentWeight, "muscle_gain");

      return {
        status: "adjustment_suggested",
        rateKgPerWeek,
        daysObserved: Math.round(daysObserved),
        totalDeltaKg,
        direction,
        suggestedCalories,
        suggestedMacros,
        calorieDelta,
        headline: "Surplus Exceeds Optimal Hypertrophy Rate",
        reason: `Weight is rising at +${rateKgPerWeek} kg/week. Natural lean muscle growth caps around +0.4 kg/week; exceeding this rate increases unnecessary adiposity. Trimming 150 kcal keeps your gains lean and athletic.`,
        targetPaceDescription: targetPace,
        safetyNotes: "Reduces surplus to prevent excess fat accumulation while keeping training energy high.",
      };
    }

    // Scenario C: On Track
    return {
      status: "on_track",
      rateKgPerWeek,
      daysObserved: Math.round(daysObserved),
      totalDeltaKg,
      direction,
      headline: "Hypertrophy on Track",
      reason: `Weight gain is tracking at +${rateKgPerWeek} kg/week, ideal for muscle protein synthesis with minimal fat accumulation.`,
      targetPaceDescription: targetPace,
    };
  }

  // =========================================================================
  // GOAL 3: RECOMPOSITION / STRENGTH / MAINTENANCE
  // =========================================================================
  const targetPace = "Target pace: -0.15 to +0.15 kg / week (Weight Stability)";

  if (rateKgPerWeek > 0.35 && daysObserved >= 6) {
    const suggestedCalories = Math.max(1400, currentCalories - 100);
    const calorieDelta = suggestedCalories - currentCalories;
    const suggestedMacros = calculateMacros(suggestedCalories, currentWeight, "recomp");

    return {
      status: "adjustment_suggested",
      rateKgPerWeek,
      daysObserved: Math.round(daysObserved),
      totalDeltaKg,
      direction,
      suggestedCalories,
      suggestedMacros,
      calorieDelta,
      headline: "Weight Drifting Above Maintenance",
      reason: `Weight has drifted upward by +${rateKgPerWeek} kg/week. Trimming 100 kcal restores stable energy balance while supporting body recomposition.`,
      targetPaceDescription: targetPace,
      safetyNotes: "Mild 100 kcal tweak to maintain weight equilibrium.",
    };
  }

  if (rateKgPerWeek < -0.4 && daysObserved >= 6) {
    const suggestedCalories = Math.min(4200, currentCalories + 100);
    const calorieDelta = suggestedCalories - currentCalories;
    const suggestedMacros = calculateMacros(suggestedCalories, currentWeight, "recomp");

    return {
      status: "adjustment_suggested",
      rateKgPerWeek,
      daysObserved: Math.round(daysObserved),
      totalDeltaKg,
      direction,
      suggestedCalories,
      suggestedMacros,
      calorieDelta,
      headline: "Weight Drifting Below Maintenance",
      reason: `Weight has drifted downward by ${rateKgPerWeek} kg/week. Adding 100 kcal restores energy balance and supports strength progression.`,
      targetPaceDescription: targetPace,
      safetyNotes: "Mild 100 kcal tweak to prevent accidental deficit.",
    };
  }

  return {
    status: "on_track",
    rateKgPerWeek,
    daysObserved: Math.round(daysObserved),
    totalDeltaKg,
    direction,
    headline: "Recomposition on Track",
    reason: `Body weight is stable (${rateKgPerWeek >= 0 ? "+" : ""}${rateKgPerWeek} kg/week). Your energy intake supports body recomposition and strength adaptations.`,
    targetPaceDescription: targetPace,
  };
}

/**
 * Applies plan recalibration by creating an immutable new plan version (vN+1)
 * and archiving the previous version, preserving full history.
 */
export async function applyPlanRecalibration(
  userId: string,
  currentPlan: SavedPlanData,
  assessment: RecalibrationAssessment
): Promise<{ success: boolean; newPlan?: SavedPlanData; error?: string }> {
  if (!assessment.suggestedCalories || !assessment.suggestedMacros) {
    return { success: false, error: "Missing suggested calories or macro targets." };
  }

  const nextVersion = (currentPlan.version || 1) + 1;
  const newCalories = assessment.suggestedCalories;
  const newMacros = assessment.suggestedMacros;

  // Generate updated meal plan reflecting new calorie targets
  const updatedMeals: DayMeal[] = generateMealPlan(
    currentPlan.dietType || "eggetarian",
    newCalories,
    currentPlan.meals.length || 3
  );

  const newPlanData: SavedPlanData = {
    ...currentPlan,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `plan-v${nextVersion}-${Date.now()}`,
    version: nextVersion,
    calories: newCalories,
    protein: newMacros.protein,
    carbs: newMacros.carbs,
    fat: newMacros.fat,
    meals: updatedMeals,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  // Update local cache immediately
  setCachedActivePlan(newPlanData);

  // Persist to Supabase if connected
  const supabase = getSupabase();
  if (supabase && userId && !currentPlan.id.startsWith("local-")) {
    try {
      // 1. Archive current plan
      await supabase
        .from("plans")
        .update({ status: "archived" })
        .eq("user_id", userId)
        .eq("id", currentPlan.id);

      // 2. Insert new active plan
      const { data: insertedPlan, error: insertError } = await supabase
        .from("plans")
        .insert({
          id: newPlanData.id,
          user_id: userId,
          version: nextVersion,
          goal: newPlanData.goal,
          calories: newCalories,
          protein: newMacros.protein,
          carbs: newMacros.carbs,
          fat: newMacros.fat,
          training_days: newPlanData.trainingDays,
          status: "active",
        })
        .select()
        .single();

      if (insertError) {
        console.warn("Supabase plan insert warning during recalibration:", insertError.message);
      } else if (insertedPlan) {
        // 3. Insert workouts for new plan
        if (newPlanData.schedule && newPlanData.schedule.length > 0) {
          const workoutsToInsert = newPlanData.schedule.map((day) => ({
            plan_id: insertedPlan.id,
            day: day.dayName,
            title: day.focus,
            exercise_data: day.exercises || [],
          }));
          await supabase.from("plan_workouts").insert(workoutsToInsert);
        }

        // 4. Insert updated meals for new plan
        if (updatedMeals && updatedMeals.length > 0) {
          const mealsToInsert = updatedMeals.map((m) => ({
            plan_id: insertedPlan.id,
            meal_type: m.name,
            meal_data: m,
          }));
          await supabase.from("plan_meals").insert(mealsToInsert);
        }
      }
    } catch (err: any) {
      console.warn("Supabase recalibration persist failed (active in local cache):", err?.message || err);
    }
  }

  return { success: true, newPlan: newPlanData };
}
