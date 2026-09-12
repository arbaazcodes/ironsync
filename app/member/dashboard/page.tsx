"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Flame,
  Apple,
  Zap,
  Bot,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Loader2,
  TrendingUp,
  Award,
} from "lucide-react";
import { MemberDashboardData } from "@/lib/types/member";
import { AiCoachDrawer } from "@/components/dashboard/AiCoachDrawer";

export default function MemberDashboardPage() {
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/member/dashboard");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-white/50 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF1E1E]" />
        <span className="text-xs font-mono uppercase tracking-wider">Syncing Member Blueprint...</span>
      </div>
    );
  }

  if (!data || !data.member) {
    return (
      <div className="py-20 text-center text-white space-y-3">
        <div className="text-base font-bold text-red-400">Failed to load member blueprint</div>
        <p className="text-xs text-white/50">Please re-authenticate or contact your gym front desk.</p>
        <Link
          href="/login?tab=member"
          className="inline-block py-2 px-4 rounded-xl bg-[#FF1E1E] text-xs font-bold uppercase"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  const { member, assignedPlan } = data;
  const todaySchedule = assignedPlan?.schedule?.[0] || {
    dayName: "Day 1",
    focus: "Hypertrophy Push Session",
    type: "workout" as const,
    tag: "hypertrophy",
    exercises: [],
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141414] via-[#161616] to-[#0f0f0f] border border-white/[0.08] p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-80 h-full bg-[#FF1E1E]/[0.06] blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF1E1E]/15 border border-[#FF1E1E]/30 text-[10px] font-mono font-bold uppercase text-[#FF1E1E]">
                Gym Member ID: {member.memberId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-bold uppercase text-emerald-400">
                {member.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Welcome Back, {member.fullName.split(" ")[0]}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-lg">
              Goal: <span className="text-white font-semibold uppercase">{member.fitnessGoal}</span> &bull; Blueprint:{" "}
              <span className="text-white font-semibold">{assignedPlan?.splitName || "IronSync Core Split"}</span>
            </p>
          </div>

          {/* Quick AI Coach Launcher */}
          <button
            onClick={() => setIsCoachOpen(true)}
            className="self-start sm:self-auto py-3 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-lg hover:border-[#FF1E1E]/50 group"
          >
            <Bot className="w-4 h-4 text-[#FF1E1E] group-hover:scale-110 transition-transform" />
            <span>AI Coach</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Daily Fuel */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-mono uppercase">
            <span>Target Fuel</span>
            <Flame className="w-3.5 h-3.5 text-[#FF1E1E]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {assignedPlan?.calories || 2600}{" "}
            <span className="text-xs font-normal text-white/40">kcal</span>
          </div>
          <div className="text-[10px] text-white/40 font-mono">Prescribed Daily Intake</div>
        </div>

        {/* Daily Protein */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-mono uppercase">
            <span>Protein</span>
            <Apple className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {assignedPlan?.protein || 180}{" "}
            <span className="text-xs font-normal text-white/40">g</span>
          </div>
          <div className="text-[10px] text-white/40 font-mono">Muscle Protein Synthesis</div>
        </div>

        {/* Training Frequency */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-mono uppercase">
            <span>Frequency</span>
            <Dumbbell className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {assignedPlan?.trainingDays || 5}{" "}
            <span className="text-xs font-normal text-white/40">days/wk</span>
          </div>
          <div className="text-[10px] text-white/40 font-mono">Assigned Split Routine</div>
        </div>

        {/* Membership Expiry */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-1.5">
          <div className="flex items-center justify-between text-white/50 text-[11px] font-mono uppercase">
            <span>Membership</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 truncate">
            {member.expiryDate || "Active Plan"}
          </div>
          <div className="text-[10px] text-white/40 font-mono">Gym Access Valid</div>
        </div>
      </div>

      {/* Main 2-Column Split: Today's Workout + Nutrition Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Workout Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#121212] border border-white/[0.08] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#FF1E1E]">
                <Dumbbell className="w-4 h-4" />
                <span>Next Training Session</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-white/60">
                {todaySchedule.dayName}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-tight">
                {todaySchedule.focus}
              </h2>
              <p className="text-xs text-white/50 mt-1">
                {todaySchedule.exercises?.length || 5} Prescribed Movements with Video Form Loops
              </p>
            </div>

            {/* Exercises List Snippet */}
            <div className="space-y-2 pt-2">
              {todaySchedule.exercises?.slice(0, 3).map((ex, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-white font-medium">{ex.name}</span>
                  <span className="text-white/40">
                    {ex.setsReps}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/member/workout"
            className="w-full py-3.5 rounded-xl bg-[#FF1E1E] hover:bg-[#E01818] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF1E1E]/20 transition-all"
          >
            <span>Launch Workout Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Today's Nutrition Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#121212] border border-white/[0.08] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
                <Apple className="w-4 h-4" />
                <span>Prescribed Fuel Strategy</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-white/60">
                Daily Targets
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-tight">
                {assignedPlan?.calories || 2600} Calories
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Optimized macro split for muscle hypertrophy & glycogen restoration
              </p>
            </div>

            {/* Macro Bars */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] text-white/40 uppercase">Protein</div>
                <div className="text-base font-bold text-emerald-400">
                  {assignedPlan?.protein || 180}g
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] text-white/40 uppercase">Carbs</div>
                <div className="text-base font-bold text-sky-400">
                  {assignedPlan?.carbs || 300}g
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] text-white/40 uppercase">Fats</div>
                <div className="text-base font-bold text-amber-400">
                  {assignedPlan?.fat || 70}g
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/member/nutrition"
            className="w-full py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span>View Meal Blueprint & Swaps</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recovery Protocol Card */}
      {assignedPlan?.recoveryProtocol && (
        <div className="p-6 sm:p-7 rounded-3xl bg-[#121212] border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
            <Zap className="w-4 h-4" />
            <span>Recovery & Optimization Protocol</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-white/40 uppercase text-[10px]">Sleep Target</span>
              <div className="text-white font-semibold">
                {assignedPlan.recoveryProtocol.sleepTarget}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-white/40 uppercase text-[10px]">Hydration Goal</span>
              <div className="text-white font-semibold truncate">
                {assignedPlan.recoveryProtocol.hydrationTarget}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-white/40 uppercase text-[10px]">Mobility Protocol</span>
              <div className="text-white font-semibold">
                {assignedPlan.recoveryProtocol.mobilityWindow}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Coach Drawer Component */}
      <AiCoachDrawer isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} />
    </div>
  );
}
