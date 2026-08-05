import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

/**
 * Normalise les visuels de projets dans `public/projets`.
 *
 * Les captures de sites arrivent en pleine résolution (2 à 3 Mo, largeurs
 * variables). Ce script les ramène à une largeur commune et les convertit en
 * WebP : le dépôt reste léger, et `next/image` part d'une source saine.
 *
 *   node scripts/optimize-project-images.mjs          # aperçu
 *   node scripts/optimize-project-images.mjs --write  # applique
 */
const DIR = 'public/projets';
const MAX_WIDTH = 1920;
const QUALITY = 82;

const write = process.argv.includes('--write');

const files = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f));

if (files.length === 0) {
  console.log('Aucune image à traiter.');
  process.exit(0);
}

for (const file of files) {
  const source = path.join(DIR, file);
  const target = path.join(DIR, `${path.parse(file).name}.webp`);

  const before = (await stat(source)).size;
  const meta = await sharp(source).metadata();
  const ratio = (meta.width / meta.height).toFixed(2);

  if (!write) {
    console.log(
      `${file.padEnd(28)} ${meta.width}x${meta.height} ratio ${ratio}  ${(before / 1024 / 1024).toFixed(2)} Mo`
    );
    continue;
  }

  await sharp(source)
    .resize({ width: Math.min(meta.width, MAX_WIDTH), withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(`${target}.tmp`);

  await rename(`${target}.tmp`, target);
  if (source !== target) await unlink(source);

  const after = (await stat(target)).size;
  console.log(
    `${file} -> ${path.basename(target)}  ${(before / 1024 / 1024).toFixed(2)} Mo -> ${(after / 1024).toFixed(0)} Ko`
  );
}

if (!write) {
  console.log('\nAperçu seulement. Relancer avec --write pour appliquer.');
}
