"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Flame,
  Zap,
  Timer,
  Check,
  X,
  Coffee,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

interface WorkoutRoutineProps {
  memberData?: MemberDashboardData | null;
  className?: string;
  showBackToDashboard?: boolean;
}

export function WorkoutRoutine({
  memberData: initialMemberData,
  className = "",
  showBackToDashboard = false,
}: WorkoutRoutineProps) {
  const router = useRouter();
  const [data, setData] = useState<MemberDashboardData | null>(initialMemberData || null);
  const [loading, setLoading] = useState(!initialMemberData);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Exercise Detail Drawer State
  const [detailExercise, setDetailExercise] = useState<WorkoutExercise | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Rest Timer visibility
  const [showTimer, setShowTimer] = useState(false);

  // Interactive Set Completion Tracking (persisted per member + date + exercise + set)
  const [completedSets, setCompletedSets] = useState<Record<number, Record<number, boolean>>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Local/IST Date string
  const todayIST = useMemo(() => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
    }).format(new Date());
  }, []);

  const todayWeekdayShort = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date()).toUpperCase();
  }, []);

  const todayWeekdayFull = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata",
    }).format(new Date());
  }, []);

  useEffect(() => {
    if (initialMemberData) {
      setData(initialMemberData);
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const res = await fetch("/api/member/dashboard");
        if (res.ok) {
          const result: MemberDashboardData = await res.json();
          setData(result);
        }
      } catch (e) {
        console.error("Failed to load workouts:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialMemberData]);

  const schedule = useMemo(
    () => data?.assignedPlan?.schedule || [],
    [data?.assignedPlan?.schedule]
  );

  // Match current day on initial load
  useEffect(() => {
    if (schedule.length > 0) {
      const matchedIdx = schedule.findIndex((s) => {
        const name = s.dayName.toUpperCase();
        return (
          name === todayWeekdayShort ||
          name.startsWith(todayWeekdayShort) ||
          name === todayWeekdayFull.toUpperCase()
        );
      });

      const initialIdx = matchedIdx >= 0 ? matchedIdx : 0;
      setSelectedDayIndex(initialIdx);

      // Load set persistence for initial day
      if (typeof window !== "undefined" && data?.member?.memberId) {
        const storageKey = `ironsync_workout_${data.member.memberId}_${todayIST}_day${initialIdx}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            setCompletedSets(JSON.parse(saved));
          } catch {}
        }
      }
    }
  }, [schedule, todayWeekdayShort, todayWeekdayFull, todayIST, data?.member?.memberId]);

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

  const getSetCount = (setsReps: string): number => {
    const parts = setsReps.split("×").map((s) => s.trim());
    const count = parseInt(parts[0], 10);
    return isNaN(count) || count <= 0 ? 3 : Math.min(count, 8);
  };

  const handleCompleteSession = async () => {
    setActionLoading(true);
    try {
      await fetch("/api/member/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "present" }),
      });
      setSessionCompleted(true);
    } catch (err) {
      console.error("Failed to mark session complete:", err);
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

  const currentDay = schedule[selectedDayIndex] || schedule[0];

  // Calculate sets progress
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

  const isTodaySelected =
    currentDay?.dayName.toUpperCase() === todayWeekdayShort ||
    currentDay?.dayName.toUpperCase().startsWith(todayWeekdayShort);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header & Rest Timer Action */}
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
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider font-bold">
            <Dumbbell className="w-3.5 h-3.5" />
            Day-Driven Workout Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-primary mt-0.5">
            {data?.assignedPlan?.splitName || "IronSync Resistance Split"}
          </h1>
          <p className="text-xs sm:text-sm text-primary-muted">
            Today is <span className="text-primary font-bold">{todayWeekdayFull}</span> &bull; Select any weekday to preview and track your workouts.
          </p>
        </div>

        {/* Rest Timer Button */}
        <button
          onClick={() => setShowTimer(!showTimer)}
          className={`self-start sm:self-auto py-2.5 px-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
            showTimer
              ? "bg-accent border-accent text-white shadow-accent-glow"
              : "bg-card border-border text-primary hover:border-accent/40 shadow-sm"
          }`}
        >
          <Timer className="w-4 h-4 text-accent" />
          <span>{showTimer ? "Hide Rest Timer" : "Rest Timer (90s)"}</span>
        </button>
      </div>

      {/* Floating Collapsible Rest Timer */}
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

      {/* Day Selector Pills Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-primary-muted uppercase font-bold">
          <span>Weekly Microcycle Schedule</span>
          <span className="text-accent">{isTodaySelected ? "Viewing Today" : "Previewing Selected Day"}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {schedule.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            const isToday =
              item.dayName.toUpperCase() === todayWeekdayShort ||
              item.dayName.toUpperCase().startsWith(todayWeekdayShort);

            return (
              <button
                key={idx}
                onClick={() => handleSelectDay(idx)}
                className={`relative px-4 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? "bg-accent border-accent text-white shadow-accent-glow"
                    : "bg-card border-border text-primary-muted hover:text-primary hover:border-border/80"
                }`}
              >
                <span>{item.dayName}</span>
                {isToday && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold uppercase ${
                      isSelected
                        ? "bg-white text-accent"
                        : "bg-accent/15 text-accent border border-accent/30"
                    }`}
                  >
                    Today
                  </span>
                )}
                <span className="text-[10px] opacity-75">
                  ({item.type === "recovery" ? "Rest" : `${item.exercises?.length || 0} Ex`})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail Container */}
      {currentDay && (
        <div className="space-y-6">
          {/* Day Focus Header */}
          <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-accent font-bold">
                  {currentDay.dayName} {isTodaySelected ? "• Today's Split" : ""}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-[10px] font-mono text-primary-muted">
                  {currentDay.type === "recovery" ? "Active Rest" : "Hypertrophy"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-primary tracking-tight mt-1">
                {currentDay.focus}
              </h2>
              <p className="text-xs text-primary-muted mt-1">
                {currentDay.type === "recovery"
                  ? "Active recovery protocol — prioritize hydration, gentle mobility, and 8+ hours sleep."
                  : `Target: ${currentDay.exercises?.length || 0} Prescribed Movements &bull; Est. Duration: ~${
                      (currentDay.exercises?.length || 5) * 9
                    } min`}
              </p>
            </div>

            {currentDay.type === "workout" && (
              <div className="flex items-center gap-3">
                {/* Progress Mini Bar */}
                <div className="hidden sm:block text-right font-mono text-xs">
                  <div className="text-primary-dim uppercase text-[10px]">Sets Progress</div>
                  <div className="text-primary font-bold">
                    {completedSetsCount} / {totalSetsCount} Sets ({progressPercent}%)
                  </div>
                </div>

                {/* Complete Button */}
                <button
                  onClick={handleCompleteSession}
                  disabled={actionLoading || sessionCompleted}
                  className={`py-3 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95 ${
                    sessionCompleted
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-default"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  }`}
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{sessionCompleted ? "Session Logged!" : "Complete Session"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Session Complete Notification */}
          {sessionCompleted && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-xs sm:text-sm font-semibold">
                  Workout logged! Your attendance for today has been marked as present.
                </p>
              </div>
              <button
                onClick={() => setSessionCompleted(false)}
                className="p-1 rounded-lg hover:bg-emerald-500/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Exercise Roster with Set Tracking */}
          {currentDay.type === "workout" && currentDay.exercises && currentDay.exercises.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-primary-muted font-bold flex items-center gap-2">
                  <Dumbbell className="w-3.5 h-3.5 text-accent" />
                  Prescribed Movements ({currentDay.exercises.length})
                </h3>
                <span className="text-xs font-mono text-primary-dim">
                  Click sets below each exercise to log reps
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentDay.exercises.map((exercise, exIdx) => {
                  const numSets = getSetCount(exercise.setsReps);

                  return (
                    <div
                      key={exIdx}
                      className="rounded-3xl bg-card border border-border overflow-hidden shadow-sm hover:border-border/80 transition-all"
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
                          Set Logs:
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          {Array.from({ length: numSets }).map((_, setIdx) => {
                            const isSetDone = Boolean(completedSets[exIdx]?.[setIdx]);

                            return (
                              <button
                                key={setIdx}
                                onClick={() => handleToggleSet(exIdx, setIdx)}
                                className={`py-1.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                                  isSetDone
                                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                                    : "bg-surface hover:bg-surface-elevated border-border text-primary-muted hover:text-primary"
                                }`}
                              >
                                <div
                                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
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
            </div>
          )}

          {/* Rest / Recovery Day Empty State */}
          {(currentDay.type === "recovery" || !currentDay.exercises || currentDay.exercises.length === 0) && (
            <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-sm text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-500 shadow-md">
                <Coffee className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold uppercase text-primary">
                  Rest Day: Hydrate, stretch, and recover for tomorrow
                </h3>
                <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
                  No heavy lifting scheduled today. Muscle protein synthesis and neural recovery occur during downtime.
                  Prioritize hydration, mobility work, and nutrient intake to recharge your muscular system.
                </p>
              </div>

              {/* Recovery Directives */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-primary-dim text-[10px] uppercase block">Water Intake</span>
                  <span className="text-primary font-bold">3.5L - 4.0L Target</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-primary-dim text-[10px] uppercase block">Protein Synthesis</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {data?.assignedPlan?.protein || 180}g Protein
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                  <span className="text-primary-dim text-[10px] uppercase block">Circadian Rest</span>
                  <span className="text-sky-500 font-bold">8+ Hours Sleep</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exercise Detail & Video Demo Drawer */}
      <ExerciseDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        exercise={detailExercise}
      />
    </div>
  );
}
