"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Flame,
  Award,
  Zap,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

const RANGES = ["1M", "3M", "6M", "1Y", "ALL"] as const;
type TimeRange = (typeof RANGES)[number];

const LIFETIME_RECORDS = [
  { lift: "Barbell Deadlift", weight: 455, reps: 1, date: "Sep 14", percentile: "Top 4%", pr: true },
  { lift: "Barbell Bench Press", weight: 315, reps: 1, date: "Aug 29", percentile: "Top 7%", pr: false },
  { lift: "Back Squat", weight: 385, reps: 2, date: "Aug 12", percentile: "Top 10%", pr: false },
  { lift: "Overhead Press", weight: 205, reps: 1, date: "Jul 22", percentile: "Top 8%", pr: false },
];

export function AnalyticsScreen() {
  const [range, setRange] = useState<TimeRange>("3M");

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
            <span className="font-mono text-[9px] text-[#FFC72C] uppercase font-bold tracking-wider">
              IronSync
            </span>
            <h1 className="font-extrabold text-sm tracking-tight text-white font-sans uppercase">
              Analytics Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#16161A] border border-white/[0.06] flex items-center justify-center text-white/60 hover:text-white"
          >
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10">
            <img
              src="/images/mobile/coach-portrait.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <div className="px-4 pt-3 flex flex-col gap-4">
        {/* Context HUD */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase text-[#FFC72C] flex items-center gap-1.5 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FFC72C] animate-ping" />
            Biometric &amp; Load Reconciliation
          </span>
          <span className="font-mono text-[9px] text-white/50 bg-[#16161A] px-2 py-0.5 rounded-full border border-white/[0.04]">
            SYNCED: 07:42 AM
          </span>
        </div>

        {/* Segmented Time-Range Selector */}
        <div className="flex items-center justify-between p-1 bg-[#16161A] border border-white/[0.06] rounded-full">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              type="button"
              className={`font-mono text-xs px-3.5 py-1.5 rounded-full transition-all ${
                range === r
                  ? "bg-[#FF3D41] text-white font-bold shadow-[0_0_12px_rgba(255,84,81,0.35)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Dual-Metric Chart Card */}
        <section className="bg-[#16161A] border border-white/[0.08] p-4 rounded-2xl shadow-lg relative flex flex-col gap-3 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FF3D41]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Metric Legend Header */}
          <div className="flex items-start justify-between gap-2 z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D41] shadow-[0_0_8px_rgba(255,84,81,0.6)]" />
                <span className="font-mono text-[10px] text-white uppercase font-bold tracking-wider">
                  Body Weight
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-white font-sans">178.4</span>
                <span className="font-mono text-[10px] text-white/50">lbs avg</span>
                <span className="font-mono text-[10px] text-[#00E5FF] font-bold bg-[#1F1F23] px-1.5 py-0.5 rounded ml-1">
                  -1.6 lbs
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#FFC72C] rounded-full" />
                <span className="font-mono text-[10px] text-[#FFC72C] uppercase font-bold tracking-wider">
                  Est. BF% / Load
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-[#FFC72C] font-sans">14.2%</span>
                <span className="font-mono text-[10px] text-white/50">• 184k lbs</span>
              </div>
            </div>
          </div>

          {/* Dual SVG Graph Container */}
          <div className="relative w-full h-48 mt-1 select-none">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 320 180"
            >
              <defs>
                <linearGradient id="anWeightGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff5451" stopOpacity="0.35" />
                  <stop offset="90%" stopColor="#ff5451" stopOpacity="0.0" />
                </linearGradient>
                <filter id="anGlowCrimson" height="140%" width="140%" x="-20%" y="-20%">
                  <feDropShadow dx="0" dy="0" floodColor="#ff5451" floodOpacity="0.7" stdDeviation="3" />
                </filter>
              </defs>

              {/* Grid Lines */}
              <g stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" strokeWidth="1">
                <line x1="0" x2="320" y1="20" y2="20" />
                <line x1="0" x2="320" y1="65" y2="65" />
                <line x1="0" x2="320" y1="110" y2="110" />
                <line x1="0" x2="320" y1="155" y2="155" />
              </g>

              {/* Axis Labels */}
              <text fill="#8E8E93" fontSize="9" className="font-mono" x="3" y="24">188</text>
              <text fill="#8E8E93" fontSize="9" className="font-mono" x="3" y="69">184</text>
              <text fill="#8E8E93" fontSize="9" className="font-mono" x="3" y="114">180</text>
              <text fill="#8E8E93" fontSize="9" className="font-mono" x="3" y="159">176</text>

              <text fill="#FFC72C" fontSize="9" className="font-mono" textAnchor="end" x="315" y="24">17%</text>
              <text fill="#FFC72C" fontSize="9" className="font-mono" textAnchor="end" x="315" y="69">15.5%</text>
              <text fill="#FFC72C" fontSize="9" className="font-mono" textAnchor="end" x="315" y="114">14.8%</text>
              <text fill="#FFC72C" fontSize="9" className="font-mono" textAnchor="end" x="315" y="159">14.0%</text>

              {/* Amber Dashed Curve (Volume & Lean Mass Trend) */}
              <path
                d="M 15 145 C 50 135, 80 120, 120 110 C 160 100, 200 85, 240 70 C 270 58, 295 50, 305 45"
                fill="none"
                stroke="#FFC72C"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeWidth="2"
              />

              {/* Bodyweight Fill Area */}
              <path
                d="M 15 32 C 55 45, 90 60, 130 82 C 170 105, 210 115, 250 130 C 280 142, 295 148, 305 152 L 305 170 L 15 170 Z"
                fill="url(#anWeightGrad)"
              />

              {/* Crimson Solid Curve */}
              <path
                d="M 15 32 C 55 45, 90 60, 130 82 C 170 105, 210 115, 250 130 C 280 142, 295 148, 305 152"
                fill="none"
                filter="url(#anGlowCrimson)"
                stroke="#FF3D41"
                strokeLinecap="round"
                strokeWidth="2.5"
              />

              {/* Trend Dots */}
              <circle cx="15" cy="32" fill="#FF3D41" r="3" />
              <circle cx="130" cy="82" fill="#FF3D41" r="3" />
              <circle cx="210" cy="115" fill="#FF3D41" r="3" />
              <circle cx="250" cy="130" fill="#FF3D41" r="3.5" />

              {/* Active Pulsing Dot */}
              <circle cx="305" cy="152" fill="#FF3D41" opacity="0.4" r="7" className="animate-ping" />
              <circle cx="305" cy="152" fill="#FFFFFF" r="4.5" />
              <circle cx="305" cy="152" fill="#68000B" r="2.5" />
              <circle cx="305" cy="45" fill="#FFC72C" r="3.5" />
            </svg>

            {/* Micro Tooltip Bubble */}
            <div className="absolute right-2 bottom-6 bg-[#0E0E12]/95 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xl pointer-events-none flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D41]" />
                <span className="font-bold text-white">178.4 lbs</span>
                <span className="text-[#00E5FF]">(-1.6)</span>
              </div>
              <span className="font-mono text-[9px] text-white/50">Oct 24 • Fasted Morning</span>
            </div>
          </div>

          {/* Quick Micro Stats Strip inside card */}
          <div className="grid grid-cols-3 gap-2 bg-[#0E0E12] p-2.5 rounded-xl border border-white/[0.04]">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-white/50 uppercase font-semibold">30D DELTA</span>
              <span className="font-mono text-xs font-bold text-[#00E5FF]">-4.2 lbs</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-white/50 uppercase font-semibold">LEAN GAIN</span>
              <span className="font-mono text-xs font-bold text-[#FFC72C]">+1.8 lbs</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-white/50 uppercase font-semibold">AVG RPE</span>
              <span className="font-mono text-xs font-bold text-[#FF3D41]">8.6 / 10</span>
            </div>
          </div>
        </section>

        {/* Lifetime Telemetry Records */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#FFC72C]" />
              Lifetime Telemetry Records
            </h2>
            <span className="font-mono text-[10px] text-white/50">Verified 1RM</span>
          </div>

          <div className="flex flex-col gap-2">
            {LIFETIME_RECORDS.map((rec) => (
              <div
                key={rec.lift}
                className="p-3 rounded-xl bg-[#16161A] border border-white/[0.06] flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-sans">{rec.lift}</span>
                    {rec.pr && (
                      <span className="px-1.5 py-0.2 rounded bg-[#FFC72C]/20 text-[#FFC72C] font-mono text-[9px] font-bold">
                        NEW PR
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-white/50 mt-0.5">
                    {rec.date} • {rec.percentile}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-base font-black text-white">{rec.weight}</span>
                  <span className="font-mono text-[10px] text-[#FF3D41] font-bold">LBS</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
