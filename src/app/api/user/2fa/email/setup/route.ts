import * as nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/dal';
import { rateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  unauthorizedResponse,
  rateLimitResponse,
  handleApiError,
} from '@/lib/api-response';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const limit = rateLimit(`2fa-setup-send:${admin.id}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) {
      return rateLimitResponse(limit.retryAfter);
    }

    // randomInt exclut la borne haute : 1000000 pour couvrir 999999.
    const code = crypto.randomInt(100000, 1000000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: admin.id },
      data: {
        emailCodeSecret: code,
        emailCodeExpiry: expiry,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: 'Code de vérification',
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
