"use client";

import React, { useState } from "react";
import { X, Sparkles, ArrowRight, ShieldCheck, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SavedPlanData } from "@/lib/supabase/planSync";
import { RecalibrationAssessment } from "@/lib/data/checkInService";

interface RecalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: SavedPlanData;
  assessment: RecalibrationAssessment;
  onApply: () => Promise<void>;
}

export function RecalibrationModal({
  isOpen,
  onClose,
  currentPlan,
  assessment,
  onApply,
}: RecalibrationModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !assessment.suggestedCalories || !assessment.suggestedMacros) {
    return null;
  }

  const nextVersion = (currentPlan.version || 1) + 1;
  const calorieDiff = assessment.suggestedCalories - currentPlan.calories;
  const isIncrease = calorieDiff > 0;

  const handleApply = async () => {
    try {
      setIsApplying(true);
      setError(null);
      await onApply();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to apply recalibration. Please try again.");
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recalibration-title"
        className="relative w-full max-w-xl bg-surface-elevated border border-accent/40 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-5 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="recalibration-title" className="text-base font-bold text-primary tracking-tight">
                  Plan Recalibration Review
                </h3>
                <Badge variant="accent" size="sm">
                  v{nextVersion} Candidate
                </Badge>
              </div>
              <p className="text-xs text-primary-dim font-mono mt-0.5">
                Target energy balance adaptation based on real physiological response
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-primary-dim hover:text-primary p-1.5 rounded-lg hover:bg-surface transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Recalibration Reason Box */}
        <div className="p-4 rounded-xl bg-surface border border-border/80 mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold uppercase tracking-wider text-accent">
              {assessment.headline || "Observed Progress Analysis"}
            </span>
            <span className="font-mono text-[11px] text-primary-dim">
              {assessment.daysObserved} days observed &bull; {assessment.rateKgPerWeek >= 0 ? "+" : ""}
              {assessment.rateKgPerWeek} kg/wk
            </span>
          </div>
          <p className="text-xs text-primary-muted leading-relaxed">
            {assessment.reason}
          </p>
          {assessment.targetPaceDescription && (
            <p className="text-[11px] font-mono text-primary-dim">
              {assessment.targetPaceDescription}
            </p>
          )}
        </div>

        {/* Side-by-Side Target Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Current Plan */}
          <div className="p-4 rounded-xl bg-surface/50 border border-border/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary-dim font-bold">
                  Current Plan
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-primary-muted font-bold">
                  v{currentPlan.version || 1}
                </span>
              </div>
              <div className="font-mono text-2xl font-black text-primary">
                {currentPlan.calories.toLocaleString()}
                <span className="text-xs font-normal text-primary-dim ml-1">kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-3 mt-3 border-t border-border/40 text-center font-mono">
              <div>
                <span className="text-[9px] text-primary-dim block">PRO</span>
                <span className="text-xs font-bold text-primary">{currentPlan.protein}g</span>
              </div>
              <div>
                <span className="text-[9px] text-primary-dim block">CARB</span>
                <span className="text-xs font-bold text-primary">{currentPlan.carbs}g</span>
              </div>
              <div>
                <span className="text-[9px] text-primary-dim block">FAT</span>
                <span className="text-xs font-bold text-primary">{currentPlan.fat}g</span>
              </div>
            </div>
          </div>

          {/* Suggested Plan */}
          <div className="p-4 rounded-xl bg-accent/[0.04] border border-accent/40 shadow-accent-glow flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/[0.08] blur-xl rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                  Suggested Target
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/20 border border-accent/40 text-accent font-bold">
                  v{nextVersion}
                </span>
              </div>
              <div className="font-mono text-2xl font-black text-accent flex items-baseline gap-1.5">
                <span>{assessment.suggestedCalories.toLocaleString()}</span>
                <span className="text-xs font-normal text-primary-dim">kcal</span>
                <span
                  className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                    isIncrease
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {isIncrease ? `+${calorieDiff}` : calorieDiff}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-3 mt-3 border-t border-accent/20 text-center font-mono">
              <div>
                <span className="text-[9px] text-primary-dim block">PRO</span>
                <span className="text-xs font-bold text-primary">
                  {assessment.suggestedMacros.protein}g
                </span>
              </div>
              <div>
                <span className="text-[9px] text-primary-dim block">CARB</span>
                <span className="text-xs font-bold text-primary">
                  {assessment.suggestedMacros.carbs}g
                </span>
              </div>
              <div>
                <span className="text-[9px] text-primary-dim block">FAT</span>
                <span className="text-xs font-bold text-primary">
                  {assessment.suggestedMacros.fat}g
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Versioning Guarantee Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-elevated/70 border border-border/70 mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-primary-dim leading-relaxed font-sans">
            <span className="font-semibold text-primary">Strict Plan Versioning:</span> Applying this recalibration will archive version {currentPlan.version || 1} and launch version {nextVersion} with updated nutrition targets. Your workouts, past check-ins, and archived plans will remain preserved.
          </div>
        </div>

        {/* Non-medical Disclaimer */}
        <div className="flex items-center gap-1.5 mb-5 px-1">
          <AlertCircle className="w-3.5 h-3.5 text-primary-dim shrink-0" />
          <p className="text-[10px] text-primary-dim">
            Energy balance planning tool. Not intended for medical diagnosis or clinical nutrition therapy.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/70">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isApplying}
          >
            Keep Current Plan
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={isApplying}
            className="min-w-[150px]"
          >
            {isApplying ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Applying...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Apply Adjustment
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
