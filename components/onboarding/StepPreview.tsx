"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { useAuth } from "@/lib/context/AuthContext";
import { generateBlueprint } from "@/lib/engine";
import { Metric } from "@/components/ui/Metric";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Sparkles,
  Lock,
  ArrowRight,
  Dumbbell,
  Flame,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { cachePendingBlueprint, syncPendingBlueprintToDatabase } from "@/lib/supabase/planSync";
import { trackEvent } from "@/lib/analytics";

export function StepPreview() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, calculatedBlueprint } = useOnboarding();
  const [isSaving, setIsSaving] = useState(false);

  // Fallback if accessed directly
  const blueprint = calculatedBlueprint || generateBlueprint(data);

  useEffect(() => {
    cachePendingBlueprint(data, blueprint);
    trackEvent("blueprint_preview_viewed", { goal: data.goal });
  }, [data, blueprint]);

  const handleUnlock = async () => {
    trackEvent("auth_started", { source: "preview_unlock_cta" });
    if (user) {
      setIsSaving(true);
      try {
        await syncPendingBlueprintToDatabase(
          user.id,
          user.user_metadata?.full_name || user.email?.split("@")[0]
        );
      } catch (err) {
        console.warn("Could not sync blueprint to Supabase:", err);
      }
      router.push("/dashboard");
    } else {
      router.push("/login?next=/dashboard");
    }
  };

  const goalTitleMap: Record<string, string> = {
    muscle_gain: "Muscle Gain",
    fat_loss: "Fat Loss",
    recomp: "Body Recomposition",
    strength: "Strength & Power",
    posture_mobility: "Posture & Mobility",
    endurance: "Aerobic Conditioning",
  };

  const goalName = data.goal ? goalTitleMap[data.goal] : "Personalized";
  const firstWorkoutDay = blueprint.schedule.find((d) => d.type === "workout");

  return (
    <div className="space-y-10 py-4 animate-in fade-in slide-in-from-bottom-3 duration-300 pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="accent" size="md" dot>
          CALCULATED & READY
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
          Your blueprint is ready.
        </h1>
        <p className="text-sm sm:text-base text-primary-muted max-w-lg mx-auto">
          Calculated for <span className="text-primary font-semibold">{goalName}</span>, your{" "}
          <span className="text-primary font-semibold">{data.weightKg || 75} kg</span> baseline, and a{" "}
          <span className="text-primary font-semibold">{data.daysPerWeek}-day</span> weekly commitment.
        </p>
      </div>

      {/* 1. Core Target Metrics Card */}
      <Card variant="elevated" padding="lg" className="border-accent/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/[0.04] blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border/80 gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              YOUR STARTING TARGET
            </span>
          </div>
          <span className="text-xs font-mono text-primary-dim">
            TDEE ~{blueprint.tdee} kcal &bull; Baseline BMR {blueprint.bmr} kcal
          </span>
        </div>

        {/* 4 Key Macro Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={blueprint.macros.calories.toLocaleString()}
              label="DAILY CALORIES"
              unit="kcal"
              size="md"
              sublabel="Calculated target"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={`${blueprint.macros.protein}g`}
              label="DAILY PROTEIN"
              size="md"
              sublabel="Goal-scaled target"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={`${blueprint.macros.carbs}g`}
              label="CARBOHYDRATES"
              size="md"
              sublabel="Energy & recovery"
            />
          </div>
          <div className="p-4 rounded-xl bg-surface border border-border/60">
            <Metric
              value={`${blueprint.macros.fat}g`}
              label="ESSENTIAL FATS"
              size="md"
              sublabel="Hormone synthesis"
            />
          </div>
        </div>

        {/* Strategy note */}
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-primary-muted gap-2 font-mono">
          <span className="text-primary-dim">Strategy:</span>
          <span className="text-accent">{blueprint.dietStrategyNotes}</span>
        </div>
      </Card>

      {/* 2. Training Plan Schedule */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-primary">
              {data.daysPerWeek} DAY TRAINING PLAN &mdash; {blueprint.splitName}
            </h2>
          </div>
          <span className="text-xs font-mono text-primary-dim">
            {data.sessionDuration}m sessions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {blueprint.schedule.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                day.type === "workout"
                  ? "bg-surface border-border/80 text-primary"
                  : "bg-surface-elevated/40 border-border-subtle text-primary-muted"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-black text-accent">
                  {day.dayName}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background/80 border border-border/40 text-primary-dim">
                  {day.tag}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-primary">{day.focus}</p>
                <p className="text-[11px] text-primary-dim mt-0.5">
                  {day.type === "workout" ? "Resistance Session" : "Active Reset"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Locked Value Preview (Curiosity Teaser) */}
      {firstWorkoutDay && firstWorkoutDay.exercises && (
        <Card variant="elevated" padding="md" className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-accent" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                SESSION SAMPLE &mdash; {firstWorkoutDay.dayName} ({firstWorkoutDay.focus})
              </span>
            </div>
            <span className="text-[11px] font-mono text-accent">Preview Sample</span>
          </div>

          <div className="space-y-2.5">
            {firstWorkoutDay.exercises.map((exercise, idx) => {
              if (exercise.locked) {
                return (
                  <div
                    key={idx}
                    className="relative p-3.5 rounded-xl border border-dashed border-border/60 bg-surface/40 flex items-center justify-between overflow-hidden select-none"
                  >
                    <div className="filter blur-[5px] flex items-center justify-between w-full opacity-60">
                      <span className="text-xs font-medium text-primary">
                        Secret Heavy Loading Exercise #{idx + 1}
                      </span>
                      <span className="text-xs font-mono text-primary-dim">
                        4 sets &times; 10 reps
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-primary-dim text-xs font-mono bg-background/60">
                      <Lock className="w-3.5 h-3.5 text-accent" />
                      <span>Unlocked with full plan</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface border border-border/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-mono text-accent">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-primary">
                      {exercise.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-primary-muted">
                    <span>{exercise.setsReps}</span>
                    {exercise.rpe && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-accent border border-border/60">
                        {exercise.rpe}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-primary-dim font-mono pt-1">
            + 4 additional full-session daily routines included in complete blueprint.
          </p>
        </Card>
      )}

      {/* 4. Unlock Blueprint Call to Action */}
      <div className="rounded-3xl bg-gradient-to-b from-surface-elevated to-surface border border-accent/40 p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <div className="max-w-xl mx-auto space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-accent/40 flex items-center justify-center text-accent mx-auto shadow-accent-glow">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Unlock Your Complete Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
              Save your plan, access the full workout and nutrition breakdown,
              and download your personalized blueprint.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center justify-center gap-3">
            <Button
              onClick={handleUnlock}
              disabled={isSaving}
              variant="primary"
              size="lg"
              icon={isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto px-8 py-4 font-bold text-base shadow-accent-glow"
            >
              {isSaving ? "Saving Your Plan..." : "Unlock My Blueprint"}
            </Button>

            <Link
              href={user ? "/dashboard" : "/login?next=/dashboard"}
              className="text-xs font-mono text-primary-dim hover:text-accent transition-colors underline underline-offset-4 pt-1"
            >
              Skip to Dashboard without saving &rarr;
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs font-mono text-primary-dim pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Instant Access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              100% Tailored
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
