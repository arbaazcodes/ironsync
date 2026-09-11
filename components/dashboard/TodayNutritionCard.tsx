"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Utensils, ArrowRight } from "lucide-react";
import { SavedPlanData } from "@/lib/supabase/planSync";

interface TodayNutritionCardProps {
  plan: SavedPlanData;
}

export function TodayNutritionCard({ plan }: TodayNutritionCardProps) {
  const meals = plan.meals?.slice(0, 4) || [];

  return (
    <Card variant="elevated" padding="md" className="space-y-5 border-border/80 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Utensils className="w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-primary-dim block">
              Daily Nutrition
            </span>
            <span className="text-xs font-bold font-mono text-accent">
              {plan.calories.toLocaleString()} kcal target
            </span>
          </div>
        </div>

        <span className="text-xs font-mono text-primary-dim">
          {meals.length} Scheduled Meals
        </span>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">
          Today&apos;s Meal Breakdown
        </h2>
        <p className="text-xs text-primary-muted mt-0.5">
          {plan.dietStrategyNotes}
        </p>
      </div>

      {/* Meals list */}
      {meals.length > 0 ? (
        <div className="space-y-2.5">
          {meals.map((meal, idx) => (
            <div
              key={meal.id || idx}
              className="p-3 rounded-xl bg-surface border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 transition-colors hover:border-border-hover"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">{meal.name}</span>
                  <span className="text-[10px] font-mono text-primary-dim">({meal.timing})</span>
                </div>
                <p className="text-xs text-primary-muted mt-0.5">
                  {meal.items.map((i) => i.name).join(" + ")}
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-accent shrink-0">
                <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border/50">
                  {meal.calories} kcal
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center rounded-xl bg-surface border border-dashed border-border text-xs text-primary-muted">
          Your nutrition plan hasn&apos;t been generated yet.
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between border-t border-border/60">
        <span className="text-xs text-primary-dim font-mono">
          P: {plan.protein}g &bull; C: {plan.carbs}g &bull; F: {plan.fat}g
        </span>
        <Button
          href="/dashboard/nutrition"
          variant="secondary"
          size="sm"
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Full Nutrition
        </Button>
      </div>
    </Card>
  );
}
