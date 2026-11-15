"use client";

import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";

/**
 * Bascule entre thème clair et sombre.
 *
 * Le balisage ne dépend volontairement d'aucun état React. Les deux icônes sont
 * rendues, et c'est la classe `dark` de l'élément racine — posée par le script
 * bloquant de `layout.tsx` — qui décide laquelle s'affiche.
 *
 * Sans cela, le serveur rendrait la lune et le client le soleil dès que la
 * préférence est sombre : l'hydratation divergerait. Le faire porter par le CSS
 * supprime le problème à la racine plutôt que de le masquer.
 *
 * L'intitulé est fixe pour la même raison : un libellé qui dépendrait du thème
 * réintroduirait la divergence.
 */
export default function ThemeSwitcher() {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 md:h-8 md:w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Changer de thème"
    >
      <LuMoon className="h-3.5 w-3.5 dark:hidden" aria-hidden />
      <LuSun className="hidden h-3.5 w-3.5 dark:block" aria-hidden />
    </button>
  );
}
