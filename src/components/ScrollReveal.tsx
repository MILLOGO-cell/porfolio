import { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    /** Retard en secondes, utilisé uniquement par le repli au chargement. */
    delay?: number;
    /** Amplitude de la montée, en pixels. */
    y?: number;
}

/**
 * Révélation du contenu situé sous la ligne de flottaison.
 *
 * La version framer-motion (`whileInView`) inscrivait `opacity: 0` dans le HTML
 * rendu côté serveur : sans JavaScript, tout ce qui se trouvait sous le premier
 * écran restait invisible. Le hero avait été corrigé de la même façon ; cette
 * fois c'est le reste de la page.
 *
 * Le mouvement est désormais porté par `.reveal-scroll` (globals.css), qui
 * s'appuie sur `animation-timeline: view()` là où le navigateur le sait faire,
 * et retombe sur un simple fondu au chargement ailleurs. Dans les deux cas le
 * contenu finit visible, et aucun JavaScript n'est nécessaire.
 *
 * Le composant n'a plus de directive `'use client'` : il fonctionne aussi bien
 * dans un composant serveur que dans un composant client.
 *
 * Pour le contenu déjà visible au chargement, voir `IntroGroup`.
 */
export const ScrollReveal = ({
    children,
    width = "100%",
    delay = 0.2,
    y = 14
}: ScrollRevealProps) => {
    return (
        // Plus d'`overflow: hidden` : il rognait les ombres et les
        // débordements au survol des cartes qu'il enveloppait.
        <div
            className="reveal-scroll"
            style={
                {
                    position: "relative",
                    width,
                    "--reveal-y": `${y}px`,
                    "--reveal-delay": `${delay}s`,
                } as React.CSSProperties
            }
        >
            {children}
        </div>
    );
};
