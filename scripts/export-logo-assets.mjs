// Produit le jeu complet de fichiers du logo : SVG vectoriels, PNG a fond
// transparent dans toutes les tailles, et JPEG pour les outils qui n'acceptent
// que ce format.
//
// Tout descend du meme trace que src/components/Logo.tsx : rien n'est
// redessine, et l'ensemble est regenerable a l'identique.
//
//   npx playwright install chromium        # une seule fois
//   node scripts/export-logo-assets.mjs docs/logo
//
// Playwright n'est volontairement pas une dependance du projet : plus de 100 Mo
// installes en permanence pour un script qui tourne le jour ou le logo change.
// Si l'import echoue, executer une copie du script depuis un dossier ou
// playwright est installe — le chemin de sortie est passe en argument.
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const RACINE = process.argv[2];

// --- Le trace, source unique ------------------------------------------------
const TRAITS = `
    <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke-width="4.6"/>
    <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke-width="4"/>
    <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke-width="4.6"/>`;

const DEGRADES = `
    <linearGradient id="disque" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2F0939"/><stop offset="1" stop-color="#85199E"/>
    </linearGradient>
    <linearGradient id="chevronGauche" x1="0.5" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#2B7FB4"/><stop offset="1" stop-color="#3FD3C6"/>
    </linearGradient>
    <linearGradient id="chevronDroit" x1="0.4" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#E8452F"/><stop offset="1" stop-color="#F79420"/>
    </linearGradient>`;

const entete = (titre) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${titre}">
  <title>${titre}</title>`;

/** Version en couleur : la principale. */
const svgCouleur = `${entete("Logo Nicolas MILLOGO")}
  <defs>${DEGRADES}
  </defs>
  <circle cx="32" cy="32" r="32" fill="url(#disque)"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="url(#chevronGauche)" stroke-width="4.6"/>
    <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#FFFFFF" stroke-width="4"/>
    <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="url(#chevronDroit)" stroke-width="4.6"/>
  </g>
</svg>
`;

/**
 * Monochrome : le symbole est un vrai detourage, obtenu par masque. Il est donc
 * transparent et laisse voir le fond, au lieu d'imposer une couleur de reserve.
 *
 * La barre oblique chevauche le chevron gauche d'environ 1,8 unite. En couleur,
 * elle passe par-dessus et le croisement reste net ; en detourage, les deux
 * trous fusionneraient et le symbole deviendrait illisible. On reserve donc un
 * degagement de 0,9 unite de part et d'autre de la barre — le blanc du masque
 * rend la matiere, le noir la retire, dans cet ordre :
 *
 *   1. le disque entier est conserve ;
 *   2. les deux chevrons sont retires ;
 *   3. un trait large redonne de la matiere autour de la barre ;
 *   4. la barre elle-meme est retiree.
 */
const svgMono = (couleur, titre) => `${entete(titre)}
  <defs>
    <mask id="reserve">
      <circle cx="32" cy="32" r="32" fill="#FFFFFF"/>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="#000000" stroke-width="4.6"/>
        <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="#000000" stroke-width="4.6"/>
        <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#FFFFFF" stroke-width="5.8"/>
        <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#000000" stroke-width="4"/>
      </g>
    </mask>
  </defs>
  <circle cx="32" cy="32" r="32" fill="${couleur}" mask="url(#reserve)"/>
</svg>
`;

/** Version a fond perdu, pour les icones que le systeme masque lui-meme. */
const svgFondPerdu = `${entete("Logo Nicolas MILLOGO, fond perdu")}
  <defs>${DEGRADES}
  </defs>
  <rect width="64" height="64" fill="url(#disque)"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="url(#chevronGauche)" stroke-width="4.6"/>
    <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#FFFFFF" stroke-width="4"/>
    <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="url(#chevronDroit)" stroke-width="4.6"/>
  </g>
