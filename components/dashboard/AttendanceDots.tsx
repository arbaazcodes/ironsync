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
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30">
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
          glow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
          text: "text-emerald-400",
          label: "Present",
          icon: Check,
        };
      case "missed":
        return {
          bg: "bg-rose-500",
          border: "border-rose-400",
          glow: "shadow-[0_0_8px_rgba(244,63,94,0.3)]",
          text: "text-rose-400",
          label: "Missed",
          icon: X,
        };
      case "skipped":
        return {
          bg: "bg-amber-500",
          border: "border-amber-400",
          glow: "shadow-[0_0_8px_rgba(245,158,11,0.3)]",
          text: "text-amber-400",
          label: "Skipped",
          icon: Minus,
        };
      case "rest":
        return {
          bg: "bg-sky-500/30",
          border: "border-sky-400/40",
          glow: "",
          text: "text-sky-300",
          label: "Rest Day",
          icon: Coffee,
        };
      case "unmarked":
      default:
        return {
          bg: "bg-white/[0.08]",
          border: "border-white/[0.12]",
          glow: "",
          text: "text-white/40",
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
          const Icon = config.icon;
          return (
            <div
              key={idx}
              className="relative group/dot cursor-default"
              title={`${item.dayOfWeek} (${item.date}): ${config.label}`}
            >
              <div
                className={`w-3 h-3 rounded-full ${config.bg} ${config.glow} transition-transform hover:scale-125 ${
                  item.isToday ? "ring-2 ring-white/60 ring-offset-1 ring-offset-black" : ""
                }`}
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/dot:flex flex-col items-center z-30 pointer-events-none">
                <div className="px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[9px] font-mono text-white whitespace-nowrap shadow-lg">
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
              className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-all border ${
                item.isToday
                  ? "bg-white/[0.06] border-[#FF1E1E]/40 shadow-sm"
                  : "bg-black/30 border-white/[0.05]"
              }`}
              title={`${item.formattedDate}: ${config.label}`}
            >
              <span
                className={`text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider ${
                  item.isToday ? "text-[#FF1E1E]" : "text-white/40"
                }`}
              >
                {item.dayOfWeek}
              </span>

              <div className="my-1.5 flex items-center justify-center">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${config.bg} ${config.glow} ${
                    item.isToday ? "ring-2 ring-[#FF1E1E] ring-offset-1 ring-offset-black" : ""
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
