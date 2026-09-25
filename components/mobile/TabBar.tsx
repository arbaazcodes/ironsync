"use client";

import React from "react";
import { motion } from "framer-motion";
import { IS } from "@/components/mobile/tokens";

export type TabId = "dashboard" | "library" | "ai" | "analytics" | "profile";

interface TabBarProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Plan", icon: "space_dashboard" },
  { id: "library", label: "Exercises", icon: "fitness_center" },
  { id: "ai", label: "Muscle Sync", icon: "vital_signs" },
  { id: "analytics", label: "History", icon: "history" },
  { id: "profile", label: "Profile", icon: "person" },
];

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(19, 19, 23, 0.90)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 -2px 16px rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        height: "calc(64px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {TABS.map(({ id, label, icon }) => {
        const isActive = activeTab === id;
        return (
          <motion.button
            key={id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              height: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              position: "relative",
              color: isActive ? "#FF3D41" : "#8E8E93",
              transition: "color 0.2s ease",
            }}
          >
            {/* Active Pill Glow Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                style={{
                  position: "absolute",
                  top: 0,
                  width: 28,
                  height: 3,
                  borderRadius: "0 0 3px 3px",
                  background: "#FF3D41",
                  boxShadow: "0 0 10px rgba(255, 61, 65, 0.7)",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}

            {/* Icon */}
            <motion.span
              className="material-symbols-outlined select-none"
              style={{
                fontSize: 22,
                fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
                filter: isActive ? "drop-shadow(0 0 8px rgba(255, 61, 65, 0.5))" : "none",
                transition: "filter 0.2s ease, font-variation-settings 0.2s ease",
              }}
              animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {icon}
            </motion.span>

            {/* Monospaced Technical Label */}
            <span
              style={{
                fontFamily: IS.fontMono,
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight: "12px",
              }}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
