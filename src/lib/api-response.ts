import { NextResponse } from 'next/server';

// ====================================
// API RESPONSE HELPERS
// ====================================

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

export function unauthorizedResponse() {
  return errorResponse('Non autorisé', 401);
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    {
      success: false,
      error: 'Trop de tentatives. Réessayez dans quelques instants.',
    },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}

export function validationErrorResponse(errors: Record<string, string[]>) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors,
    },
    { status: 422 }
  );
}

// ====================================
// ERROR HANDLING
// ====================================

/**
 * Le détail de l'erreur reste dans les logs serveur. Le renvoyer au client
 * exposait les messages Prisma (noms de tables, contraintes) à n'importe quel
 * appelant.
 */
export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  return errorResponse('Une erreur interne est survenue', 500);
}

/** Formate les erreurs Zod pour `validationErrorResponse`. */
export function zodErrorsToRecord(
  issues: { path: PropertyKey[]; message: string }[]
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of issues) {
    const path = issue.path.map(String).join('.') || '_';
    (errors[path] ??= []).push(issue.message);
  }
  return errors;
}
