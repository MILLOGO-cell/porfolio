import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * `proxy.ts` = l'ex-`middleware.ts` (renommé en Next.js 16).
 *
 * CONTRÔLE OPTIMISTE UNIQUEMENT : il évite d'afficher le shell d'administration
 * à un visiteur non connecté. Ce n'est PAS la barrière de sécurité — elle est
 * dans `getAdminSession()`, appelée par chaque Route Handler. Un proxy ne se
 * réexécute pas sur toutes les transitions et n'empêche pas d'appeler une API
 * directement : renommer /admin en /protected_access ne protège que les URL de
 * pages, les routes /api/* répondent toujours à leur adresse d'origine.
 */
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(
      new URL('/protected_access/login', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // Les pages publiques d'authentification restent accessibles.
  matcher: [
    '/protected_access',
    '/protected_access/projects/:path*',
    '/protected_access/settings/:path*',
  ],
};
