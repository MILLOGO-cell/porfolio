// Construit la charte graphique du logo en .pptx.
//
// Les visuels sont les PNG produits par render-charte-visuals.mjs, eux-memes
// rendus depuis le meme trace SVG que le logo du site : aucune capture d'ecran,
// aucune reproduction approximative.
//
//   node scripts/render-charte-visuals.mjs /tmp/visuels
//   node scripts/build-charte-pptx.mjs /tmp/visuels docs/charte-graphique-logo.pptx
//
// pptxgenjs n'est pas une dependance du projet, pour la meme raison que
// playwright : l'installer via npx au moment ou l'on regenere le document.
//
// Le PDF joint a cote se produit ensuite avec LibreOffice :
//   soffice --headless --convert-to pdf --outdir docs docs/charte-graphique-logo.pptx
import PptxGenJS from "pptxgenjs";
import { join } from "node:path";

const VISUELS = process.argv[2];
const DESTINATION = process.argv[3];
const img = (nom) => join(VISUELS, `${nom}.png`);

// ---- Palette, reprise de la charte ----------------------------------------
const VIOLET = "85199E";
const VIOLET_FONCE = "2F0939";
const ENCRE = "1A1420";
const ATTENUE = "6B6472";
const FILET = "E7E1EA";
const SURFACE = "FAF7FB";
const ORANGE = "F79420";
const BLANC = "FFFFFF";
const POLICE = "Arial";

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13,33 x 7,5 pouces
pptx.author = "Nicolas MILLOGO";
pptx.company = "Nicolas MILLOGO";
pptx.title = "Charte graphique du logo";
pptx.subject = "Construction, couleurs, versions et emplois du logo";

const L = 0.72; // marge gauche
const LARGEUR = 13.33 - L * 2;

/** En-tete commun : numero, titre, chapeau, filet. */
function chapitre(numero, titre, chapeau) {
  const s = pptx.addSlide();
  s.background = { color: BLANC };
  s.addText(numero, {
    x: L, y: 0.42, w: 1, h: 0.3,
    fontFace: POLICE, fontSize: 12, bold: true, color: VIOLET, charSpacing: 2,
  });
  s.addText(titre, {
    x: L, y: 0.72, w: LARGEUR, h: 0.6,
    fontFace: POLICE, fontSize: 30, bold: true, color: ENCRE,
  });
  if (chapeau) {
    s.addText(chapeau, {
      x: L, y: 1.36, w: 9.6, h: 0.62,
      fontFace: POLICE, fontSize: 13, color: ATTENUE, lineSpacingMultiple: 1.25,
    });
  }
  s.addShape(pptx.ShapeType.rect, {
    x: L, y: 0.34, w: 0.34, h: 0.045, fill: { color: VIOLET },
  });
  pied(s);
  return s;
}

/**
 * Pied de page des diapositives de contenu. Il occupe la bande basse, qui
 * resterait sinon vide sans raison, et rappelle de quel document il s'agit une
 * fois la diapositive sortie de son contexte.
 */
let numero = 0;
function pied(s) {
  numero++;
  s.addShape(pptx.ShapeType.rect, {
    x: L, y: 6.86, w: LARGEUR, h: 0.008, fill: { color: FILET },
  });
  s.addText("Charte graphique du logo — Nicolas MILLOGO", {
    x: L, y: 6.95, w: 8, h: 0.28,
    fontFace: POLICE, fontSize: 9.5, color: ATTENUE,
  });
  s.addText(String(numero).padStart(2, "0"), {
    x: 13.33 - L - 1, y: 6.95, w: 1, h: 0.28, align: "right",
    fontFace: POLICE, fontSize: 9.5, bold: true, color: VIOLET,
  });
}

/** Legende sous un visuel. */
function legende(s, x, y, w, titre, texte) {
  s.addText(titre, {
    x, y, w, h: 0.24,
    fontFace: POLICE, fontSize: 11.5, bold: true, color: ENCRE,
  });
  s.addText(texte, {
    x, y: y + 0.24, w, h: 0.72,
    fontFace: POLICE, fontSize: 10, color: ATTENUE, lineSpacingMultiple: 1.2,
  });
}

