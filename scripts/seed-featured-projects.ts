import { config } from 'dotenv';
import { resolve } from 'path';

// Charger .env
config({ path: resolve(process.cwd(), '.env') });

// Importer le client Prisma configuré
import { prisma } from '../src/lib/db.js';

/**
 * Les blocs d'étude de cas (context / role / challenges / outcome) ne sont
 * volontairement pas remplis ici : ils décrivent un travail réel et se
 * saisissent depuis l'administration, pas dans un script de démarrage.
 */
const projects = [
  {
    id: 'itouch-app',
    slug: 'itouch-app',
    title: 'Itouch App',
    description:
      'Une application complète pour la gestion des bars et restaurants, intégrant la gestion des employés, des salaires, et la génération automatisée des fiches de paie, pour une gestion simplifiée et efficace.',
    url: 'https://example.com',
    imageUrl: '/itouch.png',
    tags: ['DESIGN UX/UI', 'Mobile', 'Restaurant'],
    featured: true,
    position: 0,
  },
  {
    id: 'agropole',
    slug: 'agropole',
    title: 'Agropole',
    description:
      "Agropole est une plateforme complète dédiée à l'agriculture, offrant une marketplace pour l'achat et la vente de produits agricoles avec commandes et paiements en ligne, ainsi qu'un service de prévisions météorologiques pour aider les agriculteurs à suivre les conditions climatiques.",
    url: 'https://example.com',
    imageUrl: '/agropole.png',
    tags: ['AGRICULTURE INNOVANTE', 'E-commerce', 'Météo'],
    featured: true,
    position: 1,
  },
  {
    id: 'exclusivity',
    slug: 'exclusivity',
    title: 'Exclusivity',
    description:
      "Exclusivity est un réseau social dédié aux échanges exclusifs entre utilisateurs, intégrant une gestion de followers pour suivre et interagir avec les publications. Il permet de partager du contenu, de gérer son audience et de créer des interactions personnalisées dans un environnement sécurisé et convivial.",
    url: 'https://example.com',
    imageUrl: '/exclusivity.png',
    tags: ['INNOVATION UNIQUE', 'Social Media', 'Networking'],
    featured: true,
    position: 2,
  },
];

async function main() {
  console.log('Seed des projets en vedette...');

  await prisma.$connect();
  console.log('Connexion à la base de données établie.');

  for (const project of projects) {
    const { id, ...fields } = project;

    const saved = await prisma.project.upsert({
      where: { id },
      update: fields,
      create: { id, ...fields },
    });

    console.log(`- ${saved.title} (/projets/${saved.slug})`);
  }

  console.log(`\n${projects.length} projets créés ou mis à jour.`);
}

main()
  .catch((error) => {
    console.error('Erreur lors du seed :', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
