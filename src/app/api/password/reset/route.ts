import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { hashResetToken } from '@/lib/reset-token';
import { passwordSchema } from '@/lib/validations';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  rateLimitResponse,
  handleApiError,
} from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === 'string' ? body.token : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!token || !password) {
      return errorResponse('Token et mot de passe requis', 400);
    }

    const limit = rateLimit(clientKey(request, 'reset'), 10, 60 * 60 * 1000);
    if (!limit.allowed) {
      return rateLimitResponse(limit.retryAfter);
    }

    const validation = passwordSchema.safeParse(password);
    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0]?.message ?? 'Mot de passe invalide',
        400
      );
    }

    // On cherche sur l'empreinte : la base ne contient jamais le jeton en clair.
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashResetToken(token),
        resetTokenExpiry: { gte: new Date() },
      },
      select: { id: true },
    });

    if (!user) {
      return errorResponse('Token invalide ou expiré', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hash(validation.data, 12),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return successResponse({
      message: 'Mot de passe réinitialisé avec succès',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
