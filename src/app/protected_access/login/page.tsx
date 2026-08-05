'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { LuLoaderCircle } from 'react-icons/lu';
import AuthCard, {
  AUTH_FIELD,
  AUTH_LABEL,
  AuthError,
  AuthSuccess,
} from '@/components/admin/AuthCard';
import { buttonClass } from '@/components/ui/button-styles';

type Step = 'credentials' | 'code';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  // Le mot de passe reste dans l'état du composant pendant l'étape 2FA. Il
  // n'est JAMAIS écrit dans sessionStorage : tout script de la page pourrait
  // l'y relire, et il y survivrait à l'onglet.
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const oauthError = searchParams?.get('error');

  const completeSignIn = async (twoFactorCode?: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      code: twoFactorCode ?? '',
      redirect: false,
    });

    if (result?.error) {
      setError(
        twoFactorCode
          ? 'Code invalide ou expiré'
          : 'Email ou mot de passe incorrect'
      );
      setLoading(false);
      return;
    }

    router.push('/protected_access');
    router.refresh();
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/check-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Email ou mot de passe incorrect');
        setLoading(false);
        return;
      }

      if (!payload.data.twoFactorEnabled) {
        await completeSignIn();
        return;
      }

      setMethod(payload.data.twoFactorMethod);

      if (payload.data.twoFactorMethod === 'email') {
        await fetch('/api/auth/send-2fa-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      setStep('code');
      setLoading(false);
    } catch {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      await completeSignIn(code);
    } catch {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-2fa-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (response.ok) {
        setNotice('Code renvoyé avec succès');
      } else {
        setError(payload.error || "Erreur lors de l'envoi");
      }
    } catch {
      setError("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  const backToCredentials = () => {
    setStep('credentials');
    setCode('');
    setError('');
    setNotice('');
  };

  return (
    <AuthCard
      title={step === 'credentials' ? 'Administration' : 'Vérification'}
      description={
        step === 'credentials'
          ? 'Connectez-vous pour accéder au tableau de bord'
          : method === 'totp'
            ? "Entrez le code de votre application d'authentification"
            : 'Entrez le code reçu par email'
      }
    >
      {(error || oauthError) && (
        <AuthError>
          {error ||
            "Connexion GitHub refusée. Ce compte n'est pas autorisé, ou la double authentification est active : utilisez votre email et votre mot de passe."}
        </AuthError>
      )}

      {notice && <AuthSuccess>{notice}</AuthSuccess>}

      {step === 'credentials' ? (
        <form className="space-y-5" onSubmit={handleCredentials}>
          <div>
            <label htmlFor="email" className={AUTH_LABEL}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={AUTH_FIELD}
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className={AUTH_LABEL}>
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`${AUTH_FIELD} pr-20`}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-accent transition-opacity hover:opacity-80"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/protected_access/forgot-password"
              className="text-sm text-accent transition-opacity hover:opacity-80"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={buttonClass('primary', 'md', 'w-full')}
          >
            {loading && (
              <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            )}
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

          <div className="pt-2">
            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">ou</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl: '/protected_access' })}
              className={buttonClass('secondary', 'md', 'mt-4 w-full')}
            >
              Continuer avec GitHub
            </button>
            <p className="mt-2 text-center text-xs text-muted">
              Réservé aux comptes existants sans double authentification.
            </p>
          </div>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={handleCode}>
          <div>
            <label htmlFor="code" className={AUTH_LABEL}>
              Code de vérification
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              autoFocus
              className={`${AUTH_FIELD} text-center text-2xl tracking-[0.4em]`}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className={buttonClass('primary', 'md', 'w-full')}
          >
            {loading && (
              <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            )}
            {loading ? 'Vérification…' : 'Vérifier'}
          </button>

          {method === 'email' && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-accent transition-opacity hover:opacity-80 disabled:opacity-60"
              >
                Renvoyer le code
              </button>
            </div>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={backToCredentials}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
