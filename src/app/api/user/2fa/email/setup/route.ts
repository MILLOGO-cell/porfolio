import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import * as nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        emailCodeSecret: code,
        emailCodeExpiry: expiry,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: session.user.email,
      subject: 'Code de vérification 2FA',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Code de vérification</h2>
          <p>Votre code de vérification pour activer l'authentification à deux facteurs :</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>Ce code expire dans 10 minutes.</p>
        </div>
      `,
    });

    return successResponse({ message: 'Code envoyé par email' });
  } catch (error) {
    return handleApiError(error);
  }
}