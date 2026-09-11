"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Metric } from "@/components/ui/Metric";
import { MealCard } from "@/components/dashboard/MealCard";
import { DayMeal } from "@/lib/engine/mealGenerator";
import { updatePlanMeals } from "@/lib/supabase/planSync";
import {
  Utensils,
  Sparkles,
  AlertCircle,
  PieChart,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  RotateCcw,
  Save,
  CheckCircle2,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface PendingMealSwap {
  mealIdx: number;
  original: DayMeal;
  replacement: DayMeal;
}

export default function DashboardNutritionPage() {
  const { activePlan, refreshPlan } = useAuth();
  const [meals, setMeals] = useState<DayMeal[]>([]);
  const [pendingSwap, setPendingSwap] = useState<PendingMealSwap | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize meals from activePlan on load & track nutrition_viewed
  useEffect(() => {
    if (activePlan?.meals) {
      setMeals(activePlan.meals);
      trackEvent("nutrition_viewed", {
        meal_count: activePlan.meals.length,
        goal: activePlan.goal,
      });
    }
  }, [activePlan]);

  if (!activePlan) return null;

  const currentMeals = meals.length > 0 ? meals : activePlan.meals || [];

  // Local swap handler: updates displayed meals without mutating DB yet
  const handleSwapMeal = (updatedMeal: DayMeal) => {
    const targetIdx = currentMeals.findIndex(
      (m) => m.id === updatedMeal.id || m.name === updatedMeal.name
    );

    const original = targetIdx >= 0 ? currentMeals[targetIdx] : currentMeals[0];

    setMeals((prev) => {
      const copy = [...prev];
      if (targetIdx >= 0) {
        copy[targetIdx] = updatedMeal;
      } else {
        copy.push(updatedMeal);
      }
      return copy;
    });

    setPendingSwap({
      mealIdx: targetIdx >= 0 ? targetIdx : 0,
      original,
      replacement: updatedMeal,
    });
    setSaveStatus(null);
  };

  // Undo Swap: reverts back to original meal
  const handleUndoSwap = () => {
    if (!pendingSwap) return;

    setMeals((prev) => {
      const copy = [...prev];
      copy[pendingSwap.mealIdx] = pendingSwap.original;
      return copy;
    });

    setPendingSwap(null);
    setSaveStatus("Reverted back to original meal.");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Save Changes: permanently persists updated meals to active plan in Supabase & cache
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveStatus("Persisting updated meals to active blueprint...");

      await updatePlanMeals(activePlan.id, meals);
      if (refreshPlan) {
        await refreshPlan();
      }

      setPendingSwap(null);
      setSaveStatus("Meals successfully saved to active blueprint!");
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      console.error("Failed to save meal changes:", err);
      setSaveStatus("Failed to save meal changes. Please retry.");
    } finally {
      setIsSaving(false);
    }
  };

  // Dynamically calculate actual totals from currentMeals
  const activeCalories = currentMeals.reduce((sum, m) => sum + (m.calories || 0), 0) || activePlan.calories;
  const activeProtein = currentMeals.reduce((sum, m) => sum + (m.protein || 0), 0) || activePlan.protein;
  const activeCarbs = currentMeals.reduce((sum, m) => sum + (m.carbs || 0), 0) || activePlan.carbs;
  const activeFat = currentMeals.reduce((sum, m) => sum + (m.fat || 0), 0) || activePlan.fat;

  const proteinCals = activeProtein * 4;
  const carbsCals = activeCarbs * 4;
  const fatCals = activeFat * 9;
  const totalCalculated = proteinCals + carbsCals + fatCals || activeCalories;

  const proteinPct = Math.round((proteinCals / totalCalculated) * 100);
  const carbsPct = Math.round((carbsCals / totalCalculated) * 100);
  const fatPct = Math.max(100 - proteinPct - carbsPct, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="space-y-1.5 pb-5 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm">
            NUTRITION
          </Badge>
          <span className="text-xs font-mono text-primary-dim">
            Diet Architecture: {activePlan.dietType ? activePlan.dietType.replace(/_/g, " ") : "Personalized"} &bull; {activePlan.budget || "balanced"} tier
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Metabolic Energy & Macro Architecture
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted">
          {activePlan.dietStrategyNotes || "Engineered for optimal protein pacing, glycogen replenishment, and cellular recovery."}
        </p>
      </div>

      {/* 2. Swap Confirmation & Preview Banner */}
      {pendingSwap && (
        <div className="p-4 rounded-2xl bg-accent/[0.08] border border-accent/40 shadow-lg animate-in slide-in-from-top-2 duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>UNSAVED MEAL SWAP ACTIVE</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-primary-dim">Original:</span>
              <span className="line-through text-primary-muted font-medium">
                {pendingSwap.original.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
              <span className="text-primary font-bold text-sm">
                {pendingSwap.replacement.name}
              </span>
              <span className="text-[11px] text-accent font-semibold ml-1">
                ({pendingSwap.replacement.calories - pendingSwap.original.calories > 0 ? "+" : ""}
                {pendingSwap.replacement.calories - pendingSwap.original.calories} kcal,{" "}
                {pendingSwap.replacement.protein - pendingSwap.original.protein > 0 ? "+" : ""}
                {pendingSwap.replacement.protein - pendingSwap.original.protein}g protein)
              </span>
            </div>
            <p className="text-[11px] text-primary-dim">
              Displayed macros updated. Save to persist to your blueprint or undo to revert.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <Button
              onClick={handleUndoSwap}
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              className="font-mono text-xs"
            >
              Undo Swap
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              className="font-mono text-xs shadow-md shadow-accent/20"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Temporary Status Notification */}
      {saveStatus && !pendingSwap && (
        <div className="p-3 rounded-xl bg-surface border border-accent/30 text-xs font-mono text-primary flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* 3. Top: TODAY'S TARGET & Macro Distribution Visualization */}
      <Card variant="elevated" padding="lg" className="border-border/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">
              TODAY&apos;S TARGET
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight mt-0.5">
              Daily Nutritional Allotment
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-primary-dim">
              Calibrated Intake &bull;
            </span>
            <span className="text-xs font-mono text-accent font-bold">
              {activeCalories.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {/* 4 Metric Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-surface border border-border/70">
            <Metric
              value={activeCalories.toLocaleString()}
              label="CALORIC BUDGET"
              unit="kcal"
              size="md"
              sublabel="Daily metabolic target"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/70">
            <Metric
              value={`${activeProtein}g`}
              label={`PROTEIN (${proteinPct}%)`}
              size="md"
              sublabel="Muscle repair target"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/70">
            <Metric
              value={`${activeCarbs}g`}
              label={`CARBOHYDRATES (${carbsPct}%)`}
              size="md"
              sublabel="Glycogen replenishment"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/70">
            <Metric
              value={`${activeFat}g`}
              label={`DIETARY FATS (${fatPct}%)`}
              size="md"
              sublabel="Hormonal homeostasis"
            />
          </div>
        </div>

        {/* Horizontal Macro Distribution Bar */}
        <div className="space-y-2 pt-2">
          <div className="h-2.5 w-full rounded-full bg-surface overflow-hidden flex">
            <div
              style={{ width: `${proteinPct}%` }}
              className="bg-accent h-full transition-all duration-300"
              title={`Protein: ${proteinPct}%`}
            />
            <div
              style={{ width: `${carbsPct}%` }}
              className="bg-white/85 h-full transition-all duration-300"
              title={`Carbs: ${carbsPct}%`}
            />
            <div
              style={{ width: `${fatPct}%` }}
              className="bg-white/30 h-full transition-all duration-300"
              title={`Fat: ${fatPct}%`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-primary-dim pt-1">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_6px_rgba(255,30,30,0.8)]" />
              Protein: {activeProtein}g ({proteinPct}%)
            </span>
            <span className="flex items-center gap-1.5 text-white/90">
              <span className="w-2 h-2 rounded-full bg-white/85" />
              Carbs: {activeCarbs}g ({carbsPct}%)
            </span>
            <span className="flex items-center gap-1.5 text-primary-muted">
              <span className="w-2 h-2 rounded-full bg-white/30" />
              Fat: {activeFat}g ({fatPct}%)
            </span>
          </div>
        </div>
      </Card>

      {/* 4. Daily Scheduled Meals */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Scheduled Daily Meals ({currentMeals.length} Scheduled)
            </h2>
          </div>
          <span className="text-xs font-mono text-primary-dim">
            Strictly respects: {activePlan.dietType ? activePlan.dietType.replace(/_/g, " ").toUpperCase() : "PERSONALIZED"}
          </span>
        </div>

        {currentMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMeals.map((meal, idx) => (
              <MealCard
                key={meal.id || idx}
                meal={meal}
                index={idx}
                userDiet={activePlan.dietType || "eggetarian"}
                userBudget={activePlan.budget || "balanced"}
                userAllergies={activePlan.foodRestrictions || []}
                onSwapMeal={handleSwapMeal}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-surface border border-dashed border-border text-xs text-primary-muted">
            Your nutrition plan hasn&apos;t been generated yet.
          </div>
        )}
      </div>

      {/* Safety and Allergy Guarantee */}
      <div className="p-4 rounded-xl bg-surface/60 border border-border/70 flex items-center justify-between gap-3 text-xs font-mono text-primary-dim">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Macro targets dynamically adjusted to bodyweight and activity expenditure</span>
        </span>
        <span className="hidden sm:inline">Deterministic Multi-Macro Proximity Enabled</span>
      </div>
    </div>
  );
}
