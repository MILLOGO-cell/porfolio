import { errorResponse } from '@/lib/api-response';

/**
 * ROUTE NEUTRALISÉE — le dossier entier est à supprimer.
 *
 * Elle vérifiait le code 2FA sans émettre de session, ce qui rendait le second
 * facteur purement décoratif : le client pouvait l'ignorer et appeler
 * directement /api/auth/callback/credentials avec email + mot de passe.
 *
 * La vérification vit désormais dans `authorize()` (src/lib/auth.ts), dans le
 * même appel que le mot de passe. On renvoie 410 plutôt que de laisser le code
 * en place, pour que tout appelant résiduel échoue bruyamment.
 */
export async function POST() {
  return errorResponse(
    "Cette route n'existe plus. Le code 2FA se transmet au moment de la connexion.",
    410
  );
}
