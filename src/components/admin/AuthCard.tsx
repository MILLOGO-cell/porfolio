/**
 * Cadre commun aux pages d'authentification (connexion, mot de passe oublié,
 * réinitialisation). Les trois recopiaient la même carte avec des couleurs
 * codées en dur qui ignoraient les jetons du thème.
 */
export default function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-subtle">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-muted">{description}</p>
            )}
          </div>

          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        )}
      </div>
    </div>
  );
}

/**
 * Repli des frontières Suspense des pages d'authentification.
 *
 * `useSearchParams` impose une frontière Suspense au prérendu. Elle était
 * fournie par un `loading.tsx` à la racine, qui plaçait tout le site derrière un
 * spinner plein écran et le rendait invisible sans JavaScript. La frontière est
 * désormais locale à ces deux pages, avec un repli qui garde la carte et les
 * jetons du thème au lieu d'une page vide.
 */
export function AuthCardFallback({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <AuthCard title={title} description={description}>
      <div className="space-y-4" aria-hidden>
        <div className="h-11 animate-pulse rounded-xl bg-surface-muted" />
        <div className="h-11 animate-pulse rounded-xl bg-surface-muted" />
        <div className="h-11 animate-pulse rounded-xl bg-accent-soft/60" />
      </div>
      <span className="sr-only">Chargement du formulaire…</span>
    </AuthCard>
  );
}

/** Classes de champ partagées par les formulaires d'authentification. */
export const AUTH_FIELD =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export const AUTH_LABEL = 'mb-1.5 block text-sm font-medium text-foreground';

export function AuthError({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
    >
      {children}
    </div>
  );
}

export function AuthSuccess({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
    >
      {children}
    </div>
  );
}
