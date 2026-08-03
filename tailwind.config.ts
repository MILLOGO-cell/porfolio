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
      },
      boxShadow: {
        // Une seule échelle, discrète : la profondeur vient des bordures.
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        raised: "0 4px 16px -4px rgb(0 0 0 / 0.08)",
        float: "0 12px 32px -8px rgb(0 0 0 / 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
