"use client";

import React, { useEffect } from "react";
import { WorkoutExercise } from "@/lib/types/onboarding";
import {
  getExerciseAlternatives,
  ExerciseMetadata,
  inferMovementPattern,
} from "@/lib/data/exerciseSwapData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  X,
  RefreshCw,
  Dumbbell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
} from "lucide-react";

interface ExerciseSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExercise: WorkoutExercise;
  userEquipment?: string | null;
  userExperience?: string | null;
  onSelectSwap: (newExercise: WorkoutExercise) => void;
}

export function ExerciseSwapModal({
  isOpen,
  onClose,
  currentExercise,
  userEquipment,
  userExperience,
  onSelectSwap,
}: ExerciseSwapModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pattern = inferMovementPattern(currentExercise.name);
  const alternatives = getExerciseAlternatives(
    currentExercise.name,
    userEquipment,
    userExperience
  );

  const formattedPattern = pattern.replace(/_/g, " ").toUpperCase();

  const handleApplySwap = (alt: ExerciseMetadata) => {
    const updated: WorkoutExercise = {
      ...currentExercise,
      name: alt.name,
      rest: alt.defaultRest,
      executionCue: alt.executionCue,
      commonMistake: alt.commonMistake,
      primaryMuscles: [alt.primaryMuscle, ...(alt.secondaryMuscles || [])],
    };
    onSelectSwap(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-swap-title"
        className="relative w-full max-w-2xl max-h-[90vh] bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent">
              <RefreshCw className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 id="exercise-swap-title" className="text-base sm:text-lg font-bold text-primary">
                Smart Exercise Substitution
              </h2>
              <span className="text-xs font-mono text-primary-dim block">
                Pattern: {formattedPattern} &bull; Equipment: {userEquipment ? userEquipment.replace(/_/g, " ") : "gym"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-primary-dim hover:text-primary hover:bg-surface transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Current Exercise Reference Card */}
          <div className="p-4 rounded-xl bg-surface border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-primary-dim uppercase tracking-wider block">
                Current Prescribed Movement
              </span>
              <h3 className="text-base font-bold text-primary">{currentExercise.name}</h3>
              <p className="text-xs font-mono text-primary-muted">
                {currentExercise.setsReps} &bull; {currentExercise.rpe || "RPE 8"}
              </p>
            </div>
            <Badge variant="accent" size="sm" className="self-start sm:self-center font-mono">
              ACTIVE SELECTION
            </Badge>
          </div>

          {/* Compatible Alternatives List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-primary-dim">
              <span className="uppercase font-bold tracking-wider">
                Compatible Substitutions ({alternatives.length} Available)
              </span>
              <span className="text-accent flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Equivalent Biomechanics
              </span>
            </div>

            {alternatives.length > 0 ? (
              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-4 rounded-xl bg-surface border border-border/80 hover:border-accent/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-primary">{alt.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border/50 text-[10px] font-mono text-primary-dim uppercase">
                          {alt.equipment.replace(/_/g, " ")}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border/50 text-[10px] font-mono text-primary-dim uppercase">
                          {alt.difficulty}
                        </span>
                      </div>

                      <p className="text-xs text-primary-muted leading-relaxed">
                        {alt.rationale}
                      </p>

                      <div className="pt-1 flex items-center gap-3 text-[11px] font-mono text-primary-dim">
                        <span>Rest: {alt.defaultRest}</span>
                        <span>&bull;</span>
                        <span className="text-accent truncate max-w-[250px]">
                          Target: {alt.primaryMuscle}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleApplySwap(alt)}
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="shrink-0 self-start sm:self-center font-mono text-xs"
                    >
                      Select Swap
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-surface border border-dashed border-border/80 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-primary">
                  No suitable alternatives found.
                </h4>
                <p className="text-xs text-primary-muted max-w-md mx-auto leading-relaxed">
                  There are no equivalent biomechanical exercises matching the &ldquo;{formattedPattern}&rdquo; pattern for your current &ldquo;{userEquipment || "bodyweight"}&rdquo; equipment and experience level.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-surface/50 flex items-center justify-between text-xs text-primary-dim font-mono">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-accent" />
            Preserves prescribed set and rep targets
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-mono">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
