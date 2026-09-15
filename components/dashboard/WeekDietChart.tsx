"use client";

import React, { useState, useMemo } from "react";
import { DietType } from "@/lib/types/onboarding";
import { generateWeeklyDietChart, WeekDietDay } from "@/lib/engine/mealGenerator";
import { getMealMedia } from "@/lib/data/mealMedia";
import {
  Printer,
  Calendar,
  Flame,
  Apple,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
            <Apple className="w-3.5 h-3.5" />
            7-Day Periodized Nutritional Protocol
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-primary mt-0.5">
            Weekly Diet Chart
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
      <div className="space-y-4 print:hidden">
        {/* Day Focus Header */}
        <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 text-accent font-mono text-sm font-bold flex items-center justify-center">
              {activeDay.dayShort}
            </span>
            <div>
              <h3 className="font-extrabold text-sm uppercase text-primary">
                {activeDay.dayName} Strategy
              </h3>
              <p className="text-xs text-primary-muted font-mono">{activeDay.focus}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-primary">
              {activeDay.totalCalories} kcal
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              {activeDay.totalProtein}g protein
            </span>
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDay.meals.map((meal) => {
            const media = getMealMedia(meal.name, dietType || undefined);

            return (
              <div
                key={meal.id}
                className="rounded-2xl bg-card border border-border p-4 shadow-sm hover:border-accent/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  {/* Photo with safe fallback */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-elevated shrink-0 border border-border">
                    <img
                      src={media.thumbnailUrl}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        // Safe fallback to prevent broken images
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                  </div>

                  {/* Meal Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-primary-dim uppercase tracking-wider">
                        {meal.timing}
                      </span>
                      <span className="text-xs font-mono font-bold text-accent">
                        {meal.calories} kcal
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-primary uppercase mt-0.5 truncate">
                      {meal.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-primary-muted mt-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {meal.protein}g P
                      </span>
                      <span>&bull;</span>
                      <span>{meal.carbs}g C</span>
                      <span>&bull;</span>
                      <span>{meal.fat}g F</span>
                    </div>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-border space-y-1">
                  <div className="text-[10px] font-mono uppercase text-primary-dim font-bold">
                    Prescribed Food Items:
                  </div>
                  <ul className="space-y-1">
                    {meal.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-primary flex items-center justify-between font-mono"
                      >
                        <span className="truncate">{item.name}</span>
                        <span className="text-primary-muted text-[11px] shrink-0 pl-2">
                          {item.portion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
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
                    <th className="py-1 px-2">Items</th>
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
