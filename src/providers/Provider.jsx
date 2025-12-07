"use client";

import { ThemeProvider } from "@/context/ThemeContext";

export default function Provider({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}