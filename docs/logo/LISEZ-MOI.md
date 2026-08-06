# Logo Nicolas MILLOGO — quel fichier pour quoi

Règle générale : **prendre le SVG dès que l'outil l'accepte**, un PNG sinon, un
JPEG seulement si l'outil refuse le PNG.

Les règles d'emploi (zone de protection, tailles minimales, interdits) sont dans
`../charte-graphique-logo.pptx`.

## Par usage

| Ce que tu fais | Fichier à prendre |
|---|---|
| **Site web** — interface, en-tête, pied de page | `svg/logo-couleur.svg` (dans le portfolio, c'est déjà `src/components/Logo.tsx`) |
| **Icône d'onglet** d'un site | `svg/logo-couleur.svg`, avec repli `png/couleur/logo-couleur-32.png` |
| **Maquette** — Figma, Sketch, Penpot | `svg/logo-couleur.svg` : vectoriel, redimensionnable sans perte, couleurs modifiables |
| **Application mobile iOS** | `png/fond-perdu/logo-fond-perdu-1024.png` pour l'App Store, `-180.png` pour l'appareil |
| **Application mobile Android** | `png/fond-perdu/logo-fond-perdu-512.png` pour le Play Store, `-192.png` pour l'appareil |
| **Word, PowerPoint, Google Docs** | `png/couleur/logo-couleur-512.png` (ou `-1024` si le logo est grand dans la page) |
| **Réseaux sociaux** — photo de profil | `png/fond-perdu/logo-fond-perdu-512.png` : la plateforme masque les coins elle-même |
| **Signature de courriel** | `png/couleur/logo-couleur-64.png` |
| **Sur une photographie** ou un fond chargé | `svg/logo-monochrome-negatif.svg` |
| **Impression en couleur** | `svg/logo-couleur.svg`, à défaut `png/couleur/logo-couleur-2048.png` |
| **Impression en une seule encre**, gravure, tampon | `svg/logo-monochrome-positif.svg` |
| **Outil qui refuse le PNG** | `jpeg/` — voir la réserve plus bas |
| **Texte, filigrane, pictogramme seul** | `svg/logo-symbole.svg` : il prend la couleur du texte environnant |

## Les cinq versions

| Version | À quoi elle sert |
|---|---|
| **couleur** | La règle. Partout où la couleur est possible. |
| **monochrome-positif** | Disque sombre, symbole détouré. Une seule encre, ou fond clair chargé. |
| **monochrome-negatif** | Disque clair, symbole détouré. Fonds sombres et photographies. |
| **fond-perdu** | Carré plein. Uniquement les icônes que le système masque lui-même (iOS, Android, réseaux sociaux). |
| **symbole** | Le signe sans son disque, en `currentColor`. Pour un pictogramme dans du texte. |

Les deux monochromes ont un symbole **réellement transparent** : ils se posent
sur n'importe quel fond, qui apparaît à travers le détourage.

## Les tailles

`16 · 24 · 32 · 48 · 64 · 128 · 180 · 192 · 256 · 512 · 1024 · 2048`

Chacune correspond à un usage, aucune n'est décorative : 16/32/48 pour les icônes
d'onglet, 180 pour iOS, 192 pour Android, 512 pour les magasins d'applications et
les réseaux sociaux, 1024 pour l'App Store, 2048 pour l'impression.

**Planchers à respecter :** 16 px pour une icône d'onglet, 24 px dès que le logo
est à côté d'un texte, 8 mm en impression couleur, 12 mm en monochrome — sans les
couleurs pour séparer les trois éléments, le détourage a besoin de plus de place.

## Deux réserves

**Le JPEG est un mauvais format pour un logo.** Il ne gère pas la transparence,
et sa compression produit des salissures autour des contours nets. Les fichiers
sont fournis parce que certains outils n'acceptent rien d'autre ; partout
ailleurs, prendre le PNG ou le SVG. Deux fonds sont proposés, blanc et violet de
marque, parce qu'un JPEG impose forcément un fond.

**Les couleurs sont reconstituées.** Elles ont été relevées sur les pixels de
cœur du logo d'origine, un raster de 78 px dont l'antialiasing avait mélangé tous
les contours avec le violet du fond, puis leur saturation a été restaurée. Elles
sont fidèles à l'œil, non garanties identiques au fichier source initial.

## Régénérer

Tous ces fichiers descendent du même tracé que `src/components/Logo.tsx`. Le jour
où le logo change, ils sont régénérables à l'identique — rien n'a été retouché à
la main :

```bash
npx playwright install chromium                    # une seule fois
node scripts/export-logo-assets.mjs docs/logo      # ce dossier
node scripts/generate-icons.mjs                    # favicon.ico et apple-icon.png
```

La charte se régénère de la même façon, avec
`scripts/render-charte-visuals.mjs` puis `scripts/build-charte-pptx.mjs` — voir
l'en-tête de chaque script.

`planche-controle.png` montre l'ensemble tel qu'il a été vérifié : les versions
en couleur sur damier pour la transparence, les monochromes sur fond clair, sur
damier et sur fond sombre, et les SVG agrandis.
