"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  ShieldCheck,
  Award,
  Zap,
  Flame,
  Watch,
  Fingerprint,
  ChevronRight,
  TrendingUp,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface ProfileScreenProps {
  onWearableSync?: () => void;
  onLogout?: () => void;
}

export function ProfileScreen({ onWearableSync, onLogout }: ProfileScreenProps) {
  const [unit, setUnit] = useState<"LBS" | "KG">("LBS");
  const [biometricEnabled, setBiometricEnabled] = useState(true);

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
          <span className="font-extrabold text-sm tracking-wider uppercase text-white font-sans">
            Iron<span className="text-[#FF3D41]">Sync</span>
          </span>
        </div>

        <h1 className="text-sm font-bold uppercase tracking-wider text-white font-mono truncate">
          Profile &amp; Standards
        </h1>

        <button
          type="button"
          className="w-9 h-9 rounded-full bg-[#16161A] border border-white/[0.06] flex items-center justify-center text-white/60 hover:text-white"
        >
          <Settings className="w-4 h-4" />
        </button>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <div className="px-4 pt-3 flex flex-col gap-4">
        {/* Hero Profile Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#16161A] border border-white/[0.08] p-5 shadow-xl flex flex-col items-center text-center">
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#FF3D41]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-[#FFC72C]/10 blur-3xl pointer-events-none" />

          {/* Avatar with Pulsing Rim */}
          <div className="relative mb-3 z-10">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#FF3D41] via-[#2A292E] to-[#FFC72C] shadow-[0_0_24px_rgba(255,84,81,0.35)]">
              <img
                src="/images/mobile/coach-portrait.png"
                alt="Marcus Vance"
                className="w-full h-full object-cover rounded-full bg-[#0E0E12]"
              />
            </div>
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#0E0E12] flex items-center justify-center text-[#FFC72C] shadow-md border border-[#FFC72C]/40">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Identity */}
          <div className="flex items-center gap-1.5 z-10">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase font-sans">
              Marcus Vance
            </h2>
            <Award className="w-5 h-5 text-[#FFC72C]" />
          </div>

          {/* Classification Badge */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F23] border border-white/10 text-white shadow-sm z-10">
            <span className="w-2 h-2 rounded-full bg-[#FF3D41] animate-ping" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
              Advanced Lifter • Tier III
            </span>
          </div>

          <p className="mt-2 font-mono text-[11px] text-white/50 max-w-xs z-10">
            Member since Jan 2023 • Bodyweight: 182.4 lbs (82.7 kg)
          </p>

          {/* Quick Stats Strip */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 bg-[#0E0E12] rounded-xl p-2.5 border border-white/[0.04] z-10">
            <div className="flex flex-col items-center text-center">
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider">1RM Total</span>
              <span className="font-mono text-base text-white font-bold mt-0.5">1,120 lbs</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Wilks</span>
              <span className="font-mono text-base text-[#FFC72C] font-bold mt-0.5">348.2</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider">Streak</span>
              <span className="font-mono text-base text-[#FF3D41] font-bold mt-0.5">18 wks</span>
            </div>
          </div>
        </div>

        {/* Strength Standards & 1RM Benchmarks (2x2 Grid) */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Strength Standards
              </h3>
              <p className="font-mono text-[10px] text-white/50">Epley &amp; Brzycki telemetry models</p>
            </div>
            <div className="flex items-center gap-1 bg-[#16161A] p-1 rounded-full border border-white/[0.06]">
              <button
                onClick={() => setUnit("LBS")}
                type="button"
                className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  unit === "LBS" ? "bg-[#FF3D41] text-white" : "text-white/50"
                }`}
              >
                LBS
              </button>
              <button
                onClick={() => setUnit("KG")}
                type="button"
                className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  unit === "KG" ? "bg-[#FF3D41] text-white" : "text-white/50"
                }`}
              >
                KG
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: Bench Press */}
            <div className="flex flex-col justify-between rounded-xl bg-[#16161A] border border-white/[0.06] p-3 shadow-md">
              <span className="font-mono text-[10px] uppercase text-white/50">Bench Press</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-black text-white">
                  {unit === "LBS" ? 245 : 111}
                </span>
                <span className="font-mono text-[10px] text-white/50">{unit}</span>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <span className="font-mono text-[9px] text-[#FFC72C] bg-[#FFC72C]/10 px-2 py-0.5 rounded-full w-fit">
                  Top 8% Class
                </span>
                <span className="text-[10px] text-white/50 font-mono">+10 lbs • 2w ago</span>
              </div>
            </div>

            {/* Card 2: Barbell Squat */}
            <div className="flex flex-col justify-between rounded-xl bg-[#16161A] border border-white/[0.06] p-3 shadow-md">
              <span className="font-mono text-[10px] uppercase text-white/50">Barbell Squat</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-black text-white">
                  {unit === "LBS" ? 315 : 143}
                </span>
                <span className="font-mono text-[10px] text-white/50">{unit}</span>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <span className="font-mono text-[9px] text-[#FFC72C] bg-[#FFC72C]/10 px-2 py-0.5 rounded-full w-fit">
                  Top 12% Class
                </span>
                <span className="text-[10px] text-white/50 font-mono">+15 lbs • 1w ago</span>
              </div>
            </div>

            {/* Card 3: Deadlift (Elite Glow) */}
            <div className="flex flex-col justify-between rounded-xl bg-[#16161A] border border-[#FF3D41]/30 p-3 shadow-md relative overflow-hidden shadow-[0_0_20px_rgba(255,61,65,0.15)]">
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#FF3D41]/20 rounded-full blur-xl pointer-events-none" />
              <span className="font-mono text-[10px] uppercase text-[#FF3D41] font-bold">Deadlift</span>
              <div className="mt-1 flex items-baseline gap-1 z-10">
                <span className="font-mono text-2xl font-black text-white">
                  {unit === "LBS" ? 405 : 184}
                </span>
                <span className="font-mono text-[10px] text-[#FF3D41]">{unit}</span>
              </div>
              <div className="mt-2 flex flex-col gap-1 z-10">
                <span className="font-mono text-[9px] text-white bg-[#FF3D41] px-2 py-0.5 rounded-full w-fit font-bold">
                  Top 5% Elite Tier
                </span>
                <span className="text-[10px] text-white/50 font-mono">+20 lbs • 3w ago</span>
              </div>
            </div>

            {/* Card 4: Overhead Press */}
            <div className="flex flex-col justify-between rounded-xl bg-[#16161A] border border-white/[0.06] p-3 shadow-md">
              <span className="font-mono text-[10px] uppercase text-white/50">Overhead Press</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-black text-white">
                  {unit === "LBS" ? 155 : 70}
                </span>
                <span className="font-mono text-[10px] text-white/50">{unit}</span>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <span className="font-mono text-[9px] text-[#FFC72C] bg-[#FFC72C]/10 px-2 py-0.5 rounded-full w-fit">
                  Top 15% Class
                </span>
                <span className="text-[10px] text-white/50 font-mono">+5 lbs • 3w ago</span>
              </div>
            </div>
          </div>
        </section>

        {/* Device Sync & App Integrations */}
        <section className="flex flex-col gap-2">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Ecosystem &amp; Security
          </h3>

          <div className="flex flex-col rounded-xl bg-[#16161A] border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">
            {/* Connected Wearables */}
            <button
              onClick={onWearableSync}
              type="button"
              className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0E0E12] flex items-center justify-center text-[#00E5FF]">
                  <Watch className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Connected Devices &amp; BLE Sensors</span>
                  <span className="font-mono text-[10px] text-[#00E5FF]">Apple Watch Ultra 2 • Synced</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>

            {/* Biometric Unlock Toggle */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0E0E12] flex items-center justify-center text-[#FFC72C]">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Biometric Quick Unlock</span>
                  <span className="font-mono text-[10px] text-white/50">Fingerprint / Face ID</span>
                </div>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                type="button"
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  biometricEnabled ? "bg-[#FF3D41]" : "bg-[#2A292E]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    biometricEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Sign Out */}
            <button
              onClick={onLogout}
              type="button"
              className="p-3.5 flex items-center justify-between text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-mono text-xs font-bold"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>End Active Session</span>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
