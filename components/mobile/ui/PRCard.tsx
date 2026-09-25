"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import { IS } from '@/components/mobile/tokens';

export interface PREntry {
  lift: string;
  value: number;
  unit: "kg" | "lbs";
  percentile: number;   // 0–100
  trend: "up" | "down" | "flat";
  trendValue?: number;  // e.g. +5 kg since last month
}

interface PRCardProps {
  entry: PREntry;
  unit?: "kg" | "lbs";
}

function percentileColor(p: number): string {
  if (p >= 90) return IS.accent;
  if (p >= 70) return IS.amber;
  if (p >= 50) return "#30D158";
  return IS.textSecondary;
}

function percentileLabel(p: number): string {
  if (p >= 95) return "Elite";
  if (p >= 80) return "Advanced";
  if (p >= 60) return "Intermediate";
  if (p >= 40) return "Novice";
  return "Beginner";
}

export function PRCard({ entry, unit = "kg" }: PRCardProps) {
  const color = percentileColor(entry.percentile);
  const label = percentileLabel(entry.percentile);
  const displayValue = unit === entry.unit
    ? entry.value
    : unit === "lbs"
    ? Math.round(entry.value * 2.20462)
    : Math.round(entry.value / 2.20462);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      style={{
        background: IS.surface2,
        border: `1px solid ${IS.border}`,
        borderRadius: IS.radiusLg,
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow accent on top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6,
      }} />

      {/* Lift name */}
      <p style={{ fontSize: 11, fontWeight: 600, color: IS.textDim, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
        {entry.lift}
      </p>

      {/* PR Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
        <span style={{ fontFamily: IS.fontMono, fontSize: 32, fontWeight: 800, color: IS.textPrimary, lineHeight: 1 }}>
          {displayValue}
        </span>
        <span style={{ fontSize: 14, fontWeight: 500, color: IS.textSecondary }}>{unit}</span>
      </div>

      {/* Trend */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
        {entry.trend === "up" ? <TrendingUp size={13} color={IS.green} /> :
          entry.trend === "down" ? <TrendingDown size={13} color={IS.accent} /> :
            <Minus size={13} color={IS.textDim} />}
        {entry.trendValue !== undefined && (
          <span style={{
            fontSize: 12, fontWeight: 500,
            color: entry.trend === "up" ? IS.green : entry.trend === "down" ? IS.accent : IS.textDim,
          }}>
            {entry.trend === "up" ? "+" : ""}{entry.trendValue} {unit}
          </span>
        )}
        <span style={{ fontSize: 11, color: IS.textDim }}>since last month</span>
      </div>

      {/* Percentile bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: IS.textDim }}>Percentile</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Award size={10} color={color} />
            <span style={{ fontSize: 10, fontWeight: 700, color }}>{label}</span>
          </div>
        </div>
        <div style={{ height: 4, background: IS.surface3, borderRadius: 4, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${entry.percentile}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: "100%", background: color, borderRadius: 4 }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
          <span style={{ fontSize: 9, color: IS.textDim }}>0</span>
          <span style={{ fontSize: 9, fontWeight: 600, color }}>{entry.percentile}th</span>
          <span style={{ fontSize: 9, color: IS.textDim }}>100</span>
        </div>
      </div>
    </motion.div>
  );
}
