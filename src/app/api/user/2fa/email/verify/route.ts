import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/dal';
import { rateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  rateLimitResponse,
  handleApiError,
} from '@/lib/api-response';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const limit = rateLimit(`2fa-verify:${admin.id}`, 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return rateLimitResponse(limit.retryAfter);
    }

    const body = await request.json();
    const code = typeof body?.code === 'string' ? body.code : '';

    if (!code) {
      return errorResponse('Code requis', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: { emailCodeSecret: true, emailCodeExpiry: true },
    });

    if (!user?.emailCodeSecret || !user.emailCodeExpiry) {
      return errorResponse('Code non trouvé', 400);
    }

    if (new Date() > user.emailCodeExpiry) {
      return errorResponse('Code expiré', 400);
    }

    if (!safeEqual(code, user.emailCodeSecret)) {
      return errorResponse('Code invalide', 400);
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: 'email',
        emailCodeSecret: null,
        emailCodeExpiry: null,
      },
    });

    return successResponse({ message: '2FA par email activé avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}
