/**
 * Regenere les icones binaires depuis src/app/icon.svg.
 *
 *   npx playwright install chromium   # une seule fois
 *   node scripts/generate-icons.mjs
 *
 * A relancer uniquement si le logo change. Playwright n'est volontairement pas
 * une dependance du projet : ce serait plus de 100 Mo installes en permanence
 * pour un script qui tourne deux fois par an. Il est appele via npx a la
 * demande.
 *
 * Produit :
 *   src/app/favicon.ico      16 / 32 / 48, entrees PNG — l'ancien fichier ne
 *                            contenait qu'une entree 78 x 78, taille non
 *                            standard que les navigateurs reechantillonnaient.
 *   src/app/apple-icon.png   180 x 180, seul format qu'iOS refuse en vectoriel.
 *                            Rendu a fond perdu : iOS applique son propre
 *                            masque arrondi, un cercle sur fond transparent y
 *                            laisserait les coins vides.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

// La racine du projet est deduite de l'emplacement du script, mais peut etre
// passee en argument : cela permet d'executer une copie du script depuis un
// dossier ou playwright est installe, sans l'ajouter aux dependances.
const racine = process.argv[2]
  ? resolve(process.argv[2])
  : join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(racine, 'src/app/icon.svg'), 'utf8');

/** Le symbole seul, sans le cercle : reutilise pour la version a fond perdu. */
const symbole = svg.slice(svg.indexOf('<g fill="none"'), svg.indexOf('</svg>'));
const degrades = svg.slice(svg.indexOf('<defs>'), svg.indexOf('</defs>') + 7);

const navigateur = await chromium.launch({ channel: 'chromium' });

/** Rend un fragment SVG en PNG a la taille demandee. */
async function rendre(contenuSvg, taille) {
  const page = await navigateur.newPage({
    viewport: { width: taille, height: taille },
  });
  await page.setContent(
    `<body style="margin:0">${contenuSvg.replace(
      '<svg ',
      `<svg width="${taille}" height="${taille}" `
    )}</body>`
  );
  const png = await page.screenshot({ omitBackground: true });
  await page.close();
  return png;
}

// ---- favicon.ico : trois tailles standard, entrees PNG ----------------------
const tailles = [16, 32, 48];
const images = [];
for (const t of tailles) images.push(await rendre(svg, t));

// Format ICO : en-tete de 6 octets, puis une entree de 16 octets par image,
// puis les charges utiles. 0 dans le champ taille signifie 256.
const entete = Buffer.alloc(6);
entete.writeUInt16LE(0, 0); // reserve
entete.writeUInt16LE(1, 2); // type 1 = icone
entete.writeUInt16LE(images.length, 4);

let decalage = 6 + 16 * images.length;
const entrees = [];
for (let i = 0; i < images.length; i++) {
  const e = Buffer.alloc(16);
  e.writeUInt8(tailles[i] >= 256 ? 0 : tailles[i], 0); // largeur
  e.writeUInt8(tailles[i] >= 256 ? 0 : tailles[i], 1); // hauteur
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserve
  e.writeUInt16LE(1, 4); // plans
  e.writeUInt16LE(32, 6); // bits par pixel
  e.writeUInt32LE(images[i].length, 8);
  e.writeUInt32LE(decalage, 12);
  decalage += images[i].length;
  entrees.push(e);
}

const ico = Buffer.concat([entete, ...entrees, ...images]);
writeFileSync(join(racine, 'src/app/favicon.ico'), ico);
console.log(
  `favicon.ico : ${tailles.join(' / ')} px, ${(ico.length / 1024).toFixed(1)} Ko`
);

// ---- apple-icon.png : 180 px a fond perdu ----------------------------------
const carre = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  ${degrades}
  <rect width="64" height="64" fill="url(#fond)"/>
  ${symbole}
</svg>`;
const apple = await rendre(carre, 180);
writeFileSync(join(racine, 'src/app/apple-icon.png'), apple);
console.log(`apple-icon.png : 180 px, ${(apple.length / 1024).toFixed(1)} Ko`);

await navigateur.close();
