export interface Projet {
  id: number;
  titre: string;
  image: string;
  description: string;
  status: "En cours" | "Terminé" | "En réflexion";
}

export const projets: Projet[] = [
  {
    id: 1,
    titre: "Agritech Hub",
    image: "https://placehold.co/600x400/ffefd5/ffdab9",
    description:
      "Agritech Hub est une plateforme visant à transformer le secteur agricole à travers l'intégration de solutions numériques. Ce projet en cours a pour but de connecter les agriculteurs aux marchés, leur fournir des prévisions météorologiques précises et permettre une gestion efficace des récoltes grâce à des outils basés sur l'intelligence artificielle. En s'appuyant sur des analyses de données avancées, Agritech Hub ambitionne de résoudre les problèmes critiques de distribution et de prévision agricole dans les zones rurales.",
    status: "En cours",
  },
  {
    id: 2,
    titre: "HealthSync",
    image: "https://placehold.co/600x400/ffefd5/ffdab9",
    description:
      "HealthSync est une application de santé connectée qui permet aux patients de suivre leurs données médicales, de gérer leurs rendez-vous, et de recevoir des notifications sur leurs prescriptions. Actuellement en cours de développement, cette plateforme intègre également des fonctionnalités de téléconsultation et un réseau de médecins, facilitant l'accès aux soins, particulièrement dans les régions éloignées. L'objectif est de réduire les délais de prise en charge et d'améliorer l'efficacité des consultations médicales.",
    status: "En cours",
  },
  {
    id: 3,
    titre: "EduSpark",
    image: "https://placehold.co/600x400/ffefd5/ffdab9",
    description:
      "EduSpark est une idée en réflexion destinée à révolutionner l'éducation à travers une plateforme d'apprentissage personnalisée. Utilisant des algorithmes d'apprentissage automatique, cette plateforme propose des parcours éducatifs sur mesure, adaptés aux compétences et aux objectifs de chaque apprenant. Avec une bibliothèque riche de cours interactifs et une communauté d'apprenants et de mentors, EduSpark vise à démocratiser l'éducation et à réduire les écarts d'accès à l'apprentissage de qualité.",
    status: "En réflexion",
  },
  {
    id: 4,
    titre: "GreenLoop",
    image: "https://placehold.co/600x400/ffefd5/ffdab9",
    description:
      "GreenLoop est un concept en réflexion centré sur la création d'un réseau de partage d'énergie renouvelable. L'objectif est de permettre aux ménages et aux entreprises de vendre ou d'acheter de l'énergie solaire ou éolienne excédentaire via une plateforme décentralisée. En intégrant la blockchain pour garantir la transparence et la sécurité des transactions, GreenLoop ambitionne de rendre les énergies renouvelables accessibles et abordables pour tous.",
    status: "En réflexion",
  },
  {
    id: 5,
    titre: "SmartCity Planner",
    image: "https://placehold.co/600x400/ffefd5/ffdab9",
    description:
      "SmartCity Planner est une initiative en réflexion visant à aider les urbanistes à concevoir des villes intelligentes. Ce projet propose des outils de simulation et d'analyse pour optimiser l'aménagement urbain, en tenant compte de facteurs tels que la densité de population, la consommation énergétique, et les infrastructures de transport. Grâce à des modèles prédictifs basés sur des données en temps réel, cette plateforme pourrait révolutionner la planification urbaine en mettant l'accent sur la durabilité et la résilience des villes.",
    status: "En réflexion",
  },
];
