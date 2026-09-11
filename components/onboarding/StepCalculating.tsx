"use client";

import React, { useState, useEffect } from "react";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { CheckCircle2, CircleDashed } from "lucide-react";

interface StatusStep {
  id: number;
  label: string;
}

const CALCULATION_STEPS: StatusStep[] = [
  { id: 1, label: "Understanding your goal & body baselines" },
  { id: 2, label: "Calculating BMR & energy requirements" },
  { id: 3, label: "Structuring your customized training split" },
  { id: 4, label: "Matching macronutrients to your diet style" },
  { id: 5, label: "Preparing your actionable weekly blueprint" },
];

export function StepCalculating() {
  const { goToStep } = useOnboarding();
  const [completedStepIndex, setCompletedStepIndex] = useState<number>(0);

  useEffect(() => {
    // Sequentially complete each checklist item
    const interval = setInterval(() => {
      setCompletedStepIndex((prev) => {
        if (prev < CALCULATION_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 320); // 320ms per step = ~1.6s total

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (completedStepIndex >= CALCULATION_STEPS.length) {
      const timeout = setTimeout(() => {
        goToStep(7); // Advance to Preview screen
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [completedStepIndex, goToStep]);

  return (
    <div className="max-w-md mx-auto w-full py-12 px-4 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Visual Indicator Ring */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping opacity-30" />
        <div className="w-14 h-14 rounded-full bg-surface-elevated border border-accent/40 flex items-center justify-center text-accent shadow-accent-glow">
          <CircleDashed className="w-7 h-7 animate-spin text-accent" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
          ALGORITHMIC COMPILATION
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Building your blueprint...
        </h2>
        <p className="text-xs sm:text-sm text-primary-muted">
          Synthesizing your metrics into an individualized training and nutrition system.
        </p>
      </div>

      {/* Checklist Card */}
      <div className="w-full rounded-2xl bg-surface border border-border p-5 space-y-3.5 text-left shadow-card">
        {CALCULATION_STEPS.map((step, idx) => {
          const isDone = completedStepIndex > idx;
          const isCurrent = completedStepIndex === idx;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                isDone
                  ? "text-primary font-medium"
                  : isCurrent
                  ? "text-accent font-semibold"
                  : "text-primary-dim opacity-50"
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-accent animate-in zoom-in-50" />
                ) : (
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      isCurrent
                        ? "border-accent animate-pulse"
                        : "border-border-hover bg-surface-elevated"
                    }`}
                  />
                )}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
