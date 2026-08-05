import { z } from 'zod';

/**
 * Les URL de projet sont rendues dans des <a href>. Sans restriction de schéma,
 * une valeur `javascript:…` stockée en base devient un XSS au clic.
 */
const httpUrl = z
  .string()
  .trim()
  .url('URL invalide')
  .refine(
    (value) => /^https?:\/\//i.test(value),
    'Seules les URL http(s) sont acceptées'
  );

const optionalHttpUrl = z.union([httpUrl, z.literal(''), z.null()]).optional();

/**
 * Chemin servi depuis /public : les uploads (/uploads/…) comme les visuels
 * placés à la racine (/portfolio.png). Le `..` est refusé, et le schéma exclut
 * de fait `javascript:` et `data:`.
 */
export const relativeAssetPath = z
  .string()
  .trim()
  .regex(/^\/[\w./-]*$/, 'Chemin d’image invalide')
  .refine((value) => !value.includes('..'), 'Chemin d’image invalide');

/** Une image vient soit d'une URL externe http(s), soit d'un fichier local. */
const optionalImageUrl = z
  .union([httpUrl, relativeAssetPath, z.literal(''), z.null()])
  .optional();

/** Bloc de texte libre d'une étude de cas. */
const caseStudyText = z.string().trim().max(5000).nullable().optional();

/**
 * Familles de projets. Vocabulaire volontairement court et ferme : une liste
 * qui s'allonge à chaque fiche cesse de servir à regrouper quoi que ce soit.
 */
export const PROJECT_CATEGORIES = [
  'Site web',
  'E-commerce',
  'Application métier',
  'Application mobile',
  'API et backend',
  'Design UX/UI',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * États d'avancement. Un projet livré n'affiche aucun badge : le signaler
 * reviendrait à mettre une pastille sur presque toutes les fiches, ce qui
 * n'apprendrait plus rien.
 */
export const PROJECT_STATUSES = [
  'En cours',
  'Proposition',
  'Maintenu',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/**
 * Dérive un identifiant d'URL depuis un titre. Utilisé côté serveur quand
 * l'administrateur laisse le champ vide, et côté formulaire pour la
 * prévisualisation — d'où l'export.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    // Retire les diacritiques : « Réclamations » -> « reclamations ».
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Le slug est requis')
  .max(80)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Le slug ne peut contenir que des minuscules, des chiffres et des tirets'
  );

export const projectSchema = z
  .object({
    // Optionnel en entrée : dérivé du titre s'il est absent.
    slug: z.union([slugSchema, z.literal('')]).optional(),
    title: z.string().trim().min(1, 'Le titre est requis').max(200),
    summary: z.string().trim().max(300).nullable().optional(),
    description: caseStudyText,

    context: caseStudyText,
    role: caseStudyText,
    challenges: caseStudyText,
    outcome: caseStudyText,

    category: z
      .union([z.enum(PROJECT_CATEGORIES), z.literal(''), z.null()])
      .optional(),
    client: z.string().trim().max(200).nullable().optional(),
    period: z.string().trim().max(60).nullable().optional(),
    stack: z.array(z.string().trim().min(1).max(40)).max(40).default([]),

    url: optionalHttpUrl,
    repoUrl: optionalHttpUrl,
    imageUrl: optionalImageUrl,
    gallery: z
      .array(z.union([httpUrl, relativeAssetPath]))
      .max(12)
      .default([]),
    tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    confidential: z.boolean().default(false),
    status: z
      .union([z.enum(PROJECT_STATUSES), z.literal(''), z.null()])
      .optional(),
    position: z.number().int().min(0).max(9999).default(0),
  })
  .transform((data) => {
    /** Une chaîne vide en base vaut « non renseigné » : on stocke NULL. */
    const emptyToNull = (value: string | null | undefined) =>
      value && value.trim() !== '' ? value : null;

    return {
      ...data,
      slug: data.slug && data.slug !== '' ? data.slug : slugify(data.title),
      summary: emptyToNull(data.summary),
      description: emptyToNull(data.description),
      context: emptyToNull(data.context),
      role: emptyToNull(data.role),
      challenges: emptyToNull(data.challenges),
      outcome: emptyToNull(data.outcome),
      category: emptyToNull(data.category),
      status: emptyToNull(data.status),
      client: emptyToNull(data.client),
      period: emptyToNull(data.period),
      url: emptyToNull(data.url),
      repoUrl: emptyToNull(data.repoUrl),
      imageUrl: emptyToNull(data.imageUrl),
    };
  })
  .refine((data) => data.slug.length > 0, {
    message: 'Impossible de dériver un slug depuis ce titre',
    path: ['slug'],
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(120),
  email: z.string().trim().email('Email invalide').max(200),
  message: z
    .string()
    .trim()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000),
});

/** Compte d'administration : 12 caractères minimum, pas 6. */
export const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
  .max(200);

export type ProjectInput = z.infer<typeof projectSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
