"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  QrCode,
  Flame,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Zap,
  ArrowRight,
  Layers,
  Plus,
} from "lucide-react";
import { IS } from "@/components/mobile/tokens";

interface LibraryScreenProps {
  onExerciseDetail: (name: string) => void;
  onAddExercise: () => void;
}

interface MuscleCard {
  id: string;
  name: string;
  count: number;
  description: string;
  status: string;
  statusColor: string;
  subtargets: { name: string; count: number }[];
  primaryColor: string;
}

const MUSCLE_CARDS: MuscleCard[] = [
  {
    id: "chest",
    name: "Chest",
    count: 31,
    description: "Pectoralis Major/Minor • 4 Paths",
    status: "Optimal",
    statusColor: "#FFC72C",
    primaryColor: "#FF3D41",
    subtargets: [
      { name: "Incline Clavicular", count: 11 },
      { name: "Sternal Flat", count: 14 },
      { name: "Costal / Decline", count: 6 },
    ],
  },
  {
    id: "shoulders",
    name: "Shoulders",
    count: 24,
    description: "Anterior, Lateral & Rear Delts",
    status: "Fresh",
    statusColor: "#00E5FF",
    primaryColor: "#FF3D41",
    subtargets: [
      { name: "Anterior Delts", count: 8 },
      { name: "Lateral Head", count: 10 },
      { name: "Rear / Posterior", count: 6 },
    ],
  },
  {
    id: "back",
    name: "Back",
    count: 38,
    description: "Latissimus Dorsi, Traps & Erectors",
    status: "Ready",
    statusColor: "#30D158",
    primaryColor: "#00E5FF",
    subtargets: [
      { name: "Upper Lats (Width)", count: 14 },
      { name: "Mid-Back (Thickness)", count: 12 },
      { name: "Erectors / Lumbar", count: 8 },
    ],
  },
  {
    id: "arms",
    name: "Arms",
    count: 42,
    description: "Biceps, Triceps & Forearm Flexors",
    status: "Optimal",
    statusColor: "#FFC72C",
    primaryColor: "#FFC72C",
    subtargets: [
      { name: "Triceps Long Head", count: 12 },
      { name: "Biceps Short/Long", count: 16 },
      { name: "Brachialis & Grip", count: 10 },
    ],
  },
  {
    id: "legs",
    name: "Legs & Glutes",
    count: 52,
    description: "Quads, Hamstrings, Glutes & Calves",
    status: "Fresh",
    statusColor: "#00E5FF",
    primaryColor: "#30D158",
    subtargets: [
      { name: "Quadriceps Femoris", count: 18 },
      { name: "Hamstring Chain", count: 14 },
      { name: "Gluteus Complex", count: 12 },
    ],
  },
  {
    id: "core",
    name: "Core & Abs",
    count: 18,
    description: "Rectus Abdominis, Obliques & TVA",
    status: "Ready",
    statusColor: "#30D158",
    primaryColor: "#FF3D41",
    subtargets: [
      { name: "Upper Abdominals", count: 6 },
      { name: "Lower Core Tension", count: 6 },
      { name: "Rotational Obliques", count: 6 },
    ],
  },
];

const FILTERS = ["All Targets", "Compound", "Hypertrophy", "Cables", "Dumbbells", "Barbell"];

