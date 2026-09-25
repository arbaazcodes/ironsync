"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Bookmark,
  RotateCw,
  Zap,
  Flame,
  AlertTriangle,
  History,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface ExerciseDetailScreenProps {
  exerciseName?: string;
  onClose: () => void;
}

const VIEW_ANGLES = ["Rear 45°", "Front Anterior", "Lateral Sagittal"];

export function ExerciseDetailScreen({
  exerciseName = "Barbell Deadlift",
  onClose,
}: ExerciseDetailScreenProps) {
  const [angleIdx, setAngleIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"execution" | "mistakes" | "history">("execution");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const nextAngle = () => {
    setAngleIdx((prev) => (prev + 1) % VIEW_ANGLES.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#0A0A0C] text-white flex flex-col overflow-hidden selection:bg-accent/30"
    >
      {/* ── HEADER HUD ─────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/[0.06] h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-white/80 hover:text-white active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src="/images/mobile/ironsync-logo.png"
            alt="IronSync"
            className="h-7 w-auto object-contain"
          />
        </div>

        <h1 className="text-sm font-black uppercase tracking-wider text-white truncate max-w-[180px] font-sans">
          {exerciseName}
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            type="button"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isBookmarked ? "text-[#FFC72C]" : "text-white/60 hover:text-white"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-20 pb-20 px-4 flex flex-col gap-4 text-white">
        {/* Category & Biomechanical Meta Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#16161A] border border-white/[0.06] text-white font-mono text-[10px] uppercase font-bold tracking-wider">
              Compound • Pull
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#16161A] border border-[#FFC72C]/30 text-[#FFC72C] font-mono text-[10px] uppercase font-bold tracking-wider">
              Posterior Chain
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00E5FF] font-mono text-[10px] tracking-wider uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            <span>Live 3D HUD</span>
          </div>
        </div>

        {/* 3D Anatomy Stage (Hero Visual with Telemetry Overlays) */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#0E0E12] border border-white/[0.08] shadow-2xl">
          <div className="relative w-full aspect-[4/3] max-h-80 overflow-hidden flex items-center justify-center">
            <img
              src="/images/mobile/3d-deadlift-physique.png"
              alt="3D Anatomical Biomechanical Muscle Guide"
              className="w-full h-full object-cover object-center scale-105"
            />

            {/* Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-transparent to-[#0E0E12]/60 pointer-events-none" />

            {/* High-Contrast HUD Overlays */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
              <div className="px-2.5 py-1 rounded-lg bg-[#0A0A0C]/85 backdrop-blur-md border border-white/10 shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3D41] animate-pulse" />
                <span className="font-mono text-[10px] text-white font-semibold">
                  Primary: Posterior Chain (95%)
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-[#0A0A0C]/85 backdrop-blur-md border border-[#FFC72C]/30 shadow-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
                <span className="font-mono text-[10px] text-[#FFC72C] font-semibold">
                  Stability: Lats &amp; Grip (68%)
                </span>
              </div>
            </div>

            {/* Telemetry Diagnostic Badge */}
            <div className="absolute top-3 right-3 pointer-events-none">
              <div className="px-2.5 py-1.5 rounded-lg bg-[#0A0A0C]/85 backdrop-blur-md border border-white/10 text-right">
                <span className="font-mono text-[9px] text-white/50 block leading-none">
                  RPE LOAD
                </span>
                <span className="font-mono text-sm text-[#00E5FF] font-bold">
                  9.2 / 10
                </span>
              </div>
            </div>

            {/* 360 Rotate Interactive Pill Overlay */}
            <div className="absolute bottom-3 inset-x-4 flex justify-center">
              <button
                onClick={nextAngle}
                type="button"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1F23]/90 backdrop-blur-md border border-white/15 text-white active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#FF3D41]" />
                <span className="font-mono text-[10px] uppercase tracking-wide font-bold">
                  360° Rotate View
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D41]" />
                <span className="font-mono text-[10px] text-white/60">
                  {VIEW_ANGLES[angleIdx]}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Attributes Strip */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[#16161A] border border-white/[0.06] rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="font-mono text-[9px] text-white/50 uppercase block">Difficulty</span>
            <span className="font-mono text-xs text-white font-bold mt-1">ADVANCED</span>
          </div>
          <div className="bg-[#16161A] border border-white/[0.06] rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="font-mono text-[9px] text-white/50 uppercase block">Equipment</span>
            <span className="font-mono text-xs text-white font-bold mt-1">BARBELL</span>
          </div>
          <div className="bg-[#16161A] border border-white/[0.06] rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="font-mono text-[9px] text-white/50 uppercase block">Force</span>
            <span className="font-mono text-xs text-[#FF3D41] font-bold mt-1">PULL</span>
          </div>
          <div className="bg-[#16161A] border border-white/[0.06] rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
            <span className="font-mono text-[9px] text-white/50 uppercase block">Type</span>
            <span className="font-mono text-xs text-[#FFC72C] font-bold mt-1">COMPOUND</span>
          </div>
        </div>

        {/* Kinetic Load Distribution Card */}
        <div className="bg-[#16161A] border border-white/[0.08] rounded-2xl p-4 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FF3D41]" />
              <span className="font-mono text-[11px] uppercase text-white tracking-wider font-bold">
                Kinetic Load Distribution
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#00E5FF]">Biomechanical Split</span>
          </div>

          {/* Segmented Metric Visualizer */}
          <div className="w-full h-3 rounded-full bg-[#0E0E12] overflow-hidden flex p-0.5 gap-0.5">
            <div className="h-full bg-[#FF3D41] rounded-l-full" style={{ width: "75%" }} />
            <div className="h-full bg-[#FFC72C] rounded-r-full" style={{ width: "25%" }} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#FF3D41] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D41]" />
                  Posterior Chain
                </span>
                <span className="font-mono text-sm text-[#FF3D41] font-bold">75%</span>
              </div>
              <span className="text-[10px] text-white/50 mt-0.5">
                Glutes 32%, Hamstrings 25%, Erector 18%
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#FFC72C] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC72C]" />
                  Core &amp; Upper
                </span>
                <span className="font-mono text-sm text-[#FFC72C] font-bold">25%</span>
              </div>
              <span className="text-[10px] text-white/50 mt-0.5">
                Lats 12%, Traps 8%, Grip 5%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Segment Selector */}
        <div className="p-1 rounded-full bg-[#16161A] border border-white/[0.06] flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab("execution")}
            type="button"
            className={`flex-1 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all ${
              activeTab === "execution"
                ? "bg-[#FF3D41] text-white shadow-[0_0_12px_rgba(255,61,65,0.35)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Execution
          </button>
          <button
            onClick={() => setActiveTab("mistakes")}
            type="button"
            className={`flex-1 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all ${
              activeTab === "mistakes"
                ? "bg-[#FF3D41] text-white shadow-[0_0_12px_rgba(255,61,65,0.35)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Mistakes
          </button>
          <button
            onClick={() => setActiveTab("history")}
            type="button"
            className={`flex-1 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#FF3D41] text-white shadow-[0_0_12px_rgba(255,61,65,0.35)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            History
          </button>
        </div>

        {/* Tab Content 1: Execution */}
        {activeTab === "execution" && (
          <div className="flex flex-col gap-2.5">
            <div className="p-3.5 rounded-xl bg-[#16161A] border border-white/[0.06] flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#FF3D41] font-bold uppercase">
                Step 01 • Stance &amp; Bar Anchor
              </span>
              <p className="text-xs text-white/80 leading-relaxed">
                Position feet hip-width apart with the barbell cutting precisely across your mid-foot. Hips hinge back until shins lightly touch the bar.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161A] border border-white/[0.06] flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#FFC72C] font-bold uppercase">
                Step 02 • Lat Torque &amp; Slack Pull
              </span>
              <p className="text-xs text-white/80 leading-relaxed">
                Take an overhand grip outside your legs. Pull the slack out of the barbell until you hear a metallic click. Pack your lats down into your back pockets.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161A] border border-white/[0.06] flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#00E5FF] font-bold uppercase">
                Step 03 • Floor Drive &amp; Lockout
              </span>
              <p className="text-xs text-white/80 leading-relaxed">
                Drive the floor away with your legs. Keep hips and chest ascending simultaneously. Squeeze your glutes at the top without hyper-extending the spine.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 2: Mistakes */}
        {activeTab === "mistakes" && (
          <div className="flex flex-col gap-2.5">
            <div className="p-3.5 rounded-xl bg-[#16161A] border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold text-rose-400 uppercase">
                  Lumbar Rounding (Cat Back)
                </span>
                <p className="text-xs text-white/70">
                  Losing neutral spine puts shearing force on L4-S1. Lower the load and re-brace core with diaphragmatic pressure.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161A] border border-[#FFC72C]/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FFC72C] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold text-[#FFC72C] uppercase">
                  Bar Drifting Forward
                </span>
                <p className="text-xs text-white/70">
                  The bar must ride straight up the shins and thighs. Bar drift indicates loose lats or early knee extension.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: History */}
        {activeTab === "history" && (
          <div className="flex flex-col gap-2.5">
            <div className="p-3.5 rounded-xl bg-[#16161A] border border-white/[0.06] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-white/50 uppercase">Current 1RM Peak</span>
                <span className="font-mono text-xl font-black text-white">405 LBS</span>
              </div>
              <span className="font-mono text-xs text-[#FFC72C] font-bold bg-[#FFC72C]/10 px-2.5 py-1 rounded-full border border-[#FFC72C]/20">
                Top 5% Elite Tier
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#16161A] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-white/60">Oct 18 • 4 × 5 @ 345 lbs</span>
              <span className="text-[#30D158] font-bold">+10 lbs Volume</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#16161A] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-white/60">Oct 11 • 5 × 3 @ 365 lbs</span>
              <span className="text-white/40">Power Phase</span>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
}
