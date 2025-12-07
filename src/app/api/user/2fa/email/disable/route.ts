import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        emailCodeSecret: null,
        emailCodeExpiry: null,
      },
    });

    return successResponse({ message: '2FA par email désactivé avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}