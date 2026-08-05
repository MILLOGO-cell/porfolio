import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Amorce le compte administrateur au démarrage du conteneur, à partir des
 * variables d'environnement (configurables depuis Coolify).
 *
 * IMPORTANT — pourquoi ce script plutôt qu'une comparaison à la connexion :
 * la version précédente de `auth.ts` comparait `credentials.password` à
 * `process.env.ADMIN_PASSWORD` EN CLAIR, à chaque connexion. Toute personne
 * ayant accès aux variables du déploiement obtenait l'administration, sans
 * hachage, sans limitation de débit et sans second facteur. Ici, les variables
 * ne servent qu'une fois : le mot de passe est haché avec bcrypt puis stocké,
 * et la connexion passe par le chemin normal (bcrypt + 2FA + anti-force brute).
 *
 * Le script est idempotent : sans effet si le compte existe déjà. Il n'échoue
 * jamais le démarrage — un défaut d'amorçage ne doit pas empêcher le site
 * public de servir.
 *
 * Variables :
 *   ADMIN_EMAIL           requis
 *   ADMIN_PASSWORD        requis, 12 caractères minimum
 *   ADMIN_NAME            optionnel
 *   ADMIN_PASSWORD_RESET  optionnel — mettre à "true" pour RÉÉCRIRE le mot de
 *                         passe d'un compte existant (voie de secours en cas
 *                         de perte d'accès). À repasser à false ensuite.
 */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || null;
  const forceReset = process.env.ADMIN_PASSWORD_RESET === 'true';

  if (!email || !password) {
    console.log(
      '[ensure-admin] ADMIN_EMAIL ou ADMIN_PASSWORD absent : amorçage ignoré.'
    );
    return;
  }

  if (password.length < 12) {
    console.error(
      '[ensure-admin] ADMIN_PASSWORD doit contenir au moins 12 caractères. Amorçage ignoré.'
    );
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing && !forceReset) {
    console.log(`[ensure-admin] Le compte ${email} existe déjà.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { password: hashedPassword },
    });
    console.log(
      `[ensure-admin] Mot de passe de ${email} réécrit (ADMIN_PASSWORD_RESET=true).`
    );
    console.log(
      '[ensure-admin] Repassez ADMIN_PASSWORD_RESET à false et changez le mot de passe depuis les paramètres.'
    );
    return;
  }

  await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  console.log(`[ensure-admin] Compte administrateur créé : ${email}`);
  console.log(
    '[ensure-admin] Activez la double authentification depuis /protected_access/settings.'
  );
}

ensureAdmin()
  .catch((error) => {
    // On journalise sans propager : le site public doit démarrer même si
    // l'amorçage échoue.
    console.error('[ensure-admin] Échec de l’amorçage :', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
