"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Calendar,
  Flame,
  Dumbbell,
  Utensils,
  Moon,
  ArrowRight,
  Copy,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SavedPlanData } from "@/lib/supabase/planSync";

interface PlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SavedPlanData;
  onDuplicateClick?: (plan: SavedPlanData) => void;
}

export function PlanDetailModal({
  isOpen,
  onClose,
  plan,
  onDuplicateClick,
}: PlanDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "workouts" | "nutrition" | "recovery">("overview");

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

  const isActive = plan.status === "active";

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
        aria-labelledby="plan-detail-title"
        className="relative w-full max-w-2xl bg-surface-elevated border border-border/90 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="plan-detail-title" className="text-base font-bold text-primary tracking-tight">
                  Plan v{plan.version}
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isActive
                      ? "bg-accent/20 text-accent border border-accent/40 shadow-accent-glow"
                      : "bg-surface border border-border text-primary-dim"
                  }`}
                >
                  {isActive ? "Active Blueprint" : "Archived"}
                </span>
              </div>
              <p className="text-xs text-primary-dim font-mono mt-0.5">
                Created on {new Date(plan.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
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

        {/* Read-Only Notice */}
        {!isActive && (
          <div className="mt-3 p-3 rounded-xl bg-surface/80 border border-border/60 flex items-center gap-2 text-xs text-primary-dim shrink-0">
            <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>
              <strong className="text-primary">Historical Plan (Read-Only):</strong> Inspecting this blueprint does not alter your active plan.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pt-3 pb-2 shrink-0 select-none overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Macros", icon: Sparkles },
            { id: "workouts", label: "Workouts", icon: Dumbbell },
            { id: "nutrition", label: "Nutrition & Meals", icon: Utensils },
            { id: "recovery", label: "Recovery", icon: Moon },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  activeTab === t.id
                    ? "bg-accent/15 text-accent border border-accent/40"
                    : "text-primary-dim hover:text-primary hover:bg-surface"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Macro Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-surface border border-border/60 text-center">
                  <span className="text-[10px] text-primary-dim uppercase block">DAILY CALORIES</span>
                  <span className="text-xl font-black text-accent">{plan.calories.toLocaleString()}</span>
                  <span className="text-[10px] text-primary-dim block">kcal</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border/60 text-center">
                  <span className="text-[10px] text-primary-dim uppercase block">PROTEIN</span>
                  <span className="text-xl font-bold text-primary">{plan.protein}g</span>
                  <span className="text-[10px] text-primary-dim block">Muscle repair</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border/60 text-center">
                  <span className="text-[10px] text-primary-dim uppercase block">CARBOHYDRATES</span>
                  <span className="text-xl font-bold text-primary">{plan.carbs}g</span>
                  <span className="text-[10px] text-primary-dim block">Glycogen fuel</span>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border/60 text-center">
                  <span className="text-[10px] text-primary-dim uppercase block">FAT</span>
                  <span className="text-xl font-bold text-primary">{plan.fat}g</span>
                  <span className="text-[10px] text-primary-dim block">Hormone health</span>
                </div>
              </div>

              {/* Goal & Cadence Summary */}
              <div className="p-4 rounded-xl bg-surface border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary-dim">Goal Architecture:</span>
                  <span className="font-bold text-primary uppercase">{plan.goal.replace("_", " ")}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary-dim">Training Split:</span>
                  <span className="font-bold text-accent">{plan.splitName || `${plan.trainingDays}-Day Split`}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary-dim">Weekly Cadence:</span>
                  <span className="font-bold text-primary">{plan.trainingDays} Training Days / Week</span>
                </div>
                {plan.dietType && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-primary-dim">Dietary Style:</span>
                    <span className="font-bold text-primary capitalize">{plan.dietType.replace("_", " ")}</span>
                  </div>
                )}
              </div>

              {/* Strategy Notes */}
              {plan.dietStrategyNotes && (
                <div className="p-3.5 rounded-xl bg-surface/50 border border-border/40 text-xs text-primary-muted leading-relaxed">
                  <span className="font-mono font-bold text-accent uppercase text-[10px] block mb-1">
                    Nutrient Pacing Strategy
                  </span>
                  {plan.dietStrategyNotes}
                </div>
              )}
            </div>
          )}

          {/* WORKOUTS TAB */}
          {activeTab === "workouts" && (
            <div className="space-y-3">
              {plan.schedule && plan.schedule.length > 0 ? (
                plan.schedule.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface border border-border/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-accent">{day.dayName}</span>
                        <span className="text-xs font-bold text-primary">&bull; {day.focus}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-surface-elevated border border-border text-primary-dim">
                        {day.type === "workout" ? "Training" : "Recovery"}
                      </span>
                    </div>

                    {day.exercises && day.exercises.length > 0 && (
                      <div className="pt-2 border-t border-border/40 space-y-1.5">
                        {day.exercises.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="flex items-center justify-between text-xs text-primary-muted font-mono"
                          >
                            <span className="text-primary font-sans font-medium">{ex.name}</span>
                            <span className="text-[11px] text-primary-dim">{ex.setsReps}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-primary-dim font-mono text-center py-6">
                  No exercise breakdown recorded for this plan version.
                </p>
              )}
            </div>
          )}

          {/* NUTRITION TAB */}
          {activeTab === "nutrition" && (
            <div className="space-y-3">
              {plan.meals && plan.meals.length > 0 ? (
                plan.meals.map((meal, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface border border-border/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold text-primary">{meal.name}</span>
                      <span className="font-mono text-xs font-bold text-accent">{meal.calories} kcal</span>
                    </div>

                    {meal.items && meal.items.length > 0 && (
                      <div className="pt-2 border-t border-border/40 space-y-1 text-xs text-primary-dim">
                        {meal.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-primary-muted">{item.name}</span>
                            <span className="text-primary-dim">{item.portion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-primary-dim font-mono text-center py-6">
                  No meals breakdown recorded for this plan version.
                </p>
              )}
            </div>
          )}

          {/* RECOVERY TAB */}
          {activeTab === "recovery" && (
            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-surface border border-border/60 flex items-center justify-between">
                <span className="text-xs text-primary-dim">Sleep Target:</span>
                <span className="text-xs font-bold text-primary">{plan.recoveryProtocol?.sleepTarget || "7h 45m"}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-border/60 flex items-center justify-between">
                <span className="text-xs text-primary-dim">Daily Hydration:</span>
                <span className="text-xs font-bold text-accent">{plan.recoveryProtocol?.hydrationTarget || "3.2 Liters"}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface border border-border/60 flex items-center justify-between">
                <span className="text-xs text-primary-dim">Mobility Window:</span>
                <span className="text-xs font-bold text-primary">{plan.recoveryProtocol?.mobilityWindow || "15 min Daily"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/70 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>

          {!isActive && onDuplicateClick && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onDuplicateClick(plan);
              }}
              className="flex items-center gap-1.5 text-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Use this as starting point</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
