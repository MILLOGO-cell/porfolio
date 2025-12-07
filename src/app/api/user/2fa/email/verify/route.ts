import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return errorResponse('Code requis', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.emailCodeSecret || !user.emailCodeExpiry) {
      return errorResponse('Code non trouvé', 400);
    }

    if (new Date() > user.emailCodeExpiry) {
      return errorResponse('Code expiré', 400);
    }

    if (code !== user.emailCodeSecret) {
      return errorResponse('Code invalide', 400);
    }

    await prisma.user.update({
      where: { email: session.user.email },
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