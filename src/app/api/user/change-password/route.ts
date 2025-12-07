import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { compare, hash } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return errorResponse('Tous les champs sont requis', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse('Le nouveau mot de passe doit contenir au moins 6 caractères', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return errorResponse('Utilisateur non trouvé', 404);
    }

    const isValidPassword = await compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      return errorResponse('Mot de passe actuel incorrect', 400);
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return successResponse({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}