"use client";

import React from "react";
import { IS, MuscleGroupId } from '@/components/mobile/tokens';

interface MuscleMapProps {
  view?: "front" | "back";
  /** Which muscles are highlighted/selected */
  active?: MuscleGroupId[];
  /** Per-muscle intensity 0–1 for heatmap mode */
  heatmap?: Partial<Record<MuscleGroupId, number>>;
  /** Called when user taps a muscle region */
  onMusclePress?: (id: MuscleGroupId) => void;
  className?: string;
  size?: number;
}

const MUSCLE_COLORS: Record<MuscleGroupId, string> = {
  chest: IS.accent,
  back: "#3D8EFF",
  legs: "#30D158",
  shoulders: IS.amber,
  arms: "#BF5AF2",
  core: "#FF9F0A",
  glutes: "#30D158",
  calves: "#64D2FF",
};

function heatColor(intensity: number): string {
  // 0 = cool blue, 0.5 = amber, 1 = crimson
  if (intensity <= 0) return "rgba(61,142,255,0.15)";
  if (intensity < 0.5) {
    const t = intensity * 2;
    return `rgba(255,${Math.round(199 - t * 100)},44,${0.3 + t * 0.3})`;
  }
  const t = (intensity - 0.5) * 2;
  return `rgba(255,${Math.round(99 - t * 61)},65,${0.5 + t * 0.4})`;
}

/** Front-view SVG paths — simplified anatomical silhouette */
function FrontBody({
  active = [],
  heatmap = {},
  onMusclePress,
}: {
  active: MuscleGroupId[];
  heatmap: Partial<Record<MuscleGroupId, number>>;
  onMusclePress?: (id: MuscleGroupId) => void;
}) {
  const fill = (id: MuscleGroupId) => {
    if (heatmap[id] !== undefined) return heatColor(heatmap[id]!);
    if (active.includes(id)) return MUSCLE_COLORS[id] + "55";
    return "rgba(255,255,255,0.04)";
  };
  const stroke = (id: MuscleGroupId) => {
    if (active.includes(id)) return MUSCLE_COLORS[id];
    return IS.border;
  };
  const glow = (id: MuscleGroupId) =>
    active.includes(id)
      ? `drop-shadow(0 0 6px ${MUSCLE_COLORS[id]})`
      : "none";

  const press = (id: MuscleGroupId) => () => onMusclePress?.(id);

  return (
    <svg viewBox="0 0 180 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body silhouette */}
      <ellipse cx="90" cy="40" rx="26" ry="30" fill="#1C1C22" stroke={IS.border} strokeWidth="1" /> {/* Head */}
      <rect x="60" y="72" width="60" height="4" rx="2" fill="#1C1C22" /> {/* Neck */}

      {/* Shoulders */}
      <ellipse cx="52" cy="92" rx="18" ry="12" fill={fill("shoulders")} stroke={stroke("shoulders")} strokeWidth="1"
        style={{ filter: glow("shoulders"), cursor: "pointer" }} onClick={press("shoulders")} />
      <ellipse cx="128" cy="92" rx="18" ry="12" fill={fill("shoulders")} stroke={stroke("shoulders")} strokeWidth="1"
        style={{ filter: glow("shoulders"), cursor: "pointer" }} onClick={press("shoulders")} />

      {/* Arms */}
      <rect x="30" y="100" width="26" height="80" rx="13" fill={fill("arms")} stroke={stroke("arms")} strokeWidth="1"
        style={{ filter: glow("arms"), cursor: "pointer" }} onClick={press("arms")} />
      <rect x="124" y="100" width="26" height="80" rx="13" fill={fill("arms")} stroke={stroke("arms")} strokeWidth="1"
        style={{ filter: glow("arms"), cursor: "pointer" }} onClick={press("arms")} />

      {/* Chest */}
      <path d="M68 76 L112 76 L116 124 L64 124 Z" fill={fill("chest")} stroke={stroke("chest")} strokeWidth="1"
        style={{ filter: glow("chest"), cursor: "pointer" }} onClick={press("chest")} />
      {/* Pec line */}
      <line x1="90" y1="76" x2="90" y2="124" stroke={IS.border} strokeWidth="0.5" />

      {/* Core / Abs */}
      <rect x="68" y="126" width="44" height="72" rx="8" fill={fill("core")} stroke={stroke("core")} strokeWidth="1"
        style={{ filter: glow("core"), cursor: "pointer" }} onClick={press("core")} />
      {/* Six-pack lines */}
      {[140, 154, 168].map(y => (
        <React.Fragment key={y}>
          <line x1="68" y1={y} x2="112" y2={y} stroke={IS.border} strokeWidth="0.5" />
          <line x1="90" y1="126" x2="90" y2="198" stroke={IS.border} strokeWidth="0.5" />
        </React.Fragment>
      ))}

      {/* Legs */}
      <rect x="60" y="200" width="28" height="100" rx="14" fill={fill("legs")} stroke={stroke("legs")} strokeWidth="1"
        style={{ filter: glow("legs"), cursor: "pointer" }} onClick={press("legs")} />
      <rect x="92" y="200" width="28" height="100" rx="14" fill={fill("legs")} stroke={stroke("legs")} strokeWidth="1"
        style={{ filter: glow("legs"), cursor: "pointer" }} onClick={press("legs")} />

      {/* Calves */}
      <rect x="62" y="302" width="24" height="56" rx="12" fill={fill("calves")} stroke={stroke("calves")} strokeWidth="1"
        style={{ filter: glow("calves"), cursor: "pointer" }} onClick={press("calves")} />
      <rect x="94" y="302" width="24" height="56" rx="12" fill={fill("calves")} stroke={stroke("calves")} strokeWidth="1"
        style={{ filter: glow("calves"), cursor: "pointer" }} onClick={press("calves")} />

      {/* Forearms */}
      <rect x="32" y="182" width="22" height="44" rx="11" fill={fill("arms")} stroke={stroke("arms")} strokeWidth="1"
        style={{ filter: glow("arms"), cursor: "pointer" }} onClick={press("arms")} />
      <rect x="126" y="182" width="22" height="44" rx="11" fill={fill("arms")} stroke={stroke("arms")} strokeWidth="1"
        style={{ filter: glow("arms"), cursor: "pointer" }} onClick={press("arms")} />
    </svg>
  );
}

