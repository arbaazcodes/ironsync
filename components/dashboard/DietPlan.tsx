"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MemberDashboardData } from "@/lib/types/member";
import { MealCard } from "@/components/dashboard/MealCard";
import { WeekDietChart } from "@/components/dashboard/WeekDietChart";
import { DietPdfDownloadButton } from "@/components/pdf/DietPdfDownloadButton";
import { DietModificationModal } from "@/components/dashboard/DietModificationModal";
import { DayMeal } from "@/lib/engine/mealGenerator";
import { MemberChangeRequest } from "@/lib/types/changeRequest";
import {
  Apple,
  Flame,
  Zap,
  Clock,
  Sparkles,
  Loader2,
  Info,
  Utensils,
  Calendar,
  CheckCircle2,
  Clock3,
  FileEdit,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Scale,
} from "lucide-react";

interface DietPlanProps {
  memberData?: MemberDashboardData | null;
  className?: string;
  showBackToDashboard?: boolean;
}

export function DietPlan({
  memberData: initialMemberData,
  className = "",
  showBackToDashboard = false,
}: DietPlanProps) {
  const [data, setData] = useState<MemberDashboardData | null>(initialMemberData || null);
  const [loading, setLoading] = useState(!initialMemberData);
  const [meals, setMeals] = useState<DayMeal[]>(initialMemberData?.assignedPlan?.meals || []);
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");

  // Diet Revision / Change Request State
  const [pendingRequest, setPendingRequest] = useState<MemberChangeRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [dashRes, reqRes] = await Promise.all([
        initialMemberData ? Promise.resolve(null) : fetch("/api/member/dashboard"),
        fetch("/api/member/change-request"),
      ]);

      if (dashRes && dashRes.ok) {
        const result = await dashRes.json();
        setData(result);
        if (result.assignedPlan?.meals) {
          setMeals(result.assignedPlan.meals);
        }
      } else if (initialMemberData?.assignedPlan?.meals) {
        setMeals(initialMemberData.assignedPlan.meals);
      }

      if (reqRes && reqRes.ok) {
        const reqData = await reqRes.json();
        setPendingRequest(reqData.pendingRequest || null);
      }
    } catch (err) {
      console.error("Failed to load diet data:", err);
    } finally {
      setLoading(false);
    }
  }, [initialMemberData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSwapMeal = (updatedMeal: DayMeal) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.name === updatedMeal.name || m.timing === updatedMeal.timing ? updatedMeal : m
      )
    );
  };

  const handleRequestSubmitted = (newRequest: MemberChangeRequest) => {
    setPendingRequest(newRequest);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-primary-muted space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-mono uppercase tracking-wider">
          Compiling Nutrition Blueprint...
        </span>
      </div>
    );
  }

  const assignedPlan = data?.assignedPlan;
  const member = data?.member;

  const formattedDietType = (member?.dietType || "Standard")
    .replace(/_/g, " ")
    .toUpperCase();

  const formattedGoal = (member?.fitnessGoal || "General Fitness").toUpperCase();

  const formattedRequestDate = pendingRequest?.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(pendingRequest.createdAt))
    : "";

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header with Profile Badges & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {showBackToDashboard && (
            <Link
              href="/member/dashboard"
              className="inline-flex items-center gap-1 text-xs font-mono text-primary-muted hover:text-primary transition-colors mb-1"
            >
              &larr; Back to Overview
            </Link>
          )}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
            <Apple className="w-3.5 h-3.5" />
            Nutritional Periodization Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-primary mt-0.5">
            Daily Fuel & Diet Plan
          </h1>
          <p className="text-xs sm:text-sm text-primary-muted">
            Assigned for <span className="text-primary font-bold">{member?.fullName}</span> ({member?.memberId})
          </p>
        </div>

        {/* View Switcher: Today's Protocol vs 7-Day Week Chart */}
        <div className="flex items-center p-1 rounded-2xl bg-surface-elevated border border-border shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("today")}
            className={`py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "today"
                ? "bg-accent text-white shadow-accent-glow"
                : "text-primary-muted hover:text-primary"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Today&apos;s Protocol</span>
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "week"
                ? "bg-accent text-white shadow-accent-glow"
                : "text-primary-muted hover:text-primary"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Week Chart</span>
          </button>
        </div>
      </div>

      {/* Profile Parameters Strip & Status Badge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono font-bold text-primary-muted uppercase">Profile:</span>

          {/* Goal Badge */}
          <span className="px-3 py-1 rounded-xl bg-accent/10 border border-accent/30 text-xs font-mono font-bold text-accent">
            Goal: {formattedGoal}
          </span>

          {/* Diet Type Badge */}
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Diet: {formattedDietType}
          </span>
        </div>

        {/* Revision Status Badge */}
        <div className="shrink-0">
          {pendingRequest ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Clock3 className="w-3.5 h-3.5 animate-pulse" />
              <span>Revision Requested</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Active Diet Plan</span>
            </div>
          )}
        </div>
      </div>

      {/* PENDING DIET REVISION BANNER (WHEN REVISION REQUESTED) */}
      {pendingRequest && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300 animate-in fade-in duration-300">
          <div className="flex items-start sm:items-center gap-3">
            <Clock3 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                Diet revision requested on {formattedRequestDate || "recent date"}. Your coach is reviewing your updates.
              </p>
              {pendingRequest.memberNote && (
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5 italic">
                  &ldquo;{pendingRequest.memberNote}&rdquo;
                </p>
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 uppercase font-semibold shrink-0">
            Pending Admin Review
          </span>
        </div>
      )}

      {/* Beginner Quick Guide: डाइट फॉलो करने का आसान तरीका */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-accent/10 via-emerald-500/10 to-transparent border border-accent/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-tight">
                डाइट फॉलो करने का आसान तरीका &bull; Simple Guide for Everyone
              </h3>
              <p className="text-xs text-primary-muted mt-0.5">
                हर मील की फोटो देखकर भोजन पहचानें और बिना तराजू के कटोरी, हथेली या चम्मच से सही मात्रा लें।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-primary font-bold">
              📸 असली फोटो
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-primary font-bold">
              🥣 घरेलू माप (कटोरी/हथेली)
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-card border border-border text-primary font-bold">
              🔄 आसान Meal Swap
            </span>
          </div>
        </div>
      </div>

      {/* Macro Targets Strip */}
      <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-primary-muted uppercase">Prescribed Daily Energy Target</div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary mt-0.5 font-mono">
              {assignedPlan?.calories || 2600}{" "}
              <span className="text-base font-normal text-primary-dim font-mono">kcal / day</span>
            </div>
          </div>

          {/* Macro Breakdown Pills */}
          <div className="grid grid-cols-3 gap-3 font-mono">
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border text-center">
              <div className="text-[10px] text-primary-dim uppercase font-bold">Protein</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {assignedPlan?.protein || 180}g
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border text-center">
              <div className="text-[10px] text-primary-dim uppercase font-bold">Carbs</div>
              <div className="text-xl font-extrabold text-sky-500 mt-0.5">
                {assignedPlan?.carbs || 300}g
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border text-center">
              <div className="text-[10px] text-primary-dim uppercase font-bold">Fats</div>
              <div className="text-xl font-extrabold text-amber-500 mt-0.5">
                {assignedPlan?.fat || 70}g
              </div>
            </div>
          </div>
        </div>

        {assignedPlan?.dietStrategyNotes && (
          <div className="p-4 rounded-2xl bg-surface-elevated border border-border flex items-start gap-2.5 text-xs text-primary-muted">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span className="leading-relaxed">{assignedPlan.dietStrategyNotes}</span>
          </div>
        )}
      </div>

      {activeTab === "week" ? (
        <WeekDietChart
          dietType={(member?.dietType as any) || "non_vegetarian"}
          totalCalories={assignedPlan?.calories || 2400}
          mealsCount={4}
        />
      ) : (
        /* Meals Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Prescribed Meal Structure
            </h2>
            <span className="text-xs font-mono text-primary-dim">
              {meals.length} Meals &bull; {assignedPlan?.calories || 2400} kcal Total
            </span>
          </div>

          {meals.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Utensils className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold uppercase text-primary">
                  Standard Meal Framework
                </h3>
                <p className="text-xs text-primary-muted leading-relaxed">
                  Your daily macronutrient targets are active above:{" "}
                  <span className="text-primary font-bold">{assignedPlan?.calories || 2600} kcal</span> and{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{assignedPlan?.protein || 180}g protein</span>.
                  Detailed culinary breakdowns are being generated by your coach.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.map((meal, index) => (
                <MealCard
                  key={index}
                  meal={meal}
                  index={index}
                  onSwapMeal={handleSwapMeal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PDF Download and Modification Request Actions Bar */}
      {member && assignedPlan && (
        <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase text-primary">
              Download or Request Modifications
            </h3>
            <p className="text-xs text-primary-muted max-w-md">
              Download your complete print-ready A4 diet chart or submit dietary changes, allergy updates, or food swaps to your coach.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Download PDF Button */}
            <DietPdfDownloadButton
              member={{
                fullName: member.fullName,
                memberId: member.memberId,
                fitnessGoal: member.fitnessGoal,
                dietType: member.dietType || undefined,
              }}
              assignedPlan={assignedPlan}
            />

            {/* Request Modification CTA */}
            {pendingRequest ? (
              <button
                disabled
                className="py-3 px-5 rounded-2xl bg-surface-elevated border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider cursor-not-allowed opacity-80 flex items-center justify-center gap-2"
                title="A diet revision request is already under review"
              >
                <Clock3 className="w-4 h-4" />
                <span>Revision Pending</span>
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-5 rounded-2xl bg-surface-elevated hover:bg-surface border border-border hover:border-emerald-500/40 text-primary text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <FileEdit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Request Changes to Diet</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Diet Modification Modal */}
      <DietModificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRequestSubmitted}
        memberId={member?.memberId}
      />
    </div>
  );
}
