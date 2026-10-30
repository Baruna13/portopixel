import type { Config } from "tailwindcss";

// Design tokens ported 1:1 from the Stitch "blue edition" export
// (see stitch_pixel_quest_portfolio/*_blue_edition/code.html inline tailwind.config).
// This is the visual source of truth — do not rebalance these values.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "#020617",
        "surface-dim": "#020617",
        "surface-bright": "#334155",
        "surface-container-lowest": "#020617",
        "surface-container-low": "#0f172a",
        "surface-container": "#0f172a",
        "surface-container-high": "#1e293b",
        "surface-container-highest": "#334155",
        "surface-variant": "#1e293b",
        "surface-tint": "#7dd3fc",

        "on-background": "#f8fafc",
        "on-surface": "#f8fafc",
        "on-surface-variant": "#94a3b8",

        "inverse-surface": "#f1f5f9",
        "inverse-on-surface": "#0f172a",
        "inverse-primary": "#0284c7",

        primary: "#7dd3fc",
        "on-primary": "#082f49",
        "primary-container": "#0284c7",
        "on-primary-container": "#f0f9ff",
        "primary-fixed": "#bae6fd",
        "primary-fixed-dim": "#38bdf8",
        "on-primary-fixed": "#0c4a6e",
        "on-primary-fixed-variant": "#0369a1",

        secondary: "#93c5fd",
        "on-secondary": "#0f172a",
        "secondary-container": "#1d4ed8",
        "on-secondary-container": "#0f172a",
        "secondary-fixed": "#bfdbfe",
        "secondary-fixed-dim": "#60a5fa",
        "on-secondary-fixed": "#0f172a",
        "on-secondary-fixed-variant": "#1e3a8a",

        tertiary: "#c7d2fe",
        "on-tertiary": "#312e81",
        "tertiary-container": "#4f46e5",
        "on-tertiary-container": "#e0e7ff",
        "tertiary-fixed": "#e0e7ff",
        "tertiary-fixed-dim": "#a5b4fc",
        "on-tertiary-fixed": "#1e1b4b",
        "on-tertiary-fixed-variant": "#3730a3",

        error: "#f87171",
        "on-error": "#450a0a",
        "error-container": "#7f1d1d",
        "on-error-container": "#fecaca",

        outline: "#64748b",
        "outline-variant": "#334155",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "pixel-unit": "4px",
        "grid-gutter": "16px",
        "container-margin": "32px",
        "border-width-sm": "4px",
        "border-width-lg": "8px",
      },
      fontFamily: {
        "headline-xl": ['"Press Start 2P"', "monospace"],
        "headline-xl-mobile": ['"Press Start 2P"', "monospace"],
        "headline-lg": ['"Press Start 2P"', "monospace"],
        "headline-md": ['"Press Start 2P"', "monospace"],
        "label-sm": ['"Press Start 2P"', "monospace"],
        "body-lg": ["Silkscreen", "monospace"],
        "body-md": ["Silkscreen", "monospace"],
      },
      fontSize: {
        "headline-xl": ["32px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-xl-mobile": ["20px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-lg": ["24px", { lineHeight: "1.2", fontWeight: "400" }],
        "headline-md": ["16px", { lineHeight: "1.4", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": ["8px", { lineHeight: "1", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
