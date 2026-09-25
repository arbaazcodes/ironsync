"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Zap,
  Check,
  RotateCcw,
  Flame,
  ArrowRight,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface ReadinessScreenProps {
  onClose: () => void;
  onApplyCalibration?: (trainedMuscles: string[]) => void;
}

interface MuscleItem {
  id: string;
  name: string;
  decay: string;
  isFatigued?: boolean;
}

const MUSCLES: MuscleItem[] = [
  { id: "chest", name: "Chest", decay: "72h Decay", isFatigued: true },
  { id: "shoulders", name: "Shoulders", decay: "48h Decay", isFatigued: true },
  { id: "triceps", name: "Triceps", decay: "Fatigued", isFatigued: true },
  { id: "back", name: "Back & Lats", decay: "Ready", isFatigued: false },
  { id: "biceps", name: "Biceps", decay: "Fresh", isFatigued: false },
  { id: "quads", name: "Quads", decay: "Active 36h", isFatigued: false },
  { id: "hamstrings", name: "Hamstrings", decay: "Ready", isFatigued: false },
  { id: "core", name: "Core & Abs", decay: "Optimal", isFatigued: false },
];

export function ReadinessScreen({ onClose, onApplyCalibration }: ReadinessScreenProps) {
  const [selected, setSelected] = useState<string[]>(["chest", "shoulders", "triceps"]);

  const toggleMuscle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const applyPreset = (list: string[]) => {
    setSelected(list);
  };

  const handleRecalibrate = () => {
    onApplyCalibration?.(selected);
    onClose();
  };

  const fatigueScore = Math.min(95, 20 + selected.length * 16);

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
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-white/80 hover:text-white active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src="/images/mobile/ironsync-logo.png"
            alt="IronSync"
            className="h-7 w-auto object-contain"
          />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Physical Telemetry
          </span>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="font-mono text-xs text-white/50 hover:text-white uppercase font-bold"
        >
          Skip
        </button>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4 flex flex-col gap-4 text-white">
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFC72C] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC72C] animate-ping" />
            Step 3 of 4 • Readiness Calibration
          </span>
          <span className="font-mono text-[9px] text-white/50">Telemetry v2.4</span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight font-sans">
            Which muscle groups did you train last?
          </h1>
          <p className="text-xs text-white/60 leading-relaxed">
            IronSync calculates fatigue recovery decay and recalibrates your training load, volume, and recommended splits in real-time.
          </p>
        </div>

        {/* Active Engine Badge */}
        <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#16161A] border border-white/[0.08] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#FF3D41] animate-ping" />
          <span className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">
            ⚡ Auto-Recovery Engine Active
          </span>
        </div>

        {/* Metabolic Fatigue Score Snapshot Card */}
        <div className="p-4 rounded-2xl bg-[#16161A] border border-white/[0.08] flex items-center justify-between shadow-md">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider">
              Metabolic Fatigue Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-3xl font-black text-white">
                {fatigueScore}
              </span>
              <span className="font-mono text-xs text-[#FF3D41] font-bold">
                / 100 HIGH
              </span>
            </div>
            <span className="text-[10px] text-white/50 mt-1">
              Optimal systemic split: Upper Pull / Deload Core
            </span>
          </div>

          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="transparent"
                stroke="#1F1F23"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="transparent"
                stroke="#FF3D41"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * fatigueScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-mono text-[11px] font-black text-white">
              {fatigueScore}%
            </span>
          </div>
        </div>

        {/* Quick Batch Split Helpers */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-white/50 uppercase font-bold tracking-wider">
            Quick Batch Calibration
          </span>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => applyPreset(["chest", "shoulders", "triceps"])}
              type="button"
              className="h-8 px-3 rounded-full bg-[#1F1F23] border border-white/10 text-white font-mono text-[10px] font-semibold uppercase whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D41]" /> Push Day
            </button>
            <button
              onClick={() => applyPreset(["back", "biceps"])}
              type="button"
              className="h-8 px-3 rounded-full bg-[#16161A] border border-white/10 text-white/70 font-mono text-[10px] font-semibold uppercase whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> Pull Day
            </button>
            <button
              onClick={() => applyPreset(["quads", "hamstrings"])}
              type="button"
              className="h-8 px-3 rounded-full bg-[#16161A] border border-white/10 text-white/70 font-mono text-[10px] font-semibold uppercase whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]" /> Legs Split
            </button>
            <button
              onClick={() =>
                applyPreset(["chest", "shoulders", "back", "quads", "core"])
              }
              type="button"
              className="h-8 px-3 rounded-full bg-[#16161A] border border-white/10 text-white/70 font-mono text-[10px] font-semibold uppercase whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC72C]" /> Full Body
            </button>
            <button
              onClick={() => applyPreset([])}
              type="button"
              className="h-8 px-2.5 rounded-full bg-[#0E0E12] border border-white/[0.06] text-white/40 font-mono text-[10px] whitespace-nowrap active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>

        {/* 2-Column Grid of Muscles */}
        <div className="grid grid-cols-2 gap-2.5">
          {MUSCLES.map((m) => {
            const isSelected = selected.includes(m.id);

            return (
              <div
                key={m.id}
                onClick={() => toggleMuscle(m.id)}
                className={`relative p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center ${
                  isSelected
                    ? "bg-[#1F1F23] border border-[#FF3D41] shadow-[0_0_16px_rgba(255,61,65,0.2)]"
                    : "bg-[#16161A] border border-white/[0.06] hover:bg-white/[0.02]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#FF3D41] flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                )}

                <div className="w-12 h-12 rounded-full bg-[#0E0E12] border border-white/[0.06] flex items-center justify-center mb-2">
                  <Activity
                    className={`w-6 h-6 ${
                      isSelected ? "text-[#FF3D41]" : "text-white/40"
                    }`}
                  />
                </div>

                <span className="font-bold text-xs text-white font-sans">
                  {m.name}
                </span>

                <span
                  className={`mt-1.5 px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                    isSelected
                      ? "bg-[#FF3D41]/20 text-[#FF3D41]"
                      : "bg-[#0E0E12] text-white/40"
                  }`}
                >
                  {m.decay}
                </span>
              </div>
            );
          })}
        </div>

        {/* Primary Recalibrate Action Button */}
        <button
          onClick={handleRecalibrate}
          type="button"
          className="w-full h-[52px] rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,61,65,0.4)] active:scale-95 transition-all mt-2 cursor-pointer"
        >
          <span>Recalibrate Training Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>
    </motion.div>
  );
}
