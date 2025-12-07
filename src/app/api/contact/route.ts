import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import { contactSchema } from '@/lib/validations';
import { successResponse, validationErrorResponse, handleApiError } from '@/lib/api-response';

// ====================================
// Configuration Nodemailer
// ====================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ====================================
// POST /api/contact
// Envoyer un email de contact
// ====================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return validationErrorResponse(errors);
    }

    const { name, email, message } = validation.data;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: Message de ${name}`,
      text: `
Nouveau message de contact depuis votre portfolio

Nom: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Nouveau message de contact</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555;">Message:</h3>
            <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Ce message a été envoyé depuis le formulaire de contact de votre portfolio.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return successResponse({
      message: 'Message envoyé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return handleApiError(error);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}