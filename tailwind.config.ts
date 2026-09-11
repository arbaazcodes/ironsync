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
          DEFAULT: "var(--background)",
          subtle: "var(--background-subtle)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          hover: "var(--surface-hover)",
        },
        card: "var(--card-bg)",
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          hover: "var(--border-hover)",
          active: "var(--accent)",
        },
        primary: {
          DEFAULT: "var(--primary-text)",
          muted: "var(--secondary-text)",
          dim: "var(--muted-text)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
          glow: "var(--accent-glow)",
        },
        status: {
          success: "#30D158",
          warning: "#FF9F0A",
          error: "#FF453A",
        },
        divider: "var(--divider)",
      },
      borderRadius: {
        "3xl": "24px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
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
