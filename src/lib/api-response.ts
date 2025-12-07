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

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse('Une erreur interne est survenue', 500);
}