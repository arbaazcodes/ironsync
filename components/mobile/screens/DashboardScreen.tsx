"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Dumbbell,
  Zap,
  HeartPulse,
  Lock,
  ArrowRight,
  Play,
  CheckCircle2,
  Timer,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface DashboardScreenProps {
  onStartWorkout: () => void;
  onReadinessCheck: () => void;
  onExerciseDetail?: (name: string) => void;
  onProfileClick?: () => void;
}

const MICROCYCLE_DAYS = [
  { id: 1, label: "TODAY", dayName: "Day 1", routine: "Push A", status: "active", isToday: true },
  { id: 2, label: "TOMORROW", dayName: "Day 2", routine: "Pull & Traps", status: "locked" },
  { id: 3, label: "WED", dayName: "Day 3", routine: "Legs & Core", status: "locked" },
  { id: 4, label: "REST", dayName: "Day 4", routine: "Active Rest", status: "rest" },
  { id: 5, label: "FRI", dayName: "Day 5", routine: "Push B (Power)", status: "locked" },
  { id: 6, label: "SAT", dayName: "Day 6", routine: "Pull B (Hyper)", status: "locked" },
];

export function DashboardScreen({
  onStartWorkout,
  onReadinessCheck,
  onExerciseDetail,
  onProfileClick,
}: DashboardScreenProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  return (
    <div className="flex flex-col w-full text-white pb-12 selection:bg-accent/30">
      {/* ── STICKY GLASS HEADER ────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0A0A0C]/85 backdrop-blur-xl border-b border-white/[0.06] px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/mobile/ironsync-logo.png"
            alt="IronSync"
            className="h-8 w-auto object-contain"
          />
          <span className="font-extrabold text-base tracking-wider uppercase text-white font-sans">
            Iron<span className="text-[#FF3D41]">Sync</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden xs:inline-block font-mono text-[10px] tracking-wider uppercase text-white/50">
            Routine Dashboard
          </span>
          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-full ring-2 ring-white/10 overflow-hidden active:scale-95 transition-transform"
          >
            <img
              src="/images/mobile/coach-portrait.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* ── SECTION 1: TOP GREETING & QUICK METRICS ─────────── */}
      <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
        {/* Sub-greeting & Streak Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/50 font-semibold">
              Welcome back, Marcus
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white truncate">
              Push Day Phase 2
            </h1>
          </div>

          {/* Amber Flame Streak Pill */}
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F1F23] border border-[#FFC72C]/30 shadow-[0_0_16px_rgba(255,199,44,0.18)]">
            <span className="text-sm select-none">🔥</span>
            <span className="font-mono text-[11px] text-[#FFC72C] uppercase font-bold tracking-wider">
              12 Days
            </span>
          </div>
        </div>

        {/* Quick Metrics Bar (3 Fluid Tiles) */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {/* Target Load */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#16161A] border border-white/[0.06] shadow-sm">
            <div className="flex items-center gap-1 text-white/50 mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-[#FF3D41]" />
              <span className="font-mono text-[10px] uppercase font-semibold">Target</span>
            </div>
            <span className="font-mono text-sm text-white font-bold truncate">
              180 <span className="text-[10px] font-normal text-white/50">lbs</span>
            </span>
          </div>

          {/* Calorie Burn */}
          <div className="flex flex-col p-2.5 rounded-xl bg-[#16161A] border border-white/[0.06] shadow-sm">
            <div className="flex items-center gap-1 text-[#FFC72C] mb-1">
              <Zap className="w-3.5 h-3.5 text-[#FFC72C]" />
              <span className="font-mono text-[10px] uppercase text-white/50 font-semibold">Burn</span>
            </div>
            <span className="font-mono text-sm text-white font-bold truncate">
              520 <span className="text-[10px] font-normal text-white/50">kcal</span>
            </span>
          </div>

          {/* Bio-Readiness */}
          <button
            onClick={onReadinessCheck}
            className="flex flex-col p-2.5 rounded-xl bg-[#16161A] border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 text-left transition-colors shadow-sm"
          >
            <div className="flex items-center gap-1 text-[#00E5FF] mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span className="font-mono text-[10px] uppercase text-white/50 font-semibold">Readiness</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-sm text-[#00E5FF] font-bold">94%</span>
              <span className="font-mono text-[9px] text-white/60 uppercase font-medium">Peak</span>
            </div>
          </button>
        </div>
      </div>

      {/* ── SECTION 2: WEEKLY MICROCYCLE SELECTOR ───────────── */}
      <div className="w-full flex flex-col gap-1.5 my-2">
        <div className="px-4 flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase text-white/50 tracking-wider font-semibold">
            Weekly Microcycle
          </span>
          <span className="font-mono text-[10px] text-[#FF5451] uppercase font-bold tracking-wide">
            Block 4 / Week 2
          </span>
        </div>

        {/* Microcycle Horizontal Scroll Reel */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-1 no-scrollbar scroll-smooth">
          {MICROCYCLE_DAYS.map((d) => {
            const isSelected = selectedDay === d.id;
            const isToday = d.isToday;

            if (d.status === "rest") {
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  type="button"
                  className="shrink-0 w-[100px] p-2.5 rounded-2xl bg-[#16161A] border border-[#FFC72C]/30 shadow-sm flex flex-col text-left transition-transform active:scale-95"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-[9px] text-[#FFC72C] font-bold uppercase">REST</span>
                    <Zap className="w-3 h-3 text-[#FFC72C]" />
                  </div>
                  <span className="text-base text-white font-black leading-none mb-1 font-sans">
                    {d.dayName}
                  </span>
                  <span className="font-mono text-[10px] text-[#FFC72C] truncate">
                    {d.routine}
                  </span>
                </button>
              );
            }

            if (d.status === "locked") {
              return (
                <div
                  key={d.id}
                  className="shrink-0 w-[100px] p-2.5 rounded-2xl bg-[#16161A] border border-white/[0.04] opacity-60 shadow-sm flex flex-col text-left"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-[9px] text-white/40 font-semibold">{d.label}</span>
                    <Lock className="w-3 h-3 text-white/40" />
                  </div>
                  <span className="text-base text-white/70 font-bold leading-none mb-1 font-sans">
                    {d.dayName}
                  </span>
                  <span className="font-mono text-[10px] text-white/40 truncate">
                    {d.routine}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                type="button"
                className={`group shrink-0 w-[106px] p-2.5 rounded-2xl flex flex-col text-left relative overflow-hidden transition-transform active:scale-95 ${
                  isSelected
                    ? "bg-[#2A292E] border border-[#FF5451]/60 shadow-[0_0_20px_rgba(255,84,81,0.25)]"
                    : "bg-[#16161A] border border-white/[0.08]"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5451]/20 to-transparent pointer-events-none" />
                <div className="flex items-center justify-between w-full mb-1 relative z-10">
                  <span className="font-mono text-[9px] font-bold text-white bg-[#FF3D41] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {d.label}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FF3D41] animate-ping" />
                </div>
                <span className="text-base text-white font-extrabold relative z-10 leading-none mb-1 font-sans">
                  {d.dayName}
                </span>
                <span className="font-mono text-[11px] text-[#FF5451] font-bold relative z-10 truncate">
                  {d.routine}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: HERO WORKOUT CARD ────────────────────── */}
      <div className="px-4 my-2">
        <div className="relative w-full rounded-[24px] overflow-hidden bg-[#16161A] border border-white/[0.08] shadow-2xl flex flex-col justify-end min-h-[380px]">
          {/* Background Image with Scrim */}
          <img
            src="/images/mobile/incline-dumbbell-hero.png"
            alt="Incline Dumbbell Press Hero"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Precision Gradient Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent pointer-events-none" />

          {/* Card Foreground Content */}
          <div className="relative z-10 p-5 flex flex-col justify-between h-full gap-4">
            {/* Status Tags */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md font-mono text-[10px] uppercase font-bold text-white tracking-wider border border-white/10">
                HYPERTROPHY PHASE
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFC72C]/15 backdrop-blur-md font-mono text-[10px] uppercase font-bold text-[#FFC72C] flex items-center gap-1 border border-[#FFC72C]/30 shadow-[0_0_12px_rgba(255,199,44,0.2)]">
                <span>🔥</span> High RPE 8.5
              </span>
            </div>

            {/* Title & Telemetry Metas */}
            <div className="flex flex-col gap-2 mt-8">
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight uppercase font-sans">
                Push Hypertrophy — Chest &amp; Shoulders
              </h2>

              <div className="flex items-center flex-wrap gap-2 text-white/70 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 bg-[#1F1F23]/90 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                  <Timer className="w-3.5 h-3.5 text-[#FF3D41]" /> 55 mins
                </span>
                <span className="flex items-center gap-1.5 bg-[#1F1F23]/90 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                  <Dumbbell className="w-3.5 h-3.5 text-[#FFC72C]" /> 18,450 lbs
                </span>
                <span className="flex items-center gap-1.5 bg-[#1F1F23]/90 px-2.5 py-1 rounded-lg border border-white/[0.06]">
                  <Layers className="w-3.5 h-3.5 text-[#00E5FF]" /> 6 Movements
                </span>
              </div>
            </div>

            {/* Big Prominent 54px CTA */}
            <button
              onClick={onStartWorkout}
              type="button"
              className="w-full h-[54px] rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_28px_rgba(255,61,65,0.45)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Start Workout</span>
              <ArrowRight className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: INTERACTIVE MUSCLE TARGET CARD (KINETIC ANATOMY) ── */}
      <div className="px-4 my-2">
        <div className="w-full rounded-2xl bg-[#16161A] border border-white/[0.08] p-4 flex flex-col gap-3.5 shadow-md">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF3D41]" />
              <span className="font-mono text-[11px] uppercase text-white font-bold tracking-wider">
                Targeted Muscle Groups
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#FF3D41] px-2 py-0.5 rounded-full bg-[#FF3D41]/15 font-semibold">
              Primary Load
            </span>
          </div>

          {/* Vector Torso Graphic + Legend Split */}
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* SVG Torso Biomechanical Wireframe */}
            <div className="col-span-5 flex items-center justify-center py-2 bg-[#0E0E12] rounded-xl relative overflow-hidden border border-white/[0.04]">
              <div className="absolute inset-0 bg-radial from-[#FF3D41]/10 to-transparent pointer-events-none" />
              <svg
                className="w-24 h-auto drop-shadow-[0_0_12px_rgba(255,84,81,0.3)]"
                fill="none"
                viewBox="0 0 100 130"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Upper Torso Silhouette */}
                <path
                  d="M 50 12 C 45 12 40 18 36 24 C 26 27 16 34 10 46 C 7 53 6 65 6 78 C 12 79 17 76 21 68 C 22 80 25 96 28 116 C 35 118 45 119 50 119 C 55 119 65 118 72 116 C 75 96 78 80 79 68 C 83 76 88 79 94 78 C 94 65 93 53 90 46 C 84 34 74 27 64 24 C 60 18 55 12 50 12 Z"
                  fill="#1F1F23"
                  opacity="0.8"
                />
                <ellipse cx="50" cy="10" fill="#2A292E" rx="9" ry="8" />
                <path d="M 44 18 L 44 26 L 56 26 L 56 18 Z" fill="#2A292E" />

                {/* Targeted: Deltoids (Glowing Pulse Red) */}
                <path
                  className="animate-pulse"
                  d="M 23 28 C 16 32 12 39 10 47 C 14 53 19 54 23 48 C 25 41 25 34 23 28 Z"
                  fill="#FF3D41"
                />
                <path
                  className="animate-pulse"
                  d="M 77 28 C 84 32 88 39 90 47 C 86 53 81 54 77 48 C 75 41 75 34 77 28 Z"
                  fill="#FF3D41"
                />

                {/* Targeted: Pectoralis Major & Minor (High Intensity Pulse Red) */}
                <path
                  d="M 48 30 C 40 29 27 33 26 46 C 27 57 38 60 48 57 Z"
                  fill="#FF3D41"
                />
                <path
                  d="M 52 30 C 60 29 73 33 74 46 C 73 57 62 60 52 57 Z"
                  fill="#FF3D41"
                />

                {/* Targeted: Triceps Brachii */}
                <path
                  d="M 9 52 C 8 61 8 72 9 78 C 12 76 16 71 18 64 C 15 58 12 54 9 52 Z"
                  fill="#FFB3AE"
                  opacity="0.9"
                />
                <path
                  d="M 91 52 C 92 61 92 72 91 78 C 88 76 84 71 82 64 C 85 58 88 54 91 52 Z"
                  fill="#FFB3AE"
                  opacity="0.9"
                />

                {/* Abdominals & Core Grid */}
                <rect fill="#2A292E" height="8" rx="1.5" width="7" x="42" y="66" />
                <rect fill="#2A292E" height="8" rx="1.5" width="7" x="51" y="66" />
                <rect fill="#2A292E" height="9" rx="1.5" width="7" x="42" y="77" />
                <rect fill="#2A292E" height="9" rx="1.5" width="7" x="51" y="77" />
                <rect fill="#2A292E" height="9" rx="1.5" width="6" x="43" y="89" />
                <rect fill="#2A292E" height="9" rx="1.5" width="6" x="51" y="89" />

                {/* Biomechanical Guideline */}
                <line
                  stroke="#FF3D41"
                  strokeDasharray="2 2"
                  strokeOpacity="0.3"
                  x1="50"
                  x2="50"
                  y1="26"
                  y2="108"
                />
              </svg>
            </div>

            {/* Targeted Muscles Breakdown */}
            <div className="col-span-7 flex flex-col gap-2">
              {/* Pectorals */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1F1F23]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3D41] shrink-0" />
                  <span className="font-semibold text-xs text-white">Pectorals</span>
                </div>
                <span className="font-mono text-[10px] text-[#FF3D41] font-bold">82% Load</span>
              </div>

              {/* Deltoids */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1F1F23]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3D41] shrink-0" />
                  <span className="font-semibold text-xs text-white">Deltoids</span>
                </div>
                <span className="font-mono text-[10px] text-[#FF3D41] font-bold">64% Load</span>
              </div>

              {/* Triceps */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1F1F23]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB3AE] shrink-0" />
                  <span className="font-semibold text-xs text-white">Triceps</span>
                </div>
                <span className="font-mono text-[10px] text-white/50 font-bold">45% Load</span>
              </div>

              {/* Recovery Index Note */}
              <div className="flex items-center gap-1.5 pt-0.5 text-white/50 text-[10px] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC72C]" />
                <span>98% Recovered since Monday</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: ROUTINE PROGRESS TILE ───────────────── */}
      <div className="px-4 my-2">
        <div className="w-full rounded-2xl bg-[#16161A] border border-white/[0.08] p-4 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase text-white/50 font-semibold">
                Routine Progress
              </span>
              <span className="text-base font-bold text-white">3 of 5 completed</span>
            </div>
            <span className="font-mono text-xl font-black text-[#FF3D41]">60%</span>
          </div>

          {/* Segmented Gradient Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-[#202026] overflow-hidden flex p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FFC72C] to-[#FF3D41] transition-all duration-700 shadow-[0_0_12px_rgba(255,84,81,0.5)]"
              style={{ width: "60%" }}
            />
          </div>

          {/* Up Next Movement Pill */}
          <div
            onClick={() => onExerciseDetail?.("Incline Dumbbell Press")}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#1F1F23] hover:bg-[#2A292E] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#2A292E] flex items-center justify-center shrink-0 text-[#FFC72C]">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[9px] text-white/50 uppercase font-semibold">
                  Up Next
                </span>
                <span className="text-xs font-semibold text-white truncate">
                  Incline Dumbbell Press
                </span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-white/60 shrink-0 bg-[#2A292E] px-2 py-1 rounded">
              4 × 8-10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
