// Rend en PNG haute definition tous les visuels de la charte, depuis le meme
// trace SVG que le logo du site. Un seul document, une capture par selecteur.
//
//   npx playwright install chromium
//   node scripts/render-charte-visuals.mjs <dossier-de-sortie>
//
// Premiere etape avant build-charte-pptx.mjs, qui consomme ces PNG.
import { chromium } from "playwright";
import { join } from "node:path";

const SORTIE = process.argv[2];

/** Definitions partagees : degrades et symboles. */
const DEFS = `
<svg style="position:absolute;width:0;height:0" aria-hidden="true"><defs>
  <linearGradient id="gc" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2f0939"/><stop offset="1" stop-color="#85199e"/>
  </linearGradient>
  <linearGradient id="gg" x1="0.5" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="#2b7fb4"/><stop offset="1" stop-color="#3fd3c6"/>
  </linearGradient>
  <linearGradient id="gd" x1="0.4" y1="0" x2="0.6" y2="1">
    <stop offset="0" stop-color="#e8452f"/><stop offset="1" stop-color="#f79420"/>
  </linearGradient>

  <symbol id="couleur" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="32" fill="url(#gc)"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="url(#gg)" stroke-width="4.6"/>
      <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#fff" stroke-width="4"/>
      <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="url(#gd)" stroke-width="4.6"/>
    </g>
  </symbol>

  <!--
    Monochrome. La barre oblique chevauche le chevron gauche d'environ 1,8
    unite : en couleur elle passe par-dessus et le croisement reste net, mais
    d'une seule couleur les deux formes fusionnent et le symbole devient
    illisible. On redonne donc un degagement de 0,9 unite autour de la barre,
    en la doublant d'un trait plus large de la couleur de l'encre.
  -->
  <symbol id="mono" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="32" fill="var(--encre)"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="var(--sol)" stroke-width="4.6"/>
      <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="var(--sol)" stroke-width="4.6"/>
      <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="var(--encre)" stroke-width="5.8"/>
      <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="var(--sol)" stroke-width="4"/>
    </g>
  </symbol>

  <symbol id="carre" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="url(#gc)"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="url(#gg)" stroke-width="4.6"/>
      <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#fff" stroke-width="4"/>
      <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="url(#gd)" stroke-width="4.6"/>
    </g>
  </symbol>

  <symbol id="construction" viewBox="-5 -5 74 74">
    <g stroke="#b445d0" stroke-width="0.25" opacity="0.55">
      <path d="M0 0h64v64H0z" fill="none"/>
      <path d="M16 0v64M32 0v64M48 0v64M0 16h64M0 32h64M0 48h64"/>
    </g>
    <circle cx="32" cy="32" r="32" fill="none" stroke="#85199e" stroke-width="0.5"/>
    <rect x="16.8" y="14.9" width="32.3" height="34.2" fill="none"
          stroke="#f79420" stroke-width="0.5" stroke-dasharray="1.6 1.2"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="#2b7fb4" stroke-width="4.6"/>
      <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#6b6472" stroke-width="4"/>
      <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="#f79420" stroke-width="4.6"/>
    </g>
    <g fill="#85199e">
      <circle cx="30.6" cy="17.2" r="0.8"/><circle cx="19.1" cy="26.8" r="0.8"/>
      <circle cx="29.6" cy="36.3" r="0.8"/><circle cx="38.2" cy="17.2" r="0.8"/>
      <circle cx="28.7" cy="46.8" r="0.8"/><circle cx="36.3" cy="28.7" r="0.8"/>
      <circle cx="46.8" cy="37.7" r="0.8"/><circle cx="37.2" cy="46.8" r="0.8"/>
    </g>
  </symbol>

  <symbol id="protection" viewBox="-18 -18 100 100">
    <rect x="-16" y="-16" width="96" height="96" fill="#85199e" opacity="0.08"/>
    <rect x="-16" y="-16" width="96" height="96" fill="none" stroke="#85199e"
          stroke-width="0.6" stroke-dasharray="3 2" opacity="0.7"/>
    <circle cx="32" cy="32" r="32" fill="url(#gc)"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="30.6,17.2 19.1,26.8 29.6,36.3" stroke="url(#gg)" stroke-width="4.6"/>
      <line x1="38.2" y1="17.2" x2="28.7" y2="46.8" stroke="#fff" stroke-width="4"/>
      <polyline points="36.3,28.7 46.8,37.7 37.2,46.8" stroke="url(#gd)" stroke-width="4.6"/>
    </g>
    <g stroke="#f79420" stroke-width="0.7">
      <path d="M-16 32h16M64 32h16M32 -16v16M32 64v16"/>
    </g>
    <g fill="#f79420" font-family="Arial" font-size="6.5" font-weight="bold">
      <text x="-14" y="29.5">16</text><text x="66" y="29.5">16</text>
      <text x="33.5" y="-8">16</text><text x="33.5" y="76">16</text>
    </g>
  </symbol>
</defs></svg>`;

