import type { Config } from "tailwindcss";

/** Les valeurs vivent dans globals.css (:root / .dark) — ici on ne fait que les nommer. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: token("background"),
        surface: {
          DEFAULT: token("surface"),
          muted: token("surface-muted"),
        },
        border: token("border"),
        foreground: token("foreground"),
        muted: token("muted"),
        accent: {
          DEFAULT: token("accent"),
          soft: token("accent-soft"),
        },
        success: {
          DEFAULT: token("success"),
          soft: token("success-soft"),
        },
        warning: {
          DEFAULT: token("warning"),
          soft: token("warning-soft"),
        },
        info: {
          DEFAULT: token("info"),
          soft: token("info-soft"),
        },
      },
      boxShadow: {
        // Une seule échelle, discrète : la profondeur vient des bordures.
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        raised: "0 4px 16px -4px rgb(0 0 0 / 0.08)",
        float: "0 12px 32px -8px rgb(0 0 0 / 0.12)",
      },
      fontFamily: {
        // Helvetica en tête, avec les replis usuels : Arial sur Windows,
        // Liberation Sans sur Linux. Aucune police n'est téléchargée.
        sans: [
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          '"Liberation Sans"',
          "sans-serif",
        ],
        // `display` reste défini pour ne pas casser les classes existantes,
        // mais pointe désormais sur la même pile : plus de serif.
        display: [
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          '"Liberation Sans"',
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
