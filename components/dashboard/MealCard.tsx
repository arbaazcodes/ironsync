"use client";

import React, { useState } from "react";
import { DayMeal } from "@/lib/engine/mealGenerator";
import { DietType, BudgetTier } from "@/lib/types/onboarding";
import { getMealRecipe } from "@/lib/data/mealSwapData";
import { getMealMedia, getFoodItemDetail } from "@/lib/data/mealMedia";
import { MealSwapModal } from "./MealSwapModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Utensils,
  Sparkles,
  Scale,
} from "lucide-react";

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
  const isVeg = media.isVeg ?? (media.dietTier === "Vegetarian" || media.dietTier === "Vegan");

  return (
    <>
      <Card
        variant="elevated"
        padding="none"
        className="group relative overflow-hidden border-border hover:border-accent/40 hover:shadow-card-hover transition-all duration-300 rounded-3xl"
      >
        {/* Visual Header Banner */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-black/90 border-b border-border">
          <img
            src={media.imageUrl}
            alt={meal.name}
            className="w-full h-full object-cover brightness-[0.82] group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Top badges: Index, Veg/Non-Veg, Timing, Swap Button */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center font-mono text-xs font-bold text-accent">
                {index + 1}
              </span>

              {/* Veg / Non-Veg Indicator */}
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

              <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 font-mono text-[10px] text-white uppercase font-bold tracking-wider">
                {meal.timing}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSwapModalOpen(true)}
              className="h-7 px-2.5 text-xs bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-accent font-mono shadow-sm"
            >
              <RefreshCw className="w-3 h-3 mr-1 text-accent" />
              Swap
            </Button>
          </div>

          {/* Bottom Title, Subtitle & Calories */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-base sm:text-lg font-extrabold text-white block leading-tight tracking-tight drop-shadow-sm truncate">
                {meal.name}
              </span>
              {media.hindiName && (
                <span className="text-xs text-accent font-semibold block drop-shadow mt-0.5 truncate">
                  {media.hindiName}
                </span>
              )}
              <div className="flex items-center gap-2 text-[11px] font-mono text-white/80 mt-1">
                <span className="flex items-center gap-1 text-white">
                  <Clock className="w-3 h-3 text-accent" />
                  {media.prepTimeMinutes + media.cookTimeMinutes} mins
                </span>
                <span>&bull;</span>
                <span className="text-white/90">{media.dietTier}</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-accent text-white font-mono text-xs font-black shadow-accent-glow shrink-0">
              {meal.calories} kcal
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Macronutrient Pill Grid */}
          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] text-primary-dim uppercase block font-bold">Protein</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {meal.protein}g
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20">
              <span className="text-[10px] text-primary-dim uppercase block font-bold">Carbs</span>
              <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 mt-0.5 block">
                {meal.carbs}g
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-primary-dim uppercase block font-bold">Fats</span>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">
                {meal.fat}g
              </span>
            </div>
          </div>

          {/* Key Benefits Callout */}
          {media.keyBenefits && (
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border flex items-start gap-2.5 text-xs">
              <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary block text-[11px] uppercase tracking-wider">
                  Key Benefits:
                </span>
                <span className="text-primary-muted font-medium text-xs leading-relaxed mt-0.5 block">
                  {media.keyBenefits}
                </span>
              </div>
            </div>
          )}

          {/* Food Items & Portions with Circular Food Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-primary-dim tracking-wider font-bold">
              <span>Scheduled Items & Portions</span>
              <span>Estimated Portion</span>
            </div>

            <ul className="space-y-2">
              {meal.items.map((item, itemIdx) => {
                const itemDetail = getFoodItemDetail(item.name);
                return (
                  <li
                    key={itemIdx}
                    className="p-2 rounded-2xl bg-surface-elevated border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Circular Food Photo */}
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

          {/* Timing Advice if available */}
          {media.timingAdvice && (
            <div className="p-2.5 rounded-xl bg-surface border border-border flex items-center gap-2 text-xs font-mono text-primary-muted">
              <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-[11px]">{media.timingAdvice}</span>
            </div>
          )}

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
