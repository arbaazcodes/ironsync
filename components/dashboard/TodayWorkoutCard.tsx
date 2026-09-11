"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dumbbell, ArrowRight, CheckCircle2, Clock, Check } from "lucide-react";
import { SavedPlanData } from "@/lib/supabase/planSync";
import { getExerciseDetails } from "@/lib/data/exerciseDetails";

interface TodayWorkoutCardProps {
  plan: SavedPlanData;
}

export function TodayWorkoutCard({ plan }: TodayWorkoutCardProps) {
  // Map current calendar day to 3-letter abbreviation
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const currentDayAbbr = dayNames[new Date().getDay()];

  // Find today's workout, or first scheduled workout if today is rest/not present
  const todayFromSchedule = plan.schedule.find((d) => d.dayName.toUpperCase() === currentDayAbbr);
  const todayWorkout =
    todayFromSchedule && todayFromSchedule.type === "workout"
      ? todayFromSchedule
      : plan.schedule.find((d) => d.type === "workout") || plan.schedule[0];

  const storageKey = `ironsync_completed_${plan.id || "local"}_${todayWorkout?.dayName}`;
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSaved = localStorage.getItem(storageKey);
      if (isSaved === "true") setCompleted(true);
    }
  }, [storageKey]);

  const handleToggleComplete = () => {
    const nextState = !completed;
    setCompleted(nextState);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, String(nextState));
    }
  };

  const exercises = todayWorkout?.exercises || [];

  return (
    <Card variant="elevated" padding="md" className="space-y-5 border-border/80 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
            <Dumbbell className="w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold block">
              TODAY &bull; {todayWorkout?.dayName || "MON"}
            </span>
            <span className="text-xs font-mono text-primary-dim">
              {todayWorkout?.tag || "Training"}
            </span>
          </div>
        </div>

        {completed ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
            <Check className="w-3.5 h-3.5" />
            Workout completed ✓
          </span>
        ) : (
          <span className="text-xs font-mono text-primary-dim">
            Estimated: 60 mins
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight uppercase">
          {todayWorkout?.focus || "Systemic Training"}
        </h2>
        <p className="text-xs text-primary-muted mt-0.5">
          {todayWorkout?.type === "workout"
            ? "Progressive tension overload & controlled tempo cadence."
            : "Active tissue decompression and mobility focus."}
        </p>
      </div>

      {/* Exercise list */}
      {todayWorkout?.type === "workout" && exercises.length > 0 ? (
        <div className="space-y-2.5">
          {exercises.slice(0, 3).map((item, idx) => {
            const details = getExerciseDetails(item.name);
            const restText = item.rest || `Rest ${details.defaultRest}`;

            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors hover:border-border-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-mono text-accent font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-primary">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-primary-dim mt-0.5">
                      <span className="text-primary-muted font-semibold">{item.setsReps}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-accent">
                        <Clock className="w-3 h-3" />
                        {restText}
                      </span>
                    </div>
                  </div>
                </div>

                {item.rpe && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-accent border border-border/50 font-mono self-start sm:self-center">
                    {item.rpe}
                  </span>
                )}
              </div>
            );
          })}
          {exercises.length > 3 && (
            <p className="text-[11px] font-mono text-primary-dim text-center">
              + {exercises.length - 3} more exercises scheduled for today
            </p>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-surface border border-dashed border-border text-center space-y-2">
          <p className="text-xs text-primary-muted">
            {todayWorkout?.type === "recovery"
              ? "Today is a scheduled active recovery day. Focus on hydration and mobility."
              : "Your workout plan hasn't been generated yet."}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/60">
        <button
          onClick={handleToggleComplete}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all ${
            completed
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-surface-elevated text-primary-muted border-border hover:text-primary hover:border-accent/40"
          }`}
        >
          {completed ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Workout completed ✓</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>Mark Workout Complete</span>
            </>
          )}
        </button>

        <Button
          href="/dashboard/workout"
          variant="secondary"
          size="sm"
          icon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Full Workout
        </Button>
      </div>
    </Card>
  );
}
