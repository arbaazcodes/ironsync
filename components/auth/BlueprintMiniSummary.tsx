"use client";

import React, { useEffect, useState } from "react";
import { getPendingBlueprint, getCachedActivePlan } from "@/lib/supabase/planSync";
import { Flame, Dumbbell, Sparkles, CheckCircle2 } from "lucide-react";

export function BlueprintMiniSummary() {
  const [metrics, setMetrics] = useState({
    calories: "2,640",
    protein: "165g",
    split: "5-day training",
    goal: "Muscle Gain",
  });

  useEffect(() => {
    const pending = getPendingBlueprint();
    if (pending) {
      const goalLabels: Record<string, string> = {
        muscle_gain: "Muscle Gain",
        fat_loss: "Fat Loss",
        recomp: "Body Recomposition",
        strength: "Strength & Power",
        posture_mobility: "Posture & Mobility",
        endurance: "Endurance",
      };

      setMetrics({
        calories: pending.blueprint.macros.calories.toLocaleString(),
        protein: `${pending.blueprint.macros.protein}g`,
        split: `${pending.data.daysPerWeek || 5}-day training`,
        goal: pending.data.goal ? goalLabels[pending.data.goal] || "Custom Goal" : "Custom Goal",
      });
    } else {
      const cached = getCachedActivePlan();
      if (cached) {
        setMetrics({
          calories: cached.calories.toLocaleString(),
          protein: `${cached.protein}g`,
          split: `${cached.trainingDays}-day training`,
          goal: cached.goal,
        });
      }
    }
  }, []);

  return (
    <div className="rounded-2xl bg-surface border border-accent/30 p-5 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-2xl rounded-full pointer-events-none" />

      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-border/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-subtle" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent">
            YOUR BLUEPRINT IS READY
          </span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-primary border border-border/50">
          {metrics.goal}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-left">
        <div className="p-2.5 rounded-xl bg-surface-elevated/70 border border-border/50">
          <span className="text-[10px] font-mono uppercase text-primary-dim block">Calories</span>
          <span className="text-base sm:text-lg font-extrabold text-primary tabular-nums">
            {metrics.calories}
          </span>
          <span className="text-[10px] text-primary-muted block">kcal / day</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-elevated/70 border border-border/50">
          <span className="text-[10px] font-mono uppercase text-primary-dim block">Protein</span>
          <span className="text-base sm:text-lg font-extrabold text-accent tabular-nums">
            {metrics.protein}
          </span>
          <span className="text-[10px] text-primary-muted block">Daily target</span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-elevated/70 border border-border/50">
          <span className="text-[10px] font-mono uppercase text-primary-dim block">Split</span>
          <span className="text-xs sm:text-sm font-bold text-primary mt-1 block">
            {metrics.split}
          </span>
          <span className="text-[10px] text-primary-dim block">Customized</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-primary-dim">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
          Plan calculated
        </span>
        <span>Awaiting account link</span>
      </div>
    </div>
  );
}
