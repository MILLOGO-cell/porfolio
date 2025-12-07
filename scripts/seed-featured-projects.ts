import { config } from 'dotenv';
import { resolve } from 'path';

// Charger .env
config({ path: resolve(process.cwd(), '.env') });

// Importer le client Prisma configuré
import { prisma } from '../src/lib/db.js';

async function main() {
  console.log('🌱 Début du seed des projets...');

  try {
    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données établie');

    // Itouch
    const itouch = await prisma.project.upsert({
      where: { id: 'itouch-app' },
      update: {
        title: 'Itouch App',
        description: 'Une application complète pour la gestion des bars et restaurants, intégrant la gestion des employés, des salaires, et la génération automatisée des fiches de paie, pour une gestion simplifiée et efficace.',
        url: 'https://example.com',
        imageUrl: '/itouch.png',
        tags: ['DESIGN UX/UI', 'Mobile', 'Restaurant'],
        featured: true,
      },
      create: {
        id: 'itouch-app',
        title: 'Itouch App',
        description: 'Une application complète pour la gestion des bars et restaurants, intégrant la gestion des employés, des salaires, et la génération automatisée des fiches de paie, pour une gestion simplifiée et efficace.',
        url: 'https://example.com',
        imageUrl: '/itouch.png',
        tags: ['DESIGN UX/UI', 'Mobile', 'Restaurant'],
        featured: true,
      },
    });
    console.log('✅ Itouch App créé/mis à jour:', itouch.title);

    // Agropole
    const agropole = await prisma.project.upsert({
      where: { id: 'agropole' },
      update: {
        title: 'Agropole',
        description: "Agropole est une plateforme complète dédiée à l'agriculture, offrant une marketplace pour l'achat et la vente de produits agricoles avec commandes et paiements en ligne, ainsi qu'un service de prévisions météorologiques pour aider les agriculteurs à suivre les conditions climatiques.",
        url: 'https://example.com',
        imageUrl: '/agropole.png',
        tags: ['AGRICULTURE INNOVANTE', 'E-commerce', 'Météo'],
        featured: true,
      },
      create: {
        id: 'agropole',
        title: 'Agropole',
        description: "Agropole est une plateforme complète dédiée à l'agriculture, offrant une marketplace pour l'achat et la vente de produits agricoles avec commandes et paiements en ligne, ainsi qu'un service de prévisions météorologiques pour aider les agriculteurs à suivre les conditions climatiques.",
        url: 'https://example.com',
        imageUrl: '/agropole.png',
        tags: ['AGRICULTURE INNOVANTE', 'E-commerce', 'Météo'],
        featured: true,
      },
    });
    console.log('✅ Agropole créé/mis à jour:', agropole.title);

    // Exclusivity
    const exclusivity = await prisma.project.upsert({
      where: { id: 'exclusivity' },
      update: {
        title: 'Exclusivity',
        description: "Exclusivity est un réseau social dédié aux échanges exclusifs entre utilisateurs, intégrant une gestion de followers pour suivre et interagir avec les publications. Il permet de partager du contenu, de gérer son audience et de créer des interactions personnalisées dans un environnement sécurisé et convivial.",
        url: 'https://example.com',
        imageUrl: '/exclusivity.png',
        tags: ['INNOVATION UNIQUE', 'Social Media', 'Networking'],
        featured: true,
      },
      create: {
        id: 'exclusivity',
        title: 'Exclusivity',
        description: "Exclusivity est un réseau social dédié aux échanges exclusifs entre utilisateurs, intégrant une gestion de followers pour suivre et interagir avec les publications. Il permet de partager du contenu, de gérer son audience et de créer des interactions personnalisées dans un environnement sécurisé et convivial.",
        url: 'https://example.com',
        imageUrl: '/exclusivity.png',
        tags: ['INNOVATION UNIQUE', 'Social Media', 'Networking'],
        featured: true,
      },
    });
    console.log('✅ Exclusivity créé/mis à jour:', exclusivity.title);

    console.log('\n🎉 Tous les projets en vedette ont été créés/mis à jour avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Déconnexion de Prisma');
  });