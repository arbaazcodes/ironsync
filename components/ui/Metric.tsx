import React from "react";
import { cn } from "@/lib/utils";

export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  unit?: string;
  sublabel?: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    label: string;
  };
  size?: "sm" | "md" | "lg";
}

export function Metric({
  value,
  label,
  unit,
  sublabel,
  trend,
  size = "md",
  className,
  ...props
}: MetricProps) {
  const valueSizes = {
    sm: "text-2xl font-bold tracking-tight",
    md: "text-3xl sm:text-4xl font-bold tracking-tight",
    lg: "text-4xl sm:text-5xl font-extrabold tracking-tight",
  };

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-primary-dim uppercase font-mono">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5 font-sans">
        <span className={cn(valueSizes[size], "text-primary tabular-nums")}>
          {value}
        </span>
        {unit && (
          <span className="text-sm sm:text-base font-medium text-primary-muted">
            {unit}
          </span>
        )}
      </div>
      {sublabel && (
        <span className="text-xs text-primary-muted mt-0.5">{sublabel}</span>
      )}
      {trend && (
        <div className="flex items-center gap-1 text-xs mt-1 text-accent">
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
