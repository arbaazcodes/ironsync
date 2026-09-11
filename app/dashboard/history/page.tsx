"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  fetchAllUserPlans,
  duplicatePlanAsNewVersion,
  fetchUserExports,
  ExportRecord,
} from "@/lib/data/historyService";
import { SavedPlanData } from "@/lib/supabase/planSync";
import { PlanDetailModal } from "@/components/dashboard/PlanDetailModal";
import { DuplicatePlanModal } from "@/components/dashboard/DuplicatePlanModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  History,
  FileDown,
  Sparkles,
  Calendar,
  Eye,
  Copy,
  CheckCircle2,
  Share2,
  FileText,
  Flame,
  ArrowRight,
  Clock,
  Layers,
} from "lucide-react";

export default function DashboardHistoryPage() {
  const router = useRouter();
  const { user, activePlan, refreshPlan } = useAuth();

  const [plans, setPlans] = useState<SavedPlanData[]>([]);
  const [exportsList, setExportsList] = useState<ExportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"plans" | "exports">("plans");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal inspection states
  const [selectedPlan, setSelectedPlan] = useState<SavedPlanData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Duplication modal state
  const [planToDuplicate, setPlanToDuplicate] = useState<SavedPlanData | null>(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  // Load plans & exports on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const [userPlans, userExports] = await Promise.all([
          fetchAllUserPlans(user.id),
          fetchUserExports(user.id),
        ]);

        if (mounted) {
          setPlans(userPlans);
          setExportsList(userExports);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Next version calculation
  const nextVersion = useMemo(() => {
    return Math.max(...plans.map((p) => p.version || 1), 1) + 1;
  }, [plans]);

  // Handle plan duplication
  const handleConfirmDuplicate = async () => {
    if (!user?.id || !planToDuplicate) return;

    const result = await duplicatePlanAsNewVersion(user.id, planToDuplicate, plans);
    if (!result.success || !result.newPlan) {
      throw new Error(result.error || "Failed to duplicate plan.");
    }

    // Refresh local state
    setPlans((prev) => [
      result.newPlan!,
      ...prev.map((p) => ({
        ...p,
        status: p.status === "active" ? ("archived" as const) : p.status,
      })),
    ]);

    await refreshPlan();
    showToast(`Plan v${result.newPlan.version} successfully activated!`);
  };

  // Open detail modal
  const handleViewPlan = (plan: SavedPlanData) => {
    setSelectedPlan(plan);
    setIsDetailModalOpen(true);
  };

  // Open duplicate modal
  const handleStartDuplication = (plan: SavedPlanData) => {
    setPlanToDuplicate(plan);
    setIsDuplicateModalOpen(true);
  };

  if (!activePlan) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
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
              AUDIT TRAIL & LOGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary uppercase tracking-tight">
            PLAN & EXPORT HISTORY
          </h1>
          <p className="text-xs text-primary-dim max-w-xl mt-1">
            Browse all chronological iterations of your fitness blueprints, inspect archived parameters, and review export events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/exports">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <FileDown className="w-4 h-4" />
              <span>Export Hub</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-2 select-none">
        <button
          onClick={() => setActiveTab("plans")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            activeTab === "plans"
              ? "bg-accent/15 text-accent border border-accent/40"
              : "text-primary-dim hover:text-primary hover:bg-surface"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Plan Versions ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("exports")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            activeTab === "exports"
              ? "bg-accent/15 text-accent border border-accent/40"
              : "text-primary-dim hover:text-primary hover:bg-surface"
          }`}
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Logs ({exportsList.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PLAN HISTORY */}
      {/* ========================================================================= */}
      {activeTab === "plans" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {plans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-surface/30">
              <History className="w-8 h-8 text-primary-dim mx-auto mb-3" />
              <h3 className="text-sm font-bold text-primary font-mono mb-1">
                No Plan Versions Found
              </h3>
              <p className="text-xs text-primary-dim">
                Active plan is loading from local session.
              </p>
            </div>
          ) : (
            plans.map((plan) => {
              const isActive = plan.status === "active";

              return (
                <div
                  key={plan.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? "bg-accent/[0.04] border-accent/60 shadow-accent-glow"
                      : "bg-surface/50 border-border/70 hover:border-border"
                  }`}
                >
                  {/* Subtle top indicator for active plan */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-secondary" />
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Version, Goal, and Meta */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-base font-black text-primary">
                          Plan v{plan.version}
                        </span>

                        {isActive ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase bg-accent/20 text-accent border border-accent/40">
                            Active Blueprint
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase bg-surface border border-border text-primary-dim">
                            Archived
                          </span>
                        )}

                        <span className="text-xs font-mono text-primary-dim hidden sm:inline">
                          &bull; {new Date(plan.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono">
                        <span className="font-bold text-primary uppercase">
                          {plan.goal.replace("_", " ")}
                        </span>
                        <span className="text-primary-dim">
                          {plan.splitName || `${plan.trainingDays}-Day Split`}
                        </span>
                        <span className="text-primary-dim">
                          {plan.trainingDays} Days / Week
                        </span>
                      </div>
                    </div>

                    {/* Middle: Macros Summary */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 font-mono text-center p-2.5 rounded-xl bg-surface/70 border border-border/40 shrink-0">
                      <div className="px-2">
                        <span className="text-[9px] text-primary-dim uppercase block">ENERGY</span>
                        <span className="text-xs font-bold text-accent">{plan.calories}</span>
                        <span className="text-[9px] text-primary-dim block">kcal</span>
                      </div>
                      <div className="px-2">
                        <span className="text-[9px] text-primary-dim uppercase block">PRO</span>
                        <span className="text-xs font-bold text-primary">{plan.protein}g</span>
                      </div>
                      <div className="px-2">
                        <span className="text-[9px] text-primary-dim uppercase block">CARB</span>
                        <span className="text-xs font-bold text-primary">{plan.carbs}g</span>
                      </div>
                      <div className="px-2">
                        <span className="text-[9px] text-primary-dim uppercase block">FAT</span>
                        <span className="text-xs font-bold text-primary">{plan.fat}g</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPlan(plan)}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Plan</span>
                      </Button>

                      {!isActive && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStartDuplication(plan)}
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
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXPORT HISTORY */}
      {/* ========================================================================= */}
      {activeTab === "exports" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {exportsList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-surface/30">
              <FileDown className="w-8 h-8 text-primary-dim mx-auto mb-3" />
              <h3 className="text-sm font-bold text-primary font-mono mb-1">
                No Export Records Logged
              </h3>
              <p className="text-xs text-primary-dim max-w-sm mx-auto mb-4">
                Export events are tracked whenever you download your branded PDF blueprint or share cards.
              </p>
              <Link href="/dashboard/exports">
                <Button variant="primary" size="sm" className="text-xs">
                  Go to Exports
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/80 overflow-hidden bg-surface/40 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface/70 text-[10px] font-mono uppercase tracking-wider text-primary-dim">
                      <th className="py-3.5 px-4">Export Type</th>
                      <th className="py-3.5 px-4">Associated Plan</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {exportsList.map((item) => {
                      const isPdf = item.type === "pdf";

                      return (
                        <tr key={item.id} className="hover:bg-surface-elevated/40 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {isPdf ? (
                                <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                  <FileText className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                                  <Share2 className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <span className="font-bold text-primary">
                                {isPdf ? "PDF Blueprint" : "Share Card (9:16)"}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="text-primary-muted">
                              {item.planVersion ? `Plan v${item.planVersion}` : `Active Blueprint`}
                            </span>
                            {item.planGoal && (
                              <span className="text-primary-dim text-[11px] block uppercase">
                                {item.planGoal.replace("_", " ")}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-primary-dim whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Exported
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <Link href="/dashboard/exports">
                              <Button variant="outline" size="sm" className="text-[11px] py-1 px-2.5">
                                Re-Export
                              </Button>
                            </Link>
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
      )}

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <PlanDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          plan={selectedPlan}
          onDuplicateClick={handleStartDuplication}
        />
      )}

      {/* Plan Duplication Modal */}
      {planToDuplicate && (
        <DuplicatePlanModal
          isOpen={isDuplicateModalOpen}
          onClose={() => setIsDuplicateModalOpen(false)}
          sourcePlan={planToDuplicate}
          activePlan={activePlan}
          nextVersion={nextVersion}
          onConfirmDuplicate={handleConfirmDuplicate}
          onCustomizeClick={() => router.push("/dashboard/profile")}
        />
      )}
    </div>
  );
}
