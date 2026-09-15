"use client";

import React from "react";
import { DayAttendanceSummary, AttendanceStatus } from "@/lib/types/attendance";
import { Check, X, Minus, Coffee, Circle } from "lucide-react";

interface AttendanceDotsProps {
  summary: DayAttendanceSummary[];
  compact?: boolean;
  showLabels?: boolean;
}

export function AttendanceDots({
  summary,
  compact = false,
  showLabels = true,
}: AttendanceDotsProps) {
  if (!summary || summary.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary-dim">
        No attendance records
      </div>
    );
  }

  const getStatusConfig = (status: DayAttendanceSummary["status"]) => {
    switch (status) {
      case "present":
        return {
          bg: "bg-emerald-500",
          border: "border-emerald-400",
          glow: "shadow-[0_0_8px_rgba(16,185,129,0.35)]",
          text: "text-emerald-600 dark:text-emerald-400",
          label: "Present",
          icon: Check,
        };
      case "missed":
        return {
          bg: "bg-rose-500",
          border: "border-rose-400",
          glow: "shadow-[0_0_8px_rgba(244,63,94,0.3)]",
          text: "text-rose-600 dark:text-rose-400",
          label: "Missed",
          icon: X,
        };
      case "skipped":
        return {
          bg: "bg-amber-500",
          border: "border-amber-400",
          glow: "shadow-[0_0_8px_rgba(245,158,11,0.3)]",
          text: "text-amber-600 dark:text-amber-400",
          label: "Skipped",
          icon: Minus,
        };
      case "rest":
        return {
          bg: "bg-sky-500/25 dark:bg-sky-500/30",
          border: "border-sky-400/50",
          glow: "",
          text: "text-sky-600 dark:text-sky-300",
          label: "Rest Day",
          icon: Coffee,
        };
      case "unmarked":
      default:
        return {
          bg: "bg-neutral-200 dark:bg-white/[0.1]",
          border: "border-neutral-300 dark:border-white/[0.12]",
          glow: "",
          text: "text-primary-dim",
          label: "Not Marked",
          icon: Circle,
        };
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5" title="Last 7 Days Attendance">
        {summary.map((item, idx) => {
          const config = getStatusConfig(item.status);
          return (
            <div
              key={idx}
              className="relative group/dot cursor-default"
              title={`${item.dayOfWeek} (${item.date}): ${config.label}`}
            >
              <div
                className={`w-3 h-3 rounded-full ${config.bg} ${config.glow} transition-transform hover:scale-125 ${
                  item.isToday ? "ring-2 ring-accent ring-offset-1 ring-offset-background" : ""
                }`}
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/dot:flex flex-col items-center z-30 pointer-events-none">
                <div className="px-2 py-0.5 rounded bg-primary text-background text-[9px] font-mono whitespace-nowrap shadow-md">
                  {item.dayOfWeek}: {config.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {summary.map((item, idx) => {
          const config = getStatusConfig(item.status);
          const Icon = config.icon;

          return (
            <div
              key={idx}
              className={`flex-1 flex flex-col items-center p-2 sm:p-2.5 rounded-xl transition-all border ${
                item.isToday
                  ? "bg-accent/10 border-accent/40 shadow-sm"
                  : "bg-surface-elevated/70 border-border"
              }`}
              title={`${item.formattedDate}: ${config.label}`}
            >
              <span
                className={`text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider ${
                  item.isToday ? "text-accent" : "text-primary-dim"
                }`}
              >
                {item.dayOfWeek}
              </span>

              <div className="my-1.5 flex items-center justify-center">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${config.bg} ${config.glow} ${
                    item.isToday ? "ring-2 ring-accent ring-offset-1 ring-offset-background" : ""
                  }`}
                >
                  <Icon className="w-3 h-3 text-white" />
                </div>
              </div>

              {showLabels && (
                <span
                  className={`text-[8px] sm:text-[9px] font-mono truncate max-w-full font-semibold ${config.text}`}
                >
                  {item.isToday && item.status === "unmarked" ? "Today" : config.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
