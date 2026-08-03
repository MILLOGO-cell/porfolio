import { NextRequest } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  rateLimitResponse,
  handleApiError,
} from '@/lib/api-response';

/**
 * Indique au formulaire s'il doit demander un second facteur.
 *
 * Cette route valide le mot de passe : elle partage donc volontairement le
 * compteur `login:` de `authorize()`, sinon elle offrirait un canal de force
 * brute échappant à la limite de connexion.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return errorResponse('Email et mot de passe requis', 400);
    }

    const limit = rateLimit(`login:${email}`, 8, 15 * 60 * 1000);
    if (!limit.allowed) {
      return rateLimitResponse(limit.retryAfter);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        password: true,
        twoFactorEnabled: true,
        twoFactorMethod: true,
      },
    });

    if (!user) {
      return errorResponse('Identifiants invalides', 401);
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return errorResponse('Identifiants invalides', 401);
    }

    return successResponse({
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