// ---- 1. Couverture --------------------------------------------------------
{
  const s = pptx.addSlide();
  s.background = { color: VIOLET_FONCE };
  // Aplat d'accent a droite, pour ne pas laisser un fond nu.
  s.addShape(pptx.ShapeType.rect, {
    x: 8.6, y: 0, w: 4.73, h: 7.5, fill: { color: "3A0E47" },
  });
  s.addImage({ path: img("couleur-grand"), x: 9.55, y: 2.1, w: 2.9, h: 2.9 });
  s.addText("Charte graphique", {
    x: L, y: 2.28, w: 7.4, h: 0.34,
    fontFace: POLICE, fontSize: 13, bold: true, color: ORANGE, charSpacing: 3,
  });
  s.addText("Le logo,\nses règles d'emploi", {
    x: L, y: 2.72, w: 7.4, h: 1.7,
    fontFace: POLICE, fontSize: 40, bold: true, color: BLANC, lineSpacingMultiple: 1.05,
  });
  s.addText("Nicolas MILLOGO — Ingénieur logiciel", {
    x: L, y: 4.62, w: 7.4, h: 0.3,
    fontFace: POLICE, fontSize: 14, color: "D8C7DE",
  });
  s.addText(
    "Document de référence. Ce qui n'y figure pas ne doit pas être improvisé.",
    { x: L, y: 5.05, w: 7.4, h: 0.3, fontFace: POLICE, fontSize: 11, color: "A98FB3", italic: true }
  );
}

// ---- 2. Sommaire ----------------------------------------------------------
{
  const s = chapitre("", "Sommaire", null);
  const entrees = [
    ["01", "La marque", "Le signe et ses quatre parties"],
    ["02", "Construction", "Grille, coordonnées, épaisseurs"],
    ["03", "Couleurs", "Dégradés et contrastes mesurés"],
    ["04", "Zone de protection", "Le quart du diamètre"],
    ["05", "Versions", "Quatre, et pas d'autres"],
    ["06", "Tailles minimales", "Planchers par usage"],
    ["07", "Fonds admis", "Et ceux à éviter"],
    ["08", "Interdits", "Six altérations"],
    ["09", "Typographie", "Association signe et nom"],
    ["10", "Fichiers", "Sources et dérivés"],
  ];
  entrees.forEach(([num, titre, sous], i) => {
    const colonne = i < 5 ? 0 : 1;
    const rang = i % 5;
    const x = L + colonne * 6.2;
    const y = 1.55 + rang * 1.02;
    s.addText(num, {
      x, y, w: 0.62, h: 0.34, fontFace: POLICE, fontSize: 15, bold: true, color: VIOLET,
    });
    s.addText(titre, {
      x: x + 0.68, y, w: 4.5, h: 0.3, fontFace: POLICE, fontSize: 15, bold: true, color: ENCRE,
    });
    s.addText(sous, {
      x: x + 0.68, y: y + 0.3, w: 4.9, h: 0.3, fontFace: POLICE, fontSize: 11, color: ATTENUE,
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: y + 0.72, w: 5.6, h: 0.008, fill: { color: FILET },
    });
  });
}

// ---- 3. La marque ---------------------------------------------------------
{
  const s = chapitre(
    "01",
    "La marque",
    "Un signe unique, indissociable : un disque en dégradé violet portant le symbole chevron-barre-chevron. Les trois éléments sont échelonnés en diagonale, du haut à gauche vers le bas à droite. Cette diagonale est la caractéristique du signe ; elle ne se redresse pas."
  );
  s.addImage({ path: img("couleur-grand"), x: L + 0.5, y: 2.3, w: 3.5, h: 3.5 });
  const parties = [
    ["Le disque", "Support du signe. Dégradé diagonal, jamais un aplat."],
    ["Le chevron gauche", "En haut à gauche. Dégradé bleu vers turquoise."],
    ["La barre oblique", "Traverse le signe. Toujours blanche."],
    ["Le chevron droit", "En bas à droite. Dégradé rouge vers orange."],
  ];
  parties.forEach(([t, d], i) => {
    const y = 2.42 + i * 0.86;
    s.addShape(pptx.ShapeType.rect, { x: 5.4, y, w: 0.05, h: 0.62, fill: { color: VIOLET } });
    s.addText(t, { x: 5.65, y, w: 6.8, h: 0.28, fontFace: POLICE, fontSize: 14, bold: true, color: ENCRE });
    s.addText(d, { x: 5.65, y: y + 0.29, w: 6.9, h: 0.3, fontFace: POLICE, fontSize: 11.5, color: ATTENUE });
  });
}

