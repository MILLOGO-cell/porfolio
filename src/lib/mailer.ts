import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Point d'entrée unique pour l'envoi d'email.
 *
 * La configuration SMTP était recopiée à l'identique dans quatre routes, ce qui
 * voulait dire quatre endroits à corriger le jour où le fournisseur change — et
 * quatre transporteurs construits au chargement du module, donc quatre lectures
 * de `process.env` au moment de l'import plutôt qu'à l'usage.
 *
 * Ici le transporteur est créé à la première demande puis réutilisé, et
 * l'absence de configuration lève une `MailConfigError` que l'appelant peut
 * distinguer d'un échec réseau ou d'un refus d'authentification.
 */

/** Configuration SMTP absente ou incomplète : rien n'a été tenté. */
export class MailConfigError extends Error {
  constructor(public readonly missing: string[]) {
    super(
      `Configuration email incomplète : ${missing.join(', ')} ${
        missing.length > 1 ? 'sont absentes' : 'est absente'
      }.`
    );
    this.name = 'MailConfigError';
  }
}

interface MailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

/**
 * `EMAIL_PORT` est facultatif et vaut 587 par défaut : c'est le port de
 * soumission STARTTLS, celui de tous les fournisseurs courants. Les trois
 * autres variables n'ont pas de valeur par défaut raisonnable.
 */
function readConfig(): MailConfig {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  const missing: string[] = [];
  if (!host) missing.push('EMAIL_HOST');
  if (!user) missing.push('EMAIL_USER');
  if (!pass) missing.push('EMAIL_PASS');
  if (missing.length > 0) {
    throw new MailConfigError(missing);
  }

  const rawPort = process.env.EMAIL_PORT;
  const port = rawPort ? Number(rawPort) : 587;
  if (!Number.isFinite(port) || port <= 0) {
    throw new MailConfigError(['EMAIL_PORT (valeur non numérique)']);
  }

  return { host: host!, port, user: user!, pass: pass! };
}

let cached: Transporter | null = null;

/**
 * Le transporteur est mis en cache pour la durée de vie du processus. Les
 * variables d'environnement ne changent pas à chaud dans un conteneur : les
 * relire à chaque envoi n'apporterait rien.
 */
export function getTransporter(): Transporter {
  if (cached) return cached;

  const { host, port, user, pass } = readConfig();
  cached = nodemailer.createTransport({
    host,
    port,
    // Le port 465 parle TLS d'emblée ; 587 négocie STARTTLS après le EHLO.
    secure: port === 465,
    auth: { user, pass },
  });
  return cached;
}

/** Adresse d'expédition. `EMAIL_USER` est le seul expéditeur que le SMTP autorise. */
export function senderAddress(displayName?: string): string {
  const { user } = readConfig();
  return displayName ? `"${displayName}" <${user}>` : user;
}

/** Destinataire des messages du formulaire de contact. */
export function defaultRecipient(): string {
  const { user } = readConfig();
  return process.env.EMAIL_TO || user;
}

type MailOptions = Parameters<Transporter['sendMail']>[0];

/**
 * Envoie un message. Les erreurs remontent telles quelles : chaque appelant
 * décide de ce qu'il montre à l'utilisateur, et `smtpErrorDetails` sert à en
 * journaliser le détail.
 */
export function sendMail(options: MailOptions) {
  return getTransporter().sendMail(options);
}

/** Détails d'une erreur SMTP, que `console.error` sur une Error nue n'expose pas. */
export interface SmtpErrorDetails {
  code?: string;
  responseCode?: number;
  command?: string;
  response?: string;
  message?: string;
}

/**
 * Extrait de quoi diagnostiquer un échec d'envoi. Sans `response`, un
 * « Invalid login » ne dit pas si le mot de passe est faux, révoqué, ou si le
 * compte exige un mot de passe d'application.
 */
export function smtpErrorDetails(error: unknown): SmtpErrorDetails {
  const err = error as NodeJS.ErrnoException & {
    responseCode?: number;
    command?: string;
    response?: string;
  };
  return {
    code: err?.code,
    responseCode: err?.responseCode,
    command: err?.command,
    response: err?.response,
    message: err?.message,
  };
}

/**
 * Le serveur a refusé les identifiants. On teste `code` plutôt que le libellé :
 * « Invalid login » est propre à Gmail, un autre SMTP dira autre chose.
 */
export function isAuthError(error: unknown): boolean {
  const { code, responseCode, message } = smtpErrorDetails(error);
  return (
    code === 'EAUTH' ||
    responseCode === 535 ||
    (message?.includes('Invalid login') ?? false)
  );
}

/** La connexion au serveur SMTP n'a pas pu être établie. */
export function isConnectionError(error: unknown): boolean {
  const { code, message } = smtpErrorDetails(error);
  return (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ESOCKET' ||
    code === 'EDNS' ||
    (message?.includes('ECONNREFUSED') ?? false)
  );
}
