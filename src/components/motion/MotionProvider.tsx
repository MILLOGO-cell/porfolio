'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Fait respecter `prefers-reduced-motion` à l'ensemble des animations
 * framer-motion de l'application.
 *
 * Jusqu'ici globals.css ne neutralisait que `scroll-behavior` : quelqu'un qui a
 * demandé à son système de réduire les animations les recevait quand même
 * toutes. `reducedMotion="user"` fait tomber les animations de transformation
 * et de mise en page tout en conservant les fondus, qui ne déclenchent pas de
 * gêne vestibulaire — l'interface reste lisible au lieu d'apparaître d'un bloc.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
