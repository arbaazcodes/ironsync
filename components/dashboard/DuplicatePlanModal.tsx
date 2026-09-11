"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, ShieldCheck, ArrowRight, Sparkles, Sliders } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SavedPlanData } from "@/lib/supabase/planSync";

interface DuplicatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePlan: SavedPlanData;
  activePlan: SavedPlanData;
  nextVersion: number;
  onConfirmDuplicate: () => Promise<void>;
  onCustomizeClick?: () => void;
}

export function DuplicatePlanModal({
  isOpen,
  onClose,
  sourcePlan,
  activePlan,
  nextVersion,
  onConfirmDuplicate,
  onCustomizeClick,
}: DuplicatePlanModalProps) {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keyboard accessibility and body scroll lock
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

  const handleConfirm = async () => {
    try {
      setIsDuplicating(true);
      setError(null);
      await onConfirmDuplicate();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to duplicate plan. Please try again.");
      setIsDuplicating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="duplicate-plan-title"
        className="relative w-full max-w-lg bg-surface-elevated border border-accent/40 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Copy className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="duplicate-plan-title" className="text-base font-bold text-primary tracking-tight">
                  Duplicate Plan as Baseline
                </h3>
                <Badge variant="accent" size="sm">
                  v{nextVersion} Candidate
                </Badge>
              </div>
              <p className="text-xs text-primary-dim font-mono mt-0.5">
                Clone historical blueprint into a new active version
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

        {/* Source vs Target Comparison */}
        <div className="p-4 rounded-xl bg-surface border border-border/80 mb-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-primary-dim block text-[10px]">SOURCE TEMPLATE</span>
              <span className="font-bold text-primary">Plan v{sourcePlan.version}</span>
              <span className="text-[11px] text-primary-dim block uppercase">
                {sourcePlan.goal.replace("_", " ")} &bull; {sourcePlan.calories} kcal
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-accent" />

            <div className="text-right">
              <span className="text-accent block text-[10px] font-bold">NEW ACTIVE PLAN</span>
              <span className="font-bold text-accent">Plan v{nextVersion}</span>
              <span className="text-[11px] text-primary-dim block">Active status</span>
            </div>
          </div>
        </div>

        {/* Guarding notice */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-elevated/70 border border-border/70 mb-5 text-xs text-primary-dim leading-relaxed font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-primary font-medium">Zero Silent Overwrite:</strong> Your currently active plan (Plan v{activePlan.version || 1}) will be archived, and Plan v{nextVersion} will become active. Historical plans remain safely preserved in history.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70">
          {onCustomizeClick ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onCustomizeClick();
              }}
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Or edit in Profile Settings</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isDuplicating}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={isDuplicating}
              className="text-xs min-w-[160px]"
            >
              {isDuplicating ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Duplicating...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Activate Plan v{nextVersion}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
