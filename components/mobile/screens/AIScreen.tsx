"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Dumbbell,
  Clock,
  Flame,
  ArrowRight,
  Brain,
  Layers,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface AIScreenProps {
  onGeneratedRoutine?: (routine: any) => void;
  onStartWorkout?: () => void;
}

interface MuscleOption {
  id: string;
  name: string;
  status: "priority" | "fatigued" | "fresh" | "ready";
  strain?: number;
  badge: string;
}

const MUSCLE_OPTIONS: MuscleOption[] = [
  { id: "back", name: "Back & Lats", status: "priority", badge: "PRIORITY" },
  { id: "hamstrings", name: "Hamstrings", status: "priority", badge: "RECRUIT" },
  { id: "arms", name: "Biceps & Arms", status: "priority", badge: "ISOLATE" },
  { id: "chest", name: "Chest (Pecs)", status: "fatigued", strain: 85, badge: "85% Strain" },
  { id: "triceps", name: "Triceps", status: "fatigued", strain: 70, badge: "70% Load" },
  { id: "delts", name: "Deltoids", status: "fresh", badge: "Rest: 48h" },
  { id: "quads", name: "Quads", status: "fresh", badge: "Fresh" },
  { id: "core", name: "Abs & Core", status: "ready", badge: "Ready" },
];

const EQUIPMENT_LIST = ["Barbell", "Dumbbells", "Cables", "Machines", "Bodyweight", "Kettlebell"];
const DURATIONS = [30, 45, 60, 75];

