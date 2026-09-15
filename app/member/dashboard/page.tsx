"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CheckCircle2,
  AlertTriangle,
  Lock,
  Check,
  UserCheck,
  Coffee,
  CircleAlert,
} from "lucide-react";
import { MemberDashboardData } from "@/lib/types/member";
import { DayAttendanceSummary, AttendanceStatus } from "@/lib/types/attendance";
import { AiCoachDrawer } from "@/components/dashboard/AiCoachDrawer";
import { AttendanceDots } from "@/components/dashboard/AttendanceDots";

interface AttendanceState {
  todayDate: string;
  today: AttendanceStatus | "unmarked";
  weekSummary: DayAttendanceSummary[];
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [startingWorkout, setStartingWorkout] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashRes, attRes] = await Promise.all([
          fetch("/api/member/dashboard"),
          fetch("/api/member/attendance"),
        ]);

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setData(dashData);
        }

        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendance({
            todayDate: attData.todayDate,
            today: attData.today,
            weekSummary: attData.weekSummary || [],
          });
        }
      } catch (err) {
        console.error("Failed to load member dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const handleMarkPresent = async () => {
    if (!data?.member || isExpired || markingAttendance || attendance?.today === "present") return;
    setMarkingAttendance(true);
    try {
      const res = await fetch("/api/member/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "present" }),
      });

      if (res.ok) {
        // Refetch updated attendance summary
        const attRes = await fetch("/api/member/attendance");
        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendance({
            todayDate: attData.todayDate,
            today: attData.today,
            weekSummary: attData.weekSummary || [],
          });
        }
      }
    } catch (err) {
      console.error("Failed to mark attendance:", err);
    } finally {
      setMarkingAttendance(false);
    }
  };

  const handleStartWorkout = async () => {
    if (isExpired || startingWorkout) return;
    setStartingWorkout(true);
    try {
      // Auto mark attendance as present if not marked yet
      if (attendance?.today !== "present") {
        await fetch("/api/member/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "present" }),
        });
      }
    } catch (err) {
      console.warn("Auto-attendance sync warning:", err);
    }
    router.push("/member/workout");
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-primary-muted space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-mono uppercase tracking-wider">Syncing Member Blueprint...</span>
      </div>
    );
  }

  if (!data || !data.member) {
    return (
      <div className="py-20 text-center text-primary space-y-3">
        <div className="text-base font-bold text-rose-500">Failed to load member blueprint</div>
        <p className="text-xs text-primary-muted">Please re-authenticate or contact your gym front desk.</p>
        <Link
          href="/login?tab=member"
          className="inline-block py-2 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase transition-colors"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  const { member, assignedPlan } = data;

  // Timezone IST check
  const todayIST = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  // Expiration calculation
  const isExpired =
    member.status === "expired" ||
    member.status === "suspended" ||
    Boolean(member.expiryDate && member.expiryDate < todayIST);

  let daysRemaining: number | null = null;
  if (member.expiryDate) {
    const diff = new Date(member.expiryDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
  const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7;

  // Resolve today's workout matching IST weekday
  const todayWeekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Kolkata",
  })
    .format(new Date())
    .toUpperCase();

  const todaySchedule =
    assignedPlan?.schedule?.find(
      (s) => s.dayName.toUpperCase() === todayWeekday || s.dayName.toUpperCase().startsWith(todayWeekday)
    ) ||
    assignedPlan?.schedule?.[0] || {
      dayName: todayWeekday,
      focus: "Hypertrophy Push Session",
      type: "workout" as const,
      exercises: [],
    };

  const exerciseCount = todaySchedule.exercises?.length || 5;
  const durationMinutes = Math.max(45, exerciseCount * 9);

  return (
    <div className="space-y-8">
      {/* EXPIRED BANNER ALERT (IF APPLICABLE) */}
      {isExpired && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5 text-rose-700 dark:text-rose-300">
          <CircleAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold uppercase tracking-wide text-rose-700 dark:text-rose-200">
              Membership Expired or Inactive
            </div>
            <p className="text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
              Your gym access plan expired on{" "}
              <span className="font-mono font-bold text-primary">{member.expiryDate || "N/A"}</span>. Workout sessions and attendance self-marking are locked. Please visit the front desk to renew your membership.
            </p>
          </div>
        </div>
      )}

      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-72 h-full bg-accent/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-[10px] font-mono font-bold uppercase text-accent">
                Gym Member ID: {member.memberId}
              </span>

              {isExpired ? (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Expired
                </span>
              ) : isExpiringSoon ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Expiring in {daysRemaining}d
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {member.status}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-primary">
              Welcome Back, {member.fullName.split(" ")[0]}
            </h1>

            <p className="text-xs sm:text-sm text-primary-muted max-w-lg">
              Goal: <span className="text-primary font-semibold uppercase">{member.fitnessGoal}</span> &bull; Blueprint:{" "}
              <span className="text-primary font-semibold">{assignedPlan?.splitName || "IronSync Core Split"}</span>
            </p>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Action 1: Mark Present Quick Button */}
            <button
              onClick={handleMarkPresent}
              disabled={isExpired || markingAttendance || attendance?.today === "present"}
              className={`py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
                attendance?.today === "present"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-default"
                  : isExpired
                  ? "bg-surface border-border text-primary-dim cursor-not-allowed"
                  : "bg-surface-elevated hover:bg-surface border-border text-primary hover:border-emerald-500/50"
              }`}
              title={
                attendance?.today === "present"
                  ? "Already marked present today"
                  : isExpired
                  ? "Membership expired"
                  : "Mark yourself present for today's workout"
              }
            >
              {markingAttendance ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
              ) : attendance?.today === "present" ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <UserCheck className="w-4 h-4 text-primary-muted" />
              )}
              <span>
                {attendance?.today === "present"
                  ? "Present Today"
                  : markingAttendance
                  ? "Marking..."
                  : "Mark Present"}
              </span>
            </button>

            {/* Action 2: Ask Coach Launcher */}
            <button
              onClick={() => setIsCoachOpen(true)}
              className="py-3 px-4 rounded-2xl bg-accent/10 hover:bg-accent/20 border border-accent/25 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all group"
            >
              <Bot className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
              <span>Ask Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Daily Fuel */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-primary-muted text-[11px] font-mono uppercase">
            <span>Target Fuel</span>
            <Flame className="w-3.5 h-3.5 text-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">
            {assignedPlan?.calories || 2600}{" "}
            <span className="text-xs font-normal text-primary-dim">kcal</span>
          </div>
          <div className="text-[10px] text-primary-dim font-mono">Prescribed Daily Intake</div>
        </div>

        {/* Daily Protein */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-primary-muted text-[11px] font-mono uppercase">
            <span>Protein</span>
            <Apple className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {assignedPlan?.protein || 180}{" "}
            <span className="text-xs font-normal text-primary-dim">g</span>
          </div>
          <div className="text-[10px] text-primary-dim font-mono">Muscle Protein Synthesis</div>
        </div>

        {/* Today's Attendance Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-primary-muted text-[11px] font-mono uppercase">
            <span>Today&apos;s Check-In</span>
            <UserCheck className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-lg sm:text-2xl font-extrabold uppercase truncate">
            {attendance?.today === "present" ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 inline" /> Present
              </span>
            ) : attendance?.today === "missed" ? (
              <span className="text-rose-500">Missed</span>
            ) : attendance?.today === "skipped" ? (
              <span className="text-amber-500">Skipped</span>
            ) : (
              <span className="text-primary-muted">Not Marked</span>
            )}
          </div>
          <div className="text-[10px] text-primary-dim font-mono">Calendar Day in IST</div>
        </div>

        {/* Membership Access Term */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-primary-muted text-[11px] font-mono uppercase">
            <span>Membership</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div
            className={`text-lg sm:text-xl font-bold font-mono truncate ${
              isExpired ? "text-rose-500" : isExpiringSoon ? "text-amber-500" : "text-primary"
            }`}
          >
            {member.expiryDate || "Active Access"}
          </div>
          <div className="text-[10px] text-primary-dim font-mono">
            {isExpired
              ? "Plan Expired — See Desk"
              : daysRemaining !== null
              ? `${daysRemaining} days remaining`
              : "Gym Access Valid"}
          </div>
        </div>
      </div>

      {/* 7-DAY ATTENDANCE ROLL CALL WIDGET */}
      {attendance?.weekSummary && (
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Attendance Log (Last 7 Days)</span>
              </div>
              <p className="text-[11px] text-primary-muted mt-0.5">
                Daily IST check-ins. Rest days are automatically tracked according to your training blueprint.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono text-primary-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Present
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Missed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Skipped
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500/40" /> Rest
              </span>
            </div>
          </div>

          <AttendanceDots summary={attendance.weekSummary} />
        </div>
      )}

      {/* Main 2-Column Split: Today's Workout + Nutrition Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Workout Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-bold">
                <Dumbbell className="w-4 h-4" />
                <span>Today&apos;s Prescribed Training</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] font-mono text-primary-muted">
                  {todaySchedule.dayName}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] font-mono text-primary-muted">
                  ~{durationMinutes} min
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold uppercase text-primary tracking-tight">
                {todaySchedule.focus}
              </h2>
              <p className="text-xs text-primary-muted mt-1">
                {todaySchedule.type === "recovery"
                  ? "Scheduled active rest & regeneration day. Stay hydrated and hit your protein target."
                  : `${exerciseCount} Prescribed Movements with Video Form Loops & Biomechanical Cues`}
              </p>
            </div>

            {/* Exercises List Snippet */}
            {todaySchedule.type === "workout" && todaySchedule.exercises && (
              <div className="space-y-2 pt-2">
                {todaySchedule.exercises.slice(0, 3).map((ex, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-primary font-medium truncate max-w-[200px]">
                      {i + 1}. {ex.name}
                    </span>
                    <span className="text-primary-muted">{ex.setsReps}</span>
                  </div>
                ))}
                {todaySchedule.exercises.length > 3 && (
                  <div className="text-[11px] font-mono text-primary-dim text-center pt-1">
                    + {todaySchedule.exercises.length - 3} more movements
                  </div>
                )}
              </div>
            )}

            {todaySchedule.type === "recovery" && (
              <div className="p-4 rounded-xl bg-surface-elevated border border-border flex items-center gap-3 text-xs text-primary-muted font-mono">
                <Coffee className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Active recovery scheduled for today. Rest & recharge your nervous system.</span>
              </div>
            )}
          </div>

          {/* Action 1: Start Workout or Locked */}
          {isExpired ? (
            <div className="w-full py-3.5 px-4 rounded-xl bg-surface border border-border text-primary-dim font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed">
              <Lock className="w-4 h-4 text-rose-500" />
              <span>Workout Locked &bull; See Front Desk to Renew</span>
            </div>
          ) : (
            <button
              onClick={handleStartWorkout}
              disabled={startingWorkout}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-accent-glow transition-all active:scale-[0.99]"
            >
              {startingWorkout ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Launching Session...</span>
                </>
              ) : (
                <>
                  <span>Start Workout Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Today's Nutrition Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                <Apple className="w-4 h-4" />
                <span>Prescribed Fuel Strategy</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] font-mono text-primary-muted">
                Daily Targets
              </span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold uppercase text-primary tracking-tight">
                {assignedPlan?.calories || 2600} Calories
              </h2>
              <p className="text-xs text-primary-muted mt-1">
                Optimized macro split for muscle hypertrophy & glycogen restoration
              </p>
            </div>

            {/* Macro Bars */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <div className="text-[10px] text-primary-dim uppercase">Protein</div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {assignedPlan?.protein || 180}g
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <div className="text-[10px] text-primary-dim uppercase">Carbs</div>
                <div className="text-base font-bold text-sky-500">
                  {assignedPlan?.carbs || 300}g
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <div className="text-[10px] text-primary-dim uppercase">Fats</div>
                <div className="text-base font-bold text-amber-500">
                  {assignedPlan?.fat || 70}g
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/member/nutrition"
            className="w-full py-3.5 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <span>View Meal Blueprint & Swaps</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recovery Protocol Card */}
      {assignedPlan?.recoveryProtocol && (
        <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500 font-bold">
            <Zap className="w-4 h-4" />
            <span>Recovery & Optimization Protocol</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px]">Sleep Target</span>
              <div className="text-primary font-semibold">
                {assignedPlan.recoveryProtocol.sleepTarget}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px]">Hydration Goal</span>
              <div className="text-primary font-semibold truncate">
                {assignedPlan.recoveryProtocol.hydrationTarget}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px]">Mobility Protocol</span>
              <div className="text-primary font-semibold">
                {assignedPlan.recoveryProtocol.mobilityWindow}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Coach Drawer Component */}
      <AiCoachDrawer
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        memberData={data}
        onPlanUpdated={() => {
          fetch("/api/member/dashboard")
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(console.error);
        }}
      />
    </div>
  );
}