</svg>
`;

/** Le symbole seul, qui herite de la couleur du texte environnant. */
const svgSymbole = `${entete("Symbole Nicolas MILLOGO")}
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${TRAITS}
  </g>
</svg>
`;

const VERSIONS = [
  { cle: "couleur", nom: "Couleur", svg: svgCouleur },
  { cle: "monochrome-positif", nom: "Monochrome positif", svg: svgMono("#1A1420", "Logo Nicolas MILLOGO, monochrome positif") },
  { cle: "monochrome-negatif", nom: "Monochrome négatif", svg: svgMono("#FFFFFF", "Logo Nicolas MILLOGO, monochrome négatif") },
  { cle: "fond-perdu", nom: "Fond perdu", svg: svgFondPerdu },
  { cle: "symbole", nom: "Symbole seul", svg: svgSymbole, sansPng: true },
];

// Tailles retenues : chacune correspond a un usage reel, aucune n'est decorative.
const TAILLES = [16, 24, 32, 48, 64, 128, 180, 192, 256, 512, 1024, 2048];

const JPEG = [
  { cle: "couleur", fond: "#FFFFFF", suffixe: "fond-blanc" },
  { cle: "couleur", fond: "#2F0939", suffixe: "fond-violet" },
  { cle: "fond-perdu", fond: "#FFFFFF", suffixe: "" },
];
const TAILLES_JPEG = [512, 1024, 2048];

// --- Ecriture ---------------------------------------------------------------
await mkdir(join(RACINE, "svg"), { recursive: true });
for (const v of VERSIONS) {
  await writeFile(join(RACINE, "svg", `logo-${v.cle}.svg`), v.svg, "utf8");
}
console.log(`SVG : ${VERSIONS.length} fichiers`);

const navigateur = await chromium.launch({ channel: "chromium" });
let nbPng = 0;
let nbJpeg = 0;

/** Rend un SVG a une taille donnee, en PNG transparent ou en JPEG sur un fond. */
async function rendre({ svg, taille, chemin, fond, jpeg }) {
  const page = await navigateur.newPage({
    viewport: { width: taille, height: taille },
    deviceScaleFactor: 1,
  });
  // Le SVG est pose seul, sans marge : la capture fait exactement la taille voulue.
  await page.setContent(
    `<body style="margin:0;background:${fond ?? "transparent"}">${svg.replace(
      'width="64" height="64"',
      `width="${taille}" height="${taille}" style="display:block"`
    )}</body>`
  );
  await page.waitForTimeout(60);
  await page.screenshot({
    path: chemin,
    omitBackground: !fond,
    ...(jpeg ? { type: "jpeg", quality: 92 } : {}),
  });
  await page.close();
}

for (const v of VERSIONS) {
  if (v.sansPng) continue;
  const dossier = join(RACINE, "png", v.cle);
  await mkdir(dossier, { recursive: true });
  for (const t of TAILLES) {
    await rendre({
      svg: v.svg,
      taille: t,
      chemin: join(dossier, `logo-${v.cle}-${t}.png`),
    });
    nbPng++;
  }
  console.log(`PNG ${v.cle} : ${TAILLES.length} tailles`);
}

await mkdir(join(RACINE, "jpeg"), { recursive: true });
for (const j of JPEG) {
  const v = VERSIONS.find((x) => x.cle === j.cle);
  for (const t of TAILLES_JPEG) {
    const nom = j.suffixe
      ? `logo-${j.cle}-${j.suffixe}-${t}.jpg`
      : `logo-${j.cle}-${t}.jpg`;
    await rendre({
      svg: v.svg,
      taille: t,
      chemin: join(RACINE, "jpeg", nom),
      fond: j.fond,
      jpeg: true,
    });
    nbJpeg++;
  }
}
console.log(`JPEG : ${nbJpeg} fichiers`);

await navigateur.close();
console.log(`\ntotal : ${VERSIONS.length} SVG, ${nbPng} PNG, ${nbJpeg} JPEG`);
