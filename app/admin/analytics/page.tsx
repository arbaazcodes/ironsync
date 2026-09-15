"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, Activity, Target, Dumbbell } from "lucide-react";
import { GymMember } from "@/lib/types/member";

export default function AdminAnalyticsPage() {
  const [members, setMembers] = useState<GymMember[]>([]);

  useEffect(() => {
    fetch("/api/admin/members")
      .then((res) => res.json())
      .then((data) => setMembers(data.members || []))
      .catch((e) => console.error(e));
  }, []);

  const total = members.length;
  const active = members.filter((m) => m.status === "active").length;
  const retention = total > 0 ? Math.round((active / total) * 100) : 100;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider font-bold">
          <BarChart3 className="w-3.5 h-3.5" />
          Performance & Metrics
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-primary mt-1">
          Gym Analytics
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted">
          Real-time metrics on membership growth, engagement, and blueprint completion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
          <div className="text-xs font-mono text-primary-muted uppercase">Roster Retention</div>
          <div className="text-3xl font-black text-primary font-mono">{retention}%</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Active status ratio</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
          <div className="text-xs font-mono text-primary-muted uppercase">Enrolled Members</div>
          <div className="text-3xl font-black text-accent font-mono">{total}</div>
          <div className="text-[11px] text-primary-dim font-mono">Managed gym profiles</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
          <div className="text-xs font-mono text-primary-muted uppercase">Active Programs</div>
          <div className="text-3xl font-black text-sky-600 dark:text-sky-400 font-mono">4</div>
          <div className="text-[11px] text-primary-dim font-mono">Standardized splits</div>
        </div>
      </div>

      {/* Roster Demographics Breakdown */}
      <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
          Goal Distribution
        </h3>
        <div className="space-y-3">
          {["hypertrophy", "fat_loss", "strength", "recomp"].map((goal) => {
            const count = members.filter((m) => m.fitnessGoal === goal).length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={goal} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-primary font-bold uppercase">{goal.replace("_", " ")}</span>
                  <span className="text-primary-muted">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-accent transition-all duration-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
