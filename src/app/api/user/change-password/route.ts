import { NextRequest } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/dal';
import { passwordSchema } from '@/lib/validations';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse('Tous les champs sont requis', 400);
    }

    const validation = passwordSchema.safeParse(newPassword);
    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0]?.message ?? 'Mot de passe invalide',
        400
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: { password: true },
    });

    if (!user) {
      return errorResponse('Utilisateur non trouvé', 404);
    }

    const isValidPassword = await compare(currentPassword, user.password);

    if (!isValidPassword) {
      return errorResponse('Mot de passe actuel incorrect', 400);
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: { password: await hash(validation.data, 12) },
    });

    return successResponse({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}
