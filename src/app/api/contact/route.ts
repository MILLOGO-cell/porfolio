import { errorResponse } from '@/lib/api-response';

/**
 * ROUTE NEUTRALISÉE — le dossier entier est à supprimer.
 *
 * Doublon de /api/sendMail, qu'aucun composant n'appelait : le formulaire de
 * contact poste sur sendMail. Elle envoyait pourtant des emails sans aucune
 * limitation de débit, ce qui en faisait un second relais de spam ouvert.
 */
export async function POST() {
  return errorResponse(
    "Cette route n'existe plus. Utilisez /api/sendMail.",
    410
  );
}
