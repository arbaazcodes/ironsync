"use client";

import React, { useState } from "react";
import { CheckInRecord } from "@/lib/data/checkInService";
import { TrendingUp, Target, Calendar, Info } from "lucide-react";

interface WeightTrendChartProps {
  checkIns: CheckInRecord[];
  targetWeightKg?: number | null;
  startingWeightKg?: number | null;
}

export function WeightTrendChart({
  checkIns,
  targetWeightKg,
  startingWeightKg,
}: WeightTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Requirement: If fewer than 2 check-ins exist, show "Add another check-in to see your trend." (no fake chart)
  if (!checkIns || checkIns.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-surface/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-accent mb-4 shadow-sm">
          <TrendingUp className="w-6 h-6 text-accent/80" />
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-primary font-mono mb-1.5">
          Weight Trend Trajectory
        </h4>
        <p className="text-base font-semibold text-accent mb-2">
          Add another check-in to see your trend.
        </p>
        <p className="text-xs text-primary-dim max-w-md leading-relaxed">
          Tracking your body weight across multiple days removes daily water and glycogen fluctuations, giving an accurate physiological trendline.
        </p>
      </div>
    );
  }

  // Sort check-ins chronologically
  const sorted = [...checkIns].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Min / Max calculation with padding
  const weights = sorted.map((c) => c.weightKg);
  if (typeof targetWeightKg === "number") weights.push(targetWeightKg);
  if (typeof startingWeightKg === "number") weights.push(startingWeightKg);

  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);
  const padding = Math.max(1.0, (rawMax - rawMin) * 0.15);
  const minWeight = Math.floor(rawMin - padding);
  const maxWeight = Math.ceil(rawMax + padding);
  const weightRange = maxWeight - minWeight || 1;

  // SVG dimensions
  const width = 640;
  const height = 240;
  const padLeft = 50;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  // Point projection
  const points = sorted.map((c, i) => {
    const x = padLeft + (i / (sorted.length - 1)) * plotWidth;
    const y = padTop + ((maxWeight - c.weightKg) / weightRange) * plotHeight;
    return { x, y, checkIn: c, index: i };
  });

  // Polyline string
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Closed area polygon for subtle gradient fill
  const firstP = points[0];
  const lastP = points[points.length - 1];
  const areaPath = `${linePath} L ${lastP.x} ${height - padBottom} L ${firstP.x} ${height - padBottom} Z`;

  // Target weight Y coordinate
  const targetY =
    typeof targetWeightKg === "number"
      ? padTop + ((maxWeight - targetWeightKg) / weightRange) * plotHeight
      : null;

  // Y-axis grid ticks (4 ticks)
  const ticks = [
    maxWeight,
    Math.round((maxWeight * 2 + minWeight) / 3),
    Math.round((maxWeight + minWeight * 2) / 3),
    minWeight,
  ];

  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="rounded-2xl border border-border/80 bg-surface/50 p-5 sm:p-6 backdrop-blur-sm relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-3 border-b border-border/60 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Weight Trajectory
            </h3>
            <p className="text-[11px] text-primary-dim">
              {sorted.length} recorded check-ins
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-accent rounded" />
            <span className="text-primary-muted">Weight Trend</span>
          </div>
          {typeof targetWeightKg === "number" && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-emerald-400" />
              <span className="text-emerald-400">Target ({targetWeightKg} kg)</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px]"
          aria-label="Weight progress line chart"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {ticks.map((t, idx) => {
            const y = padTop + ((maxWeight - t) / weightRange) * plotHeight;
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/50"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-primary-dim"
                >
                  {t}kg
                </text>
              </g>
            );
          })}

          {/* Target Weight Line */}
          {targetY !== null && targetY >= padTop && targetY <= height - padBottom && (
            <g>
              <line
                x1={padLeft}
                y1={targetY}
                x2={width - padRight}
                y2={targetY}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                opacity="0.75"
              />
              <text
                x={width - padRight}
                y={targetY - 5}
                textAnchor="end"
                className="text-[9px] font-mono fill-emerald-400 font-semibold"
              >
                Target {targetWeightKg}kg
              </text>
            </g>
          )}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#trendGradient)" />

          {/* Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIdx === idx;
            const isFirst = idx === 0;
            const isLast = idx === points.length - 1;

            return (
              <g
                key={p.checkIn.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-transform"
              >
                {/* Hit area */}
                <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

                {/* Outer halo on hover */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill="#00E5FF"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                )}

                {/* Point dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered || isLast ? "5" : "3.5"}
                  fill={isLast ? "#00E5FF" : isHovered ? "#fff" : "#0f172a"}
                  stroke="#00E5FF"
                  strokeWidth="2"
                />

                {/* X Axis Date Label */}
                {(isFirst || isLast || sorted.length <= 6 || idx % 2 === 0) && (
                  <text
                    x={p.x}
                    y={height - 12}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-primary-dim"
                  >
                    {new Date(p.checkIn.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 pointer-events-none bg-surface-elevated/95 border border-accent/40 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md text-xs font-mono z-10 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-primary-dim">
                {new Date(hoveredPoint.checkIn.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="font-extrabold text-accent text-sm">
                {hoveredPoint.checkIn.weightKg} kg
              </span>
            </div>
            {hoveredPoint.checkIn.notes && (
              <p className="text-[11px] text-primary-muted font-sans mt-1 line-clamp-1 italic">
                &ldquo;{hoveredPoint.checkIn.notes}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
