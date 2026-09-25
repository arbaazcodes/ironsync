"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Watch,
  Heart,
  Activity,
  Zap,
  Sliders,
  Bluetooth,
  RefreshCw,
  Check,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface WearableSyncScreenProps {
  onClose: () => void;
}

interface Ecosystem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

const ECOSYSTEMS: Ecosystem[] = [
  {
    id: "apple_health",
    name: "Apple Health & Health Connect",
    description: "Two-way activity, active calories, sleep stages & resting heart rate sync.",
    enabled: true,
    color: "#FF3D41",
  },
  {
    id: "whoop",
    name: "WHOOP 4.0 Biometrics",
    description: "Continuous strain, recovery index and cardiovascular strain reconciliation.",
    enabled: true,
    color: "#00E5FF",
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    description: "Body Battery, VO2 Max, training load focus and respiration rate.",
    enabled: false,
    color: "#FFC72C",
  },
  {
    id: "ble_sensor",
    name: "GymAware / Barbell Velocity BLE",
    description: "Direct optical sensor BLE link for real-time rep velocity (m/s) telemetry.",
    enabled: true,
    color: "#30D158",
  },
];

export function WearableSyncScreen({ onClose }: WearableSyncScreenProps) {
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>(ECOSYSTEMS);
  const [syncing, setSyncing] = useState(false);

  const toggleEcosystem = (id: string) => {
    setEcosystems((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    );
  };

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
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
          <h1 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Connected Devices
          </h1>
        </div>

        <button
          onClick={handleForceSync}
          disabled={syncing}
          type="button"
          className="w-9 h-9 rounded-full bg-[#16161A] border border-white/[0.06] flex items-center justify-center text-[#00E5FF] active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* ── SCROLLABLE BODY ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4 flex flex-col gap-4 text-white">
        {/* Intro */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 self-start px-2.5 py-1 rounded-full bg-[#16161A] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="font-mono text-[10px] text-[#00E5FF] uppercase tracking-wider font-bold">
              Biometric Engine • BLE &amp; API
            </span>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
            Device Integrations
          </h2>
          <p className="text-xs text-white/60 leading-relaxed">
            Synchronize real-time biometric strain, heart rate, and barbell velocity to calibrate your recovery in real time.
          </p>
        </div>

        {/* Active Connected Device Card (Hero Card) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#16161A] border border-white/[0.08] p-4 shadow-xl flex flex-col gap-3">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FF3D41]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Device Metadata */}
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0E0E12] border border-white/[0.06] flex items-center justify-center relative shadow-inner text-[#FF3D41]">
                <Watch className="w-6 h-6" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#16161A] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#FFC72C]" />
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-sans">Apple Watch Ultra 2</h3>
                  <span className="px-1.5 py-0.2 rounded bg-[#2A292E] text-white/60 font-mono text-[9px] uppercase font-bold">
                    Titanium
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                  <span className="font-mono text-[10px] text-[#00E5FF]">Connected • Low Latency BLE</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0E0E12] text-[#FFC72C] font-mono text-xs font-bold border border-[#FFC72C]/20">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>84%</span>
            </div>
          </div>

          {/* Live Biometric Telemetry Sub-panel */}
          <div className="rounded-xl bg-[#0E0E12] p-3 border border-white/[0.04] flex flex-col gap-2.5 mt-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-wider font-bold">
                Live Telemetry HUD
              </span>
              <div className="flex items-center gap-1 font-mono text-[9px] text-[#FF3D41]">
                <Heart className="w-3 h-3 fill-current animate-pulse" />
                <span>Streaming 1.2 Hz</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Live HR */}
              <div className="p-2 rounded-lg bg-[#16161A] border border-white/[0.04]">
                <span className="font-mono text-[9px] text-white/50 uppercase block">Live HR</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-base font-black text-white">138</span>
                  <span className="font-mono text-[9px] text-[#FF3D41] font-bold">BPM</span>
                </div>
                {/* ECG Waveform SVG */}
                <div className="h-4 w-full mt-1">
                  <svg className="w-full h-full text-[#FF3D41]" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path
                      d="M0 10 L20 10 L28 2 L34 18 L40 7 L44 12 L48 10 L68 10 L74 3 L80 17 L86 10 L100 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* HRV Zone */}
              <div className="p-2 rounded-lg bg-[#16161A] border border-white/[0.04]">
                <span className="font-mono text-[9px] text-white/50 uppercase block">HRV Zone</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-base font-black text-white">68</span>
                  <span className="font-mono text-[9px] text-[#FFC72C] font-bold">ms</span>
                </div>
                <span className="mt-1 inline-block px-1.5 py-0.2 rounded bg-[#FFC72C]/10 text-[#FFC72C] font-mono text-[9px]">
                  Optimal
                </span>
              </div>

              {/* Strain */}
              <div className="p-2 rounded-lg bg-[#16161A] border border-white/[0.04]">
                <span className="font-mono text-[9px] text-white/50 uppercase block">Strain</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-base font-black text-white">14.2</span>
                  <span className="font-mono text-[9px] text-white/50">/21</span>
                </div>
                <div className="w-full h-1.5 bg-[#202026] rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FFC72C] to-[#FF3D41] rounded-full" style={{ width: "67%" }} />
                </div>
              </div>
            </div>

            {/* Calibrate Optical Sensors Button */}
            <button
              onClick={() => alert("Optical photoplethysmography sensor calibrated to athlete wrist tone.")}
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-[#16161A] hover:bg-[#1F1F23] border border-white/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-white font-mono text-xs font-semibold"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FF3D41]" />
              <span>Calibrate Optical Sensors</span>
            </button>
          </div>
        </div>

        {/* Supported Ecosystems & Sensors */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Supported Ecosystems &amp; Sensors
            </h4>
            <span className="font-mono text-[10px] text-white/50">4 Integrations</span>
          </div>

          <div className="flex flex-col gap-2">
            {ecosystems.map((eco) => (
              <div
                key={eco.id}
                className="rounded-xl bg-[#16161A] border border-white/[0.06] p-3.5 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${eco.color}15`, color: eco.color }}
                  >
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate font-sans">
                      {eco.name}
                    </span>
                    <p className="text-[10px] text-white/50 mt-0.5 line-clamp-1">
                      {eco.description}
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  onClick={() => toggleEcosystem(eco.id)}
                  type="button"
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                    eco.enabled ? "bg-[#FF3D41]" : "bg-[#2A292E]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      eco.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => alert("Searching for Bluetooth Low Energy fitness sensors...")}
            type="button"
            className="w-full h-12 rounded-full bg-[#16161A] border border-white/10 text-white font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Bluetooth className="w-4 h-4 text-[#00E5FF]" />
            <span>Pair BLE Barbell Sensor</span>
          </button>

          <button
            onClick={handleForceSync}
            disabled={syncing}
            type="button"
            className="w-full h-12 rounded-full bg-[#FF3D41] hover:bg-[#FF5558] text-white font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,61,65,0.4)] active:scale-95 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing Telemetry..." : "Force Re-Sync Telemetry"}</span>
          </button>
        </div>
      </main>
    </motion.div>
  );
}
