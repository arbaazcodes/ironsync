"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MemberDashboardData } from "@/lib/types/member";
import { ExerciseCard } from "@/components/dashboard/ExerciseCard";
import { ExerciseDetailDrawer } from "@/components/dashboard/ExerciseDetailDrawer";
import { WorkoutTimer } from "@/components/dashboard/WorkoutTimer";
import { WorkoutExercise } from "@/lib/types/onboarding";
import {
  Dumbbell,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Flame,
  Zap,
  Timer,
  Check,
  X,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Trophy,
} from "lucide-react";

export default function MemberWorkoutPage() {
  const router = useRouter();
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Exercise Detail Drawer State
  const [detailExercise, setDetailExercise] = useState<WorkoutExercise | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Rest Timer visibility
  const [showTimer, setShowTimer] = useState(false);

  // Interactive Set Completion Tracking (persisted per member + date + exercise index + set index)
  // { [exerciseIndex]: { [setIndex]: boolean } }
  const [completedSets, setCompletedSets] = useState<Record<number, Record<number, boolean>>>({});

  // Modals
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [skipReason, setSkipReason] = useState("fatigue");
  const [actionLoading, setActionLoading] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Today date string in IST
  const todayIST = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/member/dashboard");
        if (res.ok) {
          const result: MemberDashboardData = await res.json();
          setData(result);

          // Find today's weekday in IST and select default index
          const todayWeekday = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            timeZone: "Asia/Kolkata",
          })
            .format(new Date())
            .toUpperCase();

          const schedule = result.assignedPlan?.schedule || [];
          const matchedIdx = schedule.findIndex(
            (s) =>
              s.dayName.toUpperCase() === todayWeekday ||
              s.dayName.toUpperCase().startsWith(todayWeekday)
          );

          const activeIdx = matchedIdx >= 0 ? matchedIdx : 0;
          setSelectedDayIndex(activeIdx);

          // Load sets tracking from localStorage
          if (typeof window !== "undefined" && result.member?.memberId) {
            const storageKey = `ironsync_workout_${result.member.memberId}_${todayIST}_day${activeIdx}`;
            const saved = localStorage.getItem(storageKey);
            if (saved) {
              try {
                setCompletedSets(JSON.parse(saved));
              } catch {}
            }
          }
        }
      } catch (e) {
        console.error("Failed to load workouts:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [todayIST]);

  // Load sets when day index changes
  const handleSelectDay = (idx: number) => {
    setSelectedDayIndex(idx);
    if (typeof window !== "undefined" && data?.member?.memberId) {
      const storageKey = `ironsync_workout_${data.member.memberId}_${todayIST}_day${idx}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCompletedSets(JSON.parse(saved));
        } catch {
          setCompletedSets({});
        }
      } else {
        setCompletedSets({});
      }
    }
  };

  const handleToggleSet = (exerciseIdx: number, setIdx: number) => {
    setCompletedSets((prev) => {
      const exSets = prev[exerciseIdx] || {};
      const updatedExSets = {
        ...exSets,
        [setIdx]: !exSets[setIdx],
      };
      const updated = {
        ...prev,
        [exerciseIdx]: updatedExSets,
      };

      // Save to localStorage
      if (typeof window !== "undefined" && data?.member?.memberId) {
        const storageKey = `ironsync_workout_${data.member.memberId}_${todayIST}_day${selectedDayIndex}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }

      return updated;
    });
  };

  const handleOpenDetail = (exercise: WorkoutExercise) => {
    setDetailExercise(exercise);
    setIsDetailOpen(true);
  };

  // Parse set count from exercise.setsReps (e.g. "4 × 8-10" -> 4)
  const getSetCount = (setsReps: string): number => {
    const parts = setsReps.split("×").map((s) => s.trim());
    const count = parseInt(parts[0], 10);
    return isNaN(count) || count <= 0 ? 3 : Math.min(count, 8);
  };

  // Complete Session Flow
  const handleCompleteSession = async () => {
    setActionLoading(true);
    try {
      await fetch("/api/member/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "present" }),
      });
      setSessionCompleted(true);
      setIsCompleteModalOpen(true);
    } catch (err) {
      console.error("Failed to mark session complete:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Skip Session Flow
  const handleConfirmSkip = async () => {
    setActionLoading(true);
    try {
      await fetch("/api/member/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "skipped" }),
      });
      setIsSkipModalOpen(false);
      router.push("/member/dashboard");
    } catch (err) {
      console.error("Failed to skip session:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-primary-muted space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-mono uppercase tracking-wider">
          Loading Workout Protocol...
        </span>
      </div>
    );
  }

  const schedule = data?.assignedPlan?.schedule || [];
  const currentDay = schedule[selectedDayIndex] || schedule[0];

  // Calculate total sets and completed sets for progress
  let totalSetsCount = 0;
  let completedSetsCount = 0;
  if (currentDay && currentDay.type === "workout" && currentDay.exercises) {
    currentDay.exercises.forEach((ex, exIdx) => {
      const numSets = getSetCount(ex.setsReps);
      totalSetsCount += numSets;
      for (let s = 0; s < numSets; s++) {
        if (completedSets[exIdx]?.[s]) {
          completedSetsCount++;
        }
      }
    });
  }

  const progressPercent =
    totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/member/dashboard"
            className="inline-flex items-center gap-1 text-xs font-mono text-primary-muted hover:text-primary transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider font-bold">
            <Dumbbell className="w-3.5 h-3.5" />
            Assigned Split Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-primary mt-0.5">
            {data?.assignedPlan?.splitName || "Training Program"}
          </h1>
          <p className="text-xs text-primary-muted">
            Track individual sets, view video form loops, and launch rest intervals.
          </p>
        </div>

        {/* Timer Launcher Button */}
        <button
          onClick={() => setShowTimer(!showTimer)}
          className={`self-start sm:self-auto py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
            showTimer
              ? "bg-accent border-accent text-white shadow-accent-glow"
              : "bg-card border-border text-primary hover:border-accent/40 shadow-sm"
          }`}
        >
          <Timer className="w-4 h-4 text-accent" />
          <span>{showTimer ? "Hide Rest Timer" : "Rest Timer (90s)"}</span>
        </button>
      </div>

      {/* Floating / Collapsible Rest Timer */}
      {showTimer && (
        <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-md animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-primary-muted font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" /> Active Rest Interval
            </span>
            <button
              onClick={() => setShowTimer(false)}
              className="text-xs text-primary-dim hover:text-primary font-mono"
            >
              Close
            </button>
          </div>
          <WorkoutTimer defaultDuration={90} />
        </div>
      )}

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {schedule.map((item, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelectDay(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? "bg-accent border-accent text-white shadow-accent-glow"
                  : "bg-card border-border text-primary-muted hover:text-primary"
              }`}
            >
              <span>{item.dayName}</span>
              <span className="text-[10px] opacity-70">
                ({item.type === "recovery" ? "Rest" : `${item.exercises?.length || 0} Ex`})
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Card */}
      {currentDay && (
        <div className="space-y-6">
          {/* Day Focus Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-accent font-bold">{currentDay.dayName}</div>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-primary tracking-tight mt-0.5">
                {currentDay.focus}
              </h2>
              <p className="text-xs text-primary-muted mt-1">
                {currentDay.type === "recovery"
                  ? "Active recovery protocol — prioritize hydration, gentle mobility, and 8+ hours sleep."
                  : `Target: ${currentDay.exercises?.length || 0} movements &bull; Estimated completion: ~${
                      (currentDay.exercises?.length || 5) * 9
                    } min`}
              </p>
            </div>

            {currentDay.type === "workout" && (
              <div className="flex items-center gap-3">
                {/* Progress Mini Bar */}
                <div className="hidden sm:block text-right font-mono text-xs">
                  <div className="text-primary-dim uppercase text-[10px]">Session Progress</div>
                  <div className="text-primary font-bold">
                    {completedSetsCount} / {totalSetsCount} Sets ({progressPercent}%)
                  </div>
                </div>

                {/* Complete Button */}
                <button
                  onClick={handleCompleteSession}
                  disabled={actionLoading}
                  className="py-3 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                  <span>Complete Session</span>
                </button>
              </div>
            )}
          </div>

          {/* Exercise Roster with Interactive Set Trackers */}
          {currentDay.type === "workout" && currentDay.exercises && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-primary-muted">
                  Prescribed Movements & Sets
                </h3>
                <span className="text-xs font-mono text-primary-dim">
                  Click sets to track completion
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentDay.exercises.map((exercise, exIdx) => {
                  const numSets = getSetCount(exercise.setsReps);

                  return (
                    <div
                      key={exIdx}
                      className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm"
                    >
                      {/* Movement Card */}
                      <ExerciseCard
                        exercise={exercise}
                        index={exIdx}
                        onDetailClick={() => handleOpenDetail(exercise)}
                      />

                      {/* Interactive Set Tracker Row */}
                      <div className="px-4 py-3 bg-surface-elevated border-t border-border flex flex-wrap items-center justify-between gap-3">
                        <span className="text-[11px] font-mono text-primary-muted uppercase font-bold">
                          Sets Log:
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          {Array.from({ length: numSets }).map((_, setIdx) => {
                            const isSetDone = Boolean(completedSets[exIdx]?.[setIdx]);

                            return (
                              <button
                                key={setIdx}
                                onClick={() => handleToggleSet(exIdx, setIdx)}
                                className={`py-1.5 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                                  isSetDone
                                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                                    : "bg-surface border-border text-primary-muted hover:text-primary hover:bg-surface-elevated"
                                }`}
                                title={`Toggle Set ${setIdx + 1}`}
                              >
                                <div
                                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                    isSetDone
                                      ? "bg-emerald-500 border-emerald-400 text-white"
                                      : "border-border"
                                  }`}
                                >
                                  {isSetDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                                <span>Set {setIdx + 1}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* End of Workout Actions Bar */}
              <div className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="text-center sm:text-left">
                  <div className="text-sm font-bold text-primary uppercase">Finish Today&apos;s Training</div>
                  <p className="text-xs text-primary-muted mt-0.5">
                    Marking complete logs your attendance as present and finalizes your session.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsSkipModalOpen(true)}
                    className="py-3 px-4 rounded-xl text-xs font-mono uppercase text-primary-muted hover:text-primary hover:bg-surface-elevated transition-all border border-border/60"
                  >
                    Skip Session
                  </button>

                  <button
                    onClick={handleCompleteSession}
                    disabled={actionLoading}
                    className="py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                    <span>Complete Session</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recovery Day Protocol */}
          {currentDay.type === "recovery" && (
            <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-500 shadow-md">
                <Zap className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-extrabold uppercase text-primary">
                  Rest & Muscle Regeneration Day
                </h3>
                <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
                  Muscle protein synthesis and central nervous system recovery occur while resting.
                  Prioritize hydration, light mobility, and adequate sleep to prepare for your next
                  hypertrophy session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left font-mono text-xs">
                <div className="p-3 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-primary-dim text-[10px] uppercase block">Water Intake</span>
                  <span className="text-primary font-bold">3.5L - 4.0L</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-primary-dim text-[10px] uppercase block">Protein Goal</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {data?.assignedPlan?.protein || 180}g Target
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-primary-dim text-[10px] uppercase block">Sleep Target</span>
                  <span className="text-primary font-bold">8+ Hours</span>
                </div>
              </div>

              <Link
                href="/member/dashboard"
                className="inline-block py-3 px-6 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-primary text-xs font-mono uppercase font-bold transition-all"
              >
                Return to Member Dashboard
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Exercise Detail Drawer with Video Loop */}
      <ExerciseDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        exercise={detailExercise}
      />

      {/* MODAL: COMPLETE WORKOUT SUCCESS */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Attendance Recorded &bull; Present
              </span>
              <h2 className="text-2xl font-extrabold uppercase text-primary tracking-tight">
                Workout Completed!
              </h2>
              <p className="text-xs text-primary-muted leading-relaxed">
                Outstanding execution today. Your attendance has been marked as present in your gym
                record. Refuel with your target protein and hydration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-elevated border border-border grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-primary-dim uppercase block">Sets Logged</span>
                <span className="text-base font-bold text-primary">
                  {completedSetsCount} / {totalSetsCount || 15}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-primary-dim uppercase block">Est. Caloric Burn</span>
                <span className="text-base font-bold text-accent">~380 kcal</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/member/dashboard"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Return to Dashboard</span>
              </Link>
              <button
                onClick={() => setIsCompleteModalOpen(false)}
                className="w-full py-2.5 text-xs font-mono text-primary-muted hover:text-primary"
              >
                Review Workout Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SKIP WORKOUT */}
      {isSkipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 font-bold">
                  Attendance Action
                </div>
                <h2 className="text-lg font-extrabold uppercase text-primary">Skip Today&apos;s Workout</h2>
              </div>
              <button
                onClick={() => setIsSkipModalOpen(false)}
                className="p-1 rounded-lg text-primary-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-primary-muted leading-relaxed">
              This will record your attendance for today as <span className="text-amber-600 dark:text-amber-400 font-bold">Skipped</span> in your gym log.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-primary-dim block">
                Primary Reason for Skip
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: "fatigue", label: "Fatigue or Muscle Soreness" },
                  { key: "schedule", label: "Work or Travel Conflict" },
                  { key: "injury", label: "Minor Strain or Discomfort" },
                  { key: "rest", label: "Additional Rest Day Needed" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSkipReason(item.key)}
                    className={`py-2.5 px-3.5 rounded-xl text-left text-xs font-mono transition-all border ${
                      skipReason === item.key
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold"
                        : "bg-surface-elevated border-border text-primary-muted hover:text-primary hover:bg-surface"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSkipModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-surface-elevated hover:bg-surface text-primary border border-border font-mono text-xs font-bold uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSkip}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>Confirm Skip</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
