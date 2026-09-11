"use client";

import React from "react";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { DeliverableId } from "@/lib/types/onboarding";
import { Dumbbell, Utensils, Sparkles, Moon, Check } from "lucide-react";

export function StepDeliverables() {
  const { data, updateData } = useOnboarding();

  const deliverableOptions: {
    id: DeliverableId;
    title: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "workout",
      title: "Workout Blueprint",
      description: "Exercise selection, sets, reps, and weekly training schedule tailored to your equipment.",
      icon: Dumbbell,
    },
    {
      id: "nutrition",
      title: "Nutrition Blueprint",
      description: "Daily calorie budget, protein and macro distribution, meal timing, and food swap matrix.",
      icon: Utensils,
    },
    {
      id: "supplements",
      title: "Supplement Guide",
      description: "Evidence-based, high-ROI supplementation protocols (creatine, whey, omega-3, vitamin D).",
      icon: Sparkles,
    },
    {
      id: "recovery",
      title: "Recovery Protocol",
      description: "Target sleep windows, hydration formulas, active rest days, and nervous system reset habits.",
      icon: Moon,
    },
  ];

  const toggleDeliverable = (id: DeliverableId) => {
    if (data.deliverables.includes(id)) {
      // Keep at least one selected
      if (data.deliverables.length > 1) {
        updateData({
          deliverables: data.deliverables.filter((item) => item !== id),
        });
      }
    } else {
      updateData({ deliverables: [...data.deliverables, id] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
          QUESTION 05
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          What should we build for you?
        </h1>
        <p className="text-sm sm:text-base text-primary-muted leading-relaxed max-w-xl">
          Choose everything you want included in your personalized system.
        </p>
      </div>

      {/* Multi-select Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {deliverableOptions.map((opt) => {
          const isSelected = data.deliverables.includes(opt.id);
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleDeliverable(opt.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? "bg-surface-elevated border-accent shadow-accent-glow ring-1 ring-accent"
                  : "bg-surface border-border hover:border-border-hover text-primary-muted hover:text-primary"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    isSelected
                      ? "bg-accent/15 border-accent/40 text-accent"
                      : "bg-surface-elevated border-border text-primary-muted group-hover:text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-accent bg-accent text-background"
                      : "border-border-hover bg-surface"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-primary tracking-tight mb-1">
                  {opt.title}
                </h3>
                <p className="text-xs text-primary-muted leading-relaxed pretty-text">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
