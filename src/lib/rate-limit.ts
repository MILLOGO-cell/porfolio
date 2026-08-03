// À protéger par `import 'server-only'` une fois le paquet installé
// (`npm i server-only`) : cela ferait échouer le build si ce module était
// importé par erreur depuis un Client Component.

/**
 * Limiteur de débit en mémoire, à fenêtre fixe.
 *
 * LIMITE CONNUE : l'état vit dans le processus. Suffisant pour un déploiement
 * mono-instance (un conteneur Railway) ; derrière plusieurs répliques, chaque
 * instance compte séparément. Pour du multi-instance, remplacer le Map par
 * Redis / Upstash en gardant la même signature.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Purge opportuniste : évite que le Map grossisse indéfiniment. */
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Secondes avant la réouverture de la fenêtre. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

/** Remet le compteur à zéro — à appeler après une authentification réussie. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/**
 * Identifiant d'appelant. `x-forwarded-for` est falsifiable si l'application
 * n'est pas derrière un reverse proxy qui le réécrit : à ne pas utiliser seul
 * comme barrière de sécurité, seulement pour lisser les abus.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return `${scope}:${ip}`;
}
