"use client";

import React, { useState } from "react";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { BudgetTier, DietType } from "@/lib/types/onboarding";
import { Check, Plus, X } from "lucide-react";

export function StepNutrition() {
  const { data, updateData } = useOnboarding();
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const dietOptions: { id: DietType; label: string; desc: string }[] = [
    {
      id: "vegetarian",
      label: "Vegetarian",
      desc: "Plant foods, dairy, legumes, and paneer.",
    },
    {
      id: "eggetarian",
      label: "Eggetarian",
      desc: "Vegetarian staples + whole eggs & egg whites.",
    },
    {
      id: "non_vegetarian",
      label: "Non-Vegetarian",
      desc: "Poultry, fish, meats, eggs, and dairy.",
    },
    {
      id: "vegan",
      label: "Vegan",
      desc: "100% plant-derived nutrition without animal products.",
    },
  ];

  const budgetOptions: { id: BudgetTier; symbol: string; label: string; desc: string }[] = [
    {
      id: "budget",
      symbol: "₹",
      label: "Budget-Conscious",
      desc: "High-value whole foods (eggs, soy, lentils, rice, oats).",
    },
    {
      id: "balanced",
      symbol: "₹₹",
      label: "Balanced",
      desc: "Mix of staple groceries with selective premium sources.",
    },
    {
      id: "flexible",
      symbol: "₹₹₹",
      label: "Flexible",
      desc: "Emphasis on convenience, specialty cuts, and premium items.",
    },
  ];

  const commonAllergies = ["Peanuts", "Dairy", "Gluten", "Eggs", "Shellfish", "Soy"];

  const toggleAllergy = (tag: string) => {
    if (data.allergies.includes(tag)) {
      updateData({ allergies: data.allergies.filter((t) => t !== tag) });
    } else {
      updateData({ allergies: [...data.allergies, tag] });
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTagInput.trim() && !data.allergies.includes(customTagInput.trim())) {
      updateData({ allergies: [...data.allergies, customTagInput.trim()] });
      setCustomTagInput("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
          QUESTION 04
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          Let&apos;s build around the food you actually eat.
        </h1>
        <p className="text-sm sm:text-base text-primary-muted leading-relaxed max-w-xl">
          Dietary compliance drives 90% of body transformation. We never prescribe foods you dislike or can&apos;t access.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Diet Type */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
            Dietary Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dietOptions.map((opt) => {
              const isSelected = data.dietType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateData({ dietType: opt.id })}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-surface-elevated border-accent text-primary shadow-accent-glow ring-1 ring-accent"
                      : "bg-surface border-border hover:border-border-hover text-primary-muted hover:text-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-primary">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-accent stroke-[3]" />}
                  </div>
                  <p className="text-xs text-primary-dim">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Meals Per Day & Grocery Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Meals Per Day */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
                Meals Per Day
              </label>
              <span className="text-xs font-mono text-accent">
                {data.mealsPerDay} meals
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map((m) => {
                const isSelected = data.mealsPerDay === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateData({ mealsPerDay: m })}
                    className={`py-3 rounded-xl border text-sm font-bold font-mono transition-all duration-200 ${
                      isSelected
                        ? "bg-accent text-background border-accent shadow-accent-glow"
                        : "bg-surface text-primary border-border hover:border-border-hover hover:bg-surface-elevated"
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                  >
                    {m === 5 ? "5+ meals" : `${m} meals`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grocery Budget */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
              Grocery Budget
            </label>
            <div className="grid grid-cols-3 gap-2">
              {budgetOptions.map((b) => {
                const isSelected = data.budget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateData({ budget: b.id })}
                    className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-surface-elevated text-accent border-accent shadow-accent-glow"
                        : "bg-surface text-primary-muted border-border hover:border-border-hover hover:text-primary"
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                  >
                    <span className="font-mono text-sm font-bold">{b.symbol}</span>
                    <span className="text-[10px] font-semibold mt-0.5">{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Food Restrictions / Allergies (Optional) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
              Food Restrictions / Allergies (Optional)
            </label>
            <span className="text-[11px] text-primary-dim">Optional</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {commonAllergies.map((allergy) => {
              const isSelected = data.allergies.includes(allergy);
              return (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => toggleAllergy(allergy)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-accent/15 border-accent text-accent font-semibold"
                      : "bg-surface border-border text-primary-muted hover:border-border-hover hover:text-primary"
                  }`}
                >
                  {allergy}
                  {isSelected && " ✓"}
                </button>
              );
            })}

            {/* Custom user tags */}
            {data.allergies
              .filter((a) => !commonAllergies.includes(a))
              .map((custom) => (
                <span
                  key={custom}
                  className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent text-accent text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  {custom}
                  <button
                    type="button"
                    onClick={() => toggleAllergy(custom)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

            {/* Add Custom Button */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="px-3 py-1.5 rounded-full border border-dashed border-border hover:border-border-hover text-primary-dim hover:text-primary text-xs font-mono inline-flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add restriction
              </button>
            ) : (
              <form onSubmit={handleAddCustom} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="e.g. Seafood"
                  autoFocus
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-accent text-xs text-primary outline-none"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-accent text-background text-xs font-bold rounded-lg"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="p-1 text-primary-dim hover:text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
