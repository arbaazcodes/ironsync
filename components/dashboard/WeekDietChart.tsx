"use client";

import React, { useState, useMemo } from "react";
import { DietType } from "@/lib/types/onboarding";
import { generateWeeklyDietChart, WeekDietDay } from "@/lib/engine/mealGenerator";
import { getMealMedia, getFoodItemDetail } from "@/lib/data/mealMedia";
import {
  Printer,
  Calendar,
  Flame,
  Apple,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
  Utensils,
  Droplets,
  Scale,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

interface WeekDietChartProps {
  dietType?: DietType | null;
  totalCalories?: number;
  mealsCount?: number;
  className?: string;
}

export function WeekDietChart({
  dietType = "non_vegetarian",
  totalCalories = 2400,
  mealsCount = 4,
  className = "",
}: WeekDietChartProps) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const weekData = useMemo(() => {
    return generateWeeklyDietChart(dietType, totalCalories, mealsCount);
  }, [dietType, totalCalories, mealsCount]);

  const activeDay = weekData[selectedDayIdx] || weekData[0];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Bar: Diet specs & Print button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
            <Apple className="w-3.5 h-3.5" />
            7-Day Periodized Nutritional Protocol &bull; Weekly Meal Schedule
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-primary mt-0.5">
            Weekly Diet Chart & Meal Guide
          </h2>
          <p className="text-xs text-primary-muted mt-1 font-mono">
            Calorie Baseline: {totalCalories} kcal/day &bull; Dietary Tier: {dietType?.replace("_", " ") || "non vegetarian"}
          </p>
        </div>

        <button
          onClick={handlePrint}
          type="button"
          className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-primary font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95"
          title="Print or Export PDF"
        >
          <Printer className="w-4 h-4 text-accent" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Mon-Sun Day Selector Tabs (Hidden in Print) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
        {weekData.map((day, idx) => {
          const isSelected = selectedDayIdx === idx;
          return (
            <button
              key={day.dayShort}
              onClick={() => setSelectedDayIdx(idx)}
              className={`px-4 py-3 rounded-2xl text-xs font-mono font-bold transition-all border shrink-0 text-left ${
                isSelected
                  ? "bg-accent border-accent text-white shadow-accent-glow"
                  : "bg-card border-border text-primary-muted hover:text-primary hover:border-accent/40 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="uppercase">{day.dayShort}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isSelected ? "bg-white/20 text-white" : "bg-surface-elevated text-primary-dim"
                  }`}
                >
                  {day.totalCalories} kcal
                </span>
              </div>
              <div className="text-[10px] opacity-80 mt-1 font-normal truncate max-w-[120px]">
                {day.totalProtein}g protein
              </div>
            </button>
          );
        })}
      </div>

      {/* Screen View: Selected Day Meals (Hidden in Print) */}
      <div className="space-y-5 print:hidden">
        {/* Day Focus Header */}
        <div className="p-4 sm:p-5 rounded-3xl bg-surface border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 text-accent font-mono text-sm font-black flex items-center justify-center">
              {activeDay.dayShort}
            </span>
            <div>
              <h3 className="font-extrabold text-sm uppercase text-primary">
                {activeDay.dayName} Nutrition Strategy
              </h3>
              <p className="text-xs text-primary-muted font-mono">{activeDay.focus}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-surface-elevated border border-border text-primary font-bold">
              {activeDay.totalCalories} kcal
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              {activeDay.totalProtein}g Protein
            </span>
          </div>
        </div>

        {/* Meals Grid with Rich Images & Hindi Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeDay.meals.map((meal) => {
            const media = getMealMedia(meal.name, dietType || undefined);
            const isVeg = media.isVeg ?? (media.dietTier === "Vegetarian" || media.dietTier === "Vegan");

            return (
              <div
                key={meal.id}
                className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm hover:border-accent/40 transition-all flex flex-col justify-between"
              >
                {/* Visual Header Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-black/80">
                  <img
                    src={media.imageUrl || media.thumbnailUrl}
                    alt={meal.name}
                    className="w-full h-full object-cover brightness-[0.82] hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Top badges: Timing, Veg/Non-Veg */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Veg / Non-Veg FSSAI-style Dot */}
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center bg-white/95 backdrop-blur-md shadow-sm border ${
                          isVeg ? "border-emerald-600" : "border-red-600"
                        }`}
                        title={isVeg ? "100% Vegetarian" : "Non-Vegetarian / Contains Egg"}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isVeg ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        />
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                        {meal.timing}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-xl bg-accent text-white font-mono text-xs font-black shadow-accent-glow">
                      {meal.calories} kcal
                    </span>
                  </div>

                  {/* Bottom: Meal Title + English Subtitle */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h4 className="font-extrabold text-base sm:text-lg text-white block leading-tight drop-shadow-sm truncate">
                      {meal.name}
                    </h4>
                    {media.hindiName && (
                      <p className="text-xs text-accent font-semibold drop-shadow mt-0.5 truncate">
                        {media.hindiName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Macros Strip */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-center">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[10px] text-primary-dim uppercase block font-bold">Protein</span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                        {meal.protein}g
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                      <span className="text-[10px] text-primary-dim uppercase block font-bold">Carbs</span>
                      <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 mt-0.5 block">
                        {meal.carbs}g
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] text-primary-dim uppercase block font-bold">Fats</span>
                      <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">
                        {meal.fat}g
                      </span>
                    </div>
                  </div>

                  {/* Key Benefits Callout if available */}
                  {media.keyBenefits && (
                    <div className="p-2.5 rounded-xl bg-surface-elevated border border-border flex items-start gap-2 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span className="text-primary-muted font-medium text-[11px] leading-relaxed">
                        <strong className="text-primary">Key Benefits:</strong> {media.keyBenefits}
                      </span>
                    </div>
                  )}

                  {/* Itemized Foods Breakdown with Individual Photos & Portion Tips */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-primary-dim font-bold tracking-wider">
                      <span>Prescribed Items & Portions</span>
                      <span>Estimated Portion</span>
                    </div>

                    <ul className="space-y-2">
                      {meal.items.map((item, idx) => {
                        const itemDetail = getFoodItemDetail(item.name);
                        return (
                          <li
                            key={idx}
                            className="p-2 rounded-2xl bg-surface-elevated border border-border flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* 36x36 circular item thumbnail */}
                              <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-surface border border-border">
                                <img
                                  src={itemDetail.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop";
                                  }}
                                />
                              </div>

                              <div className="min-w-0">
                                <span className="font-bold text-primary block truncate text-xs">
                                  {item.name}
                                </span>
                                {itemDetail.hindiName && itemDetail.hindiName !== item.name && (
                                  <span className="text-[10px] text-primary-muted block truncate">
                                    {itemDetail.hindiName}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono text-xs font-bold text-accent block">
                                {item.portion}
                              </span>
                              <span className="text-[10px] font-mono text-primary-dim block">
                                {itemDetail.portionTip}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Timing Advice Footer */}
                  {media.timingAdvice && (
                    <div className="pt-2 border-t border-border flex items-center gap-1.5 text-[11px] font-mono text-primary-dim">
                      <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{media.timingAdvice}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kitchen Measurement Reference Guide (Visual Portion Reference) */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase text-primary tracking-tight">
                Kitchen Measurement Guide &bull; Visual Portion Reference (No Scale Needed)
              </h3>
              <p className="text-xs text-primary-muted">
                If you do not have a digital kitchen scale, use these standard household references for accurate portion control:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-center space-y-1">
              <span className="text-xl block">🥣</span>
              <span className="text-xs font-bold text-primary block">1 Standard Bowl (Katori)</span>
              <span className="text-[11px] font-mono text-accent font-bold block">~150g</span>
              <span className="text-[10px] text-primary-dim block leading-tight">Cooked rice, dal, curd, lentils</span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-center space-y-1">
              <span className="text-xl block">✋</span>
              <span className="text-xs font-bold text-primary block">1 Palm Size</span>
              <span className="text-[11px] font-mono text-accent font-bold block">~150-180g</span>
              <span className="text-[10px] text-primary-dim block leading-tight">Paneer, chicken breast, fish</span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-center space-y-1">
              <span className="text-xl block">✊</span>
              <span className="text-xs font-bold text-primary block">1 Fist Size</span>
              <span className="text-[11px] font-mono text-accent font-bold block">1 Serving</span>
              <span className="text-[10px] text-primary-dim block leading-tight">1 Apple/banana or 2 rotis</span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-center space-y-1">
              <span className="text-xl block">🥄</span>
              <span className="text-xs font-bold text-primary block">1 Tablespoon</span>
              <span className="text-[11px] font-mono text-accent font-bold block">~15g / 5ml</span>
              <span className="text-[10px] text-primary-dim block leading-tight">Peanut butter, olive oil/ghee</span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-center space-y-1">
              <span className="text-xl block">🥛</span>
              <span className="text-xs font-bold text-primary block">1 Glass</span>
              <span className="text-[11px] font-mono text-accent font-bold block">250ml</span>
              <span className="text-[10px] text-primary-dim block leading-tight">Water, skimmed milk, buttermilk</span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-center space-y-1">
              <span className="text-xl block">🥤</span>
              <span className="text-xs font-bold text-primary block">1 Scoop</span>
              <span className="text-[11px] font-mono text-accent font-bold block">~30-32g</span>
              <span className="text-[10px] text-primary-dim block leading-tight">Whey protein powder</span>
            </div>
          </div>
        </div>

        {/* 4 Golden Rules of Gym Nutrition */}
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase text-primary tracking-tight">
                4 Golden Rules of Gym Nutrition &bull; Core Dietary Protocol
              </h3>
              <p className="text-xs text-primary-muted">
                Follow these four evidence-based rules daily to maximize fat loss, muscle recovery, and energy levels:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border flex items-start gap-3">
              <span className="text-2xl shrink-0">💧</span>
              <div>
                <h4 className="text-xs font-bold text-primary">1. Daily Hydration</h4>
                <p className="text-[11px] text-primary-muted leading-relaxed mt-0.5">
                  Drink 3.5 to 4.0 liters of pure water daily. Avoid heavy water intake immediately during meals (wait at least 30 minutes) to support optimal digestive function.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border flex items-start gap-3">
              <span className="text-2xl shrink-0">⏰</span>
              <div>
                <h4 className="text-xs font-bold text-primary">2. Nutrient Timing (Pre & Post Workout)</h4>
                <p className="text-[11px] text-primary-muted leading-relaxed mt-0.5">
                  Consume light complex carbohydrates 45 minutes prior to training (banana or toast) and high-quality protein within 30 minutes post-workout.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border flex items-start gap-3">
              <span className="text-2xl shrink-0">🧂</span>
              <div>
                <h4 className="text-xs font-bold text-primary">3. Oil & Salt Moderation</h4>
                <p className="text-[11px] text-primary-muted leading-relaxed mt-0.5">
                  Limit total added cooking oil to 1–2 tablespoons daily. Use moderate rock or pink salt to avoid unwanted fluid retention and bloating.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border flex items-start gap-3">
              <span className="text-2xl shrink-0">🚫</span>
              <div>
                <h4 className="text-xs font-bold text-primary">4. Foods to Strictly Avoid</h4>
                <p className="text-[11px] text-primary-muted leading-relaxed mt-0.5">
                  Completely eliminate refined sugars, aerated soft drinks, deep-fried street snacks, packaged chips, and alcohol for optimal physical conditioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print View: Full 7-Day Matrix for Physical Printing / PDF Export */}
      <div className="hidden print:block space-y-6 text-black">
        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-black uppercase">IronSync — 7-Day Nutrition Blueprint</h1>
          <p className="text-sm text-neutral-600 font-mono mt-1">
            Target: {totalCalories} kcal/day &bull; Dietary Tier: {dietType?.replace("_", " ").toUpperCase()}
          </p>
        </div>

        <div className="space-y-6">
          {weekData.map((day) => (
            <div key={day.dayShort} className="border-b pb-4 page-break-inside-avoid">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-base uppercase">
                  {day.dayName} ({day.dayShort}) — {day.totalCalories} kcal | {day.totalProtein}g Protein
                </h3>
                <span className="text-xs text-neutral-500 font-mono">{day.focus}</span>
              </div>

              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-y bg-neutral-100">
                    <th className="py-1 px-2">Meal</th>
                    <th className="py-1 px-2">Time</th>
                    <th className="py-1 px-2">Calories</th>
                    <th className="py-1 px-2">Protein</th>
                    <th className="py-1 px-2">Items & Portions</th>
                  </tr>
                </thead>
                <tbody>
                  {day.meals.map((m) => (
                    <tr key={m.id} className="border-b">
                      <td className="py-1.5 px-2 font-bold">{m.name}</td>
                      <td className="py-1.5 px-2">{m.timing}</td>
                      <td className="py-1.5 px-2">{m.calories} kcal</td>
                      <td className="py-1.5 px-2">{m.protein}g</td>
                      <td className="py-1.5 px-2 text-[11px]">
                        {m.items.map((it) => `${it.name} (${it.portion})`).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
