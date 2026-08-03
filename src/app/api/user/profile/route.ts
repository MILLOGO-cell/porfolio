import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/dal';
import { relativeAssetPath } from '@/lib/validations';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from '@/lib/api-response';

const profileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  profileImage: z.union([relativeAssetPath, z.literal(''), z.null()]).optional(),
});

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    // DTO explicite : `password`, `totpSecret` et `resetToken` ne sortent jamais.
    const user = await prisma.user.findUnique({
      where: { id: admin.id },
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
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const validation = profileSchema.safeParse(await request.json());
    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0]?.message ?? 'Données invalides',
        400
      );
    }

    const { name, profileImage } = validation.data;

    const user = await prisma.user.update({
      where: { id: admin.id },
      data: {
        name: name || undefined,
        // Chaîne vide = retirer l'image (retomber sur Gravatar).
        profileImage: profileImage === '' ? null : profileImage ?? undefined,
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
