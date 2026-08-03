import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Crée le compte administrateur initial.
 *
 * Le mot de passe vient de l'environnement, jamais du code : la version
 * précédente embarquait `Admin123!` en dur dans le dépôt, ce qui revenait à
 * publier les identifiants d'administration.
 *
 *   ADMIN_EMAIL=… ADMIN_NAME=… ADMIN_PASSWORD=… npm run seed:admin
 */
async function createAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const name = process.env.ADMIN_NAME?.trim() || null;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      'Variables requises : ADMIN_EMAIL et ADMIN_PASSWORD (ADMIN_NAME optionnel).'
    );
    process.exitCode = 1;
    return;
  }

  if (password.length < 12) {
    console.error('ADMIN_PASSWORD doit contenir au moins 12 caractères.');
    process.exitCode = 1;
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.error('Un utilisateur existe déjà avec cet email.');
      process.exitCode = 1;
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 12),
      },
      select: { email: true, name: true },
    });

    console.log('Utilisateur admin créé.');
    console.log('Email :', user.email);
    console.log('Nom   :', user.name ?? '(non renseigné)');
    console.log('Activez la double authentification depuis les réglages.');
  } catch (error) {
    console.error('Erreur :', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
