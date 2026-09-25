"use client";

import React from "react";
import { MuscleMap } from "./MuscleMap";
import { MuscleGroupId } from '@/components/mobile/tokens';

interface HeatmapOverlayProps {
  /** Per-muscle fatigue intensity 0–1 */
  fatigue: Partial<Record<MuscleGroupId, number>>;
  view?: "front" | "back";
  size?: number;
  className?: string;
}

export function HeatmapOverlay({ fatigue, view = "front", size = 180, className }: HeatmapOverlayProps) {
  return (
    <MuscleMap
      view={view}
      active={[]}
      heatmap={fatigue}
      size={size}
      className={className}
    />
  );
}