export function AIScreen({ onGeneratedRoutine, onStartWorkout }: AIScreenProps) {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(["back", "hamstrings", "arms"]);
  const [selectedEquip, setSelectedEquip] = useState<string[]>(["Barbell", "Dumbbells", "Cables"]);
  const [duration, setDuration] = useState<number>(60);
  const [intensity, setIntensity] = useState<"hypertrophy" | "strength" | "deload">("hypertrophy");
  const [generating, setGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<boolean>(false);

  const toggleMuscle = (id: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleEquip = (eq: string) => {
    setSelectedEquip((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  const handleSynthesize = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedOutput(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full text-white pb-24 selection:bg-accent/30">
      {/* ── STICKY GLASS HEADER ────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0A0A0C]/85 backdrop-blur-xl border-b border-white/[0.06] px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/mobile/ironsync-logo.png"
            alt="IronSync"
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-[#00E5FF] uppercase font-bold tracking-wider">
              IronSync AI
            </span>
            <span className="font-extrabold text-sm tracking-tight text-white font-sans uppercase">
              AI Session Engine
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10">
          <img
            src="/images/mobile/coach-portrait.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div className="px-4 pt-3 flex flex-col gap-4">
        {/* Engine Status Pill */}
        <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#1F1F23] border border-white/[0.08] shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3D41] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF3D41]" />
          </span>
          <span className="font-mono text-[10px] text-white uppercase tracking-wider font-semibold">
            IronSync AI Engine v2.0 <span className="text-[#00E5FF]">• Biomechanical Sync</span>
          </span>
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Generate Session
          </h1>
          <p className="text-xs text-white/60 leading-relaxed">
            Dynamically adapts to your real-time muscle fatigue, CNS load, and equipment matrix.
          </p>
        </div>

        {/* CNS Readiness Metric Card */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#16161A] border border-white/[0.08] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0E0E12] border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
              <Brain className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[9px] text-[#00E5FF] uppercase font-bold">
                CNS Readiness
              </span>
              <span className="text-xs font-bold text-white truncate font-sans">
                Optimal Surge (94%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E0E12] text-[#FFC72C] font-mono text-[10px] font-bold border border-[#FFC72C]/20 shrink-0">
            <Zap className="w-3 h-3 fill-current" />
            <span>READY</span>
          </div>
        </div>

        {/* Module A: Target Muscle Focus Selector */}
        <section className="flex flex-col p-4 rounded-2xl bg-[#16161A] border border-white/[0.08] gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF3D41]" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Target Muscle Focus
              </h2>
            </div>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#1F1F23] text-white/50">
              Multi-Select
            </span>
          </div>

          {/* Chips Grid */}
          <div className="grid grid-cols-2 gap-2">
            {MUSCLE_OPTIONS.map((m) => {
              const isSelected = selectedMuscles.includes(m.id);

              if (m.status === "fatigued") {
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMuscle(m.id)}
                    type="button"
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-[#FF3D41] text-white border-transparent"
                        : "bg-[#1F1F23]/60 border-white/[0.04] text-white/50 opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FFC72C] shrink-0" />
                      <span className="text-xs font-semibold truncate">{m.name}</span>
                    </div>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 shrink-0">
                      {m.badge}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={m.id}
                  onClick={() => toggleMuscle(m.id)}
                  type="button"
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#FF3D41] text-white border-transparent shadow-[0_0_16px_rgba(255,61,65,0.3)]"
                      : "bg-[#1F1F23] border-white/[0.06] text-white/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                    ) : (
                      <PlusCircle className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    )}
                    <span className="text-xs font-semibold truncate">{m.name}</span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded shrink-0 ${
                      isSelected ? "bg-black/20 text-white font-bold" : "bg-[#0E0E12] text-white/40"
                    }`}
                  >
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* AI Synthesis Micro-Rationale */}
          <div className="flex items-start gap-2 pt-1">
            <Sparkles className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/60 leading-relaxed">
              Active selections configure a specialized{" "}
              <strong className="text-[#00E5FF] font-semibold">
                Posterior Chain &amp; Pull Hypertrophy
              </strong>{" "}
              split, protecting fatigued anterior push vectors.
            </p>
          </div>
        </section>

        {/* Module B: Available Equipment Matrix */}
        <section className="flex flex-col p-4 rounded-2xl bg-[#16161A] border border-white/[0.08] gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#FFC72C]" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Equipment Matrix
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#FFC72C] font-bold">
              {selectedEquip.length} ACTIVE
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {EQUIPMENT_LIST.map((eq) => {
              const active = selectedEquip.includes(eq);
              return (
                <button
                  key={eq}
                  onClick={() => toggleEquip(eq)}
                  type="button"
                  className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? "bg-[#FFC72C] text-[#0A0A0C] font-bold shadow-[0_0_12px_rgba(255,199,44,0.3)]"
                      : "bg-[#1F1F23] border border-white/[0.06] text-white/50 hover:text-white"
                  }`}
                >
                  {eq}
                </button>
              );
            })}
          </div>
        </section>

        {/* Module C: Target Duration */}
        <section className="flex flex-col p-4 rounded-2xl bg-[#16161A] border border-white/[0.08] gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00E5FF]" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Target Duration
              </h2>
            </div>
            <span className="font-mono text-sm text-[#00E5FF] font-bold">
              {duration} Minutes
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                type="button"
                className={`py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                  duration === d
                    ? "bg-[#00E5FF] text-[#0A0A0C] shadow-[0_0_12px_rgba(0,229,255,0.35)]"
                    : "bg-[#1F1F23] border border-white/[0.06] text-white/60 hover:text-white"
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </section>

        {/* Primary CTA Button */}
        <button
          onClick={handleSynthesize}
          disabled={generating}
          type="button"
          className="w-full h-[54px] rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(255,61,65,0.45)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-1"
        >
          {generating ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-[#00E5FF]" />
              <span>Synthesizing Bio-Kinetic Plan...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Synthesize Dynamic Routine</span>
              <ArrowRight className="w-4 h-4 font-bold" />
            </div>
          )}
        </button>

        {/* Generated Output Preview Banner */}
        {generatedOutput && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#16161A] border border-[#00E5FF]/40 shadow-xl flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#00E5FF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Routine Ready
              </span>
              <span className="font-mono text-[10px] text-white/50">6 Exercises • 18 Sets</span>
            </div>
            <h3 className="text-base font-black text-white font-sans uppercase">
              Pull Hypertrophy &amp; Posterior Chain Overload
            </h3>
            <p className="text-xs text-white/70">
              Deadlift (Heavy), Chest-Supported T-Bar Row, Incline DB Curls, Lat Pulldowns, Face Pulls.
            </p>
            {onStartWorkout && (
              <button
                type="button"
                onClick={onStartWorkout}
                className="mt-2 w-full py-2.5 rounded-full bg-[#00E5FF] hover:bg-[#33EAFF] text-[#0A0A0C] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(0,229,255,0.4)] active:scale-98 transition-all cursor-pointer"
              >
                <span>Start Live Session</span>
                <ArrowRight className="w-3.5 h-3.5 font-bold" />
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
