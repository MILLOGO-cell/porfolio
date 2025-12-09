import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  description: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
}).transform((data) => ({
  ...data,
  url: data.url && data.url.trim() !== '' ? data.url : null,
  imageUrl: data.imageUrl && data.imageUrl.trim() !== '' ? data.imageUrl : null,
  description: data.description && data.description.trim() !== '' ? data.description : null,
}));

export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type LoginInput = z.infer<typeof loginSchema>;