"use client";

import React from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-accent/40 text-primary transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 ${className}`}
      aria-label={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
      title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-accent rotate-0 transition-transform duration-300" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
