"use client";

import React, { useEffect, useState } from "react";
import { MemberDashboardData } from "@/lib/types/member";
import { MealCard } from "@/components/dashboard/MealCard";
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
} from "lucide-react";

export default function MemberNutritionPage() {
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<DayMeal[]>([]);

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
      <div className="py-24 flex flex-col items-center justify-center text-white/50 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF1E1E]" />
        <span className="text-xs font-mono uppercase tracking-wider">
          Compiling Nutrition Blueprint...
        </span>
      </div>
    );
  }

  const assignedPlan = data?.assignedPlan;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Apple className="w-3.5 h-3.5" />
          Nutritional Periodization Protocol
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
          Daily Fuel Strategy
        </h1>
        <p className="text-xs sm:text-sm text-white/50">
          Target calories, macronutrient distribution, recipes, and isocaloric swap alternatives.
        </p>
      </div>

      {/* Macro Overview Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#121212] border border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-white/50 uppercase">Daily Caloric Target</div>
            <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
              {assignedPlan?.calories || 2600}{" "}
              <span className="text-base font-normal text-white/40 font-mono">kcal / day</span>
            </div>
          </div>

          {/* Macro Pills */}
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-center">
              <div className="text-[10px] text-white/40 uppercase">Protein</div>
              <div className="text-lg font-bold text-emerald-400">{assignedPlan?.protein || 180}g</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-center">
              <div className="text-[10px] text-white/40 uppercase">Carbs</div>
              <div className="text-lg font-bold text-sky-400">{assignedPlan?.carbs || 300}g</div>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-center">
              <div className="text-[10px] text-white/40 uppercase">Fats</div>
              <div className="text-lg font-bold text-amber-400">{assignedPlan?.fat || 70}g</div>
            </div>
          </div>
        </div>

        {assignedPlan?.dietStrategyNotes && (
          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] flex items-start gap-2.5 text-xs text-white/70">
            <Info className="w-4 h-4 text-[#FF1E1E] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{assignedPlan.dietStrategyNotes}</span>
          </div>
        )}
      </div>

      {/* Meals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-wider text-white">
            Prescribed Daily Meals
          </h2>
          <span className="text-xs font-mono text-white/40">
            {meals.length} Meals Structured
          </span>
        </div>

        {meals.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#121212] border border-white/[0.08] text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Utensils className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold uppercase text-white">
                Personalized Meals Coming Soon
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Your assigned daily targets are active above:{" "}
                <span className="text-white font-bold">{assignedPlan?.calories || 2600} kcal</span> and{" "}
                <span className="text-emerald-400 font-bold">{assignedPlan?.protein || 180}g protein</span>.
                Your gym trainer or front desk can assign custom meal plans tailored to your food preferences.
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
    </div>
  );
}
