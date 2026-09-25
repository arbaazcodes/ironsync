"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Plus, Minus } from "lucide-react";
import { IS } from '@/components/mobile/tokens';

export interface SetRow {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface SetTableProps {
  sets: SetRow[];
  activeSetIndex: number;
  unit?: "kg" | "lbs";
  onWeightChange: (index: number, value: number) => void;
  onRepsChange: (index: number, value: number) => void;
  onCompleteSet: (index: number) => void;
}

function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(Math.max(min, value - step))}
        style={{
          width: 28, height: 28, borderRadius: "50%",
          background: IS.surface3, border: `1px solid ${IS.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: IS.textSecondary,
        }}
      >
        <Minus size={12} />
      </motion.button>
      <span style={{
        fontFamily: IS.fontMono, fontSize: 16, fontWeight: 600,
        color: IS.textPrimary, minWidth: 36, textAlign: "center",
      }}>
        {value}
      </span>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onChange(value + step)}
        style={{
          width: 28, height: 28, borderRadius: "50%",
          background: IS.surface3, border: `1px solid ${IS.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: IS.textSecondary,
        }}
      >
        <Plus size={12} />
      </motion.button>
    </div>
  );
}

export function SetTable({
  sets,
  activeSetIndex,
  unit = "kg",
  onWeightChange,
  onRepsChange,
  onCompleteSet,
}: SetTableProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Header */}
      <div style={{
        display: "grid", gridTemplateColumns: "36px 1fr 1fr 44px",
        gap: 8, paddingBottom: 8, borderBottom: `1px solid ${IS.border}`,
      }}>
        {["SET", `WEIGHT (${unit})`, "REPS", ""].map(h => (
          <span key={h} style={{
            fontSize: 10, fontWeight: 600, color: IS.textDim,
            letterSpacing: "0.08em", textAlign: "center",
          }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {sets.map((set, i) => {
        const isActive = i === activeSetIndex && !set.completed;
        const isDone = set.completed;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: "grid",
              gridTemplateColumns: "36px 1fr 1fr 44px",
              gap: 8,
              padding: "10px 0",
              borderRadius: IS.radiusMd,
              background: isActive ? IS.accentMuted : isDone ? "rgba(48,209,88,0.06)" : "transparent",
              border: `1px solid ${isActive ? IS.borderActive : isDone ? "rgba(48,209,88,0.2)" : "transparent"}`,
              alignItems: "center",
              marginLeft: -8, marginRight: -8, paddingLeft: 8, paddingRight: 8,
            }}
          >
            {/* Set number */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: isDone ? "rgba(48,209,88,0.15)" : isActive ? IS.accentMuted : IS.surface3,
              border: `1px solid ${isDone ? "rgba(48,209,88,0.4)" : isActive ? IS.accent : IS.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
              color: isDone ? IS.green : isActive ? IS.accent : IS.textSecondary,
            }}>
              {isDone ? <Check size={13} /> : set.setNumber}
            </div>

            {/* Weight stepper */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              {isDone ? (
                <span style={{ fontFamily: IS.fontMono, fontSize: 16, color: IS.textSecondary }}>
                  {set.weight}
                </span>
              ) : (
                <Stepper value={set.weight} onChange={v => onWeightChange(i, v)} step={2.5} />
              )}
            </div>

            {/* Reps stepper */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              {isDone ? (
                <span style={{ fontFamily: IS.fontMono, fontSize: 16, color: IS.textSecondary }}>
                  {set.reps}
                </span>
              ) : (
                <Stepper value={set.reps} onChange={v => onRepsChange(i, v)} step={1} />
              )}
            </div>

            {/* Complete button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => !isDone && isActive && onCompleteSet(i)}
              disabled={isDone || !isActive}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isDone
                  ? "rgba(48,209,88,0.2)"
                  : isActive
                  ? IS.accent
                  : IS.surface2,
                border: `1px solid ${isDone ? "rgba(48,209,88,0.4)" : isActive ? IS.accent : IS.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: isDone || !isActive ? "default" : "pointer",
                opacity: !isActive && !isDone ? 0.3 : 1,
              }}
            >
              <Check size={14} color={isDone ? IS.green : isActive ? "#fff" : IS.textDim} />
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
