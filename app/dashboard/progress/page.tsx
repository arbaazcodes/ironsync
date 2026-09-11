"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import {
  CheckInRecord,
  fetchUserCheckIns,
  saveCheckIn,
  deleteCheckIn,
  assessPlanRecalibration,
  applyPlanRecalibration,
} from "@/lib/data/checkInService";
import { WeightTrendChart } from "@/components/dashboard/WeightTrendChart";
import { AddCheckInModal } from "@/components/dashboard/AddCheckInModal";
import { RecalibrationModal } from "@/components/dashboard/RecalibrationModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Scale,
  Target,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Trash2,
  Info,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function DashboardProgressPage() {
  const { user, activePlan, refreshPlan } = useAuth();
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRecalibrationModalOpen, setIsRecalibrationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load check-ins on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const records = await fetchUserCheckIns(user.id);
        if (mounted) {
          setCheckIns(records);
        }
      } catch (err) {
        console.error("Failed to load check-ins:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Show transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sort check-ins chronologically (ascending for math, descending for list)
  const sortedAsc = useMemo(() => {
    return [...checkIns].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [checkIns]);

  const sortedDesc = useMemo(() => {
    return [...checkIns].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [checkIns]);

  // Key weight metrics
  const startingWeight = useMemo(() => {
    if (sortedAsc.length > 0) return sortedAsc[0].weightKg;
    return activePlan?.weightKg ?? null;
  }, [sortedAsc, activePlan]);

  const currentWeight = useMemo(() => {
    if (sortedAsc.length > 0) return sortedAsc[sortedAsc.length - 1].weightKg;
    return activePlan?.weightKg ?? null;
  }, [sortedAsc, activePlan]);

  const targetWeight = useMemo(() => {
    return activePlan?.targetWeightKg ?? null;
  }, [activePlan]);

  // Total delta from start
  const totalChangeKg = useMemo(() => {
    if (startingWeight !== null && currentWeight !== null) {
      return Number((currentWeight - startingWeight).toFixed(1));
    }
    return null;
  }, [startingWeight, currentWeight]);

  // Distance to target
  const distanceToTargetKg = useMemo(() => {
    if (currentWeight !== null && targetWeight !== null) {
      return Number((currentWeight - targetWeight).toFixed(1));
    }
    return null;
  }, [currentWeight, targetWeight]);

  // Recalibration assessment
  const assessment = useMemo(() => {
    if (!activePlan) return null;
    return assessPlanRecalibration(checkIns, activePlan);
  }, [checkIns, activePlan]);

  // Handle new check-in
  const handleSaveCheckIn = async (input: { weightKg: number; notes?: string; createdAt?: string }) => {
    if (!user?.id) throw new Error("User session required.");

    const { record, error } = await saveCheckIn(user.id, {
      ...input,
      planId: activePlan?.id,
    });

    if (error) throw new Error(error);

    setCheckIns((prev) => {
      const updated = [...prev.filter((c) => c.id !== record.id), record];
      return updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    // Track check-in event (privacy safeguard: strictly NO raw weight recorded)
    trackEvent("check_in_completed", {
      has_notes: Boolean(input.notes),
    });

    showToast(`Check-in logged: ${record.weightKg} kg`);
  };

  // Handle delete check-in
  const handleDeleteCheckIn = async (id: string) => {
    if (!user?.id) return;
    const confirmed = window.confirm("Are you sure you want to delete this check-in entry?");
    if (!confirmed) return;

    await deleteCheckIn(user.id, id);
    setCheckIns((prev) => prev.filter((c) => c.id !== id));
    showToast("Check-in removed.");
  };

  // Handle recalibration application
  const handleApplyRecalibration = async () => {
    if (!user?.id || !activePlan || !assessment) return;

    const result = await applyPlanRecalibration(user.id, activePlan, assessment);
    if (!result.success) {
      throw new Error(result.error || "Failed to recalibrate plan.");
    }

    await refreshPlan();
    showToast(`Plan v${result.newPlan?.version || 2} successfully activated with updated calorie targets!`);
  };

  if (!activePlan) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-accent text-background font-mono text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
              PHYSIOLOGICAL PROGRESSION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary uppercase tracking-tight">
            YOUR PROGRESS
          </h1>
          <p className="text-xs text-primary-dim max-w-xl mt-1">
            Log regular weigh-ins to chart body weight trajectories and unlock automated, conservative plan recalibration.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          className="shrink-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Check-in</span>
        </Button>
      </div>

      {/* 3 Metric Cards: Current weight, Target weight, Starting weight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Weight */}
        <Card variant="elevated" padding="md" className="border-border/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-primary-dim mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Current Weight
            </span>
            <Scale className="w-4 h-4 text-accent" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-black text-primary">
              {currentWeight !== null ? currentWeight : "--"}
            </span>
            <span className="text-xs font-mono text-primary-dim">kg</span>
          </div>
          <div className="mt-2 text-[11px] font-mono">
            {totalChangeKg !== null ? (
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  totalChangeKg < 0
                    ? "text-emerald-400"
                    : totalChangeKg > 0
                    ? "text-amber-400"
                    : "text-primary-dim"
                }`}
              >
                {totalChangeKg > 0 ? `+${totalChangeKg}` : totalChangeKg} kg from start
              </span>
            ) : (
              <span className="text-primary-dim">No weigh-in yet</span>
            )}
          </div>
        </Card>

        {/* Target Weight */}
        <Card variant="elevated" padding="md" className="border-border/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-primary-dim mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Target Weight
            </span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-black text-primary">
              {targetWeight !== null ? targetWeight : "--"}
            </span>
            <span className="text-xs font-mono text-primary-dim">kg</span>
          </div>
          <div className="mt-2 text-[11px] font-mono">
            {distanceToTargetKg !== null ? (
              <span className="text-primary-muted font-semibold">
                {Math.abs(distanceToTargetKg)} kg {distanceToTargetKg > 0 ? "to lose" : "to gain"}
              </span>
            ) : (
              <span className="text-primary-dim">Target not set</span>
            )}
          </div>
        </Card>

        {/* Starting Weight */}
        <Card variant="elevated" padding="md" className="border-border/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-primary-dim mb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Starting Weight
            </span>
            <Calendar className="w-4 h-4 text-primary-dim" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-black text-primary">
              {startingWeight !== null ? startingWeight : "--"}
            </span>
            <span className="text-xs font-mono text-primary-dim">kg</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-primary-dim">
            Initial baseline from onboarding
          </div>
        </Card>
      </div>

      {/* Recalibration Alert Banner */}
      {assessment && (
        <>
          {assessment.status === "adjustment_suggested" && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/[0.06] p-5 sm:p-6 backdrop-blur-md relative overflow-hidden shadow-lg animate-in slide-in-from-top-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                      PLAN RECALIBRATION RECOMMENDATION
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-primary tracking-tight">
                    Your current plan may need adjustment.
                  </h3>

                  <p className="text-xs text-primary-muted max-w-2xl leading-relaxed">
                    {assessment.reason}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-primary-dim">Current Target:</span>
                      <span className="font-bold text-primary">{activePlan.calories.toLocaleString()} kcal</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 hidden sm:block" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-primary-dim">Suggested Target:</span>
                      <span className="font-bold text-amber-400">
                        {assessment.suggestedCalories?.toLocaleString()} kcal
                      </span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                        {(assessment.calorieDelta ?? 0) > 0 ? `+${assessment.calorieDelta}` : assessment.calorieDelta} kcal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      trackEvent("plan_recalibration_started", { source: "progress_page" });
                      setIsRecalibrationModalOpen(true);
                    }}
                    className="w-full sm:w-auto flex items-center gap-2 border border-amber-500/40 shadow-amber-glow"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Review Adjustment</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {assessment.status === "on_track" && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Plan Status: On Track
                    </span>
                    <Badge variant="subtle" size="sm">
                      {assessment.rateKgPerWeek >= 0 ? "+" : ""}{assessment.rateKgPerWeek} kg/week
                    </Badge>
                  </div>
                  <p className="text-xs text-primary-muted mt-0.5 leading-snug">
                    {assessment.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(assessment.status === "insufficient_data" || assessment.status === "insufficient_time") && (
            <div className="rounded-2xl border border-border/80 bg-surface/40 p-4 flex items-center gap-3 text-xs">
              <Clock className="w-4 h-4 text-accent shrink-0" />
              <div className="text-primary-dim">
                <span className="font-semibold text-primary">Recalibration Engine Active: </span>
                {assessment.reason}
              </div>
            </div>
          )}
        </>
      )}

      {/* Weight Trend Visualization */}
      <WeightTrendChart
        checkIns={checkIns}
        targetWeightKg={targetWeight}
        startingWeightKg={startingWeight}
      />

      {/* Check-in History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Check-in History ({sortedDesc.length})
            </h3>
          </div>
          {sortedDesc.length > 0 && (
            <span className="text-[11px] font-mono text-primary-dim">
              Latest: {new Date(sortedDesc[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>

        {sortedDesc.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center bg-surface/20">
            <p className="text-xs text-primary-dim font-mono">
              No check-ins logged yet. Click &ldquo;Add Check-in&rdquo; to record your first weigh-in.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/80 overflow-hidden bg-surface/40 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-surface/70 text-[10px] font-mono uppercase tracking-wider text-primary-dim">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Change</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {sortedDesc.map((entry, idx) => {
                    // Delta compared to chronologically prior entry
                    const prevEntry = sortedDesc[idx + 1];
                    const delta =
                      prevEntry !== undefined
                        ? Number((entry.weightKg - prevEntry.weightKg).toFixed(1))
                        : null;

                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-surface-elevated/40 transition-colors"
                      >
                        <td className="py-3 px-4 text-primary whitespace-nowrap">
                          {new Date(entry.createdAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 font-bold text-accent whitespace-nowrap">
                          {entry.weightKg} kg
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {delta !== null ? (
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                                delta < 0
                                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                  : delta > 0
                                  ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                                  : "text-primary-dim"
                              }`}
                            >
                              {delta > 0 ? `+${delta}` : delta} kg
                            </span>
                          ) : (
                            <span className="text-primary-dim text-[11px]">Baseline</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-primary-muted font-sans text-xs max-w-xs truncate">
                          {entry.notes || <span className="text-primary-dim italic font-mono text-[10px]">&mdash;</span>}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCheckIn(entry.id)}
                            className="p-1.5 rounded-lg text-primary-dim hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete check-in"
                            aria-label="Delete check-in"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Check-in Modal */}
      <AddCheckInModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveCheckIn}
        latestWeightKg={currentWeight}
      />

      {/* Recalibration Review Modal */}
      {assessment && (
        <RecalibrationModal
          isOpen={isRecalibrationModalOpen}
          onClose={() => setIsRecalibrationModalOpen(false)}
          currentPlan={activePlan}
          assessment={assessment}
          onApply={handleApplyRecalibration}
        />
      )}
    </div>
  );
}
