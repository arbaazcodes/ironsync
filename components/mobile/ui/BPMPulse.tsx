"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { IS } from '@/components/mobile/tokens';

interface BPMPulseProps {
  bpm: number;
  /** Heart rate zones */
  zone?: "rest" | "fat-burn" | "cardio" | "peak";
  size?: "sm" | "md" | "lg";
}

const ZONE_COLORS = {
  "rest": IS.textSecondary,
  "fat-burn": IS.green,
  "cardio": IS.amber,
  "peak": IS.accent,
};

const ZONE_LABELS = {
  "rest": "Rest",
  "fat-burn": "Fat Burn",
  "cardio": "Cardio",
  "peak": "Peak",
};

function getZone(bpm: number): "rest" | "fat-burn" | "cardio" | "peak" {
  if (bpm < 100) return "rest";
  if (bpm < 130) return "fat-burn";
  if (bpm < 160) return "cardio";
  return "peak";
}

export function BPMPulse({ bpm, zone, size = "md" }: BPMPulseProps) {
  const resolvedZone: "rest" | "fat-burn" | "cardio" | "peak" = zone ?? getZone(bpm);
  const color = ZONE_COLORS[resolvedZone];
  // Pulse animation period based on BPM (60000ms / bpm)
  const period = bpm > 0 ? 60 / bpm : 1;

  const iconSize = size === "sm" ? 16 : size === "lg" ? 32 : 22;
  const fontSize = size === "sm" ? 24 : size === "lg" ? 56 : 40;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {/* Glowing ring */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: period, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: iconSize * 2.4,
            height: iconSize * 2.4,
            borderRadius: "50%",
            background: color,
            opacity: 0.2,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: period, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart
            size={iconSize}
            color={color}
            fill={color}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </motion.div>
      </div>

      {/* BPM number */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <motion.span
          key={bpm}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: IS.fontMono,
            fontSize,
            fontWeight: 700,
            color,
            lineHeight: 1,
            filter: `drop-shadow(0 0 12px ${color}60)`,
          }}
        >
          {bpm}
        </motion.span>
        <span style={{ fontSize: 13, color: IS.textSecondary, fontWeight: 500 }}>BPM</span>
      </div>

      {/* Zone pill */}
      <div style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: IS.radiusPill,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        color,
        letterSpacing: "0.04em",
      }}>
        {ZONE_LABELS[resolvedZone]}
      </div>
    </div>
  );
}
