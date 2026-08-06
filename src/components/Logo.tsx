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
 * Toute retouche ici doit y être reportée.
 */
export default function Logo({
  className,
  title,
}: {
  className?: string;
  /** Renseigné, la marque devient une image nommée ; sinon elle est décorative. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
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

      <circle cx="32" cy="32" r="32" fill="url(#logo-fond)" />

      {/* Les trois éléments partagent les mêmes réglages de trait : c'est ce qui
          manquait à l'original, dont les épaisseurs variaient. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline
          points="30.6,17.2 19.1,26.8 29.6,36.3"
          stroke="url(#logo-chevron-gauche)"
          strokeWidth="4.6"
        />
        <line
          x1="38.2"
          y1="17.2"
          x2="28.7"
          y2="46.8"
          stroke="#ffffff"
          strokeWidth="4"
        />
        <polyline
          points="36.3,28.7 46.8,37.7 37.2,46.8"
          stroke="url(#logo-chevron-droit)"
          strokeWidth="4.6"
        />
      </g>
    </svg>
  );
}
