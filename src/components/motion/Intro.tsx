import { Children } from 'react';

/**
 * Cascade d'arrivée pour le contenu visible au chargement.
 *
 * Volontairement en CSS et non avec framer-motion. Une animation au montage
 * inscrit `opacity: 0` dans le HTML rendu côté serveur : le hero restait
 * invisible jusqu'à l'hydratation de React, et ne s'affichait pas du tout si le
 * JavaScript ne s'exécutait pas. La classe `.reveal-up` (globals.css) démarre
 * au premier rendu et ne dépend de rien.
 *
 * Le composant reste donc un composant serveur : le hero n'a plus besoin de
 * franchir la frontière client, contrairement à `ScrollReveal` qui doit
 * observer le viewport.
 *
 * Pour le contenu situé sous la ligne de flottaison, voir `ScrollReveal`.
 */
export function IntroGroup({
  children,
  className,
  delay = 40,
  step = 60,
}: {
  children: React.ReactNode;
  className?: string;
  /** Retard du premier palier, en millisecondes. */
  delay?: number;
  /** Décalage entre deux paliers successifs, en millisecondes. */
  step?: number;
}) {
  // L'ordre d'animation est l'ordre du DOM : chaque enfant direct devient un
  // palier, il n'y a aucun index à tenir à la main dans la page.
  const paliers = Children.toArray(children);

  return (
    <div className={className}>
      {paliers.map((palier, index) => (
        <div
          key={index}
          className="reveal-up"
          // Même mécanisme que `ScrollReveal` : le retard passe par une
          // propriété personnalisée, ce qui laisse une règle de feuille de
          // style le neutraliser (voir prefers-reduced-motion).
          style={
            { "--reveal-delay": `${delay + index * step}ms` } as React.CSSProperties
          }
        >
          {palier}
        </div>
      ))}
    </div>
  );
}
