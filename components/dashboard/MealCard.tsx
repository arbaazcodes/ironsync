"use client";

import React, { useState } from "react";
import { DayMeal } from "@/lib/engine/mealGenerator";
import { DietType, BudgetTier } from "@/lib/types/onboarding";
import { getMealRecipe } from "@/lib/data/mealSwapData";
import { MealSwapModal } from "./MealSwapModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, RefreshCw, ChevronDown, ChevronUp, ChefHat, Check } from "lucide-react";

interface MealCardProps {
  meal: DayMeal;
  index: number;
  userDiet?: DietType;
  userBudget?: BudgetTier;
  userAllergies?: string[];
  onSwapMeal?: (updatedMeal: DayMeal) => void;
}

export function MealCard({
  meal,
  index,
  userDiet = "eggetarian",
  userBudget = "balanced",
  userAllergies = [],
  onSwapMeal,
}: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);

  const recipe = getMealRecipe(meal);

  return (
    <>
      <Card variant="elevated" padding="md" className="space-y-4 border-border/80 relative overflow-hidden transition-all duration-200 hover:border-border-hover">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-surface-elevated border border-border flex items-center justify-center font-mono text-xs font-bold text-accent">
              {index + 1}
            </span>
            <div>
              <span className="text-xs font-bold text-primary block leading-tight">{meal.name}</span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-primary-dim mt-0.5">
                <Clock className="w-3 h-3 text-accent" />
                <span>{meal.timing}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border/50 font-mono text-xs font-bold text-accent">
              {meal.calories} kcal
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSwapModalOpen(true)}
              className="h-8 px-2.5 text-xs text-primary-dim hover:text-accent font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Swap
            </Button>
          </div>
        </div>

        {/* Food Items & Portions */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
            Scheduled Portions
          </span>
          <ul className="space-y-1.5 text-xs text-primary">
            {meal.items.map((item, itemIdx) => (
              <li
                key={itemIdx}
                className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-surface border border-border/50"
              >
                <span className="font-medium text-primary">{item.name}</span>
                <span className="font-mono text-primary-muted text-[11px] font-semibold">{item.portion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Macro breakdown footer */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono text-primary-dim">
          <span>
            P: <strong className="text-primary">{meal.protein}g</strong> &bull; C:{" "}
            <strong className="text-primary">{meal.carbs}g</strong> &bull; F:{" "}
            <strong className="text-primary">{meal.fat}g</strong>
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-primary-dim hover:text-primary transition-colors text-[11px]"
          >
            <span>{expanded ? "Hide Recipe" : "View Recipe"}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Recipe Details */}
        {expanded && (
          <div className="pt-3 border-t border-border/60 space-y-3 bg-background/40 -mx-4 -mb-4 p-4 rounded-b-xl animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-accent font-bold">
                <ChefHat className="w-3.5 h-3.5 text-accent" />
                PREPARATION & INGREDIENTS
              </span>
              <span className="text-primary-dim">{recipe.servingSize}</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
                Required Ingredients
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recipe.ingredients.map((ing, ingIdx) => (
                  <span
                    key={ingIdx}
                    className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] text-primary"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
                Cooking Instructions
              </span>
              <ol className="space-y-1 text-xs text-primary-muted list-decimal list-inside leading-relaxed">
                {recipe.preparation.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Card>

      {/* Swap Modal */}
      {swapModalOpen && (
        <MealSwapModal
          isOpen={swapModalOpen}
          onClose={() => setSwapModalOpen(false)}
          currentMeal={meal}
          userDiet={userDiet}
          userBudget={userBudget}
          userAllergies={userAllergies}
          onSelectSwap={(newMeal) => {
            if (onSwapMeal) {
              onSwapMeal(newMeal);
            }
          }}
        />
      )}
    </>
  );
}
