import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return errorResponse('Token et mot de passe requis', 400);
    }

    if (password.length < 6) {
      return errorResponse('Le mot de passe doit contenir au moins 6 caractères', 400);
    }

    // Trouver l'utilisateur avec ce token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Token non expiré
        },
      },
    });

    if (!user) {
      return errorResponse('Token invalide ou expiré', 400);
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hash(password, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
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