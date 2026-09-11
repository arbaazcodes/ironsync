"use client";

import React, { useState } from "react";
import { Metric } from "@/components/ui/Metric";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Calendar, Dumbbell, Flame, CheckCircle2, Zap } from "lucide-react";

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
    goalLabel: "HYPERTROPHY & MASS",
    calories: "2,750",
    protein: "175g",
    split: "5 DAY",
    schedule: [
      { day: "MON", focus: "Incline Press & Pec Flyes", type: "workout", tag: "Push A" },
      { day: "TUE", focus: "Barbell Rows & Lat Pulldowns", type: "workout", tag: "Pull A" },
      { day: "WED", focus: "Active Tissue Reset & Mobility", type: "recovery", tag: "Mobility" },
      { day: "THU", focus: "Overhead Press & Lateral Raises", type: "workout", tag: "Upper B" },
      { day: "FRI", focus: "Back Squats & Romanian Deadlifts", type: "workout", tag: "Legs A" },
    ],
  },
  fat_loss: {
    goalLabel: "AGGRESSIVE SHRED",
    calories: "2,150",
    protein: "185g",
    split: "4 DAY",
    schedule: [
      { day: "MON", focus: "Upper Kinetic Density", type: "workout", tag: "Upper" },
      { day: "TUE", focus: "Lower Posterior Chain & Core", type: "workout", tag: "Lower" },
      { day: "WED", focus: "Zone 2 Cardiovascular Aerobic", type: "recovery", tag: "Zone 2" },
      { day: "THU", focus: "Full Body Barbell Complex", type: "workout", tag: "Full Body" },
      { day: "FRI", focus: "Sprint Intervals & Core Lockdown", type: "workout", tag: "Conditioning" },
    ],
  },
  recomp: {
    goalLabel: "ATHLETIC RECOMP",
    calories: "2,450",
    protein: "180g",
    split: "5 DAY",
    schedule: [
      { day: "MON", focus: "Compound Heavy Strength", type: "workout", tag: "Strength" },
      { day: "TUE", focus: "Volume Pull & Biceps", type: "workout", tag: "Volume" },
      { day: "WED", focus: "Thoracic & Hip Mobility", type: "recovery", tag: "Recovery" },
      { day: "THU", focus: "Speed Press & Triceps", type: "workout", tag: "Athletic" },
      { day: "FRI", focus: "Deadlift Density & Quads", type: "workout", tag: "Legs" },
    ],
  },
};

export function BlueprintPreview() {
  const [activeGoal, setActiveGoal] = useState<GoalType>("muscle_gain");
  const data = BLUEPRINT_PRESETS[activeGoal];

  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Ferrari Red outer ambient glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-accent/25 via-accent/10 to-transparent rounded-[32px] blur-2xl opacity-60 pointer-events-none" />

      {/* Main Blueprint Terminal Card */}
      <div className="relative rounded-[28px] bg-card border border-white/[0.1] shadow-2xl p-5 sm:p-7 overflow-hidden group hover:border-accent/40 transition-colors duration-300">
        {/* Subtle red corner spotlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 blur-[60px] pointer-events-none rounded-full" />

        {/* Top bar with system status */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,30,30,0.9)] animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
              IRONSYNC BLUEPRINT ENGINE
            </span>
          </div>
          <Badge variant="accent" size="sm" dot>
            {data.goalLabel}
          </Badge>
        </div>

        {/* Goal switcher tabs */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-1.5 p-1 bg-surface-elevated rounded-2xl border border-white/[0.06]">
            {(
              [
                { id: "muscle_gain", label: "Hypertrophy" },
                { id: "fat_loss", label: "Shred" },
                { id: "recomp", label: "Recomp" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGoal(tab.id)}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all duration-200 ${
                  activeGoal === tab.id
                    ? "bg-accent text-white shadow-accent-glow"
                    : "text-primary-muted hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-5 border-b border-white/[0.08]">
          <div className="p-3 sm:p-4 rounded-2xl bg-surface-elevated border border-white/[0.06] text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary-dim block">
              Daily Target
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block mt-0.5">
              {data.calories}
            </span>
            <span className="text-[10px] font-mono text-accent block mt-0.5">
              KCAL / DAY
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-surface-elevated border border-white/[0.06] text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary-dim block">
              Protein Intake
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-accent font-mono block mt-0.5">
              {data.protein}
            </span>
            <span className="text-[10px] font-mono text-primary-dim block mt-0.5">
              1.8 - 2.2g / KG
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-surface-elevated border border-white/[0.06] text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary-dim block">
              Training Split
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block mt-0.5">
              {data.split}
            </span>
            <span className="text-[10px] font-mono text-primary-dim block mt-0.5">
              CADENCE
            </span>
          </div>
        </div>

        {/* Weekly Workout Preview Schedule */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Periodized Schedule
              </span>
            </div>
            <span className="text-[11px] font-mono text-accent">Auto-Adapting</span>
          </div>

          <div className="space-y-2">
            {data.schedule.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all ${
                  item.type === "recovery"
                    ? "bg-surface-elevated/40 border-white/[0.04] text-primary-muted"
                    : "bg-surface-elevated border-white/[0.08] hover:border-accent/40 text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-accent w-8 shrink-0">
                    {item.day}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.type === "workout" ? (
                      <Dumbbell className="w-3.5 h-3.5 text-white/80 shrink-0" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-accent shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-semibold tracking-tight">
                      {item.focus}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-primary-dim">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Realistic Footer Detail */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-primary-dim font-mono">
          <span className="flex items-center gap-1.5 text-white/90">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
            Biomechanical Engine Active
          </span>
          <span className="text-accent">Precision v2.4</span>
        </div>
      </div>
    </div>
  );
}
