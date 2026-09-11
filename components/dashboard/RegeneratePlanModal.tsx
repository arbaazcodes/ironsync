"use client";

import React, { useState } from "react";
import { X, Sparkles, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ParameterChange } from "@/lib/data/profileService";
import { SavedPlanData } from "@/lib/supabase/planSync";

interface RegeneratePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  changes: ParameterChange[];
  currentPlan: SavedPlanData;
  onSaveProfileOnly: () => Promise<void>;
  onRegenerateBlueprint: () => Promise<void>;
}

export function RegeneratePlanModal({
  isOpen,
  onClose,
  changes,
  currentPlan,
  onSaveProfileOnly,
  onRegenerateBlueprint,
}: RegeneratePlanModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<"profile_only" | "regenerate" | null>(null);

  if (!isOpen) return null;

  const nextVersion = (currentPlan.version || 1) + 1;

  const handleProfileOnly = async () => {
    setIsProcessing(true);
    setActionType("profile_only");
    try {
      await onSaveProfileOnly();
      onClose();
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleRegenerate = async () => {
    setIsProcessing(true);
    setActionType("regenerate");
    try {
      await onRegenerateBlueprint();
      onClose();
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="regenerate-plan-title"
        className="relative w-full max-w-lg bg-surface-elevated border border-accent/40 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="regenerate-plan-title" className="text-base font-bold text-primary tracking-tight">
                  Update Fitness Blueprint?
                </h3>
                <Badge variant="accent" size="sm">
                  v{nextVersion} Available
                </Badge>
              </div>
              <p className="text-xs text-primary-dim font-mono mt-0.5">
                Core biometric and training parameters were modified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-primary-dim hover:text-primary p-1.5 rounded-lg hover:bg-surface transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Banner Required by Spec */}
        <div className="p-4 rounded-xl bg-surface border border-border/80 mb-5 space-y-2">
          <p className="text-sm font-semibold text-primary">
            Your current plan is based on your previous information.
          </p>
          <p className="text-xs text-primary-muted leading-relaxed">
            Would you like to create an updated blueprint tailored to your new parameters, or simply update your profile records while keeping your active plan unchanged?
          </p>
        </div>

        {/* Parameter Changes List */}
        <div className="space-y-2 mb-5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary-dim font-bold block">
            Modified Parameters ({changes.length})
          </span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {changes.map((change, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface/50 border border-border/60 text-xs font-mono"
              >
                <span className="text-primary-dim">{change.label}:</span>
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-primary-muted line-through opacity-70">
                    {change.oldValue}
                  </span>
                  <ArrowRight className="w-3 h-3 text-accent" />
                  <span className="text-accent">{change.newValue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Versioning Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-elevated/70 border border-border/70 mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-primary-dim leading-relaxed font-sans">
            <span className="font-semibold text-primary">Strict Plan Versioning:</span> Creating an updated blueprint will archive version {currentPlan.version || 1} and launch version {nextVersion} with recalculated calories, macronutrients, and workout schedules. Previous blueprints and check-ins remain safely preserved.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-border/70">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleProfileOnly}
            disabled={isProcessing}
            className="w-full sm:w-auto text-xs"
          >
            {isProcessing && actionType === "profile_only" ? "Saving Profile..." : "Save Profile Only"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleRegenerate}
            disabled={isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs min-w-[190px]"
          >
            {isProcessing && actionType === "regenerate" ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Regenerating Blueprint...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Create Updated Blueprint
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