// ---- 4. Construction ------------------------------------------------------
{
  const s = chapitre(
    "02",
    "Construction",
    "Le signe est tracé sur une grille de 64 × 64 unités. Le disque occupe tout le cadre : centre 32, 32, rayon 32. Aucune marge n'est intégrée au fichier."
  );
  s.addImage({ path: img("bloc-construction"), x: L, y: 2.06, w: 4.5, h: 4.5 });
  s.addTable(
    [
      [
        { text: "Élément", options: { bold: true, color: ATTENUE, fontSize: 10 } },
        { text: "Points", options: { bold: true, color: ATTENUE, fontSize: 10 } },
        { text: "Trait", options: { bold: true, color: ATTENUE, fontSize: 10 } },
      ],
      ["Chevron gauche", "30,6 · 17,2\n19,1 · 26,8\n29,6 · 36,3", "4,6"],
      ["Barre oblique", "38,2 · 17,2\n28,7 · 46,8", "4,0"],
      ["Chevron droit", "36,3 · 28,7\n46,8 · 37,7\n37,2 · 46,8", "4,6"],
    ],
    {
      x: 5.6, y: 2.16, w: 7.0, colW: [2.4, 3.1, 1.5],
      fontFace: POLICE, fontSize: 11.5, color: ENCRE,
      border: [{ type: "none" }, { type: "none" }, { pt: 0.5, color: FILET }, { type: "none" }],
      rowH: [0.34, 0.78, 0.6, 0.78], valign: "top",
    }
  );
  s.addText(
    "Extrémités et angles arrondis. En pointillé orange, la boîte du symbole : 32,3 × 34,2 unités, centrée verticalement, décalée de 0,95 unité à droite du centre — ce léger déport optique compense la diagonale et se conserve.",
    { x: 5.6, y: 5.35, w: 7.0, h: 1.0, fontFace: POLICE, fontSize: 10.5, color: ATTENUE, lineSpacingMultiple: 1.25 }
  );
}

// ---- 5. Couleurs ----------------------------------------------------------
{
  const s = chapitre("03", "Couleurs", "Trois dégradés et un blanc. Chaque dégradé est linéaire et suit la diagonale du signe.");
  const cols = [
    ["Disque", "sw-disque", "#2F0939 → #85199E", "135°, arrêts 0 % et 100 %"],
    ["Chevron gauche", "sw-gauche", "#2B7FB4 → #3FD3C6", "Bleu vers turquoise"],
    ["Chevron droit", "sw-droit", "#E8452F → #F79420", "Rouge vers orange"],
    ["Barre oblique", "sw-barre", "#FFFFFF", "Blanc pur, sans variante"],
  ];
  cols.forEach(([nom, bande, valeur, note], i) => {
    const x = L + i * 3.08;
    // Image plutot que deux aplats accoles : le degrade doit se lire comme un
    // degrade, pas comme deux couleurs separees par une arete.
    s.addImage({ path: img(bande), x, y: 2.2, w: 2.82, h: 1.72 });
    s.addText(nom, { x, y: 4.02, w: 2.82, h: 0.28, fontFace: POLICE, fontSize: 13, bold: true, color: ENCRE });
    s.addText(valeur, { x, y: 4.3, w: 2.82, h: 0.26, fontFace: "Consolas", fontSize: 10.5, color: VIOLET });
    s.addText(note, { x, y: 4.56, w: 2.82, h: 0.26, fontFace: POLICE, fontSize: 10, color: ATTENUE });
  });
  s.addText(
    "Réserve. Ces valeurs sont relevées sur les pixels de cœur du logo d'origine, un raster de 78 px dont l'antialiasing avait mélangé tous les contours avec le violet du fond, puis leur saturation a été restaurée. Fidèles à l'œil, non garanties identiques au fichier source initial.",
    { x: L + 0.14, y: 5.25, w: LARGEUR - 0.3, h: 0.9, fontFace: POLICE, fontSize: 10.5, color: ATTENUE, lineSpacingMultiple: 1.25 }
  );
  s.addShape(pptx.ShapeType.rect, { x: L, y: 5.25, w: 0.045, h: 0.78, fill: { color: ORANGE } });
}

