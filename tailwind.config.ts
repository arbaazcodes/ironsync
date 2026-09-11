import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F8FAFC",
          subtle: "#F1F5F9",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          elevated: "#FFFFFF",
          hover: "#F8FAFC",
        },
        border: {
          DEFAULT: "#E2E8F0",
          subtle: "#EDF2F7",
          hover: "#CBD5E1",
          active: "#94A3B8",
        },
        primary: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          dim: "#64748B",
        },
        accent: {
          DEFAULT: "#059669",
          hover: "#047857",
          muted: "rgba(5, 150, 105, 0.10)",
          glow: "rgba(5, 150, 105, 0.20)",
        },
        status: {
          success: "#10B981",
          warning: "#D97706",
          error: "#DC2626",
        },
      },

      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(226, 232, 240, 0.8)",
        "card-hover": "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(5, 150, 105, 0.3)",
        "accent-glow": "0 0 24px -4px rgba(5, 150, 105, 0.25)",
        "accent-glow-lg": "0 0 40px -6px rgba(5, 150, 105, 0.35)",
      },

      maxWidth: {
        "screen-custom": "1280px",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
