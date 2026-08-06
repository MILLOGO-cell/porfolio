/**
 * Le logo du portfolio, vectorisé.
 *
 * L'original était `public/logo.png` : un raster de 78 × 78 px, flou dès 40 px
 * sur un écran retina, avec une ombre portée cuite dans l'image — c'est elle qui
 * expliquait les pixels presque transparents sur les bords, et elle décalait le
 * cercle de 5 px vers le haut du cadre.
 *
 * Ce tracé reprend la même marque : cercle violet en dégradé diagonal et le
 * symbole `</>` échelonné en diagonale, `<` en haut à gauche, la barre oblique
 * au centre, `>` en bas à droite. Trois corrections seulement :
 *
 *   - vectoriel, donc net de 16 px à n'importe quelle taille ;
 *   - plus d'ombre cuite, donc le cercle occupe tout le cadre et la marque
 *     gagne environ 15 % de diamètre à encombrement égal ;
 *   - cercle réellement centré, épaisseurs de trait régulières.
 *
 * Les couleurs sont relevées sur les pixels de cœur de l'original, saturation
 * restaurée : l'antialiasing d'un raster de 78 px avait mélangé tous les
 * contours avec le violet du fond, les teintes d'origine n'y sont plus lisibles
 * telles quelles.
 *
 * Attention : `src/app/icon.svg` porte le même tracé, pour l'icône d'onglet.
 * Toute retouche ici doit y être reportée, puis les fichiers de `docs/logo/`
 * régénérés avec `scripts/export-logo-assets.mjs`.
 */

/** Les trois éléments du symbole. Réutilisés tels quels par chaque version. */
const CHEVRON_GAUCHE = "30.6,17.2 19.1,26.8 29.6,36.3";
const CHEVRON_DROIT = "36.3,28.7 46.8,37.7 37.2,46.8";
const BARRE = { x1: 38.2, y1: 17.2, x2: 28.7, y2: 46.8 };

export type LogoVariante = "couleur" | "monochrome" | "fond-perdu";

export default function Logo({
  className,
  title,
  variante = "couleur",
}: {
  className?: string;
  /** Renseigné, la marque devient une image nommée ; sinon elle est décorative. */
  title?: string;
  /**
   * `couleur` — la règle, partout où la couleur est possible.
   * `monochrome` — disque à la couleur du texte, symbole détouré : fonds
   *   chargés, photographies, impression en une seule encre.
   * `fond-perdu` — carré plein, réservé aux icônes que le système masque.
   */
  variante?: LogoVariante;
}) {
  const accessibilite = {
    role: title ? ("img" as const) : undefined,
    "aria-hidden": title ? undefined : true,
    "aria-label": title,
  };

  if (variante === "monochrome") {
    return (
      <svg viewBox="0 0 64 64" className={className} {...accessibilite}>
        <defs>
          {/*
            Le symbole est un vrai détourage : il laisse voir le fond au lieu
            d'imposer une couleur de réserve, ce qui rend la version utilisable
            sur n'importe quel support.

            La barre oblique chevauche le chevron gauche d'environ 1,8 unité. En
            couleur, elle passe par-dessus et le croisement reste net ; d'une
            seule couleur, les deux trous fusionneraient et le symbole
            deviendrait illisible. D'où l'ordre : disque conservé, chevrons
            retirés, matière redonnée autour de la barre, barre retirée.

            L'identifiant du masque est fixe et non unique par instance. Deux
            marques monochromes sur une même page produisent donc des
            identifiants dupliqués — sans conséquence de rendu, chaque instance
            portant sa propre copie d'un masque identique.
          */}
          <mask id="logo-reserve">
            <circle cx="32" cy="32" r="32" fill="#fff" />
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={CHEVRON_GAUCHE} stroke="#000" strokeWidth="4.6" />
              <polyline points={CHEVRON_DROIT} stroke="#000" strokeWidth="4.6" />
              <line {...BARRE} stroke="#fff" strokeWidth="5.8" />
              <line {...BARRE} stroke="#000" strokeWidth="4" />
            </g>
          </mask>
        </defs>
        {/* `currentColor` : la marque suit la couleur du texte environnant. */}
        <circle
          cx="32"
          cy="32"
          r="32"
          fill="currentColor"
          mask="url(#logo-reserve)"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className={className} {...accessibilite}>
      <defs>
        <linearGradient id="logo-fond" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f0939" />
          <stop offset="1" stopColor="#85199e" />
        </linearGradient>
        <linearGradient id="logo-chevron-gauche" x1="0.5" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#2b7fb4" />
          <stop offset="1" stopColor="#3fd3c6" />
        </linearGradient>
        <linearGradient id="logo-chevron-droit" x1="0.4" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#e8452f" />
          <stop offset="1" stopColor="#f79420" />
        </linearGradient>
      </defs>

      {/* Le fond perdu remplace le disque par un carré plein : iOS et les
          plateformes sociales appliquent leur propre masque arrondi, et un
          cercle sur fond transparent y laisserait les coins vides. */}
      {variante === "fond-perdu" ? (
        <rect width="64" height="64" fill="url(#logo-fond)" />
      ) : (
        <circle cx="32" cy="32" r="32" fill="url(#logo-fond)" />
      )}

      {/* Les trois éléments partagent les mêmes réglages de trait : c'est ce qui
          manquait à l'original, dont les épaisseurs variaient. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline
          points={CHEVRON_GAUCHE}
          stroke="url(#logo-chevron-gauche)"
          strokeWidth="4.6"
        />
        <line {...BARRE} stroke="#ffffff" strokeWidth="4" />
        <polyline
          points={CHEVRON_DROIT}
          stroke="url(#logo-chevron-droit)"
          strokeWidth="4.6"
        />
      </g>
    </svg>
  );
}