// ---- 6. Contrastes --------------------------------------------------------
{
  const s = chapitre(
    "03",
    "Contrastes mesurés",
    "Rapports calculés selon la formule de luminance relative des WCAG, face au violet le plus clair du disque (#85199E), qui est le cas le moins favorable."
  );
  s.addTable(
    [
      ["Paire", "Rapport", "Seuil requis", "Verdict"].map((t) => ({
        text: t, options: { bold: true, color: ATTENUE, fontSize: 11 },
      })),
      ["Barre blanche sur disque", "7,98 : 1", "3 : 1", "Largement tenu"],
      ["Chevron turquoise sur disque", "4,31 : 1", "3 : 1", "Tenu"],
      ["Chevron orange sur disque", "3,50 : 1", "3 : 1", "Tenu, sans marge"],
      ["Blanc sur violet foncé", "17,2 : 1", "3 : 1", "Largement tenu"],
    ],
    {
      x: L, y: 2.35, w: LARGEUR, colW: [4.6, 2.4, 2.4, 2.49],
      fontFace: POLICE, fontSize: 13, color: ENCRE, rowH: 0.52, valign: "middle",
      border: [{ type: "none" }, { type: "none" }, { pt: 0.5, color: FILET }, { type: "none" }],
    }
  );
  s.addText(
    "Le seuil de 3 : 1 est celui des éléments graphiques porteurs de sens (WCAG 1.4.11).",
    { x: L, y: 5.1, w: LARGEUR, h: 0.3, fontFace: POLICE, fontSize: 11, color: ATTENUE }
  );
  s.addShape(pptx.ShapeType.roundRect, {
    x: L, y: 5.55, w: LARGEUR, h: 0.85, rectRadius: 0.06,
    fill: { color: SURFACE }, line: { color: FILET, width: 0.75 },
  });
  s.addText(
    "Conséquence directe : le chevron orange est le point le plus juste, à 3,50 pour un seuil de 3. Sa teinte ne doit donc jamais être éclaircie.",
    { x: L + 0.28, y: 5.72, w: LARGEUR - 0.56, h: 0.55, fontFace: POLICE, fontSize: 12, color: ENCRE, bold: true }
  );
}

// ---- 7. Zone de protection ------------------------------------------------
{
  const s = chapitre(
    "04",
    "Zone de protection",
    "Aucun texte, filet, bord de page ni autre logo ne doit entrer dans une couronne de 16 unités de la grille autour du disque, soit le quart de son diamètre. La règle est proportionnelle : elle vaut à toute taille."
  );
  s.addImage({ path: img("bloc-protection"), x: L + 0.3, y: 2.1, w: 4.3, h: 4.3 });
  const cas = [
    ["28 px de diamètre", "En-tête du site → couronne de 7 px"],
    ["56 px de diamètre", "Pied de page → couronne de 14 px"],
    ["20 mm de diamètre", "Support imprimé → couronne de 5 mm"],
    ["Seule exception", "Les icônes d'application, où le système impose son propre cadrage à fond perdu"],
  ];
  cas.forEach(([t, d], i) => {
    const y = 2.35 + i * 1.0;
    s.addText(t, { x: 5.7, y, w: 6.9, h: 0.3, fontFace: POLICE, fontSize: 14, bold: true, color: ENCRE });
    s.addText(d, { x: 5.7, y: y + 0.32, w: 6.9, h: 0.5, fontFace: POLICE, fontSize: 11.5, color: ATTENUE, lineSpacingMultiple: 1.2 });
  });
}

// ---- 8. Versions ----------------------------------------------------------
{
  const s = chapitre("05", "Versions", "Quatre versions, et pas d'autres. La version en couleur est la règle ; les trois autres répondent à une contrainte technique précise.");
  const v = [
    ["v-couleur", "Couleur", "Version principale. Tout emploi numérique et toute impression en quadrichromie."],
    ["v-mono-pos", "Monochrome positif", "Disque à l'encre, symbole en réserve. Une seule encre, gravure, tampon."],
    ["v-mono-neg", "Monochrome négatif", "Même tracé sur fond sombre. La réserve prend la couleur du fond."],
    ["v-carre", "Fond perdu", "Carré plein, réservé aux icônes d'application masquées par le système."],
  ];
  v.forEach(([fichier, titre, texte], i) => {
    const x = L + i * 3.08;
    s.addImage({ path: img(fichier), x, y: 2.2, w: 2.82, h: 2.07 });
    legende(s, x, 4.45, 2.82, titre, texte);
  });
}

