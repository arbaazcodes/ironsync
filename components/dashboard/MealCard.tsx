"use client";

import React, { useState } from "react";
import { DayMeal } from "@/lib/engine/mealGenerator";
import { DietType, BudgetTier } from "@/lib/types/onboarding";
import { getMealRecipe } from "@/lib/data/mealSwapData";
import { getMealMedia } from "@/lib/data/mealMedia";
import { MealSwapModal } from "./MealSwapModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, RefreshCw, ChevronDown, ChevronUp, ChefHat, Utensils } from "lucide-react";

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

  const fallbackRecipe = getMealRecipe(meal);
  const media = getMealMedia(meal.name, userDiet);

  return (
    <>
      <Card
        variant="elevated"
        padding="none"
        className="group relative overflow-hidden border-border hover:border-accent/40 hover:shadow-card-hover transition-all duration-300"
      >
        {/* Visual Header Banner */}
        <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-black border-b border-border">
          <img
            src={media.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover brightness-[0.8] group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-accent">
                {index + 1}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] text-white uppercase">
                {meal.timing}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSwapModalOpen(true)}
              className="h-7 px-2.5 text-xs bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-accent font-mono"
            >
              <RefreshCw className="w-3 h-3 mr-1 text-accent" />
              Swap
            </Button>
          </div>

          {/* Bottom Title & Timing */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-base sm:text-lg font-extrabold text-white block leading-tight tracking-tight drop-shadow-sm">
                {meal.name}
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-white/80 mt-0.5">
                <span className="flex items-center gap-1 text-white">
                  <Clock className="w-3 h-3 text-accent" />
                  {media.prepTimeMinutes + media.cookTimeMinutes} mins total
                </span>
                <span>&bull;</span>
                <span className="text-white/80">{media.dietTier}</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-accent text-white font-mono text-xs font-bold shadow-accent-glow">
              {meal.calories} kcal
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Macronutrient Pill Grid */}
          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-accent/30">
              <span className="text-[10px] text-primary-dim uppercase block">Protein</span>
              <span className="text-sm font-extrabold text-accent mt-0.5 block">
                {meal.protein}g
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-primary-dim uppercase block">Carbs</span>
              <span className="text-sm font-extrabold text-primary mt-0.5 block">
                {meal.carbs}g
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-primary-dim uppercase block">Fats</span>
              <span className="text-sm font-extrabold text-primary-muted mt-0.5 block">
                {meal.fat}g
              </span>
            </div>
          </div>

          {/* Food Items & Portions */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
              Scheduled Portions & Ingredients
            </span>
            <ul className="space-y-1.5 text-xs text-primary">
              {meal.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-surface-elevated border border-border"
                >
                  <span className="font-semibold text-primary">{item.name}</span>
                  <span className="font-mono text-primary-dim text-[11px] font-bold">
                    {item.portion}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable Recipe Button */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
            <span className="text-primary-dim text-[11px] flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-accent" />
              Nutritional Precision
            </span>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-primary-muted hover:text-primary transition-colors text-xs font-semibold"
            >
              <span>{expanded ? "Hide Recipe" : "View Recipe"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5 text-accent" /> : <ChevronDown className="w-3.5 h-3.5 text-accent" />}
            </button>
          </div>

          {/* Expandable Preparation Instructions */}
          {expanded && (
            <div className="pt-3 border-t border-border space-y-3 bg-background-subtle -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 sm:p-5 rounded-b-[24px] animate-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-accent font-bold">
                  <ChefHat className="w-4 h-4 text-accent" />
                  PREPARATION GUIDE
                </span>
                <span className="text-primary-dim text-[11px]">
                  Prep: {media.prepTimeMinutes}m &bull; Cook: {media.cookTimeMinutes}m
                </span>
              </div>

              {/* Ingredients List */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
                  Required Grocery Items
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(media.ingredients?.length ? media.ingredients.map(i => `${i.item} (${i.amount})`) : fallbackRecipe.ingredients).map((ing, ingIdx) => (
                    <span
                      key={ingIdx}
                      className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-[11px] font-mono text-primary"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cooking Instructions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
                  Step-by-Step Culinary Protocol
                </span>
                <ol className="space-y-2 text-xs text-primary-muted list-none leading-relaxed">
                  {(media.cookingSteps?.length ? media.cookingSteps : fallbackRecipe.preparation).map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-md bg-surface-elevated border border-accent/40 font-mono text-[10px] font-bold text-accent flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
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
