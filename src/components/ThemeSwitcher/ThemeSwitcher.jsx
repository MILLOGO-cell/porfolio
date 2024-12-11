"use client";

import { FaMoon, FaSun } from "react-icons/fa";
import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div>
      <Switch
        isSelected={isDarkMode}
        size="lg"
        color={isDarkMode ? "primary" : "default"}
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <FaSun className={className} />
          ) : (
            <FaMoon className={className} />
          )
        }
        onChange={toggleTheme}
      />
    </div>
  );
}
