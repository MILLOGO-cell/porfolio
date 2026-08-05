"use client";

import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={
        theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
      }
    >
      {theme === "dark" ? (
        <LuSun className="h-3.5 w-3.5" />
      ) : (
        <LuMoon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
