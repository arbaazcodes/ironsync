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
          DEFAULT: "#050505",
          subtle: "#101010",
        },
        surface: {
          DEFAULT: "#161616",
          elevated: "#1C1C1C",
          hover: "#222222",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.04)",
          hover: "rgba(255, 255, 255, 0.16)",
          active: "#FF1E1E",
        },
        primary: {
          DEFAULT: "#FFFFFF",
          muted: "#B8B8B8",
          dim: "#7A7A7A",
        },
        accent: {
          DEFAULT: "#FF1E1E",
          hover: "#FF3B30",
          muted: "rgba(255, 30, 30, 0.12)",
          glow: "rgba(255, 30, 30, 0.28)",
        },
        status: {
          success: "#30D158",
          warning: "#FF9F0A",
          error: "#FF453A",
        },
        divider: "rgba(255, 255, 255, 0.06)",
      },
      borderRadius: {
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 8px 32px 0 rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "card-hover": "0 14px 44px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 30, 30, 0.35), 0 0 24px -4px rgba(255, 30, 30, 0.25)",
        "accent-glow": "0 0 24px -4px rgba(255, 30, 30, 0.4)",
        "accent-glow-lg": "0 0 48px -6px rgba(255, 30, 30, 0.55)",
      },
      maxWidth: {
        "screen-custom": "1280px",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
