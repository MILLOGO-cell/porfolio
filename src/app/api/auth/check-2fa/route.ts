import { NextRequest } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse('Email et mot de passe requis', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        password: true,
        twoFactorEnabled: true,
        twoFactorMethod: true,
      },
    });

    if (!user) {
      return errorResponse('Identifiants invalides', 401);
    }

    const isValidPassword = await compare(password, user.password);
    
    if (!isValidPassword) {
      return errorResponse('Identifiants invalides', 401);
    }

    return successResponse({
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod,
    });
  } catch (error) {
    return handleApiError(error);
  }
}