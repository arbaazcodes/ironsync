"use client";

import React, { useMemo } from "react";
import { IS } from '@/components/mobile/tokens';

interface DataPoint {
  label: string;  // e.g. "Mon", "Jan"
  value: number;
}

interface TrendGraphProps {
  primary: DataPoint[];
  secondary?: DataPoint[];
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
  showDots?: boolean;
}

function normalize(points: DataPoint[]) {
  const values = points.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return { values, min, max, range };
}

export function TrendGraph({
  primary,
  secondary,
  primaryLabel = "Primary",
  secondaryLabel = "Secondary",
  primaryColor = IS.accent,
  secondaryColor = IS.amber,
  height = 140,
  showDots = true,
}: TrendGraphProps) {
  const WIDTH = 320;
  const PAD_LEFT = 32;
  const PAD_RIGHT = 12;
  const PAD_TOP = 12;
  const PAD_BOT = 32;
  const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerH = height - PAD_TOP - PAD_BOT;

  const pNorm = useMemo(() => normalize(primary), [primary]);
  const sNorm = useMemo(() => secondary ? normalize(secondary) : null, [secondary]);

  const toX = (i: number, len: number) =>
    PAD_LEFT + (i / (len - 1)) * innerW;

  const toY = (value: number, min: number, range: number) =>
    PAD_TOP + innerH - ((value - min) / range) * innerH;

  const makePath = (points: DataPoint[], min: number, range: number) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i, points.length).toFixed(1)} ${toY(p.value, min, range).toFixed(1)}`)
      .join(" ");

  const makeArea = (points: DataPoint[], min: number, range: number) => {
    const line = makePath(points, min, range);
    const lastX = toX(points.length - 1, points.length);
    const firstX = toX(0, points.length);
    return `${line} L ${lastX} ${(PAD_TOP + innerH).toFixed(1)} L ${firstX} ${(PAD_TOP + innerH).toFixed(1)} Z`;
  };

  const primaryPath = makePath(primary, pNorm.min, pNorm.range);
  const primaryArea = makeArea(primary, pNorm.min, pNorm.range);
  const secondaryPath = secondary && sNorm ? makePath(secondary, sNorm.min, sNorm.range) : null;
  const secondaryArea = secondary && sNorm ? makeArea(secondary, sNorm.min, sNorm.range) : null;

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 20, height: 3, borderRadius: 2, background: primaryColor }} />
          <span style={{ fontSize: 11, color: IS.textSecondary, fontWeight: 500 }}>{primaryLabel}</span>
        </div>
        {secondary && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 20, height: 3, borderRadius: 2, background: secondaryColor, opacity: 0.7 }} />
            <span style={{ fontSize: 11, color: IS.textSecondary, fontWeight: 500 }}>{secondaryLabel}</span>
          </div>
        )}
      </div>

      <svg width="100%" viewBox={`0 0 ${WIDTH} ${height}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </linearGradient>
          {secondary && (
            <linearGradient id="secondaryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD_TOP + innerH * (1 - t);
          return (
            <g key={t}>
              <line x1={PAD_LEFT} y1={y} x2={WIDTH - PAD_RIGHT} y2={y}
                stroke={IS.border} strokeWidth="0.5" strokeDasharray="4 4" />
              <text x={PAD_LEFT - 4} y={y + 4} fontSize="9" fill={IS.textDim} textAnchor="end">
                {Math.round(pNorm.min + pNorm.range * t)}
              </text>
            </g>
          );
        })}

        {/* Secondary area + line */}
        {secondary && sNorm && secondaryArea && secondaryPath && (
          <>
            <path d={secondaryArea} fill="url(#secondaryGrad)" />
            <path d={secondaryPath} fill="none" stroke={secondaryColor} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
          </>
        )}

        {/* Primary area + line */}
        <path d={primaryArea} fill="url(#primaryGrad)" />
        <path d={primaryPath} fill="none" stroke={primaryColor} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {showDots && primary.map((p, i) => (
          <circle
            key={i}
            cx={toX(i, primary.length)}
            cy={toY(p.value, pNorm.min, pNorm.range)}
            r={3}
            fill={primaryColor}
            stroke={IS.bg}
            strokeWidth="1.5"
          />
        ))}

        {/* X axis labels */}
        {primary.map((p, i) => (
          <text
            key={i}
            x={toX(i, primary.length)}
            y={height - 6}
            fontSize="9"
            fill={IS.textDim}
            textAnchor="middle"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
