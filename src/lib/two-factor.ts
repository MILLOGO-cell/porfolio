// À protéger par `import 'server-only'` une fois le paquet installé.
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/db';

type TwoFactorUser = {
  id: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: string | null;
  totpSecret: string | null;
  emailCodeSecret: string | null;
  emailCodeExpiry: Date | null;
};

/** Comparaison à temps constant : une comparaison `===` fuite la position du 1er écart. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Vérifie le second facteur. C'est LA fonction appelée par `authorize()` :
 * tant qu'elle renvoie false, aucune session n'est émise. Le 2FA ne doit
 * jamais être vérifié par une route séparée que le client pourrait sauter.
 */
export async function verifyTwoFactorCode(
  user: TwoFactorUser,
  code: string | undefined
): Promise<boolean> {
  if (!user.twoFactorEnabled) return true;
  if (!code) return false;

  if (user.twoFactorMethod === 'totp') {
    if (!user.totpSecret) return false;
    return speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
  }

  if (user.twoFactorMethod === 'email') {
    if (!user.emailCodeSecret || !user.emailCodeExpiry) return false;
    if (new Date() > user.emailCodeExpiry) return false;
    if (!safeEqual(code, user.emailCodeSecret)) return false;

    // Usage unique : le code est brûlé dès qu'il a servi.
    await prisma.user.update({
      where: { id: user.id },
      data: { emailCodeSecret: null, emailCodeExpiry: null },
    });
    return true;
  }

  // Méthode inconnue : on refuse plutôt que d'ouvrir par défaut.
  return false;
}
