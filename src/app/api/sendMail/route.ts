import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  MailConfigError,
  defaultRecipient,
  isAuthError,
  isConnectionError,
  sendMail,
  senderAddress,
  smtpErrorDetails,
} from "@/lib/mailer";

/** Les champs du formulaire sont réinjectés dans le HTML de l'email : on échappe. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  try {
    // Le formulaire est public et déclenche un envoi de mail : sans plafond,
    // c'est un relais de spam gratuit.
    const limit = rateLimit(clientKey(req, "contact"), 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Trop de messages envoyés. Réessayez dans une heure.",
        },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
      );
    }

    const body = await req.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message ?? "Données invalides.",
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validation.data;

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const receivedAt = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const info = await sendMail({
      from: senderAddress("Portfolio Contact"),
      to: defaultRecipient(),
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      text: `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}\n`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #18181b;
              max-width: 600px;
              margin: 0 auto;
              padding: 24px;
              background: #ffffff;
            }
            .header {
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
            .header p { margin: 4px 0 0; font-size: 13px; color: #71717a; }
            .field { margin-bottom: 20px; }
            .label {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: #4f46e5;
              margin-bottom: 4px;
            }
            .value { font-size: 15px; }
            .message {
              background: #fafafa;
              border: 1px solid #e4e4e7;
              border-radius: 8px;
              padding: 16px;
              font-size: 15px;
            }
            .footer {
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px solid #e4e4e7;
              font-size: 12px;
              color: #71717a;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Nouveau message de contact</h1>
            <p>Re&ccedil;u le ${receivedAt}</p>
          </div>
          <div class="field">
            <div class="label">Nom</div>
            <div class="value">${safeName}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="message">${safeMessage}</div>
          </div>
          <div class="footer">Message envoy&eacute; depuis le formulaire de contact du portfolio.</div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message envoyé avec succès !",
        messageId: info.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    // Le visiteur ne reçoit qu'un message générique ; sans le code et la
    // réponse brute du serveur SMTP dans les logs, un échec d'authentification
    // en prod n'est pas diagnosticable (voir scripts/test-smtp.ts).
    console.error("Erreur lors de l'envoi de l'email:", smtpErrorDetails(error));

    if (error instanceof MailConfigError) {
      return NextResponse.json(
        {
          success: false,
          message: "Configuration email manquante sur le serveur.",
        },
        { status: 500 }
      );
    }

    if (isAuthError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Erreur d'authentification email. Vérifiez vos identifiants.",
        },
        { status: 500 }
      );
    }

    if (isConnectionError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Impossible de se connecter au serveur email. Vérifiez votre configuration.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Une erreur est survenue lors de l'envoi du message.",
      },
      { status: 500 }
    );
  }
}