const M = (id, taille, style = "") =>
  `<svg style="width:${taille}px;height:${taille}px;${style}"><use href="#${id}"/></svg>`;

/** Une vignette de fond, pour les sections « fonds » et « interdits ». */
const tuile = (fond, contenu, extra = "") =>
  `<div style="width:300px;height:220px;display:grid;place-items:center;background:${fond};${extra}">${contenu}</div>`;

/** Bandes de degrade, en vrai CSS : PowerPoint ne rend pas un degrade a deux
 *  arrets de facon fiable selon les versions, autant livrer des images. */
const BANDES = [
  ["disque", "linear-gradient(135deg,#2f0939,#85199e)", ""],
  ["gauche", "linear-gradient(170deg,#2b7fb4,#3fd3c6)", ""],
  ["droit", "linear-gradient(160deg,#e8452f,#f79420)", ""],
  ["barre", "#ffffff", "box-shadow:inset 0 0 0 2px #e7e1ea;"],
]
  .map(
    ([nom, fond, extra]) =>
      `<div id="sw-${nom}" style="width:560px;height:340px;border-radius:22px;background:${fond};${extra}"></div>`
  )
  .join("");

// Fond transparent : `omitBackground` n'a d'effet que si rien ne peint dessous.
// Les vignettes qui ont besoin d'un fond le declarent elles-memes.
const PAGE = `<body style="margin:0;background:transparent;font-family:Arial,Helvetica,sans-serif">
${DEFS}
<div style="display:flex;flex-direction:column;gap:0;align-items:flex-start">

  <div id="couleur-grand" style="width:520px;height:520px;display:grid;place-items:center">${M("couleur", 480)}</div>

  <div id="bloc-construction" style="width:560px;height:560px;display:grid;place-items:center">${M("construction", 520)}</div>

  <div id="bloc-protection" style="width:560px;height:560px;display:grid;place-items:center">${M("protection", 520)}</div>

  <!-- Echelle : tailles relatives exactes, alignees sur la ligne de base. -->
  <div id="echelle" style="width:fit-content;height:200px;display:flex;align-items:flex-end;gap:46px;padding:0 30px;background:#fff">
    ${[96, 56, 32, 24, 16]
      .map(
        (t) =>
          `<div style="display:flex;flex-direction:column;align-items:center;gap:12px">
             ${M("couleur", t)}
             <span style="font:700 15px Arial;color:#6b6472">${t}</span>
           </div>`
      )
      .join("")}
  </div>

  ${BANDES}

  <div id="v-couleur">${tuile("#ffffff", M("couleur", 150), "border:1px solid #e7e1ea")}</div>
  <div id="v-mono-pos">${tuile("#ffffff", M("mono", 150), "border:1px solid #e7e1ea;--sol:#ffffff;--encre:#1a1420")}</div>
  <div id="v-mono-neg">${tuile("#0b080d", M("mono", 150), "--sol:#0b080d;--encre:#f7f4f9")}</div>
  <div id="v-carre">${tuile("#ffffff", M("carre", 150, "border-radius:34px"), "border:1px solid #e7e1ea")}</div>

  <div id="f-clair">${tuile("#ffffff", M("couleur", 130), "border:1px solid #e7e1ea")}</div>
  <div id="f-gris">${tuile("#f4f4f5", M("couleur", 130))}</div>
  <div id="f-sombre">${tuile("#0b080d", M("couleur", 130))}</div>
  <div id="f-violet">${tuile("#2f0939", M("mono", 130), "--sol:#2f0939;--encre:#ffffff")}</div>
  <div id="f-photo">${tuile(
    "linear-gradient(135deg,#5c4a66,#2e2334)",
    M("mono", 130),
    "--sol:#4a3a52;--encre:#ffffff;background-image:radial-gradient(circle at 25% 30%,#7b5f86 0 22%,transparent 55%),radial-gradient(circle at 75% 70%,#3d2b46 0 26%,transparent 60%),linear-gradient(135deg,#5c4a66,#2e2334)"
  )}</div>

  <div id="i-deforme">${tuile("#ffffff", M("couleur", 130, "transform:scaleX(1.55)"), "border:1px solid #e7e1ea")}</div>
  <div id="i-tourne">${tuile("#ffffff", M("couleur", 130, "transform:rotate(22deg)"), "border:1px solid #e7e1ea")}</div>
  <div id="i-recolore">${tuile("#ffffff", M("couleur", 130, "filter:hue-rotate(150deg) saturate(1.3)"), "border:1px solid #e7e1ea")}</div>
  <div id="i-ombre">${tuile("#ffffff", M("couleur", 130, "filter:drop-shadow(0 10px 12px rgba(0,0,0,.5))"), "border:1px solid #e7e1ea")}</div>
  <div id="i-cerne">${tuile("#ffffff", M("couleur", 130, "border:5px solid #1a1420;border-radius:999px"), "border:1px solid #e7e1ea")}</div>
  <div id="i-affaibli">${tuile("#ffffff", M("couleur", 130, "opacity:.35"), "border:1px solid #e7e1ea")}</div>

  <!-- Association signe + nom, pour la section typographie. -->
  <div id="lockup" style="width:700px;height:130px;display:flex;align-items:center;gap:18px;padding:0 24px;background:#fff">
    ${M("couleur", 74)}
    <div style="display:flex;flex-direction:column;gap:2px">
      <span style="font:700 34px Arial;letter-spacing:-.02em;color:#1a1420">Nicolas MILLOGO</span>
      <span style="font:400 20px Arial;color:#6b6472">Ingénieur logiciel</span>
    </div>
  </div>

</div></body>`;

const navigateur = await chromium.launch({ channel: "chromium" });
const contexte = await navigateur.newContext({
  viewport: { width: 900, height: 900 },
  deviceScaleFactor: 3,
});
const page = await contexte.newPage();
await page.setContent(PAGE);
await page.waitForTimeout(600);

const cibles = [
  "couleur-grand", "bloc-construction", "bloc-protection", "echelle",
  "sw-disque", "sw-gauche", "sw-droit", "sw-barre",
  "v-couleur", "v-mono-pos", "v-mono-neg", "v-carre",
  "f-clair", "f-gris", "f-sombre", "f-violet", "f-photo",
  "i-deforme", "i-tourne", "i-recolore", "i-ombre", "i-cerne", "i-affaibli",
  "lockup",
];

let n = 0;
for (const id of cibles) {
  const el = await page.$(`#${id}`);
  if (!el) {
    console.log("INTROUVABLE :", id);
    continue;
  }
  await el.screenshot({
    path: join(SORTIE, `${id}.png`),
    omitBackground: true,
  });
  n++;
}
console.log(`${n} visuels rendus sur ${cibles.length}`);
await navigateur.close();
