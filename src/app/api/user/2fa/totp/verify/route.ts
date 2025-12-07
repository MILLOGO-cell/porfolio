import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return errorResponse('Code requis', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.totpSecret) {
      return errorResponse('2FA non configuré', 400);
    }

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return errorResponse('Code invalide', 400);
    }

    await prisma.user.update({
      where: { email: session.user.email },
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