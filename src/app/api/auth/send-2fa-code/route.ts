import { NextRequest } from 'next/server';
import { compare } from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import {
  successResponse,
  errorResponse,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return errorResponse('Email et mot de passe requis', 400);
    }

    // Budget partagé avec la connexion (force brute) + budget propre d'envoi
    // (inondation de la boîte mail).
    const loginLimit = rateLimit(`login:${email}`, 8, 15 * 60 * 1000);
    if (!loginLimit.allowed) {
      return rateLimitResponse(loginLimit.retryAfter);
    }

    const sendLimit = rateLimit(`2fa-send:${email}`, 5, 15 * 60 * 1000);
    if (!sendLimit.allowed) {
      return rateLimitResponse(sendLimit.retryAfter);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return errorResponse('Identifiants invalides', 401);
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return errorResponse('Identifiants invalides', 401);
    }

    if (!user.twoFactorEnabled || user.twoFactorMethod !== 'email') {
      return errorResponse('2FA par email non activé', 400);
    }

    // randomInt exclut la borne haute : 1000000 pour couvrir 999999.
    const code = crypto.randomInt(100000, 1000000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        emailCodeSecret: code,
        emailCodeExpiry: expiry,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Code de connexion',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Code de connexion</h2>
          <p>Votre code de connexion à deux facteurs :</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>Ce code expire dans 10 minutes et ne peut servir qu'une fois.</p>
          <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </div>
      `,
    });

    return successResponse({ message: 'Code envoyé par email' });
  } catch (error) {
    return handleApiError(error);
  }
}
