'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { duration as durations, ease } from '@/lib/motion';

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    y?: number;
}

/**
 * Révélation à l'entrée dans le viewport, pour le contenu situé sous la ligne
 * de flottaison. Pour ce qui est déjà visible au chargement, voir `IntroGroup`.
 *
 * Les durées et la courbe viennent de `@/lib/motion` : elles étaient écrites en
 * dur ici (0.5, "easeOut") et différaient de celles des autres composants.
 */
export const ScrollReveal = ({
    children,
    width = "100%",
    delay = 0.2,
    duration = durations.base,
    y = 14
}: ScrollRevealProps) => {
    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: y },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration, delay, ease: ease.out }}
            >
                {children}
            </motion.div>
        </div>
    );
};
