"use client";

import React from "react";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { GoalId } from "@/lib/types/onboarding";
import {
  Dumbbell,
  Flame,
  Sparkles,
  Zap,
  Activity,
  HeartPulse,
  CheckCircle2,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface GoalOption {
  id: GoalId;
  title: string;
  description: string;
  icon: React.ElementType;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "muscle_gain",
    title: "Muscle Gain",
    description: "Build muscle, size, and progressive hypertrophy.",
    icon: Dumbbell,
  },
  {
    id: "fat_loss",
    title: "Fat Loss",
    description: "Reduce body fat while preserving metabolically active muscle.",
    icon: Flame,
  },
  {
    id: "recomp",
    title: "Body Recomposition",
    description: "Lose fat while building muscle simultaneously.",
    icon: Sparkles,
  },
  {
    id: "strength",
    title: "Strength",
    description: "Improve raw compound power and CNS force output.",
    icon: Zap,
  },
  {
    id: "posture_mobility",
    title: "Posture & Mobility",
    description: "Improve movement range, structural alignment, and joint longevity.",
    icon: Activity,
  },
  {
    id: "endurance",
    title: "Endurance",
    description: "Improve aerobic conditioning, work capacity, and stamina.",
    icon: HeartPulse,
  },
];

export function StepGoal() {
  const { data, updateData } = useOnboarding();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
          QUESTION 01
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          What&apos;s your primary goal?
        </h1>
        <p className="text-sm sm:text-base text-primary-muted leading-relaxed max-w-xl">
          We&apos;ll use this to shape your training volume, caloric surplus or deficit, and recovery targets.
        </p>
      </div>

      {/* Grid of Selectable Goal Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4"
        role="radiogroup"
        aria-label="Select your primary fitness goal"
      >
        {GOAL_OPTIONS.map((option) => {
          const isSelected = data.goal === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                updateData({ goal: option.id });
                trackEvent("goal_selected", { goal: option.id });
              }}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 group relative flex flex-col justify-between ${
                isSelected
                  ? "bg-surface-elevated border-accent shadow-accent-glow ring-1 ring-accent"
                  : "bg-surface border-border hover:border-border-hover hover:bg-surface-elevated/70"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    isSelected
                      ? "bg-accent/15 border-accent/40 text-accent"
                      : "bg-surface-elevated border-border text-primary-muted group-hover:text-primary group-hover:border-border-hover"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-accent bg-accent text-background"
                      : "border-border-hover bg-surface"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-primary tracking-tight mb-1">
                  {option.title}
                </h2>
                <p className="text-xs text-primary-muted leading-relaxed pretty-text">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
