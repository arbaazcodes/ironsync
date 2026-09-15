"use client";

import React, { useEffect, useState } from "react";
import { MemberDashboardData } from "@/lib/types/member";
import { MealCard } from "@/components/dashboard/MealCard";
import { WeekDietChart } from "@/components/dashboard/WeekDietChart";
import { DayMeal } from "@/lib/engine/mealGenerator";
import {
  Apple,
  Flame,
  Zap,
  Clock,
  Sparkles,
  Loader2,
  Info,
  Utensils,
  Calendar,
} from "lucide-react";

export default function MemberNutritionPage() {
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<DayMeal[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/member/dashboard");
        if (res.ok) {
          const result = await res.json();
          setData(result);
          if (result.assignedPlan?.meals) {
            setMeals(result.assignedPlan.meals);
          }
        }
      } catch (err) {
        console.error("Failed to load nutrition data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSwapMeal = (updatedMeal: DayMeal) => {
    setMeals((prev) =>
      prev.map((m) => (m.name === updatedMeal.name || m.timing === updatedMeal.timing ? updatedMeal : m))
    );
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-primary-muted space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-mono uppercase tracking-wider">
          Compiling Nutrition Blueprint...
        </span>
      </div>
    );
  }

  const assignedPlan = data?.assignedPlan;
  const member = data?.member;

  return (
    <div className="space-y-8">
      {/* Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
            <Apple className="w-3.5 h-3.5" />
            Nutritional Periodization Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-primary mt-1">
            Daily Fuel Strategy
          </h1>
          <p className="text-xs sm:text-sm text-primary-muted">
            Target calories, macronutrient distribution, recipes, and isocaloric swap alternatives.
          </p>
        </div>

        {/* View Switcher: Today's Protocol vs 7-Day Week Chart */}
        <div className="flex items-center p-1 rounded-2xl bg-surface-elevated border border-border shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("today")}
            className={`py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "today"
                ? "bg-accent text-white shadow-accent-glow"
                : "text-primary-muted hover:text-primary"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Today&apos;s Protocol</span>
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "week"
                ? "bg-accent text-white shadow-accent-glow"
                : "text-primary-muted hover:text-primary"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Week Chart</span>
          </button>
        </div>
      </div>

      {/* Macro Overview Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-primary-muted uppercase">Daily Caloric Target</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary mt-0.5">
              {assignedPlan?.calories || 2600}{" "}
              <span className="text-base font-normal text-primary-dim font-mono">kcal / day</span>
            </div>
          </div>

          {/* Macro Pills */}
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-surface-elevated border border-border text-center">
              <div className="text-[10px] text-primary-dim uppercase">Protein</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{assignedPlan?.protein || 180}g</div>
            </div>
            <div className="p-3 rounded-xl bg-surface-elevated border border-border text-center">
              <div className="text-[10px] text-primary-dim uppercase">Carbs</div>
              <div className="text-lg font-bold text-sky-500">{assignedPlan?.carbs || 300}g</div>
            </div>
            <div className="p-3 rounded-xl bg-surface-elevated border border-border text-center">
              <div className="text-[10px] text-primary-dim uppercase">Fats</div>
              <div className="text-lg font-bold text-amber-500">{assignedPlan?.fat || 70}g</div>
            </div>
          </div>
        </div>

        {assignedPlan?.dietStrategyNotes && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-border flex items-start gap-2.5 text-xs text-primary-muted">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span className="leading-relaxed">{assignedPlan.dietStrategyNotes}</span>
          </div>
        )}
      </div>

      {activeTab === "week" ? (
        <WeekDietChart
          dietType={(member?.dietType as any) || "non_vegetarian"}
          totalCalories={assignedPlan?.calories || 2400}
          mealsCount={4}
        />
      ) : (
        /* Meals Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wider text-primary">
              Prescribed Daily Meals
            </h2>
            <span className="text-xs font-mono text-primary-dim">
              {meals.length} Meals Structured &bull; {assignedPlan?.calories || 2400} kcal
            </span>
          </div>

          {meals.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Utensils className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold uppercase text-primary">
                  Personalized Meals Coming Soon
                </h3>
                <p className="text-xs text-primary-muted leading-relaxed">
                  Your assigned daily targets are active above:{" "}
                  <span className="text-primary font-bold">{assignedPlan?.calories || 2600} kcal</span> and{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{assignedPlan?.protein || 180}g protein</span>.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.map((meal, index) => (
                <MealCard
                  key={index}
                  meal={meal}
                  index={index}
                  onSwapMeal={handleSwapMeal}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
