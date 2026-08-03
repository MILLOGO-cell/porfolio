// À protéger par `import 'server-only'` une fois le paquet installé.
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * Couche d'accès aux données : c'est ici — au plus près de la donnée — que
 * l'authentification est vérifiée, PAS dans `proxy.ts` ni dans un layout.
 * Un contrôle en bordure est optimiste ; il ne protège pas un Route Handler
 * appelé directement. Renommer /admin en /protected_access ne protège que les
 * URL de pages : les routes /api/* répondent toujours à leur adresse d'origine.
 */
export type AdminSession = {
  id: string;
  email: string;
};

/**
 * Renvoie l'administrateur connecté, ou `null`. `getServerSession` DOIT recevoir
 * `authOptions` : sans lui, NextAuth utilise une configuration par défaut et les
 * callbacks (dont l'injection de l'id) ne s'appliquent pas.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  // Le JWT peut survivre à la suppression du compte : on revalide en base.
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true },
  });

  return user;
}
