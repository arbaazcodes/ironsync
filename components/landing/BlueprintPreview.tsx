"use client";

import React, { useState } from "react";
import { Metric } from "@/components/ui/Metric";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Calendar, Dumbbell, Flame, CheckCircle2 } from "lucide-react";

type GoalType = "muscle_gain" | "fat_loss" | "recomp";

interface BlueprintData {
  goalLabel: string;
  calories: string;
  protein: string;
  split: string;
  schedule: Array<{
    day: string;
    focus: string;
    type: "workout" | "recovery";
    tag: string;
  }>;
}

const BLUEPRINT_PRESETS: Record<GoalType, BlueprintData> = {
  muscle_gain: {
    goalLabel: "MUSCLE GAIN",
    calories: "2,640",
    protein: "165g",
    split: "5 DAY",
    schedule: [
      { day: "MON", focus: "Chest & Triceps", type: "workout", tag: "Push A" },
      { day: "TUE", focus: "Back & Biceps", type: "workout", tag: "Pull A" },
      { day: "WED", focus: "Active Recovery", type: "recovery", tag: "Mobility" },
      { day: "THU", focus: "Shoulders & Arms", type: "workout", tag: "Upper B" },
      { day: "FRI", focus: "Quads & Hamstrings", type: "workout", tag: "Legs A" },
    ],
  },
  fat_loss: {
    goalLabel: "FAT LOSS",
    calories: "2,150",
    protein: "175g",
    split: "4 DAY",
    schedule: [
      { day: "MON", focus: "Upper Body Power", type: "workout", tag: "Upper" },
      { day: "TUE", focus: "Lower Body & Core", type: "workout", tag: "Lower" },
      { day: "WED", focus: "Low Impact Cardio", type: "recovery", tag: "Zone 2" },
      { day: "THU", focus: "Full Body Density", type: "workout", tag: "Full Body" },
      { day: "FRI", focus: "Sprint Intervals & Core", type: "workout", tag: "Conditioning" },
    ],
  },
  recomp: {
    goalLabel: "ATHLETIC RECOMP",
    calories: "2,420",
    protein: "170g",
    split: "5 DAY",
    schedule: [
      { day: "MON", focus: "Compound Strength", type: "workout", tag: "Strength" },
      { day: "TUE", focus: "Hypertrophy Pull", type: "workout", tag: "Volume" },
      { day: "WED", focus: "Dynamic Mobility", type: "recovery", tag: "Recovery" },
      { day: "THU", focus: "Speed & Power Press", type: "workout", tag: "Athletic" },
      { day: "FRI", focus: "Posterior Chain", type: "workout", tag: "Legs" },
    ],
  },
};

export function BlueprintPreview() {
  const [activeGoal, setActiveGoal] = useState<GoalType>("muscle_gain");
  const data = BLUEPRINT_PRESETS[activeGoal];

  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Subtle outer glow backdrop */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-accent/20 via-emerald-600/10 to-teal-500/20 rounded-3xl blur-xl opacity-40 pointer-events-none" />

      {/* Main Blueprint Terminal Card */}
      <div className="relative rounded-2xl bg-surface border border-border shadow-2xl p-5 sm:p-7 overflow-hidden">
        {/* Top bar with system status */}
        <div className="flex items-center justify-between pb-5 border-b border-border/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-subtle" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary-muted">
              YOUR FITNESS BLUEPRINT
            </span>
          </div>
          <Badge variant="accent" size="sm" dot>
            {data.goalLabel}
          </Badge>
        </div>

        {/* Goal switcher tabs (subtle interaction) */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-1.5 p-1 bg-surface-elevated rounded-xl border border-border-subtle">
            {(
              [
                { id: "muscle_gain", label: "Muscle Gain" },
                { id: "fat_loss", label: "Fat Loss" },
                { id: "recomp", label: "Recomp" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGoal(tab.id)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeGoal === tab.id
                    ? "bg-surface-hover text-accent font-semibold shadow-sm border border-border/50"
                    : "text-primary-dim hover:text-primary-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 py-5 border-b border-border/70">
          <div className="p-3 sm:p-4 rounded-xl bg-surface-elevated/70 border border-border/50">
            <Metric
              value={data.calories}
              label="DAILY CALORIES"
              size="sm"
              sublabel="Target range"
            />
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-surface-elevated/70 border border-border/50">
            <Metric
              value={data.protein}
              label="PROTEIN TARGET"
              size="sm"
              sublabel="1.8g / kg"
            />
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-surface-elevated/70 border border-border/50">
            <Metric
              value={data.split}
              label="TRAINING SPLIT"
              size="sm"
              sublabel="Per week"
            />
          </div>
        </div>

        {/* Weekly Workout Preview Schedule */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary-muted">
                Weekly Cadence
              </span>
            </div>
            <span className="text-[11px] text-primary-dim">Optimized for recovery</span>
          </div>

          <div className="space-y-2">
            {data.schedule.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-colors ${
                  item.type === "recovery"
                    ? "bg-surface-elevated/30 border-border-subtle text-primary-muted"
                    : "bg-surface-elevated border-border/70 hover:border-border-hover text-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-accent w-8 shrink-0">
                    {item.day}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.type === "workout" ? (
                      <Dumbbell className="w-3.5 h-3.5 text-primary-dim shrink-0" />
                    ) : (
                      <Flame className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-medium tracking-tight">
                      {item.focus}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-background/60 border border-border/40 text-primary-dim">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Realistic Footer Detail */}
        <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-primary-dim font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            Metabolic adjustment active
          </span>
          <span>Adaptive v2.4</span>
        </div>
      </div>
    </div>
  );
}
