"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IS } from '@/components/mobile/tokens';

interface RestTimerProps {
  /** Initial seconds for the timer */
  initialSeconds?: number;
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function RestTimer({
  initialSeconds = 90,
  visible,
  onComplete,
  onSkip,
}: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [total, setTotal] = useState(initialSeconds);

  useEffect(() => {
    if (!visible) return;
    setSeconds(initialSeconds);
    setTotal(initialSeconds);
  }, [visible, initialSeconds]);

  useEffect(() => {
    if (!visible) return;
    if (seconds <= 0) {
      onComplete();
      return;
    }
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [visible, seconds, onComplete]);

  const progress = total > 0 ? seconds / total : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const label = `${mins}:${secs.toString().padStart(2, "0")}`;

  const addTime = useCallback(() => {
    setSeconds(s => s + 30);
    setTotal(t => t + 30);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,10,12,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Title */}
          <p style={{ color: IS.textSecondary, fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 32 }}>
            Rest Period
          </p>

          {/* SVG Ring */}
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
              {/* Track */}
              <circle cx="80" cy="80" r={RADIUS} fill="none" stroke={IS.surface3} strokeWidth="6" />
              {/* Progress arc */}
              <circle
                cx="80" cy="80" r={RADIUS}
                fill="none"
                stroke={seconds <= 10 ? IS.accent : IS.amber}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.95s linear, stroke 0.3s ease" }}
              />
            </svg>
            {/* Time label */}
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: IS.fontMono,
                fontSize: seconds < 10 ? 42 : 36,
                fontWeight: 700,
                color: seconds <= 10 ? IS.accent : IS.textPrimary,
                lineHeight: 1,
                transition: "color 0.3s ease",
              }}>
                {label}
              </span>
              <span style={{ color: IS.textDim, fontSize: 11, marginTop: 4 }}>remaining</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
            {/* +30s */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={addTime}
              style={{
                background: IS.surface2,
                border: `1px solid ${IS.border}`,
                borderRadius: IS.radiusPill,
                padding: "12px 24px",
                color: IS.amber,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              +30s
            </motion.button>
            {/* Skip */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onSkip}
              style={{
                background: IS.accentMuted,
                border: `1px solid ${IS.borderActive}`,
                borderRadius: IS.radiusPill,
                padding: "12px 32px",
                color: IS.accent,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
            >
              Skip Rest
            </motion.button>
          </div>

          {/* Subtle hint */}
          <p style={{ color: IS.textDim, fontSize: 12, marginTop: 32 }}>
            Tap anywhere to dismiss early
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
