"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dumbbell, ArrowRight, CheckCircle2, Clock, Check, Flame } from "lucide-react";
import { SavedPlanData } from "@/lib/supabase/planSync";
import { getExerciseDetails } from "@/lib/data/exerciseDetails";
import { getExerciseMedia, CATEGORY_HERO_IMAGES } from "@/lib/data/exerciseMedia";

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

  // Determine category background image
  let bgImage = CATEGORY_HERO_IMAGES.Default;
  const focusLower = (todayWorkout?.focus || "").toLowerCase();
  if (focusLower.includes("chest") || focusLower.includes("push")) bgImage = CATEGORY_HERO_IMAGES.Chest;
  else if (focusLower.includes("back") || focusLower.includes("pull")) bgImage = CATEGORY_HERO_IMAGES.Back;
  else if (focusLower.includes("leg") || focusLower.includes("lower") || focusLower.includes("quad")) bgImage = CATEGORY_HERO_IMAGES.Legs;
  else if (focusLower.includes("shoulder") || focusLower.includes("press")) bgImage = CATEGORY_HERO_IMAGES.Shoulders;
  else if (focusLower.includes("arm") || focusLower.includes("bicep") || focusLower.includes("tricep")) bgImage = CATEGORY_HERO_IMAGES.Arms;

  return (
    <Card
      variant="elevated"
      padding="none"
      className="relative overflow-hidden border-white/[0.08] group hover:border-accent/40 transition-all duration-300"
    >
      {/* Dynamic Atmospheric Hero Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={bgImage}
          alt="Workout Focus"
          className="w-full h-full object-cover brightness-[0.25] group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Cinematic dark gradient overlays for maximum contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/90 to-[#161616]/75" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 blur-[100px] pointer-events-none rounded-full" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-5 sm:p-7 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-accent backdrop-blur-md shadow-sm">
              <Dumbbell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-extrabold block">
                TODAY &bull; {todayWorkout?.dayName || "MON"}
              </span>
              <span className="text-xs font-mono text-primary-dim">
                {todayWorkout?.tag || "Training"}
              </span>
            </div>
          </div>

          {completed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              Workout completed ✓
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-primary-dim backdrop-blur-sm">
              Est: 55-65 mins
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            {todayWorkout?.focus || "Systemic Training"}
          </h2>
          <p className="text-xs sm:text-sm text-primary-muted mt-1">
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
              const media = getExerciseMedia(item.name);
              const restText = item.rest || `Rest ${details.defaultRest}`;

              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/40 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 hover:border-accent/40 hover:bg-black/60 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={media.thumbnailUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-primary-dim mt-0.5">
                        <span className="text-white font-semibold">{item.setsReps}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-accent">
                          <Clock className="w-3 h-3" />
                          {restText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-primary-dim font-mono border border-white/[0.06]">
                      {media.muscleGroup}
                    </span>
                    {item.rpe && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-mono font-bold">
                        {item.rpe}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {exercises.length > 3 && (
              <p className="text-[11px] font-mono text-primary-dim text-center pt-1">
                + {exercises.length - 3} more exercises scheduled for today
              </p>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-black/40 border border-dashed border-white/10 text-center space-y-2 backdrop-blur-sm">
            <p className="text-xs text-primary-muted">
              {todayWorkout?.type === "recovery"
                ? "Today is a scheduled active recovery day. Focus on hydration and mobility."
                : "Your workout plan hasn't been generated yet."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/[0.08]">
          <button
            onClick={handleToggleComplete}
            className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
              completed
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25 shadow-sm"
                : "bg-surface-elevated text-white border-white/[0.1] hover:border-accent/50 hover:bg-surface-hover"
            }`}
          >
            {completed ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
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
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            className="font-mono text-xs shadow-accent-glow"
          >
            View Full Workout
          </Button>
        </div>
      </div>
    </Card>
  );
}