// ---- 9. Tailles -----------------------------------------------------------
{
  const s = chapitre("06", "Tailles minimales", "Le symbole est dense : trois éléments dans un disque. Sous ces seuils, la barre oblique se confond avec les chevrons.");
  s.addImage({ path: img("echelle"), x: L, y: 2.0, w: 6.6, h: 2.81 });
  s.addText("Diamètres en pixels, proportions exactes.", {
    x: L, y: 4.86, w: 6.6, h: 0.3, fontFace: POLICE, fontSize: 10.5, color: ATTENUE, italic: true,
  });
  s.addTable(
    [
      ["Emploi", "Minimum", "Version"].map((t) => ({ text: t, options: { bold: true, color: ATTENUE, fontSize: 10.5 } })),
      ["Icône d'onglet, favicon", "16 px", "Couleur"],
      ["Interface, à côté d'un texte", "24 px", "Couleur"],
      ["Impression quadrichromie", "8 mm", "Couleur"],
      ["Impression une encre, gravure", "12 mm", "Monochrome"],
    ],
    {
      x: 7.6, y: 2.1, w: 5.0, colW: [2.7, 1.15, 1.15],
      fontFace: POLICE, fontSize: 11, color: ENCRE, rowH: 0.46, valign: "middle",
      border: [{ type: "none" }, { type: "none" }, { pt: 0.5, color: FILET }, { type: "none" }],
    }
  );
  s.addText(
    "Le plancher est plus haut en monochrome : sans les couleurs pour séparer les trois éléments, la réserve a besoin de plus de place.",
    { x: 7.6, y: 4.5, w: 5.0, h: 0.8, fontFace: POLICE, fontSize: 10.5, color: ATTENUE, lineSpacingMultiple: 1.25 }
  );
}

// ---- 10. Fonds ------------------------------------------------------------
{
  const s = chapitre("07", "Fonds admis", "Le disque porte sa propre couleur : il n'a besoin ni de cartouche, ni de filet, ni d'ombre pour se détacher.");
  const f = [
    ["f-clair", "Blanc et neutres clairs", "Emploi de référence."],
    ["f-gris", "Gris de surface", "Jusqu'à environ 12 % de valeur."],
    ["f-sombre", "Fonds sombres", "Version couleur inchangée, aucun halo."],
    ["f-photo", "Photographie", "Passer en monochrome négatif."],
    ["f-violet", "Violet de la marque", "Monochrome blanc uniquement."],
  ];
  f.forEach(([fichier, titre, texte], i) => {
    const x = L + i * 2.46;
    s.addImage({ path: img(fichier), x, y: 2.2, w: 2.24, h: 1.64 });
    legende(s, x, 4.0, 2.3, titre, texte);
  });
  s.addShape(pptx.ShapeType.roundRect, {
    x: L, y: 5.5, w: LARGEUR, h: 0.9, rectRadius: 0.06,
    fill: { color: SURFACE }, line: { color: FILET, width: 0.75 },
  });
  s.addText(
    "À éviter : tout fond dont la teinte est proche du violet du disque, et les gris moyens entre 35 % et 65 %, où le disque perd son contour.",
    { x: L + 0.28, y: 5.68, w: LARGEUR - 0.56, h: 0.55, fontFace: POLICE, fontSize: 12, color: ENCRE }
  );
}

// ---- 11. Interdits --------------------------------------------------------
{
  const s = chapitre("08", "Ce qu'il ne faut pas faire", "Six altérations, montrées réellement appliquées. Aucune n'est négociable.");
  const i6 = [
    ["i-deforme", "Ne pas déformer", "Le disque reste un cercle."],
    ["i-tourne", "Ne pas faire tourner", "La diagonale est l'axe de lecture."],
    ["i-recolore", "Ne pas recolorer", "Les couleurs sont fixées en 03."],
    ["i-ombre", "Ne pas ajouter d'ombre", "C'était le défaut du fichier d'origine."],
    ["i-cerne", "Ne pas cerner", "Ni contour, ni cartouche."],
    ["i-affaibli", "Ne pas affaiblir", "Les contrastes ne tiennent plus."],
  ];
  i6.forEach(([fichier, titre, texte], i) => {
    const colonne = i % 3;
    const rang = Math.floor(i / 3);
    const x = L + colonne * 4.12;
    const y = 2.12 + rang * 2.34;
    s.addImage({ path: img(fichier), x, y, w: 2.5, h: 1.83 });
    s.addShape(pptx.ShapeType.rect, {
      x, y, w: 2.5, h: 1.83, fill: { type: "none" }, line: { color: "DC2626", width: 1.25 },
    });
    s.addText(titre, { x: x + 2.66, y: y + 0.42, w: 1.4, h: 0.3, fontFace: POLICE, fontSize: 11.5, bold: true, color: ENCRE });
    s.addText(texte, { x: x + 2.66, y: y + 0.72, w: 1.42, h: 0.6, fontFace: POLICE, fontSize: 9.5, color: ATTENUE, lineSpacingMultiple: 1.2 });
  });
}

