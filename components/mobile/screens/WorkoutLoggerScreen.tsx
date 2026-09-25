"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Timer,
  Zap,
  Box,
  Check,
  Plus,
  Minus,
  ArrowRight,
  Flame,
  RotateCcw,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface SetItem {
  setNumber: number;
  prev: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface Exercise {
  name: string;
  category: string;
  target: string;
  rpe: string;
  restSec: number;
  sets: SetItem[];
}

const DEFAULT_EXERCISES: Exercise[] = [
  {
    name: "Incline Dumbbell Press",
    category: "Chest & Triceps",
    target: "Upper Pectoralis Major, Anterior Delts",
    rpe: "8.5",
    restSec: 90,
    sets: [
      { setNumber: 1, prev: "100 × 10", weight: 100, reps: 10, completed: true },
      { setNumber: 2, prev: "105 × 8", weight: 105, reps: 8, completed: false },
      { setNumber: 3, prev: "105 × 8", weight: 105, reps: 8, completed: false },
      { setNumber: 4, prev: "110 × 6", weight: 110, reps: 6, completed: false },
    ],
  },
  {
    name: "Flat Barbell Bench Press",
    category: "Chest & Front Delts",
    target: "Sternal Pectoralis, Triceps Brachii",
    rpe: "9.0",
    restSec: 120,
    sets: [
      { setNumber: 1, prev: "185 × 8", weight: 185, reps: 8, completed: false },
      { setNumber: 2, prev: "205 × 6", weight: 205, reps: 6, completed: false },
      { setNumber: 3, prev: "215 × 5", weight: 215, reps: 5, completed: false },
    ],
  },
  {
    name: "Cable Standing Flyes",
    category: "Chest Isolation",
    target: "Inner Pectoral Squeeze, Clavicular Head",
    rpe: "8.0",
    restSec: 60,
    sets: [
      { setNumber: 1, prev: "35 × 12", weight: 35, reps: 12, completed: false },
      { setNumber: 2, prev: "40 × 10", weight: 40, reps: 10, completed: false },
      { setNumber: 3, prev: "40 × 10", weight: 40, reps: 10, completed: false },
    ],
  },
];

interface WorkoutLoggerScreenProps {
  onClose: () => void;
  onFinish: (summary: { totalVolume: number; totalSets: number; duration: number }) => void;
  onOpen3DGuide?: (exerciseName: string) => void;
}

export function WorkoutLoggerScreen({
  onClose,
  onFinish,
  onOpen3DGuide,
}: WorkoutLoggerScreenProps) {
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [activeExIdx, setActiveExIdx] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(2538); // 42:18 initial
  const [restSeconds, setRestSeconds] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest timer countdown
  useEffect(() => {
    if (!isResting || restSeconds <= 0) return;
    const restInterval = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(restInterval);
  }, [isResting, restSeconds]);

  const currentExercise = exercises[activeExIdx];

  // Weight & Rep adjusters
  const adjustValue = (
    setIdx: number,
    field: "weight" | "reps",
    delta: number
  ) => {
    setExercises((prev) => {
      const copy = [...prev];
      const curEx = { ...copy[activeExIdx] };
      const setList = [...curEx.sets];
      const set = { ...setList[setIdx] };
      set[field] = Math.max(1, set[field] + delta);
      setList[setIdx] = set;
      curEx.sets = setList;
      copy[activeExIdx] = curEx;
      return copy;
    });
  };

  const toggleSetComplete = (setIdx: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      const curEx = { ...copy[activeExIdx] };
      const setList = [...curEx.sets];
      const set = { ...setList[setIdx] };
      const willComplete = !set.completed;
      set.completed = willComplete;
      setList[setIdx] = set;
      curEx.sets = setList;
      copy[activeExIdx] = curEx;
      return copy;
    });

    // Start rest timer
    setRestSeconds(currentExercise.restSec || 90);
    setIsResting(true);
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Metrics
  const totalVolume = exercises.reduce(
    (acc, ex) =>
      acc +
      ex.sets.reduce(
        (s, row) => s + (row.completed ? row.weight * row.reps : 0),
        0
      ),
    0
  );
  const totalCompletedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completionPct = Math.round((totalCompletedSets / (totalSets || 1)) * 100);

  const handleFinish = () => {
    onFinish({
      totalVolume: totalVolume || 14850,
      totalSets: totalCompletedSets || 18,
      duration: Math.floor(secondsElapsed / 60),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#0A0A0C] text-white flex flex-col overflow-hidden selection:bg-accent/30"
    >
      {/* ── TOP HEADER HUD ─────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          {/* Left: Minimize & Logo & Elapsed Clock */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="w-10 h-10 -ml-1 flex items-center justify-center text-white/70 hover:text-white rounded-full active:scale-90 transition-transform"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            <img
              src="/images/mobile/ironsync-logo.png"
              alt="IronSync"
              className="h-7 w-auto object-contain"
            />

            <div className="flex items-center gap-1.5 bg-[#16161A] px-2.5 py-1 rounded-full border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-[#FF3D41] animate-pulse" />
              <span className="font-mono text-xs font-bold text-white tracking-tight">
                {formatTimer(secondsElapsed)}
              </span>
            </div>
          </div>

          {/* Right: Finish Button + Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleFinish}
              type="button"
              className="h-9 px-4 rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_24px_rgba(255,61,65,0.4)] active:scale-95 transition-all cursor-pointer"
            >
              Finish
            </button>

            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
              <img
                src="/images/mobile/coach-portrait.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Global Workout Progress Line */}
        <div className="w-full h-[2px] bg-white/[0.06] relative overflow-hidden">
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#FF3D41] transition-all duration-500"
            style={{ width: `${Math.max(15, completionPct)}%` }}
          />
        </div>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-20 pb-28 px-4 flex flex-col gap-3.5">
        {/* Live Telemetry Status Strip */}
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#16161A] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC72C] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFC72C]" />
            </span>
            <span className="font-mono text-[10px] uppercase text-white/50 tracking-wider">
              LIVE TELEMETRY
            </span>
            <span className="font-mono text-[10px] text-[#FFC72C] font-bold">
              SYNCED
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-white/60 font-mono text-[10px]">
            <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>EST. BURN: <strong className="text-white">348 KCAL</strong></span>
          </div>
        </div>

        {/* Active Exercise Header Card */}
        <section className="flex flex-col bg-[#16161A] border border-white/[0.08] rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FF3D41]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#1F1F23] text-[#FF3D41] font-mono text-[9px] font-bold uppercase tracking-wider">
                  Exercise {activeExIdx + 1} of {exercises.length}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1F1F23] text-[#FFC72C] font-mono text-[9px] font-bold uppercase tracking-wider">
                  {currentExercise.category}
                </span>
              </div>

              <h1 className="text-xl font-black text-white uppercase tracking-tight truncate">
                {currentExercise.name}
              </h1>

              <div className="flex items-center gap-1.5 mt-1 text-white/60 text-xs">
                <Flame className="w-3.5 h-3.5 text-[#FF3D41] shrink-0" />
                <span className="truncate">{currentExercise.target}</span>
              </div>
            </div>

            {/* 3D Form Visualizer Action Button */}
            <button
              onClick={() => onOpen3DGuide?.(currentExercise.name)}
              type="button"
              title="Open 3D Form Visualizer"
              className="w-10 h-10 shrink-0 rounded-full bg-[#1F1F23] hover:bg-[#2A292E] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all shadow-sm"
            >
              <Box className="w-5 h-5 text-[#FF3D41]" />
            </button>
          </div>

          {/* Meta Chips Row */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0E0E12] text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D41]" />
              <span className="font-mono text-[10px] font-bold">Hypertrophy</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E0E12] text-[#FFC72C]">
              <span className="font-mono text-[10px] font-bold">RPE {currentExercise.rpe}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E0E12] text-[#00E5FF]">
              <span className="font-mono text-[10px] font-bold">{currentExercise.sets.length} Sets Target</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E0E12] text-white/50">
              <Timer className="w-3 h-3" />
              <span className="font-mono text-[10px]">{currentExercise.restSec}s Rest</span>
            </div>
          </div>
        </section>

        {/* Set Logging Table */}
        <section className="flex flex-col bg-[#16161A] border border-white/[0.08] rounded-2xl p-4 shadow-md gap-2">
          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-1 px-1 items-center text-white/50 font-mono text-[10px] font-bold uppercase tracking-wider">
            <span className="col-span-2 text-left">SET</span>
            <span className="col-span-3 text-left">PREV</span>
            <span className="col-span-3 text-center">LBS</span>
            <span className="col-span-2 text-center">REPS</span>
            <span className="col-span-2 text-right">STATUS</span>
          </div>

          {/* Rows Stack */}
          <div className="flex flex-col gap-2">
            {currentExercise.sets.map((set, sIdx) => {
              const isWorking = !set.completed;

              return (
                <div
                  key={set.setNumber}
                  className={`grid grid-cols-12 gap-1 items-center p-2.5 rounded-xl transition-all ${
                    set.completed
                      ? "bg-[#0E0E12]/80 opacity-70 border border-transparent"
                      : "bg-[#1F1F23] border border-[#FF3D41]/50 shadow-[0_0_20px_rgba(255,61,65,0.15)] relative overflow-hidden"
                  }`}
                >
                  {isWorking && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF3D41]" />
                  )}

                  {/* Set # */}
                  <div className="col-span-2 flex flex-col pl-1">
                    <span
                      className={`font-mono text-sm font-bold ${
                        isWorking ? "text-[#FF3D41]" : "text-white/60"
                      }`}
                    >
                      {set.setNumber.toString().padStart(2, "0")}
                    </span>
                    {isWorking && (
                      <span className="font-mono text-[8px] text-[#FF3D41] font-semibold uppercase">
                        WORK
                      </span>
                    )}
                  </div>

                  {/* Prev */}
                  <div className="col-span-3 flex flex-col min-w-0">
                    <span className="font-mono text-xs text-white/60 truncate">
                      {set.prev}
                    </span>
                  </div>

                  {/* LBS Stepper Input */}
                  <div className="col-span-3 flex items-center justify-center gap-0.5 bg-[#0A0A0C] border border-white/[0.08] rounded-lg py-1 px-1">
                    <button
                      onClick={() => adjustValue(sIdx, "weight", -5)}
                      type="button"
                      className="w-5 h-6 flex items-center justify-center text-white/60 hover:text-white active:scale-90"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-black text-white w-7 text-center">
                      {set.weight}
                    </span>
                    <button
                      onClick={() => adjustValue(sIdx, "weight", 5)}
                      type="button"
                      className="w-5 h-6 flex items-center justify-center text-white/60 hover:text-white active:scale-90"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* REPS Stepper Input */}
                  <div className="col-span-2 flex items-center justify-center gap-0.5 bg-[#0A0A0C] border border-white/[0.08] rounded-lg py-1 px-1">
                    <button
                      onClick={() => adjustValue(sIdx, "reps", -1)}
                      type="button"
                      className="w-4 h-6 flex items-center justify-center text-white/60 hover:text-white active:scale-90"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-mono text-xs font-black text-white w-5 text-center">
                      {set.reps}
                    </span>
                    <button
                      onClick={() => adjustValue(sIdx, "reps", 1)}
                      type="button"
                      className="w-4 h-6 flex items-center justify-center text-white/60 hover:text-white active:scale-90"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Completion Circle Button */}
                  <div className="col-span-2 flex justify-end items-center pr-1">
                    <button
                      onClick={() => toggleSetComplete(sIdx)}
                      type="button"
                      aria-label="Toggle set completion"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        set.completed
                          ? "bg-[#FFC72C] text-[#0A0A0C] shadow-[0_0_12px_rgba(255,199,44,0.4)]"
                          : "bg-[#FF3D41] text-white hover:scale-105 active:scale-95 shadow-[0_0_16px_rgba(255,61,65,0.4)]"
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Movement Navigation Selector */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setActiveExIdx((prev) => Math.max(0, prev - 1))}
            disabled={activeExIdx === 0}
            type="button"
            className="flex-1 py-3 px-3 rounded-full bg-[#16161A] border border-white/10 text-white font-mono text-xs uppercase font-bold disabled:opacity-30 active:scale-95 transition-all"
          >
            ← Previous
          </button>

          <button
            onClick={() =>
              setActiveExIdx((prev) => Math.min(exercises.length - 1, prev + 1))
            }
            disabled={activeExIdx === exercises.length - 1}
            type="button"
            className="flex-1 py-3 px-3 rounded-full bg-[#1F1F23] hover:bg-[#2A292E] border border-white/10 text-[#FFC72C] font-mono text-xs uppercase font-bold disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Next Move</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* ── FLOATING REST TIMER HUD ────────────────────────── */}
      <AnimatePresence>
        {isResting && restSeconds > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-4 inset-x-4 z-50 bg-[#16161A]/95 backdrop-blur-xl border border-[#FFC72C]/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between shadow-[0_0_30px_rgba(255,199,44,0.25)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A0A0C] border border-[#FFC72C]/30 flex items-center justify-center text-[#FFC72C]">
                <Timer className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 font-bold">
                  Rest Interval
                </span>
                <span className="font-mono text-xl font-black text-[#FFC72C]">
                  {formatTimer(restSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRestSeconds((prev) => prev + 30)}
                type="button"
                className="px-3 py-1.5 rounded-full bg-[#1F1F23] border border-white/10 text-white font-mono text-xs font-semibold active:scale-95"
              >
                +30s
              </button>
              <button
                onClick={() => setIsResting(false)}
                type="button"
                className="px-3 py-1.5 rounded-full bg-[#FF3D41] text-white font-mono text-xs font-bold active:scale-95"
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
