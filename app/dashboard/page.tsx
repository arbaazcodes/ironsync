"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { TodayNutritionCard } from "@/components/dashboard/TodayNutritionCard";
import { Metric } from "@/components/ui/Metric";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function DashboardOverviewPage() {
  const { activePlan } = useAuth();

  useEffect(() => {
    if (activePlan) {
      trackEvent("dashboard_viewed", {
        plan_version: activePlan.version,
        goal: activePlan.goal,
      });
    }
  }, [activePlan]);

  if (!activePlan) return null;

  const currentDayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with greeting and status */}
      <DashboardHeader />

      {/* 2. Top Section: Your Fitness Blueprint Summary */}
      <Card variant="elevated" padding="lg" className="border-accent/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/[0.04] blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-border/80 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                YOUR FITNESS BLUEPRINT
              </span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-primary uppercase tracking-tight mt-0.5">
              {activePlan.goal.replace("_", " ")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-primary-dim">
              Frequency:
            </span>
            <Badge variant="subtle" size="sm">
              {activePlan.trainingDays} Training Days / Week
            </Badge>
          </div>
        </div>

        {/* 4 Core Macro Targets from saved plan */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={activePlan.calories.toLocaleString()}
              label="DAILY CALORIES"
              unit="kcal"
              size="md"
              sublabel="Calculated energy target"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={`${activePlan.protein}g`}
              label="PROTEIN"
              size="md"
              sublabel="Muscle repair & synthesis"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={`${activePlan.carbs}g`}
              label="CARBOHYDRATES"
              size="md"
              sublabel="Glycogen & training fuel"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={`${activePlan.fat}g`}
              label="FAT"
              size="md"
              sublabel="Hormone & cell function"
            />
          </div>
        </div>

        {/* Recalibration & Progress Bar */}
        <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-primary-dim">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <span>Active Plan: v{activePlan.version || 1} &bull; Check-in & Recalibration Active</span>
          </div>
          <Link
            href="/dashboard/progress"
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Log Check-in & Track Progress</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </Card>

      {/* 3. Weekly Workout View: reflect user's actual generated plan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Weekly Training Cadence &mdash; {activePlan.splitName}
            </h3>
          </div>
          <Link
            href="/dashboard/workout"
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
          >
            <span>Full Schedule</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Responsive grid matching exact schedule length */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${activePlan.schedule.length >= 7 ? "lg:grid-cols-7" : "lg:grid-cols-5"} gap-2.5`}>
          {activePlan.schedule.map((day, idx) => {
            const isToday = day.dayName.toUpperCase() === currentDayOfWeek;
            const isWorkout = day.type === "workout";

            return (
              <Link
                key={idx}
                href={`/dashboard/workout?day=${idx}`}
                className={`p-3 rounded-xl border flex flex-col justify-between min-h-[96px] transition-all duration-150 hover:border-accent/50 ${
                  isToday
                    ? "bg-accent/[0.06] border-accent/60 shadow-accent-glow"
                    : isWorkout
                    ? "bg-surface border-border/80 text-primary"
                    : "bg-surface-elevated/40 border-border-subtle text-primary-muted"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-xs font-black ${isToday ? "text-accent" : "text-primary"}`}>
                    {day.dayName}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                      isWorkout
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-background/80 text-primary-dim border border-border/40"
                    }`}
                  >
                    {isWorkout ? day.tag || "Workout" : "Rest"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-primary line-clamp-2 leading-snug">
                  {day.focus}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Action Cards: Today's Workout & Today's Nutrition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayWorkoutCard plan={activePlan} />
        <TodayNutritionCard plan={activePlan} />
      </div>
    </div>
  );
}