// ---- 12. Typographie ------------------------------------------------------
{
  const s = chapitre("09", "Typographie associée", "La marque n'a pas de logotype : le nom s'écrit dans la typographie courante du support. Sur le site, une pile système Helvetica, aucune police n'étant téléchargée.");
  s.addShape(pptx.ShapeType.roundRect, {
    x: L, y: 2.15, w: LARGEUR, h: 1.3, rectRadius: 0.06,
    fill: { color: SURFACE }, line: { color: FILET, width: 0.75 },
  });
  s.addImage({ path: img("lockup"), x: L + 0.3, y: 2.32, w: 5.5, h: 1.02 });
  s.addTable(
    [
      ["Nom", "Graisse 700, interlettrage −0,015 em. « Nicolas » en casse courante, « MILLOGO » en capitales."],
      ["Fonction", "Graisse 400 ou 500, en gris atténué, jamais en capitales."],
      ["Association", "Signe à gauche, texte à droite, aligné sur le centre optique du disque. L'écart vaut un quart du diamètre."],
      ["Pile", "-apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, sans-serif"],
    ],
    {
      x: L, y: 3.75, w: LARGEUR, colW: [2.2, 9.69],
      fontFace: POLICE, fontSize: 11.5, color: ENCRE, rowH: 0.56, valign: "middle",
      border: [{ type: "none" }, { type: "none" }, { pt: 0.5, color: FILET }, { type: "none" }],
    }
  );
}

// ---- 13. Fichiers ---------------------------------------------------------
{
  const s = chapitre("10", "Fichiers", "Le tracé fait autorité en vectoriel. Les fichiers matriciels sont des produits dérivés, à régénérer et non à retoucher.");
  s.addTable(
    [
      ["Fichier", "Rôle", "Nature"].map((t) => ({ text: t, options: { bold: true, color: ATTENUE, fontSize: 10.5 } })),
      ["src/components/Logo.tsx", "La marque dans l'interface du site, en SVG intégré.", "Source"],
      ["src/app/icon.svg", "Icône d'onglet vectorielle. Même tracé, à tenir synchronisé.", "Source"],
      ["src/app/favicon.ico", "Icône héritée, trois tailles : 16, 32, 48.", "Dérivé"],
      ["src/app/apple-icon.png", "Icône iOS, 180 px, version à fond perdu.", "Dérivé"],
      ["scripts/generate-icons.mjs", "Régénère les deux dérivés depuis icon.svg.", "Outil"],
    ],
    {
      x: L, y: 2.3, w: LARGEUR, colW: [4.0, 6.4, 1.49],
      fontFace: POLICE, fontSize: 11.5, color: ENCRE, rowH: 0.5, valign: "middle",
      border: [{ type: "none" }, { type: "none" }, { pt: 0.5, color: FILET }, { type: "none" }],
    }
  );
  s.addText(
    "Deux fichiers portent le même tracé, Logo.tsx et icon.svg : duplication assumée, Next.js exigeant un fichier autonome pour l'icône. Toute retouche doit être reportée dans les deux, puis les dérivés régénérés.",
    { x: L, y: 5.3, w: LARGEUR, h: 0.8, fontFace: POLICE, fontSize: 11, color: ATTENUE, lineSpacingMultiple: 1.25 }
  );
}

// ---- 14. Dos --------------------------------------------------------------
{
  const s = pptx.addSlide();
  s.background = { color: VIOLET_FONCE };
  s.addImage({ path: img("couleur-grand"), x: 5.77, y: 2.0, w: 1.8, h: 1.8 });
  s.addText("Nicolas MILLOGO", {
    x: 0, y: 4.1, w: 13.33, h: 0.4, align: "center",
    fontFace: POLICE, fontSize: 20, bold: true, color: BLANC,
  });
  s.addText("Ingénieur logiciel — Ouagadougou, Burkina Faso", {
    x: 0, y: 4.55, w: 13.33, h: 0.3, align: "center",
    fontFace: POLICE, fontSize: 12, color: "D8C7DE",
  });
  s.addText("Une question, un cas non prévu par ce document ? Demandez une version plutôt que d'improviser.", {
    x: 2.4, y: 5.2, w: 8.53, h: 0.3, align: "center",
    fontFace: POLICE, fontSize: 11, color: "A98FB3", italic: true,
  });
}

await pptx.writeFile({ fileName: DESTINATION });
console.log(`ecrit : ${DESTINATION}`);
