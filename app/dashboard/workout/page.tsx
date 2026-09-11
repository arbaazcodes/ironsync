"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExerciseCard } from "@/components/dashboard/ExerciseCard";
import { ExerciseSwapModal } from "@/components/dashboard/ExerciseSwapModal";
import { ExerciseDetailDrawer } from "@/components/dashboard/ExerciseDetailDrawer";
import { WorkoutExercise, WorkoutDayPlan } from "@/lib/types/onboarding";
import { updatePlanSchedule } from "@/lib/supabase/planSync";
import { WorkoutTimer } from "@/components/dashboard/WorkoutTimer";
import {
  Dumbbell,
  Calendar,
  Flame,
  CheckCircle2,
  Check,
  Sparkles,
  RefreshCw,
  ArrowRight,
  RotateCcw,
  Save,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface PendingWorkoutSwap {
  dayIdx: number;
  exerciseIdx: number;
  original: WorkoutExercise;
  replacement: WorkoutExercise;
}

export default function DashboardWorkoutPage() {
  const { activePlan, refreshPlan } = useAuth();
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
  const [schedule, setSchedule] = useState<WorkoutDayPlan[]>([]);
  const [pendingSwap, setPendingSwap] = useState<PendingWorkoutSwap | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  // Track workout page viewed
  useEffect(() => {
    if (activePlan) {
      trackEvent("workout_viewed", {
        training_days: activePlan.trainingDays,
        goal: activePlan.goal,
      });
    }
  }, [activePlan]);

  // Swap Modal State
  const [swapModal, setSwapModal] = useState<{
    isOpen: boolean;
    exercise: WorkoutExercise | null;
    exerciseIdx: number;
    dayIdx: number;
  }>({
    isOpen: false,
    exercise: null,
    exerciseIdx: -1,
    dayIdx: -1,
  });

  // Detail Drawer State
  const [detailDrawer, setDetailDrawer] = useState<{
    isOpen: boolean;
    exercise: WorkoutExercise | null;
  }>({
    isOpen: false,
    exercise: null,
  });

  // Sync initial schedule from activePlan
  useEffect(() => {
    if (activePlan?.schedule) {
      setSchedule(activePlan.schedule);
    }
  }, [activePlan]);

  // Check URL query param ?day=X safely on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const dayParam = params.get("day");
      if (dayParam) {
        const parsed = parseInt(dayParam, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          setSelectedDayIdx(parsed);
        }
      }

      // Load completed days from localStorage
      if (activePlan?.schedule) {
        const completedMap: Record<string, boolean> = {};
        activePlan.schedule.forEach((day) => {
          const key = `ironsync_completed_${activePlan.id || "local"}_${day.dayName}`;
          if (localStorage.getItem(key) === "true") {
            completedMap[day.dayName] = true;
          }
        });
        setCompletedDays(completedMap);
      }
    }
  }, [activePlan]);

  if (!activePlan) return null;

  const currentSchedule = schedule.length > 0 ? schedule : activePlan.schedule || [];
  const currentDay = currentSchedule[selectedDayIdx] || currentSchedule[0];
  const isCurrentDayCompleted = Boolean(completedDays[currentDay?.dayName]);

  const handleToggleCurrentDayComplete = () => {
    if (!currentDay) return;
    const nextState = !isCurrentDayCompleted;
    const key = `ironsync_completed_${activePlan.id || "local"}_${currentDay.dayName}`;

    setCompletedDays((prev) => ({
      ...prev,
      [currentDay.dayName]: nextState,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem(key, String(nextState));
    }
  };

  // Open Swap Modal for specific exercise
  const handleOpenSwapModal = (exercise: WorkoutExercise, exIdx: number) => {
    setSwapModal({
      isOpen: true,
      exercise,
      exerciseIdx: exIdx,
      dayIdx: selectedDayIdx,
    });
  };

  // Apply Swap locally (updates displayed plan without mutating database yet)
  const handleSelectSwap = (swappedExercise: WorkoutExercise) => {
    if (!swapModal.exercise || swapModal.exerciseIdx < 0 || swapModal.dayIdx < 0) return;

    const original = swapModal.exercise;
    const dayIdx = swapModal.dayIdx;
    const exerciseIdx = swapModal.exerciseIdx;

    setSchedule((prev) => {
      const updated = [...prev];
      const targetDay = { ...updated[dayIdx] };
      const updatedExercises = [...(targetDay.exercises || [])];
      updatedExercises[exerciseIdx] = swappedExercise;
      targetDay.exercises = updatedExercises;
      updated[dayIdx] = targetDay;
      return updated;
    });

    setPendingSwap({
      dayIdx,
      exerciseIdx,
      original,
      replacement: swappedExercise,
    });
    setSaveStatus(null);
  };

  // Undo Swap: reverts back to original exercise
  const handleUndoSwap = () => {
    if (!pendingSwap) return;

    setSchedule((prev) => {
      const updated = [...prev];
      const targetDay = { ...updated[pendingSwap.dayIdx] };
      const updatedExercises = [...(targetDay.exercises || [])];
      updatedExercises[pendingSwap.exerciseIdx] = pendingSwap.original;
      targetDay.exercises = updatedExercises;
      updated[pendingSwap.dayIdx] = targetDay;
      return updated;
    });

    setPendingSwap(null);
    setSaveStatus("Reverted back to original exercise.");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Save Changes: permanently persists the swap to active plan
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveStatus("Persisting swap to active blueprint...");

      await updatePlanSchedule(activePlan.id, schedule);
      if (refreshPlan) {
        await refreshPlan();
      }

      setPendingSwap(null);
      setSaveStatus("Changes successfully saved to active blueprint!");
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      console.error("Failed to save schedule changes:", err);
      setSaveStatus("Failed to save changes. Please retry.");
    } finally {
      setIsSaving(false);
    }
  };

  const exercises = currentDay?.exercises || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="space-y-3 pb-5 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="sm">
              WORKOUT
            </Badge>
            <span className="text-xs font-mono text-primary-dim">
              {activePlan.trainingDays} Days / Week Cadence &bull; {activePlan.equipment ? activePlan.equipment.replace(/_/g, " ") : "gym"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 uppercase">
            {activePlan.splitName}
          </h1>
          <p className="text-xs sm:text-sm text-primary-muted mt-0.5">
            Engineered for mechanical tension, progressive overload, and systematic muscle group recovery.
          </p>
        </div>

        <button
          onClick={() => setTimerOpen(!timerOpen)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all self-start sm:self-auto shrink-0 shadow-sm ${
            timerOpen
              ? "bg-accent text-white border-accent shadow-accent-glow"
              : "bg-card text-white border-white/[0.08] hover:border-accent/40 hover:bg-surface-elevated"
          }`}
        >
          <Timer className="w-4 h-4 text-accent" />
          <span>{timerOpen ? "Hide Rest Timer" : "Rest & Set Timer"}</span>
        </button>
      </div>

      {/* Rest Timer Companion */}
      {timerOpen && (
        <div className="animate-in slide-in-from-top-3 duration-300 max-w-md mx-auto w-full">
          <WorkoutTimer defaultDuration={90} />
        </div>
      )}

      {/* 2. Swap Confirmation & Preview Banner */}
      {pendingSwap && (
        <div className="p-4 rounded-2xl bg-accent/[0.08] border border-accent/40 shadow-lg animate-in slide-in-from-top-2 duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>UNSAVED EXERCISE SWAP ACTIVE</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-primary-dim">Original:</span>
              <span className="line-through text-primary-muted font-medium">
                {pendingSwap.original.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
              <span className="text-white font-bold text-sm">
                {pendingSwap.replacement.name}
              </span>
            </div>
            <p className="text-[11px] text-primary-dim">
              Displayed plan updated locally. Save to update your active blueprint or undo to revert.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <Button
              onClick={handleUndoSwap}
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              className="font-mono text-xs"
            >
              Undo Swap
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              className="font-mono text-xs shadow-md shadow-accent/20"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Temporary Notification Status */}
      {saveStatus && !pendingSwap && (
        <div className="p-3 rounded-xl bg-card border border-accent/30 text-xs font-mono text-white flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* 3. Day Selector Tabs (reflects user's actual generated schedule) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-primary-dim px-1">
          <span className="uppercase tracking-wider">SELECT TRAINING DAY</span>
          <span className="text-white font-bold">
            {Object.values(completedDays).filter(Boolean).length} / {activePlan.trainingDays} Complete
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {currentSchedule.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            const isDayDone = Boolean(completedDays[day.dayName]);
            const isWorkout = day.type === "workout";

            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIdx(idx)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-accent-glow"
                    : isDayDone
                    ? "bg-emerald-500/[0.1] text-emerald-400 border-emerald-500/30"
                    : "bg-card text-primary-muted border-white/[0.08] hover:border-accent/40 hover:text-white"
                }`}
              >
                <span className="font-bold">{day.dayName}</span>
                <span>&bull;</span>
                <span className="truncate max-w-[130px]">{day.focus}</span>
                {isDayDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isWorkout ? "bg-accent shadow-[0_0_6px_rgba(255,30,30,0.8)]" : "bg-primary-dim/40"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Selected Day Workout Routine */}
      <Card variant="elevated" padding="lg" className="space-y-6 border-border/80 shadow-xl">
        {/* Day Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/70 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-accent">
                {currentDay.dayName} ROUTINE
              </span>
              <Badge variant="subtle" size="sm">
                {currentDay.tag}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight mt-1 uppercase">
              {currentDay.focus}
            </h2>
          </div>

          {/* Completion Toggle */}
          {currentDay.type === "workout" && (
            <button
              onClick={handleToggleCurrentDayComplete}
              className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all self-start sm:self-center ${
                isCurrentDayCompleted
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25"
                  : "bg-surface text-primary-muted border-border hover:text-primary hover:border-accent/40"
              }`}
            >
              {isCurrentDayCompleted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Workout completed ✓</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Mark Workout Complete</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Exercises List or Recovery State */}
        {currentDay.type === "workout" ? (
          exercises.length > 0 ? (
            <div className="space-y-3">
              {exercises.map((exercise, idx) => (
                <ExerciseCard
                  key={idx}
                  exercise={exercise}
                  index={idx}
                  onSwapClick={(ex, i) => handleOpenSwapModal(ex, i)}
                  onDetailClick={(ex) => setDetailDrawer({ isOpen: true, exercise: ex })}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-surface border border-dashed border-border text-xs text-primary-muted">
              Your workout plan hasn&apos;t been generated yet.
            </div>
          )
        ) : (
          <div className="p-8 text-center rounded-2xl bg-surface border border-dashed border-border space-y-3">
            <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent mx-auto">
              <Flame className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-primary">Scheduled Recovery & Tissue Reset</h3>
            <p className="text-xs sm:text-sm text-primary-muted max-w-md mx-auto leading-relaxed">
              No heavy compound resistance scheduled today. Engage in 20-30 minutes of low-intensity Zone 2 walking, focused diaphragmatic breathing, and 15 minutes of dynamic hip and thoracic spine mobility.
            </p>
          </div>
        )}

        {/* Footer Notes */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-primary-dim border-t border-border/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            Warm-up: 2 progressive acclimation sets prior to primary compound lift
          </span>
          <span>Deterministic Biomechanical Swapping Enabled</span>
        </div>
      </Card>

      {/* Exercise Swap Modal */}
      {swapModal.exercise && (
        <ExerciseSwapModal
          isOpen={swapModal.isOpen}
          onClose={() => setSwapModal({ isOpen: false, exercise: null, exerciseIdx: -1, dayIdx: -1 })}
          currentExercise={swapModal.exercise}
          userEquipment={activePlan.equipment}
          userExperience={activePlan.experience}
          onSelectSwap={handleSelectSwap}
        />
      )}

      {/* Exercise Execution Guidance Detail Drawer */}
      <ExerciseDetailDrawer
        isOpen={detailDrawer.isOpen}
        onClose={() => setDetailDrawer({ isOpen: false, exercise: null })}
        exercise={detailDrawer.exercise}
        onSwapClick={(ex) => {
          const idx = currentDay.exercises?.findIndex((e) => e.name === ex.name) ?? 0;
          handleOpenSwapModal(ex, idx >= 0 ? idx : 0);
        }}
      />
    </div>
  );
}
