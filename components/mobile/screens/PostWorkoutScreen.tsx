"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  X,
  Flame,
  Trophy,
  Timer,
  Layers,
  Gauge,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Moon,
  Droplets,
  Beef,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface PostWorkoutScreenProps {
  summary: {
    totalVolume: number;
    totalSets: number;
    duration: number;
  };
  onClose: () => void;
}

export function PostWorkoutScreen({ summary, onClose }: PostWorkoutScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#0A0A0C] text-white flex flex-col overflow-hidden selection:bg-accent/30"
    >
      {/* ── HEADER HUD ─────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/[0.06] h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full bg-[#16161A] text-white hover:bg-[#1F1F23] active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src="/images/mobile/ironsync-logo.png"
            alt="IronSync"
            className="h-7 w-auto object-contain"
          />
        </div>

        <h1 className="text-sm font-bold uppercase tracking-wider text-white truncate font-mono">
          Workout Summary &amp; Recovery
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            type="button"
            className="h-8 px-4 rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(255,61,65,0.4)] active:scale-95"
          >
            DONE
          </button>
        </div>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-20 pb-12 px-4 flex flex-col gap-4 text-white">
        {/* Celebration Header Badge */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1F23] border border-[#FFC72C]/30 shadow-[0_0_24px_rgba(255,199,44,0.22)]">
            <Flame className="w-4 h-4 text-[#FFC72C] fill-current" />
            <span className="font-mono text-xs font-bold text-[#FFC72C] tracking-wide uppercase">
              Workout Crushed • Push Day
            </span>
            <Trophy className="w-4 h-4 text-[#FFC72C] fill-current" />
          </div>
          <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest mt-1">
            Session Complete • Telemetry Synced
          </p>
        </div>

        {/* Hero KPI Metric Display Card */}
        <div className="relative flex flex-col items-center justify-center p-5 rounded-2xl bg-[#16161A] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#FF3D41]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-[#FFC72C]/10 blur-3xl pointer-events-none" />

          <div className="flex items-baseline gap-2 z-10">
            <span className="text-4xl font-black tracking-tight text-white font-sans">
              {(summary.totalVolume || 14850).toLocaleString()}
            </span>
            <span className="font-mono text-base font-bold text-[#FF3D41]">
              LBS
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider z-10 mt-1">
            Total Net Mechanical Load
          </span>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-2 gap-2 w-full mt-4 z-10">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1F1F23] border border-white/[0.04]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2A292E] text-[#FF3D41]">
                <Timer className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[9px] text-white/50 uppercase">Duration</span>
                <span className="font-mono text-sm text-white font-bold truncate">
                  {summary.duration || 54}m
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1F1F23] border border-white/[0.04]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2A292E] text-[#00E5FF]">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[9px] text-white/50 uppercase">Volume</span>
                <span className="font-mono text-sm text-white font-bold truncate">
                  {summary.totalSets || 18} Sets
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1F1F23] border border-[#FFC72C]/20 shadow-[0_0_12px_rgba(255,199,44,0.1)]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFC72C]/20 text-[#FFC72C]">
                <Trophy className="w-4 h-4 fill-current" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[9px] text-[#FFC72C] uppercase font-semibold">Milestones</span>
                <span className="font-mono text-xs text-[#FFC72C] font-black truncate">
                  2 PRs Broken
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#1F1F23] border border-white/[0.04]">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2A292E] text-[#FFB3AE]">
                <Gauge className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[9px] text-white/50 uppercase">Intensity</span>
                <span className="font-mono text-xs text-white font-bold truncate">
                  88% (RPE 8.5)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Anatomical Fatigue Heatmap Module */}
        <div className="flex flex-col p-4 rounded-2xl bg-[#16161A] border border-white/[0.08] gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
              Target Biomechanical Load
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#2A292E] text-[#FF3D41] font-bold">
              92% PEAK
            </span>
          </div>

          {/* SVG Human Anterior HUD Wireframe with Radiant Gradients */}
          <div className="relative flex items-center justify-center py-4 bg-[#0E0E12] rounded-xl overflow-hidden border border-white/[0.04]">
            <svg
              className="w-56 h-64 text-white drop-shadow-[0_0_15px_rgba(255,84,81,0.3)]"
              fill="none"
              viewBox="0 0 280 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient cx="50%" cy="50%" id="postChestGlow" r="50%">
                  <stop offset="0%" stopColor="#FF5451" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#FFC72C" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FF5451" stopOpacity="0.1" />
                </radialGradient>
                <radialGradient cx="50%" cy="50%" id="postDeltGlow" r="50%">
                  <stop offset="0%" stopColor="#FF5451" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#FFC72C" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FF5451" stopOpacity="0" />
                </radialGradient>
                <radialGradient cx="50%" cy="50%" id="postTriGlow" r="50%">
                  <stop offset="0%" stopColor="#FFC72C" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#FF5451" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#1F1F23" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Head & Neck */}
              <path
                d="M125 35 C125 22 155 22 155 35 C155 48 148 56 148 64 L132 64 C132 56 125 48 125 35 Z"
                fill="#2A292E"
              />
              {/* Abdominals (Untrained) */}
              <path
                d="M122 136 Q140 134 158 136 L155 204 Q140 208 125 204 Z"
                fill="#2A292E"
              />
              <path
                d="M128 142 H152 V156 H128 Z M128 160 H152 V174 H128 Z M128 178 H152 V194 H128 Z"
                stroke="#131317"
                strokeWidth="2"
              />
              {/* Core / Obliques */}
              <path
                d="M110 138 Q120 170 120 208 L104 200 Q100 162 108 136 Z"
                fill="#25252D"
              />
              <path
                d="M170 138 Q160 170 160 208 L176 200 Q180 162 172 136 Z"
                fill="#25252D"
              />
              {/* Pelvis / Quads */}
              <path
                d="M104 206 L176 206 L188 280 L146 280 L140 220 L134 280 L92 280 Z"
                fill="#1B1B1F"
              />

              {/* Trained Muscle Groups: Left & Right Deltoids */}
              <path
                d="M84 78 C94 70 106 72 110 82 C108 102 96 118 84 122 C78 112 76 92 84 78 Z"
                fill="url(#postDeltGlow)"
              />
              <path
                d="M196 78 C186 70 174 72 170 82 C172 102 184 118 196 122 C202 112 204 92 196 78 Z"
                fill="url(#postDeltGlow)"
              />

              {/* Trained Pectorals */}
              <path
                d="M112 84 Q140 92 140 128 Q118 134 106 126 Q98 106 112 84 Z"
                fill="url(#postChestGlow)"
              />
              <path
                d="M168 84 Q140 92 140 128 Q162 134 174 126 Q182 106 168 84 Z"
                fill="url(#postChestGlow)"
              />

              {/* Sternal Cleft */}
              <line
                stroke="#131317"
                strokeWidth="2"
                x1="140"
                x2="140"
                y1="84"
                y2="132"
              />

              {/* Triceps Lateral / Long Heads */}
              <path
                d="M78 122 C84 128 84 154 80 170 C72 162 68 142 74 126 Z"
                fill="url(#postTriGlow)"
              />
              <path
                d="M202 122 C196 128 196 154 200 170 C208 162 212 142 206 126 Z"
                fill="url(#postTriGlow)"
              />

              {/* HUD Telemetry Target Pointers */}
              <circle cx="124" cy="108" fill="#FF5451" r="4" />
              <circle
                cx="124"
                cy="108"
                r="8"
                stroke="#FF5451"
                strokeDasharray="2 2"
                strokeWidth="1.5"
              />
            </svg>

            {/* Floating HUD Overlays */}
            <div className="absolute top-3 left-3 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0A0A0C]/90 backdrop-blur border border-white/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF3D41] animate-ping" />
                <span className="font-mono text-[10px] font-bold text-white">
                  Chest: 94%
                </span>
              </div>
              <span className="text-[9px] text-white/50 pl-1 font-mono">
                Major / Minor
              </span>
            </div>

            <div className="absolute top-3 right-3 flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0A0A0C]/90 backdrop-blur border border-[#FFC72C]/30 shadow-sm">
                <span className="font-mono text-[10px] font-bold text-[#FFC72C]">
                  Front Delts: 88%
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
              </div>
              <span className="text-[9px] text-white/50 pr-1 font-mono">
                Peak Tension
              </span>
            </div>

            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-[#0A0A0C]/90 backdrop-blur border border-white/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
              <span className="font-mono text-[10px] text-white font-semibold">
                Triceps: 82% Strain
              </span>
            </div>
          </div>
        </div>

        {/* Recovery Needed Estimate & Nutrition Card */}
        <div className="p-4 rounded-2xl bg-[#16161A] border border-white/[0.08] flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-white/50 font-bold">
              System Recovery Projection
            </span>
            <span className="font-mono text-xs text-[#00E5FF] font-black">
              ~40 Hours
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#202026] overflow-hidden flex p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF3D41] to-[#FFC72C]"
              style={{ width: "75%" }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
            <div className="p-2 rounded-lg bg-[#1F1F23] flex flex-col items-center gap-1">
              <Beef className="w-4 h-4 text-[#FF3D41]" />
              <span className="font-bold text-white">160g</span>
              <span className="text-white/50 text-[8px]">PROTEIN</span>
            </div>
            <div className="p-2 rounded-lg bg-[#1F1F23] flex flex-col items-center gap-1">
              <Droplets className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-bold text-white">3.5 L</span>
              <span className="text-white/50 text-[8px]">WATER</span>
            </div>
            <div className="p-2 rounded-lg bg-[#1F1F23] flex flex-col items-center gap-1">
              <Moon className="w-4 h-4 text-[#FFC72C]" />
              <span className="font-bold text-white">8.5 h</span>
              <span className="text-white/50 text-[8px]">SLEEP</span>
            </div>
          </div>
        </div>

        {/* Primary Save & Sync CTA */}
        <button
          onClick={onClose}
          type="button"
          className="w-full h-[52px] rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,61,65,0.4)] active:scale-95 transition-all mt-2 cursor-pointer"
        >
          <span>Save &amp; Sync Recovery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>
    </motion.div>
  );
}
