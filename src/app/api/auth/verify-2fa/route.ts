import { NextRequest } from 'next/server';
import { compare } from 'bcryptjs';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, code, method } = body;

    if (!email || !password || !code) {
      return errorResponse('Tous les champs sont requis', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse('Identifiants invalides', 401);
    }

    const isValidPassword = await compare(password, user.password);
    
    if (!isValidPassword) {
      return errorResponse('Identifiants invalides', 401);
    }

    if (!user.twoFactorEnabled) {
      return errorResponse('2FA non activé', 400);
    }

    let isValidCode = false;

    if (method === 'totp' && user.twoFactorMethod === 'totp' && user.totpSecret) {
      isValidCode = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: code,
        window: 2,
      });
    } else if (method === 'email' && user.twoFactorMethod === 'email') {
      if (!user.emailCodeSecret || !user.emailCodeExpiry) {
        return errorResponse('Code non trouvé', 400);
      }

      if (new Date() > user.emailCodeExpiry) {
        return errorResponse('Code expiré', 400);
      }

      isValidCode = code === user.emailCodeSecret;

      if (isValidCode) {
        await prisma.user.update({
          where: { email },
          data: {
            emailCodeSecret: null,
            emailCodeExpiry: null,
          },
        });
      }
    }

    if (!isValidCode) {
      return errorResponse('Code invalide', 401);
    }

    return successResponse({ 
      verified: true,
      message: 'Code vérifié avec succès' 
    });
  } catch (error) {
    return handleApiError(error);
  }
}