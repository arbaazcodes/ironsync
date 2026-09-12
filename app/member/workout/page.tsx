"use client";

import React, { useEffect, useState } from "react";
import { MemberDashboardData } from "@/lib/types/member";
import { ExerciseCard } from "@/components/dashboard/ExerciseCard";
import { ExerciseDetailDrawer } from "@/components/dashboard/ExerciseDetailDrawer";
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
} from "lucide-react";

export default function MemberWorkoutPage() {
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Exercise Detail Drawer State
  const [detailExercise, setDetailExercise] = useState<WorkoutExercise | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Completed days
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/member/dashboard");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (e) {
        console.error("Failed to load workouts:", e);
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
        <span className="text-xs font-mono uppercase tracking-wider">
          Loading Workout Protocol...
        </span>
      </div>
    );
  }

  const schedule = data?.assignedPlan?.schedule || [];
  const currentDay = schedule[selectedDayIndex] || schedule[0];

  const handleOpenDetail = (exercise: WorkoutExercise) => {
    setDetailExercise(exercise);
    setIsDetailOpen(true);
  };

  const handleToggleCompleted = (idx: number) => {
    setCompletedDays((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#FF1E1E] uppercase tracking-wider">
          <Dumbbell className="w-3.5 h-3.5" />
          Assigned Split Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
          {data?.assignedPlan?.splitName || "Training Program"}
        </h1>
        <p className="text-xs sm:text-sm text-white/50">
          Kinetic form cues, sets, rep targets, and exercise video execution loops.
        </p>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {schedule.map((item, idx) => {
          const isSelected = selectedDayIndex === idx;
          const isDone = completedDays[idx];
          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? "bg-[#FF1E1E] border-[#FF1E1E] text-white shadow-lg shadow-[#FF1E1E]/20"
                  : isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-[#121212] border-white/[0.08] text-white/60 hover:text-white"
              }`}
            >
              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
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
          <div className="p-6 sm:p-7 rounded-3xl bg-[#121212] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-[#FF1E1E]">{currentDay.dayName}</div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-0.5">
                {currentDay.focus}
              </h2>
              <p className="text-xs text-white/50 mt-1">
                {currentDay.type === "recovery"
                  ? "Active recovery protocol — prioritize hydration, gentle mobility, and 8+ hours sleep."
                  : `Target: ${currentDay.exercises?.length || 0} compound and isolation movements`}
              </p>
            </div>

            {currentDay.type === "workout" && (
              <button
                onClick={() => handleToggleCompleted(selectedDayIndex)}
                className={`py-3 px-5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  completedDays[selectedDayIndex]
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.12]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedDays[selectedDayIndex] ? "Session Completed" : "Mark Session Complete"}
                </span>
              </button>
            )}
          </div>

          {/* Exercise Roster */}
          {currentDay.type === "workout" && currentDay.exercises && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/60">
                Prescribed Movements & Sets
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {currentDay.exercises.map((exercise, i) => (
                  <ExerciseCard
                    key={i}
                    exercise={exercise}
                    index={i}
                    onDetailClick={() => handleOpenDetail(exercise)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recovery Day Protocol */}
          {currentDay.type === "recovery" && (
            <div className="p-8 rounded-3xl bg-[#121212] border border-white/[0.08] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase text-white">Rest & Regeneration Day</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
                  Muscle protein synthesis and central nervous system replenishment occur while resting. Stay hydrated and hit your daily protein goal.
                </p>
              </div>
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
    </div>
  );
}
