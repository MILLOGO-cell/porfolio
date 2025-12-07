import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        twoFactorEnabled: true,
        twoFactorMethod: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse('Utilisateur non trouvé', 404);
    }

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    const body = await request.json();
    const { name, profileImage } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        profileImage: profileImage || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
      },
    });

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}