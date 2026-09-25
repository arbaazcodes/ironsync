/**
 * IronSync Mobile Design Tokens
 * Single source of truth for the mobile dark-theme design system.
 * These match the Figma variables exactly and are used for
 * Framer Motion inline styles (which can't read CSS vars).
 */

export const IS = {
  // ── Backgrounds ───────────────────────────────────────────
  bg: "#0A0A0C",
  surface1: "#16161A",
  surface2: "#18181D",
  surface3: "#202026",
  surfaceLowest: "#0E0E12",

  // ── Accents ───────────────────────────────────────────────
  accent: "#FF3D41",         // Neon Crimson — CTAs, active states
  accentHover: "#FF5558",
  accentMuted: "rgba(255,61,65,0.12)",
  accentGlow: "rgba(255,61,65,0.30)",
  accentGlowLg: "rgba(255,61,65,0.50)",

  amber: "#FFC72C",          // Kinetic Amber — timers, streaks, warnings
  amberMuted: "rgba(255,199,44,0.12)",
  amberGlow: "rgba(255,199,44,0.30)",

  cyan: "#00E5FF",           // Telemetry Cyan — AI, velocity, sensors
  cyanMuted: "rgba(0,229,255,0.12)",
  cyanGlow: "rgba(0,229,255,0.30)",

  green: "#30D158",          // Success / recovery
  greenMuted: "rgba(48,209,88,0.12)",

  // ── Text ──────────────────────────────────────────────────
  textPrimary: "#F5F5F7",
  textSecondary: "#8E8E93",
  textDim: "#48484A",
  textInverse: "#0A0A0C",

  // ── Borders ───────────────────────────────────────────────
  border: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.04)",
  borderActive: "rgba(255,61,65,0.45)",
  borderAmber: "rgba(255,199,44,0.45)",
  borderCyan: "rgba(0,229,255,0.45)",

  // ── Radius ────────────────────────────────────────────────
  radiusSm: "8px",
  radiusMd: "12px",
  radiusLg: "16px",
  radiusXl: "20px",
  radiusPill: "9999px",

  // ── Spacing ───────────────────────────────────────────────
  spacingXs: "4px",
  spacingSm: "8px",
  spacingMd: "12px",
  spacingLg: "16px",
  spacingXl: "20px",
  spacing2xl: "24px",

  // ── Shadows ───────────────────────────────────────────────
  shadowCard: "0 4px 24px -2px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
  shadowAccent: "0 0 32px -4px rgba(255,61,65,0.45)",
  shadowAmber: "0 0 32px -4px rgba(255,199,44,0.35)",
  shadowCyan: "0 0 32px -4px rgba(0,229,255,0.35)",

  // ── Typography ────────────────────────────────────────────
  fontDisplay: '"Inter", -apple-system, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, monospace',

  // ── Animation ─────────────────────────────────────────────
  springSnap: { type: "spring", stiffness: 400, damping: 30 } as const,
  springBounce: { type: "spring", stiffness: 300, damping: 20 } as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
} as const;

/** Muscle group metadata */
export const MUSCLE_GROUPS = [
  { id: "chest",     label: "Chest",     emoji: "💪", color: IS.accent },
  { id: "back",      label: "Back",      emoji: "🔙", color: "#3D8EFF" },
  { id: "legs",      label: "Legs",      emoji: "🦵", color: "#30D158" },
  { id: "shoulders", label: "Shoulders", emoji: "🔷", color: IS.amber },
  { id: "arms",      label: "Arms",      emoji: "💪", color: "#BF5AF2" },
  { id: "core",      label: "Core",      emoji: "🔥", color: "#FF9F0A" },
  { id: "glutes",    label: "Glutes",    emoji: "🍑", color: "#30D158" },
  { id: "calves",    label: "Calves",    emoji: "🦶", color: "#64D2FF" },
] as const;

export type MuscleGroupId = typeof MUSCLE_GROUPS[number]["id"];

/** Exercise equipment types */
export const EQUIPMENT_TYPES = [
  "Barbell", "Dumbbell", "Cables", "Bodyweight", "Machine", "Kettlebell", "Bands",
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];

/** Split categories for routine builder */
export const SPLIT_CATEGORIES = [
  "Push", "Pull", "Legs", "Upper", "Lower", "Full Body",
] as const;

export type SplitCategory = typeof SPLIT_CATEGORIES[number];
