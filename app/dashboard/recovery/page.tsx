"use client";

import React from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Metric } from "@/components/ui/Metric";
import { Moon, Droplets, Calendar, Activity, CheckCircle2, ShieldCheck, Info } from "lucide-react";

export default function DashboardRecoveryPage() {
  const { activePlan } = useAuth();

  if (!activePlan) return null;

  // Extract scheduled rest/recovery days from user's actual generated schedule
  const restDays = activePlan.schedule
    .filter((d) => d.type === "recovery")
    .map((d) => d.dayName);

  const restDaysStr = restDays.length > 0 ? restDays.join(", ") : "Deload as needed";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="space-y-1.5 pb-5 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm">
            RECOVERY ENGINE
          </Badge>
          <span className="text-xs font-mono text-primary-dim">
            Systemic Central Nervous System Adaptation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Recovery & Readiness Engine
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted max-w-2xl">
          Resistance training creates the stimulus for adaptation; actual muscle remodeling and supercompensation occur exclusively during restorative sleep and cellular hydration.
        </p>
      </div>

      {/* 2. Educational Disclaimer */}
      <div className="p-4 rounded-xl bg-surface border border-border flex items-start gap-3 text-xs text-primary-muted">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-primary font-mono text-[11px] uppercase tracking-wider block mb-0.5">
            General Targets Based on Generated Plan
          </strong>
          These recommendations represent general evidence-based targets calibrated to your weekly training volume and body metrics. They are educational guidelines and not individualized medical prescriptions.
        </p>
      </div>

      {/* 3. Core Metric Targets Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="elevated" padding="md" className="space-y-3 border-border/80">
          <div className="flex items-center justify-between text-xs font-mono text-primary-dim">
            <span>SLEEP DURATION</span>
            <Moon className="w-4 h-4 text-accent" />
          </div>
          <Metric
            value={activePlan.recoveryProtocol?.sleepTarget || "7–9 hours"}
            label="TARGET SLEEP"
            size="md"
            sublabel="7-9 hours optimal circadian rest"
          />
        </Card>

        <Card variant="elevated" padding="md" className="space-y-3 border-border/80">
          <div className="flex items-center justify-between text-xs font-mono text-primary-dim">
            <span>DAILY FLUID</span>
            <Droplets className="w-4 h-4 text-accent" />
          </div>
          <Metric
            value={activePlan.recoveryProtocol?.hydrationTarget || "3.0 L"}
            label="DAILY HYDRATION"
            size="md"
            sublabel="+500ml on training sessions"
          />
        </Card>

        <Card variant="elevated" padding="md" className="space-y-3 border-border/80">
          <div className="flex items-center justify-between text-xs font-mono text-primary-dim">
            <span>SCHEDULED RESET</span>
            <Calendar className="w-4 h-4 text-accent" />
          </div>
          <Metric
            value={restDaysStr}
            label="REST DAYS"
            size="md"
            sublabel={`${7 - activePlan.trainingDays} days / week recovery`}
          />
        </Card>
      </div>

      {/* 4. Structured Recovery Protocols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sleep Architecture */}
        <Card variant="elevated" padding="md" className="space-y-4 border-border/80">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Moon className="w-4 h-4 text-accent" />
            <h2 className="text-base font-bold text-primary">Sleep Hygiene & Circadian Habits</h2>
          </div>

          <ul className="space-y-3 text-xs text-primary-muted leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary block font-medium">Consistent Sleep/Wake Timings</strong>
                Maintain a regular sleep schedule within &plusmn;30 minutes across both training and rest days to reinforce melatonin secretion.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary block font-medium">Dark, Cool Sleeping Environment</strong>
                Keep ambient room temperature at 18–20&deg;C (65–68&deg;F) with total blackout curtains to promote deep slow-wave sleep.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary block font-medium">Stimulant & Screen Curfew</strong>
                Cease caffeine intake 8–10 hours before your target sleep window; dim bright screens 60 minutes before bed.
              </div>
            </li>
          </ul>
        </Card>

        {/* Active Recovery & Hydration */}
        <Card variant="elevated" padding="md" className="space-y-4 border-border/80">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Activity className="w-4 h-4 text-accent" />
            <h2 className="text-base font-bold text-primary">Active Reset & Hydration Routine</h2>
          </div>

          <ul className="space-y-3 text-xs text-primary-muted leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary block font-medium">Zone 2 Low-Intensity Movement</strong>
                Spend 20–30 minutes walking (6,000–8,000 steps) on scheduled rest days to flush metabolic waste without central fatigue.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary block font-medium">15-Minute Daily Mobility Routine</strong>
                Perform targeted hip flexor, thoracic spine, and ankle mobility to preserve joint mechanics and injury resilience.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary block font-medium">Morning Hydration & Mineral Baseline</strong>
                Begin your day with 500ml water and a small pinch of natural sea salt or electrolytes to rehydrate after overnight water loss.
              </div>
            </li>
          </ul>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 rounded-xl bg-surface/60 border border-border/70 flex items-center justify-between gap-3 text-xs font-mono text-primary-dim">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Scheduled rest days: {restDaysStr}</span>
        </span>
        <span className="hidden sm:inline">Saved in Active Plan</span>
      </div>
    </div>
  );
}
