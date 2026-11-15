"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  /** Retard en secondes, compté depuis l'entrée du bloc dans l'écran. */
  delay?: number;
  /** Amplitude de la montée, en pixels. */
  y?: number;
  /** Classes de mise en page (ex. emprise dans une grille). */
  className?: string;
}

/**
 * Révélation au défilement, jouée une seule fois : fondu, montée et très léger
 * zoom en 700 ms, courbe douce.
 *
 * Elle repose sur framer-motion (IntersectionObserver) et non sur
 * `animation-timeline: view()`, absent de Firefox. `reducedMotion="user"`
 * (MotionProvider) retire le déplacement pour qui l'a demandé et garde le
 * fondu. Sans JavaScript, la règle <noscript> du layout rétablit l'affichage
 * grâce à l'attribut `data-motion` (le HTML serveur contient opacity: 0).
 */
export const ScrollReveal = ({
  children,
  width = "100%",
  delay = 0.1,
  y = 28,
  className = "",
}: ScrollRevealProps) => (
  <motion.div
    data-motion=""
    className={className}
    style={{ position: "relative", width }}
    initial={{ opacity: 0, y: Math.max(y, 24), scale: 0.985 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: Math.min(delay, 0.4) }}
  >
    {children}
  </motion.div>
);
