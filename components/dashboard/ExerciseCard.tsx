"use client";

import React, { useState } from "react";
import { WorkoutExercise } from "@/lib/types/onboarding";
import { getExerciseDetails } from "@/lib/data/exerciseDetails";
import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Info,
} from "lucide-react";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  onSwapClick?: (exercise: WorkoutExercise, index: number) => void;
  onDetailClick?: (exercise: WorkoutExercise, index: number) => void;
}

export function ExerciseCard({
  exercise,
  index,
  onSwapClick,
  onDetailClick,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const details = getExerciseDetails(exercise.name);

  // Parse sets and reps from setsReps (e.g. "4 × 8-10")
  const parts = exercise.setsReps.split("×").map((s) => s.trim());
  const sets = parts[0] ? `${parts[0]} Sets` : "3-4 Sets";
  const reps = parts[1] ? `${parts[1]} Reps` : "8-12 Reps";
  const restDuration = exercise.rest || details.defaultRest;

  const handleOpenDetails = () => {
    if (onDetailClick) {
      onDetailClick(exercise, index);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="rounded-xl bg-surface border border-border/75 transition-all duration-200 hover:border-border-hover overflow-hidden">
      {/* Primary compact summary row */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          onClick={handleOpenDetails}
          className="flex items-start sm:items-center gap-3.5 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenDetails();
            }
          }}
          aria-label={`View execution guide for ${exercise.name}`}
        >
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border group-hover:border-accent/50 flex items-center justify-center font-mono text-xs font-bold text-accent shrink-0 mt-0.5 sm:mt-0 transition-colors">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-bold text-primary tracking-tight group-hover:text-accent transition-colors">
                {exercise.name}
              </h3>
              <span className="text-[10px] font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                &bull; View Guide &rarr;
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-primary-dim">
              <span className="text-primary-muted font-semibold">{sets}</span>
              <span>&bull;</span>
              <span className="text-primary-muted font-semibold">{reps}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-primary-dim">
                <Clock className="w-3 h-3 text-accent" />
                {restDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: RPE, Swap button, and Execution Details button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 self-stretch sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
          {exercise.rpe ? (
            <span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold">
              {exercise.rpe}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-surface-elevated text-primary-dim font-mono text-[11px] border border-border/40">
              Form Focus
            </span>
          )}

          {onSwapClick && (
            <button
              onClick={() => onSwapClick(exercise, index)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-accent/40 text-xs font-mono text-primary-dim hover:text-accent transition-colors focus:ring-2 focus:ring-accent"
              title="Swap for a compatible exercise"
            >
              <RefreshCw className="w-3.5 h-3.5 text-accent" />
              <span>Swap</span>
            </button>
          )}

          <button
            onClick={handleOpenDetails}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-accent/50 text-xs font-mono text-primary-muted hover:text-primary transition-colors focus:ring-2 focus:ring-accent"
            aria-label={`Open execution guide for ${exercise.name}`}
          >
            <Info className="w-3.5 h-3.5 text-accent" />
            <span>Guide</span>
          </button>
        </div>
      </div>

      {/* Fallback inline expandable details (if onDetailClick not used) */}
      {!onDetailClick && expanded && (
        <div className="p-4 sm:p-5 bg-background/50 border-t border-border/60 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Target muscles */}
          <div>
            <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block mb-1.5">
              Primary Muscle Engagement
            </span>
            <div className="flex flex-wrap gap-1.5">
              {details.primaryMuscles.map((muscle, mIdx) => (
                <span
                  key={mIdx}
                  className="px-2.5 py-0.5 rounded-md bg-surface border border-border text-[11px] font-medium text-primary"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Execution cue */}
          <div className="p-3.5 rounded-xl bg-accent/[0.04] border border-accent/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-accent font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>BIOMECHANICAL FORM CUE</span>
            </div>
            <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
              {exercise.executionCue || details.executionCue}
            </p>
          </div>

          {/* Common mistake */}
          <div className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>COMMON TECHNICAL ERROR TO AVOID</span>
            </div>
            <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
              {exercise.commonMistake || details.commonMistake}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
