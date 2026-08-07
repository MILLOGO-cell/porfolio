"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Lit le thème réellement appliqué, sur l'élément racine.
 *
 * La classe y est posée par le script bloquant de `layout.tsx`, avant le premier
 * rendu. Ce fournisseur n'a donc plus à décider du thème : il ne fait que
 * refléter ce qui est déjà en place, et le basculer à la demande.
 */
function themeApplique(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialisation paresseuse plutôt qu'un effet. L'ancienne version appelait
  // `setTheme` dans un `useEffect` : le thème n'était connu qu'après
  // l'hydratation, ce qui provoquait un rendu en cascade en plus du
  // clignotement. Le rendu serveur retourne « light », valeur qui n'est jamais
  // affichée puisque rien ne dépend de `theme` pour son balisage.
  const [theme, setTheme] = useState<Theme>(themeApplique);

  const toggleTheme = useCallback(() => {
    setTheme((actuel) => {
      const suivant: Theme = actuel === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", suivant === "dark");
      try {
        localStorage.setItem("theme", suivant);
      } catch {
        // Stockage indisponible : le choix ne survivra pas au rechargement,
        // mais la bascule doit rester fonctionnelle pour la session.
      }
      return suivant;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