export function LibraryScreen({ onExerciseDetail, onAddExercise }: LibraryScreenProps) {
  const [segment, setSegment] = useState<"exercises" | "programs">("exercises");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Targets");
  const [expandedCard, setExpandedCard] = useState<string | null>("chest");

  const toggleExpand = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const filteredCards = MUSCLE_CARDS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="font-extrabold text-sm tracking-tight text-white font-sans uppercase">
              IronSync
            </span>
            <span className="font-mono text-[9px] text-white/50 leading-none">
              Exercise Library
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#16161A] border border-[#FFC72C]/30 text-[#FFC72C]">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="font-mono text-[10px] font-bold">14D</span>
          </div>
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
      <div className="px-4 pt-3 flex flex-col gap-3.5">
        {/* Segmented View Switcher: Programs vs Exercises */}
        <div className="bg-[#0E0E12] p-1 rounded-full border border-white/[0.06] flex items-center justify-between shadow-inner">
          <button
            onClick={() => setSegment("programs")}
            type="button"
            className={`w-1/2 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all flex items-center justify-center gap-1.5 ${
              segment === "programs"
                ? "bg-[#FF3D41] text-white shadow-[0_0_16px_rgba(255,84,81,0.35)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Programs</span>
          </button>
          <button
            onClick={() => setSegment("exercises")}
            type="button"
            className={`w-1/2 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all flex items-center justify-center gap-1.5 ${
              segment === "exercises"
                ? "bg-[#FF3D41] text-white shadow-[0_0_16px_rgba(255,84,81,0.35)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Exercises</span>
          </button>
        </div>

        {/* Telemetry Readiness Strip */}
        <div className="bg-[#16161A] border border-white/[0.08] rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC72C] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFC72C]" />
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#FFC72C] font-bold tracking-wider uppercase">
                Freshness Index: 88%
              </span>
              <span className="text-[10px] text-white/50">
                Recommended: Push Focus (Chest &amp; Delts)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#00E5FF] font-mono text-[10px] bg-[#0E0E12] px-2 py-0.5 rounded-full border border-[#00E5FF]/20">
            <Zap className="w-3 h-3 fill-current" />
            <span>Optimal</span>
          </div>
        </div>

        {/* Search HUD Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 420+ movements, target, equipment..."
            className="w-full bg-[#16161A] border border-white/[0.08] text-white text-xs pl-10 pr-20 py-3 rounded-full focus:outline-none focus:border-[#FF3D41] placeholder:text-white/30 font-sans shadow-inner"
          />
          <div className="absolute right-2 flex items-center gap-1 text-white/40">
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:text-white active:bg-white/10"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:text-white active:bg-white/10"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              type="button"
              className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase font-bold whitespace-nowrap transition-all ${
                selectedFilter === f
                  ? "bg-[#FF3D41] text-white shadow-[0_0_12px_rgba(255,61,65,0.35)]"
                  : "bg-[#16161A] border border-white/[0.06] text-white/50 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Kinetic Anatomy Header */}
        <div className="flex items-center justify-between px-1 mt-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-tight">
              Kinetic Anatomy
            </span>
            <span className="bg-[#16161A] border border-white/[0.06] text-[#FF3D41] font-mono text-[10px] px-2 py-0.5 rounded-full">
              6 Groups
            </span>
          </div>

          <button
            onClick={onAddExercise}
            type="button"
            className="text-[#FFC72C] font-mono text-[10px] uppercase font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Routine</span>
          </button>
        </div>

        {/* Muscle Cards Vertical Stack */}
        <div className="flex flex-col gap-2.5">
          {filteredCards.map((card) => {
            const isExpanded = expandedCard === card.id;

            return (
              <div
                key={card.id}
                className="bg-[#16161A] border border-white/[0.08] rounded-2xl p-4 transition-all shadow-md"
              >
                <div
                  onClick={() => toggleExpand(card.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#0E0E12] border border-white/[0.06] flex items-center justify-center shrink-0 relative overflow-hidden">
                      <Dumbbell className="w-5 h-5 text-[#FF3D41]" />
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-[#FF3D41]" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-white font-sans">{card.name}</h2>
                        <span
                          className="font-mono text-[9px] px-1.5 py-0.2 rounded border font-semibold"
                          style={{
                            color: card.statusColor,
                            borderColor: `${card.statusColor}40`,
                            backgroundColor: `${card.statusColor}15`,
                          }}
                        >
                          {card.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/50 truncate mt-0.5">
                        <span className="text-white/80 font-bold">{card.count} Exercises</span>
                        <span>•</span>
                        <span className="truncate">{card.description}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-white/40">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Expandable Sub-Targets Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-white/[0.06] flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-white/50 font-mono text-[10px]">
                        <span>Active Sub-zones</span>
                        <span className="text-[#00E5FF]">Recovery: 96h ago</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {card.subtargets.map((st) => (
                          <button
                            key={st.name}
                            onClick={() => onExerciseDetail(st.name)}
                            type="button"
                            className="bg-[#1F1F23] hover:bg-[#2A292E] p-2.5 rounded-xl border border-white/[0.04] flex flex-col text-left transition-colors"
                          >
                            <span className="text-xs font-semibold text-white truncate">
                              {st.name}
                            </span>
                            <span className="font-mono text-[9px] text-white/40">
                              {st.count} Movements
                            </span>
                          </button>
                        ))}

                        <button
                          onClick={() => onExerciseDetail(`${card.name} Master Movement`)}
                          type="button"
                          className="bg-[#1F1F23] hover:bg-[#2A292E] p-2.5 rounded-xl border border-[#FF3D41]/30 flex items-center justify-center text-[#FF3D41] font-mono text-[10px] font-bold gap-1 transition-colors"
                        >
                          <span>Explore All →</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
