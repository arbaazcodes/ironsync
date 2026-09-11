"use client";

import React, { useEffect } from "react";
import { DayMeal } from "@/lib/engine/mealGenerator";
import { DietType, BudgetTier } from "@/lib/types/onboarding";
import { getMealAlternatives, SwapAlternative, RankedMealSwap } from "@/lib/data/mealSwapData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  X,
  ArrowRight,
  Check,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Scale,
} from "lucide-react";

interface MealSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMeal: DayMeal;
  userDiet: DietType;
  userBudget?: BudgetTier;
  userAllergies?: string[];
  onSelectSwap: (swappedMeal: DayMeal) => void;
}

export function MealSwapModal({
  isOpen,
  onClose,
  currentMeal,
  userDiet,
  userBudget = "balanced",
  userAllergies = [],
  onSelectSwap,
}: MealSwapModalProps) {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alternatives: RankedMealSwap[] = getMealAlternatives(
    currentMeal,
    userDiet,
    userBudget,
    userAllergies
  );

  const handleApplySwap = (alt: SwapAlternative) => {
    const updated: DayMeal = {
      ...currentMeal,
      name: alt.name,
      calories: alt.calories,
      protein: alt.protein,
      carbs: alt.carbs,
      fat: alt.fat,
      items: alt.items,
      recipe: alt.recipe,
    };
    onSelectSwap(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-swap-title"
        className="relative w-full max-w-2xl max-h-[90vh] bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
              <RefreshCw className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 id="meal-swap-title" className="text-base sm:text-lg font-bold text-primary">
                Smart Macro-Ranked Meal Swap
              </h2>
              <span className="text-xs font-mono text-primary-dim block">
                Targeting: {userDiet.replace(/_/g, " ").toUpperCase()} &bull; {userBudget.toUpperCase()} TIER
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-primary-dim hover:text-primary hover:bg-surface transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Current Meal Reference */}
          <div className="p-4 rounded-xl bg-surface border border-border/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                CURRENT SCHEDULED MEAL
              </span>
              <span className="text-xs font-mono text-primary-dim">
                {currentMeal.timing}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-primary">{currentMeal.name}</p>
                <p className="text-xs text-primary-muted mt-0.5">
                  {currentMeal.items.map((i) => `${i.portion} ${i.name}`).join(" • ")}
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs shrink-0 self-start sm:self-center">
                <span className="px-2.5 py-1 rounded bg-surface-elevated border border-border text-primary font-bold">
                  {currentMeal.calories} kcal
                </span>
                <span className="text-accent font-semibold">{currentMeal.protein}g protein</span>
              </div>
            </div>
          </div>

          {/* Alternatives List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-primary-dim">
              <span className="font-bold uppercase tracking-wider text-primary">
                Compatible Alternatives ({alternatives.length} Ranked by Proximity)
              </span>
              <span className="text-accent flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                Multi-Macro Proximity
              </span>
            </div>

            {alternatives.length > 0 ? (
              <div className="space-y-3">
                {alternatives.map((item, idx) => {
                  const alt = item.alternative;
                  const calDeltaStr =
                    item.calorieDelta > 0
                      ? `+${item.calorieDelta} kcal`
                      : item.calorieDelta < 0
                      ? `${item.calorieDelta} kcal`
                      : "0 kcal";
                  const proDeltaStr =
                    item.proteinDelta > 0
                      ? `+${item.proteinDelta}g P`
                      : item.proteinDelta < 0
                      ? `${item.proteinDelta}g P`
                      : "0g P";

                  return (
                    <div
                      key={alt.id}
                      className="p-4 rounded-xl bg-surface border border-border hover:border-accent/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-primary">{alt.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                            {item.proximityPercentage}% Match
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 border border-accent/40 text-accent font-bold">
                              Closest Macro Match
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-primary-muted">
                          {alt.items.map((i) => `${i.portion} ${i.name}`).join(" • ")}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono pt-1">
                          <span className="font-semibold text-primary">
                            {alt.calories} kcal
                          </span>
                          <span>&bull;</span>
                          <span className="text-primary-muted">
                            P: {alt.protein}g &bull; C: {alt.carbs}g &bull; F: {alt.fat}g
                          </span>
                          <span>&bull;</span>
                          <span
                            className={`font-semibold ${
                              Math.abs(item.calorieDelta) <= 30 && Math.abs(item.proteinDelta) <= 5
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            ({calDeltaStr}, {proDeltaStr})
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleApplySwap(alt)}
                        variant="secondary"
                        size="sm"
                        className="shrink-0 font-mono text-xs"
                        icon={<ArrowRight className="w-3.5 h-3.5 text-accent" />}
                      >
                        Select Alternative
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-surface border border-dashed border-border/80 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-primary">
                  No suitable alternatives found.
                </h4>
                <p className="text-xs text-primary-muted max-w-md mx-auto leading-relaxed">
                  No compatible alternatives match your strict &ldquo;{userDiet.replace(/_/g, " ")}&rdquo; diet, &ldquo;{userBudget}&rdquo; tier, and active allergy restrictions for this specific meal category.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface/50 flex items-center justify-between text-xs font-mono text-primary-dim">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            Strictly respects: {userDiet.replace(/_/g, " ").toUpperCase()}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-mono">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
