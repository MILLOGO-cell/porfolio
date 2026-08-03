// À protéger par `import 'server-only'` une fois le paquet installé.
import crypto from 'crypto';

/**
 * Le jeton envoyé par email est un secret aléatoire de 256 bits ; seule son
 * empreinte est stockée. SHA-256 suffit ici (contrairement à un mot de passe,
 * l'entrée est déjà à haute entropie : pas de force brute possible).
 */
export function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
