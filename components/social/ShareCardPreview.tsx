"use client";

import React from "react";
import { SavedPlanData } from "@/lib/supabase/planSync";

interface ShareCardPreviewProps {
  plan: SavedPlanData;
  userName?: string;
  className?: string;
}

export const ShareCardPreview: React.FC<ShareCardPreviewProps> = ({
  plan,
  userName,
  className = "",
}) => {
  const formattedGoal = (plan.goal || "Muscle Gain").replace(/_/g, " ").toUpperCase();
  const athlete = (userName || plan.displayName || "Athlete").toUpperCase();
  const dietBadge = plan.dietType ? `${plan.dietType.toUpperCase()} FUEL` : "BALANCED NUTRITION";
  const caloriesStr = Number(plan.calories || 2400).toLocaleString();
  const trainingDays = plan.trainingDays || 5;
  const schedule = plan.schedule || [];

  return (
    <div
      className={`relative w-full max-w-[360px] mx-auto aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 bg-[#080A0E] text-white shadow-2xl flex flex-col justify-between p-6 sm:p-7 select-none ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.16) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.10) 0%, transparent 45%)",
      }}
    >
      {/* 1. Brand Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center tracking-wider">
          <span className="font-black text-xl text-white">IRON</span>
          <span className="font-black text-xl text-emerald-400">SYNC</span>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
          My Blueprint
        </span>
      </div>

      {/* 2. Goal & Athlete Information */}
      <div className="space-y-1.5 my-2">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-gray-400">
          <span>CALIBRATED SPEC</span>
          <span className="text-gray-600">&bull;</span>
          <span className="text-emerald-400 font-bold">v{plan.version}.0</span>
        </div>

        <h3
          className={`font-black tracking-tight text-white leading-tight uppercase ${
            formattedGoal.length > 20
              ? "text-xl sm:text-2xl"
              : formattedGoal.length > 14
              ? "text-2xl sm:text-3xl"
              : "text-3xl sm:text-4xl"
          }`}
        >
          {formattedGoal}
        </h3>

        <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-0.5">
          <span className="font-mono text-gray-500">ATHLETE:</span>
          <span className="font-bold text-gray-200 tracking-wider truncate max-w-[120px]">
            {athlete}
          </span>
          <span className="text-gray-600">&bull;</span>
          <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-gray-300">
            {dietBadge}
          </span>
        </div>
      </div>

      {/* 3. Hero Metrics: Calories & Protein */}
      <div className="grid grid-cols-2 gap-3 my-1">
        {/* Calories Card */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold">
            Daily Energy
          </span>
          <div className="my-1">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
              {caloriesStr}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">
            KCAL / DAY
          </span>
        </div>

        {/* Protein Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25 flex flex-col justify-between">
          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Daily Protein
          </span>
          <div className="my-1 flex items-baseline">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight leading-none">
              {plan.protein}
            </span>
            <span className="text-lg font-black text-emerald-400 ml-0.5">G</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-white tracking-wider">
            TARGET PROTEIN
          </span>
        </div>
      </div>

      {/* 4. Training Cadence & Microcycle Matrix */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 text-[10px] font-mono">
          <span className="font-bold text-white tracking-wider">
            {trainingDays} DAY CADENCE
          </span>
          <span className="text-emerald-400 font-bold uppercase truncate max-w-[150px]">
            {plan.splitName || "Split Schedule"}
          </span>
        </div>

        {/* 7-day microcycle pills */}
        <div className="space-y-1">
          {schedule.slice(0, 7).map((day, idx) => {
            const isRest =
              day.type === "recovery" ||
              day.tag?.toLowerCase().includes("rest") ||
              day.focus?.toLowerCase().includes("rest");

            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-2.5 py-1 rounded-lg text-[10px] font-mono ${
                  isRest
                    ? "bg-white/[0.02] border border-white/[0.04] text-gray-400"
                    : "bg-emerald-500/[0.08] border border-emerald-500/20 text-white"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`font-bold w-10 text-[9px] ${
                      isRest ? "text-gray-500" : "text-emerald-400"
                    }`}
                  >
                    {day.dayName.slice(0, 5).toUpperCase()}
                  </span>
                  <span
                    className={`truncate text-[10px] ${
                      isRest ? "text-gray-400" : "font-bold text-white"
                    }`}
                  >
                    {day.focus}
                  </span>
                </div>
                <span
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    isRest
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {day.tag.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Acquisition Footer */}
      <div className="pt-3 border-t border-white/10 text-center space-y-0.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
          Create Your Own Blueprint
        </span>
        <span className="text-sm font-black text-emerald-400 tracking-wider block">
          IRONSYNC.FIT
        </span>
        <span className="text-[8px] text-gray-500 block">
          Deterministic Algorithmic Calibration Architecture
        </span>
      </div>
    </div>
  );
};
