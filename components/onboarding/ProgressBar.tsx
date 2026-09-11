import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

export function ProgressBar({
  currentStep,
  totalSteps = 6,
  className,
}: ProgressBarProps) {
  // Cap visual progress between 10% and 100%
  const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
  const percentage = Math.round((clampedStep / totalSteps) * 100);

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-primary-dim">
        <span>Step {clampedStep} of {totalSteps}</span>
        <span className="text-accent">{percentage}%</span>
      </div>
      <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden border border-border-subtle">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-accent rounded-full transition-all duration-300 ease-out shadow-accent-glow"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
