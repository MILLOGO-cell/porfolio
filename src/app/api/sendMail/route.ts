import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Validation des champs
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email invalide." },
        { status: 400 }
      );
    }

    // Vérification des variables d'environnement
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.error("Variables d'environnement manquantes pour l'email");
      return NextResponse.json(
        {
          success: false,
          message: "Configuration email manquante sur le serveur.",
        },
        { status: 500 }
      );
    }

    // Configuration du transporteur avec Gmail
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // true pour le port 465, false pour les autres ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Accepte les certificats auto-signés (utile en dev)
      },
    });

    // Vérification de la connexion
    await transporter.verify();

    // Configuration de l'email
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`, // Expéditeur
      to: process.env.EMAIL_TO || process.env.EMAIL_USER, // Destinataire
      replyTo: email, // L'utilisateur peut répondre directement
      subject: `📬 Nouveau message de ${name}`,
      text: `
Nom: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .label {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 5px;
            }
            .message-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
              border: 1px solid #e5e7eb;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📬 Nouveau message de contact</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <div class="label">👤 Nom :</div>
              <div>${name}</div>
            </div>
            <div class="info-box">
              <div class="label">📧 Email :</div>
              <div><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="message-box">
              <div class="label">💬 Message :</div>
              <p>${message.replace(/\n/g, "<br>")}</p>
            </div>
            <div class="footer">
              <p>Message reçu depuis votre portfolio - ${new Date().toLocaleDateString(
                "fr-FR",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Envoi de l'email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email envoyé avec succès:", info.messageId);

    return NextResponse.json(
      {
        success: true,
        message: "Message envoyé avec succès !",
        messageId: info.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);

    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Erreur d'authentification email. Vérifiez vos identifiants.",
          },
          { status: 500 }
        );
      }
      if (error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Impossible de se connecter au serveur email. Vérifiez votre configuration.",
          },
          { status: 500 }
        );
      }
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