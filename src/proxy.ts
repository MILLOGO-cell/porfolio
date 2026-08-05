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

/** Noms possibles du cookie de session, selon que NextAuth se croit en HTTPS. */
const SECURE_COOKIE = '__Secure-next-auth.session-token';
const PLAIN_COOKIE = 'next-auth.session-token';

export async function proxy(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  // Sans secret, `getToken` ne peut rien déchiffrer et renverrait toujours null,
  // ce qui bouclerait sur la page de connexion. On laisse passer : la véritable
  // vérification a lieu dans les Route Handlers, qui refuseront en 401.
  if (!secret) {
    console.warn('[proxy] NEXTAUTH_SECRET absent : contrôle optimiste ignoré.');
    return NextResponse.next();
  }

  // On déduit le nom du cookie de ce qui est RÉELLEMENT présent, au lieu de le
  // faire dériver de NEXTAUTH_URL. Un NEXTAUTH_URL sans « https:// » suffisait
  // sinon à faire chercher le mauvais nom : NextAuth pose `__Secure-…` (son
  // parseUrl ajoute le schéma manquant) tandis que getToken lit la variable
  // brute et cherche la version sans préfixe. Résultat : session jamais vue,
  // redirection en boucle vers /login.
  const hasSecureCookie = request.cookies.has(SECURE_COOKIE);
  const hasPlainCookie = request.cookies.has(PLAIN_COOKIE);

  if (!hasSecureCookie && !hasPlainCookie) {
    return NextResponse.redirect(
      new URL('/protected_access/login', request.url)
    );
  }

  const token = await getToken({
    req: request,
    secret,
    secureCookie: hasSecureCookie,
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
