'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

/**
 * Cascade d'arrivée, pour le contenu déjà visible au chargement.
 *
 * Distinct de `ScrollReveal`, qui attend l'entrée dans le viewport : au-dessus
 * de la ligne de flottaison, attendre le défilement signifie ne jamais
 * s'animer, ou pire s'animer alors que l'utilisateur a déjà lu.
 *
 * L'ordre d'animation est l'ordre du DOM. Il n'y a rien à indexer à la main :
 * `staggerChildren` décale chaque enfant direct du groupe.
 */
export function IntroGroup({
  children,
  className,
  delay = 0.05,
  step = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  /** Retard avant le premier enfant, le temps que la page se pose. */
  delay?: number;
  /** Décalage entre deux enfants successifs. */
  step?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(step, delay)}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

/**
 * Un palier de la cascade. À placer en enfant direct d'`IntroGroup` : c'est de
 * cette relation que vient le décalage.
 */
export function IntroItem({
  children,
  className,
  y,
}: {
  children: React.ReactNode;
  className?: string;
  /** Amplitude de la montée. Par défaut celle de `fadeUp`. */
  y?: number;
}) {
  return (
    <motion.div className={className} variants={fadeUp(y)}>
      {children}
    </motion.div>
  );
}
