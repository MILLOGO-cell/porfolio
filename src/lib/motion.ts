import type { Transition, Variants } from 'framer-motion';

/**
 * Jetons de motion — même intention que les jetons de couleur de globals.css :
 * une seule source de vérité. Les durées et courbes étaient écrites à la main
 * dans chaque composant (0.5, 0.6, 0.3, "easeOut"), ce qui donnait des rythmes
 * légèrement différents d'une section à l'autre sans raison.
 *
 * Parti pris : court. Une animation d'interface se remarque quand elle dure ;
 * elle doit accompagner la lecture, pas la retarder.
 */

/** Durées en secondes. Au-delà de `slow`, l'animation devient le sujet. */
export const duration = {
  /** Retours immédiats : survol, bascule d'état. */
  fast: 0.18,
  /** Cas courant : apparition d'un bloc, révélation au défilement. */
  base: 0.34,
  /** Réservé aux grandes surfaces (hero, superposition). */
  slow: 0.55,
} as const;

/**
 * Courbes d'accélération. `out` démarre vite puis freine longuement : c'est ce
 * qui donne l'impression que l'élément se pose plutôt qu'il ne glisse.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Transition par défaut d'une apparition. */
export const enterTransition: Transition = {
  duration: duration.base,
  ease: ease.out,
};

/**
 * Apparition en fondu avec une montée courte. `y` reste faible volontairement :
 * un décalage important lit comme un élément qui tombe, pas qui se révèle.
 */
export function fadeUp(y: number = 14): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: enterTransition },
  };
}

/**
 * Conteneur d'une cascade. `staggerChildren` est le décalage entre deux enfants
 * successifs ; `delayChildren` retarde l'ensemble, le temps que la page se pose.
 *
 * 60 ms entre deux éléments : assez pour que l'œil perçoive un ordre, trop peu
 * pour qu'il attende.
 */
export function staggerContainer(
  staggerChildren: number = 0.06,
  delayChildren: number = 0
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}
