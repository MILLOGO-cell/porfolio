import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import * as nodemailer from 'nodemailer';
import crypto from 'crypto';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return errorResponse('Email requis', 400);
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Toujours retourner succès (sécurité - ne pas révéler si l'email existe)
    if (!user) {
      return successResponse({
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      });
    }

    // Générer un token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Envoyer l'email
    const resetUrl = `${process.env.NEXTAUTH_URL}/protected_access/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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

    return successResponse({
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
    });
  } catch (error) {
    return handleApiError(error);
  }
}