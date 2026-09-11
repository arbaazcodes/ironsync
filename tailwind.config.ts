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
          DEFAULT: "#090A0D",
          subtle: "#0D0F14",
        },
        surface: {
          DEFAULT: "#12141A",
          elevated: "#161922",
          hover: "#1D212D",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.05)",
          hover: "rgba(255, 255, 255, 0.16)",
          active: "rgba(255, 255, 255, 0.24)",
        },
        primary: {
          DEFAULT: "#F4F5F7",
          muted: "#9CA3AF",
          dim: "#6B7280",
        },
        accent: {
          DEFAULT: "#00E599",
          hover: "#00CC88",
          muted: "rgba(0, 229, 153, 0.12)",
          glow: "rgba(0, 229, 153, 0.25)",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
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
        "card": "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "card-hover": "0 8px 30px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12)",
        "accent-glow": "0 0 24px -4px rgba(0, 229, 153, 0.3)",
        "accent-glow-lg": "0 0 40px -6px rgba(0, 229, 153, 0.4)",
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
