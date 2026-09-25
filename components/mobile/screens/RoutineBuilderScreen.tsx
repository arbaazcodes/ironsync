"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  Dumbbell,
  Timer,
  Zap,
  Check,
  Flame,
  ArrowRight,
} from "lucide-react";
import { IS, SPLIT_CATEGORIES, type SplitCategory } from "@/components/mobile/tokens";

interface RoutineBuilderScreenProps {
  onClose: () => void;
  onSave?: (routine: any) => void;
}

interface RoutineExercise {
  id: string;
  name: string;
  category: string;
  sets: string;
  supersetGroup?: string;
}

const DEFAULT_MOVEMENTS: RoutineExercise[] = [
  {
    id: "1",
    name: "Barbell Conventional Deadlift",
    category: "Posterior Chain • Comp",
    sets: "4 Sets × 6-8 Reps @ 85% 1RM",
  },
  {
    id: "2",
    name: "Chest-Supported T-Bar Row",
    category: "Lats / Mid-Back • A1",
    sets: "3 Sets × 10-12 Reps",
    supersetGroup: "A",
  },
  {
    id: "3",
    name: "Incline Dumbbell Bicep Curl",
    category: "Biceps • A2",
    sets: "3 Sets × 12 Reps",
    supersetGroup: "A",
  },
  {
    id: "4",
    name: "Face Pulls (Cable Rope)",
    category: "Rear Delts & Rotator Cuff",
    sets: "3 Sets × 15 Reps",
  },
];

export function RoutineBuilderScreen({ onClose, onSave }: RoutineBuilderScreenProps) {
  const [title, setTitle] = useState("Heavy Pull Day A (Hypertrophy & Density)");
  const [selectedFocus, setSelectedFocus] = useState<SplitCategory>("Pull");
  const [movements, setMovements] = useState<RoutineExercise[]>(DEFAULT_MOVEMENTS);
  const [restInterval, setRestInterval] = useState("90s");
  const [targetRpe, setTargetRpe] = useState("8.5");

  const removeMovement = (id: string) => {
    setMovements((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = () => {
    onSave?.({
      title,
      focus: selectedFocus,
      movements,
      restInterval,
      targetRpe,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#0A0A0C] text-white flex flex-col overflow-hidden selection:bg-accent/30"
    >
      {/* ── HEADER HUD ─────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/[0.06] h-16 px-4 flex items-center justify-between">
        <button
          onClick={onClose}
          type="button"
          className="text-xs font-mono font-bold text-white/50 hover:text-white uppercase flex items-center gap-1 active:scale-95"
        >
          <X className="w-4 h-4" /> Cancel
        </button>

        <h1 className="font-mono text-xs font-bold uppercase tracking-wider text-white truncate max-w-[150px]">
          New Routine
        </h1>

        <button
          onClick={handleSave}
          type="button"
          className="h-8 px-4 rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(255,61,65,0.4)] active:scale-95 transition-all"
        >
          Save Routine
        </button>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4 flex flex-col gap-4 text-white">
        {/* Routine Metadata Card */}
        <section className="bg-[#16161A] border border-white/[0.08] rounded-2xl p-4 shadow-xl flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#FF3D41]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3D41] animate-pulse" />
              <span className="font-mono text-[10px] text-[#FF3D41] font-bold uppercase tracking-wider">
                Split Architect // Active Draft
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#00E5FF] bg-[#1F1F23] px-2 py-0.5 rounded-full border border-[#00E5FF]/20 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> HUD Synced
            </span>
          </div>

          {/* Routine Title Input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
              Routine Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0E0E12] border border-white/[0.08] text-white font-bold text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#FF3D41] shadow-inner font-sans"
            />
          </div>

          {/* Split Category Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
              Program Focus
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {SPLIT_CATEGORIES.map((cat) => {
                const isSelected = selectedFocus === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedFocus(cat)}
                    type="button"
                    className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-[#FF3D41] text-white shadow-[0_0_16px_rgba(255,61,65,0.4)]"
                        : "bg-[#1F1F23] border border-white/[0.06] text-white/50 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meta Ergonomic Controls */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#0E0E12] p-2.5 rounded-xl border border-white/[0.04] flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#FFC72C]" />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-white/50 uppercase">Rest Interval</span>
                <span className="font-mono text-xs font-bold text-white">{restInterval}</span>
              </div>
            </div>
            <div className="bg-[#0E0E12] p-2.5 rounded-xl border border-white/[0.04] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E5FF]" />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-white/50 uppercase">Target Load</span>
                <span className="font-mono text-xs font-bold text-white">RPE {targetRpe}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Exercise Sequence & Draggable Stack */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Exercise Order
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#16161A] text-white/50">
                {movements.length} Movements
              </span>
            </div>

            <button
              onClick={() => alert("AI optimization applied: Compound movements prioritized before accessories.")}
              type="button"
              className="bg-[#16161A] hover:bg-[#1F1F23] border border-[#00E5FF]/30 text-[#00E5FF] font-mono text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Balance AI</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {movements.map((mov) => {
              const inSuperset = mov.supersetGroup === "A";

              return (
                <div
                  key={mov.id}
                  className={`bg-[#16161A] border border-white/[0.08] rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md relative ${
                    inSuperset ? "border-l-4 border-l-[#FFC72C]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#0E0E12] border border-white/[0.06] flex items-center justify-center text-[#FF3D41] shrink-0">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] text-[#FF3D41] uppercase font-bold">
                          {mov.category}
                        </span>
                        {inSuperset && (
                          <span className="font-mono text-[8px] bg-[#FFC72C] text-[#0A0A0C] font-bold px-1 rounded">
                            SUPERSET
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-white truncate font-sans mt-0.5">
                        {mov.name}
                      </h3>
                      <span className="font-mono text-[10px] text-white/50 mt-0.5">
                        {mov.sets}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => removeMovement(mov.id)}
                      type="button"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-rose-400 active:scale-90 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-6 h-6 flex items-center justify-center text-white/30 cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Movement Button */}
          <button
            onClick={() => {
              const newId = (movements.length + 1).toString();
              setMovements((prev) => [
                ...prev,
                {
                  id: newId,
                  name: "Standing Overhead Cable Extension",
                  category: "Triceps Isolation",
                  sets: "3 Sets × 12-15 Reps",
                },
              ]);
            }}
            type="button"
            className="w-full py-3 rounded-xl bg-[#16161A] hover:bg-[#1F1F23] border border-dashed border-white/20 text-white font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 active:scale-95 transition-all mt-1"
          >
            <Plus className="w-4 h-4 text-[#FF3D41]" />
            <span>Add Movement</span>
          </button>
        </section>
      </main>
    </motion.div>
  );
}
