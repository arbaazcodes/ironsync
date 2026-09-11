"use client";

import React from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { LogOut, User as UserIcon } from "lucide-react";

export function DashboardHeader() {
  const { user, activePlan, signOut } = useAuth();

  // Get appropriate greeting based on client time
  const currentHour = new Date().getHours();
  let timeGreeting = "Good evening";
  if (currentHour < 12) timeGreeting = "Good morning";
  else if (currentHour < 17) timeGreeting = "Good afternoon";

  const rawName =
    user?.user_metadata?.full_name ||
    activePlan?.displayName ||
    user?.email?.split("@")[0];

  const displayName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Your Blueprint";

  // Dynamic creation date
  const planDate = activePlan?.createdAt
    ? new Date(activePlan.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <Badge variant="accent" size="sm" dot>
            ACTIVE PLAN &bull; v{activePlan?.version || 1}
          </Badge>
          {activePlan?.goal && (
            <span className="px-2 py-0.5 rounded bg-surface-elevated border border-accent/30 text-accent font-mono text-[11px] font-bold uppercase tracking-wider">
              {activePlan.goal.replace("_", " ")}
            </span>
          )}
          <span className="text-xs font-mono text-primary-dim hidden sm:inline">
            Created {planDate}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          {timeGreeting}, {displayName}
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted font-medium">
          Your Fitness Blueprint
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-primary-muted">
          <UserIcon className="w-3.5 h-3.5 text-accent" />
          <span className="max-w-[140px] truncate text-primary font-semibold">
            {user?.email || activePlan?.displayName || "Member"}
          </span>
        </div>

        <button
          onClick={() => signOut()}
          className="p-2 rounded-xl bg-surface border border-border text-primary-dim hover:text-red-400 hover:border-red-500/30 transition-colors"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
