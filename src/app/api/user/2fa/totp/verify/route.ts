import { NextRequest } from 'next/server';
import speakeasy from 'speakeasy';
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
    const { token } = body;

    if (!token) {
      return errorResponse('Code requis', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: { totpSecret: true },
    });

    if (!user?.totpSecret) {
      return errorResponse('2FA non configuré', 400);
    }

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      return errorResponse('Code invalide', 400);
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: 'totp',
      },
    });

    return successResponse({ message: '2FA activé avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}
