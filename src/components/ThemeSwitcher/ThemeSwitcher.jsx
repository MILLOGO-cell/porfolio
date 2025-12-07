"use client";

import { FaMoon, FaSun } from "react-icons/fa";
import { Switch } from "@nextui-org/react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <Switch
      isSelected={isDarkMode}
      size="lg"
      color={isDarkMode ? "primary" : "default"}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? <FaSun className={className} /> : <FaMoon className={className} />
      }
      onChange={toggleTheme}
    />
  );
}