/** Back-view SVG paths */
function BackBody({
  active = [],
  heatmap = {},
  onMusclePress,
}: {
  active: MuscleGroupId[];
  heatmap: Partial<Record<MuscleGroupId, number>>;
  onMusclePress?: (id: MuscleGroupId) => void;
}) {
  const fill = (id: MuscleGroupId) => {
    if (heatmap[id] !== undefined) return heatColor(heatmap[id]!);
    if (active.includes(id)) return MUSCLE_COLORS[id] + "55";
    return "rgba(255,255,255,0.04)";
  };
  const stroke = (id: MuscleGroupId) =>
    active.includes(id) ? MUSCLE_COLORS[id] : IS.border;
  const glow = (id: MuscleGroupId) =>
    active.includes(id) ? `drop-shadow(0 0 6px ${MUSCLE_COLORS[id]})` : "none";
  const press = (id: MuscleGroupId) => () => onMusclePress?.(id);

  return (
    <svg viewBox="0 0 180 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="90" cy="40" rx="26" ry="30" fill="#1C1C22" stroke={IS.border} strokeWidth="1" />
      <rect x="60" y="72" width="60" height="4" rx="2" fill="#1C1C22" />

      {/* Traps / Shoulders */}
      <path d="M90 76 L60 92 L50 80 L90 72 Z" fill={fill("shoulders")} stroke={stroke("shoulders")} strokeWidth="1"
        style={{ filter: glow("shoulders"), cursor: "pointer" }} onClick={press("shoulders")} />
      <path d="M90 76 L120 92 L130 80 L90 72 Z" fill={fill("shoulders")} stroke={stroke("shoulders")} strokeWidth="1"
        style={{ filter: glow("shoulders"), cursor: "pointer" }} onClick={press("shoulders")} />

      {/* Back (lats + rhomboids) */}
      <path d="M60 92 L120 92 L118 170 L62 170 Z" fill={fill("back")} stroke={stroke("back")} strokeWidth="1"
        style={{ filter: glow("back"), cursor: "pointer" }} onClick={press("back")} />
      {/* Spine line */}
      <line x1="90" y1="92" x2="90" y2="170" stroke={IS.border} strokeWidth="0.5" />

      {/* Arms */}
      <rect x="30" y="100" width="26" height="80" rx="13" fill={fill("arms")} stroke={stroke("arms")} strokeWidth="1"
        style={{ filter: glow("arms"), cursor: "pointer" }} onClick={press("arms")} />
      <rect x="124" y="100" width="26" height="80" rx="13" fill={fill("arms")} stroke={stroke("arms")} strokeWidth="1"
        style={{ filter: glow("arms"), cursor: "pointer" }} onClick={press("arms")} />

      {/* Glutes */}
      <ellipse cx="76" cy="205" rx="22" ry="20" fill={fill("glutes")} stroke={stroke("glutes")} strokeWidth="1"
        style={{ filter: glow("glutes"), cursor: "pointer" }} onClick={press("glutes")} />
      <ellipse cx="104" cy="205" rx="22" ry="20" fill={fill("glutes")} stroke={stroke("glutes")} strokeWidth="1"
        style={{ filter: glow("glutes"), cursor: "pointer" }} onClick={press("glutes")} />

      {/* Hamstrings */}
      <rect x="60" y="222" width="28" height="82" rx="14" fill={fill("legs")} stroke={stroke("legs")} strokeWidth="1"
        style={{ filter: glow("legs"), cursor: "pointer" }} onClick={press("legs")} />
      <rect x="92" y="222" width="28" height="82" rx="14" fill={fill("legs")} stroke={stroke("legs")} strokeWidth="1"
        style={{ filter: glow("legs"), cursor: "pointer" }} onClick={press("legs")} />

      {/* Calves */}
      <rect x="62" y="306" width="24" height="52" rx="12" fill={fill("calves")} stroke={stroke("calves")} strokeWidth="1"
        style={{ filter: glow("calves"), cursor: "pointer" }} onClick={press("calves")} />
      <rect x="94" y="306" width="24" height="52" rx="12" fill={fill("calves")} stroke={stroke("calves")} strokeWidth="1"
        style={{ filter: glow("calves"), cursor: "pointer" }} onClick={press("calves")} />

      {/* Lower back / Core */}
      <rect x="68" y="170" width="44" height="30" rx="6" fill={fill("core")} stroke={stroke("core")} strokeWidth="1"
        style={{ filter: glow("core"), cursor: "pointer" }} onClick={press("core")} />
    </svg>
  );
}

export function MuscleMap({
  view = "front",
  active = [],
  heatmap = {},
  onMusclePress,
  className = "",
  size = 180,
}: MuscleMapProps) {
  return (
    <div
      className={className}
      style={{ width: size, height: size * (380 / 180) }}
    >
      {view === "front" ? (
        <FrontBody active={active} heatmap={heatmap} onMusclePress={onMusclePress} />
      ) : (
        <BackBody active={active} heatmap={heatmap} onMusclePress={onMusclePress} />
      )}
    </div>
  );
}
