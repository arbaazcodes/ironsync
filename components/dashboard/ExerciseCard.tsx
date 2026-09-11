"use client";

import React, { useState } from "react";
import { WorkoutExercise } from "@/lib/types/onboarding";
import { getExerciseDetails } from "@/lib/data/exerciseDetails";
import { getExerciseMedia } from "@/lib/data/exerciseMedia";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Info,
  Flame,
  Activity,
  Zap,
  ChevronDown,
  ChevronUp,
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
  const media = getExerciseMedia(exercise.name);

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
    <div className="group rounded-[20px] bg-card border border-white/[0.08] hover:border-accent/40 hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      {/* Primary Card Body */}
      <div className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Thumbnail & Exercise Metadata */}
        <div
          onClick={handleOpenDetails}
          className="flex items-center gap-3.5 sm:gap-4 cursor-pointer flex-1 w-full sm:w-auto"
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
          {/* Athletic Image Thumbnail with Index Pill */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-surface-elevated shrink-0 border border-white/[0.08] group-hover:border-accent/50 transition-colors">
            {/* Direct HTTPS Unsplash Athletic Visual */}
            <img
              src={media.thumbnailUrl}
              alt={exercise.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center font-mono text-[10px] font-bold text-accent">
              {index + 1}
            </div>
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono font-semibold text-white/80">
              {media.durationMinutes}m
            </div>
          </div>

          {/* Exercise Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/30 text-[10px] font-mono font-bold uppercase tracking-wider text-accent">
                {media.muscleGroup}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-elevated border border-white/[0.06] text-[10px] font-mono text-primary-dim hidden sm:inline">
                {media.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight group-hover:text-accent transition-colors truncate">
                {exercise.name}
              </h3>
            </div>

            {/* Sets, Reps, Rest & Calorie Burn */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-primary-muted">
              <span className="text-white font-bold">{sets}</span>
              <span className="text-primary-dim">&bull;</span>
              <span className="text-white font-bold">{reps}</span>
              <span className="text-primary-dim">&bull;</span>
              <span className="flex items-center gap-1 text-primary-dim">
                <Clock className="w-3 h-3 text-accent" />
                {restDuration}
              </span>
              <span className="text-primary-dim hidden sm:inline">&bull;</span>
              <span className="hidden sm:flex items-center gap-1 text-primary-dim">
                <Flame className="w-3 h-3 text-accent" />
                ~{media.caloriesBurnEstimate} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Right side: RPE Badge, Swap button, and Execution Details button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          {exercise.rpe ? (
            <span className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-accent/40 text-accent font-mono text-xs font-bold shadow-sm">
              {exercise.rpe}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-lg bg-surface-elevated text-primary-dim font-mono text-[11px] border border-white/[0.06]">
              Tempo: {media.tempo}
            </span>
          )}

          {onSwapClick && (
            <button
              onClick={() => onSwapClick(exercise, index)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-elevated border border-white/[0.08] hover:border-accent/40 text-xs font-mono text-primary-muted hover:text-white transition-all focus:ring-2 focus:ring-accent active:scale-95"
              title="Swap for a compatible biomechanical exercise"
            >
              <RefreshCw className="w-3.5 h-3.5 text-accent" />
              <span>Swap</span>
            </button>
          )}

          <button
            onClick={handleOpenDetails}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-white font-mono text-xs font-bold hover:bg-accent-hover transition-all focus:ring-2 focus:ring-accent shadow-sm hover:shadow-accent-glow active:scale-95"
            aria-label={`Open execution guide for ${exercise.name}`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </div>
      </div>

      {/* Fallback inline expandable details (if onDetailClick not provided) */}
      {!onDetailClick && expanded && (
        <div className="p-4 sm:p-5 bg-black/40 border-t border-white/[0.08] space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Target muscles */}
          <div>
            <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block mb-1.5">
              Primary Anatomical Engagement
            </span>
            <div className="flex flex-wrap gap-1.5">
              {media.targetMuscles.map((muscle, mIdx) => (
                <span
                  key={mIdx}
                  className="px-2.5 py-0.5 rounded-md bg-surface-elevated border border-white/[0.08] text-[11px] font-mono text-white"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Execution cue */}
          <div className="p-3.5 rounded-xl bg-accent/[0.06] border border-accent/20 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-accent font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>BIOMECHANICAL FORM CUE</span>
            </div>
            <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
              {exercise.executionCue || details.executionCue}
            </p>
          </div>

          {/* Common mistake */}
          <div className="p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 space-y-1">
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
