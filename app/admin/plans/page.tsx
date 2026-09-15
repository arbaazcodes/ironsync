"use client";

import React, { useState } from "react";
import { GYM_PLAN_TEMPLATES } from "@/lib/data/gymPlans";
import { Dumbbell, Flame, Zap, Shield, CheckCircle2, ChevronRight, Clock, Target } from "lucide-react";

export default function AdminPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(GYM_PLAN_TEMPLATES[0]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider">
          <Dumbbell className="w-3.5 h-3.5" />
          Master Blueprint Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-primary mt-1">
          Training Plans Catalog
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted">
          Standardized periodization splits and nutritional protocols available for member assignment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Template Cards */}
        <div className="space-y-3">
          {GYM_PLAN_TEMPLATES.map((tpl) => {
            const isSelected = selectedPlan.id === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedPlan(tpl)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? "bg-card border-accent shadow-xl shadow-accent/10 ring-1 ring-accent"
                    : "bg-card border-border hover:border-accent/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                    {tpl.goal}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated text-primary-muted border border-border">
                    {tpl.trainingDays} Days/Wk
                  </span>
                </div>
                <div className="font-extrabold text-sm uppercase text-primary mt-2">
                  {tpl.name}
                </div>
                <div className="text-xs text-primary-muted mt-1 line-clamp-2">
                  {tpl.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Plan Deep-Dive */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="text-xs font-mono text-accent uppercase font-bold">Blueprint Spec</div>
              <h2 className="text-xl font-black uppercase text-primary mt-0.5">
                {selectedPlan.name}
              </h2>
              <p className="text-xs text-primary-muted mt-1">{selectedPlan.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-center font-mono">
                <div className="text-[10px] text-primary-dim uppercase">Daily Fuel</div>
                <div className="text-sm font-bold text-primary">{selectedPlan.blueprint.macros.calories} kcal</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-center font-mono">
                <div className="text-[10px] text-primary-dim uppercase">Protein Target</div>
                <div className="text-sm font-bold text-accent">{selectedPlan.blueprint.macros.protein}g</div>
              </div>
            </div>
          </div>

          {/* Schedule Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-primary-muted font-bold">
              Training Schedule Split
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedPlan.blueprint.schedule.map((day, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-primary">{day.dayName}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        day.type === "workout"
                          ? "bg-accent/15 text-accent border border-accent/20"
                          : "bg-surface-elevated text-primary-muted border border-border"
                      }`}
                    >
                      {day.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-primary font-medium">{day.focus}</div>
                  {day.exercises && day.exercises.length > 0 && (
                    <div className="text-[10px] text-primary-dim font-mono">
                      {day.exercises.length} exercises &bull; {day.exercises.map((e) => e.name).slice(0, 2).join(", ")}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Protocol */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Recovery & Periodization Strategy
            </div>
            <div className="text-xs text-primary-muted leading-relaxed font-mono">
              Sleep: {selectedPlan.blueprint.recoveryProtocol.sleepTarget} &bull; Hydration: {selectedPlan.blueprint.recoveryProtocol.hydrationTarget} &bull; Mobility: {selectedPlan.blueprint.recoveryProtocol.mobilityWindow}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
