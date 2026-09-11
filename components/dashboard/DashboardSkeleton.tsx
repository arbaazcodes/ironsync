import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background text-primary p-6 sm:p-10 animate-pulse space-y-8 max-w-7xl mx-auto">
      {/* Top greeting skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-surface-elevated rounded" />
          <div className="h-8 w-64 bg-surface-elevated rounded" />
        </div>
        <div className="h-9 w-32 bg-surface-elevated rounded-xl" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-surface border border-border/50 p-4 space-y-2">
            <div className="h-3 w-20 bg-surface-elevated rounded" />
            <div className="h-8 w-24 bg-surface-elevated rounded" />
          </div>
        ))}
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-72 rounded-2xl bg-surface border border-border/50" />
        <div className="lg:col-span-5 h-72 rounded-2xl bg-surface border border-border/50" />
      </div>
    </div>
  );
}
