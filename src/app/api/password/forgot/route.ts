import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { hashResetToken } from '@/lib/reset-token';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { sendMail, senderAddress } from '@/lib/mailer';
import {
  successResponse,
  errorResponse,
  rateLimitResponse,
  handleApiError,
} from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';

    if (!email) {
      return errorResponse('Email requis', 400);
    }

    const ipLimit = rateLimit(clientKey(request, 'forgot'), 5, 60 * 60 * 1000);
    if (!ipLimit.allowed) {
      return rateLimitResponse(ipLimit.retryAfter);
    }

    const emailLimit = rateLimit(`forgot:${email}`, 3, 60 * 60 * 1000);
    if (!emailLimit.allowed) {
      return rateLimitResponse(emailLimit.retryAfter);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Réponse identique dans tous les cas : ne pas révéler si l'email existe.
    const genericResponse = successResponse({
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    });

    if (!user) {
      return genericResponse;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    // Seul le condensé est stocké : une fuite de la table `users` ne permet
    // plus de forger un lien de réinitialisation valide.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashResetToken(resetToken),
        resetTokenExpiry,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? '';
    const resetUrl = `${baseUrl}/protected_access/reset-password?token=${resetToken}`;

    await sendMail({
      from: senderAddress(),
      to: email,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Réinitialiser mon mot de passe
          </a>
          <p>Ce lien expire dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `,
    });

    return genericResponse;
  } catch (error) {
    return handleApiError(error);
  }
}
