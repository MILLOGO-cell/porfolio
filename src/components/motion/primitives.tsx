"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Chip } from "@/components/ui/Badge";

/** Courbe d'arrivée douce, commune à toutes les animations (300-700 ms). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * Chaque bloc animé porte `data-motion` : sans JavaScript, le HTML serveur
 * contient `opacity: 0` (état initial de framer-motion). Une règle <noscript>
 * du layout rétablit alors la visibilité.
 */

/** Parallaxe réel : le contenu suit le défilement à une vitesse différente. */
export function HeroParallax({
  children,
  className,
  y = [0, 90],
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  y?: [number, number];
  fade?: boolean;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const ty = useTransform(scrollY, [0, 700], y);
  const opacity = useTransform(scrollY, [0, 520], [1, 0.15]);

  return (
    <motion.div
      aria-hidden={className?.includes("pointer-events-none") || undefined}
      className={className}
      style={reduce ? undefined : { y: ty, opacity: fade ? opacity : undefined }}
    >
      {children}
    </motion.div>
  );
}

/** Image qui dérive doucement dans son cadre pendant que la page défile. */
export function ParallaxImage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale: 1.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Carte vitrée : entrée décalée avec léger zoom, puis, à la souris seulement,
 * halo qui suit le curseur et inclinaison 3D très légère. Rien de tout cela
 * sur écran tactile (`pointerType` filtré) ni en mouvement réduit.
 */
export function GlassTilt({
  children,
  className = "",
  reveal = false,
  delay = 0,
  max = 3.5,
}: {
  children: ReactNode;
  className?: string;
  reveal?: boolean;
  delay?: number;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      ref={ref}
      data-motion={reveal ? "" : undefined}
      className={`spotlight ${className}`}
      initial={reveal ? { opacity: 0, y: 44, scale: 0.97 } : false}
      whileInView={reveal ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      whileHover={reduce ? undefined : { y: -3 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    >
      {children}
    </motion.article>
  );
}

/** Légère magnétisation d'un bouton vers le curseur (souris uniquement). */
export function Magnetic({
  children,
  strength = 0.22,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-9, Math.min(9, dx * strength)));
    y.set(Math.max(-7, Math.min(7, dy * strength)));
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/** Pastilles qui apparaissent en vague. */
export function ChipWave({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((item, i) => (
        <motion.span
          key={item}
          data-motion=""
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.05 }}
        >
          <Chip>{item}</Chip>
        </motion.span>
      ))}
    </div>
  );
}
