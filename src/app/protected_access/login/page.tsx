'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

type Step = 'credentials' | 'code';

const inputClass =
  'mt-1 block w-full px-3 py-2 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba] text-sm';

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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ff] dark:bg-[#090016] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-[#0f041f] border border-[#9e91d0]/40 dark:border-[#4e2c9f] rounded-2xl shadow-lg px-8 py-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1f1238] dark:text-white">
            {step === 'credentials' ? 'Administration' : 'Vérification'}
          </h2>
          <p className="text-sm text-[#4b3a7a] dark:text-[#c4b9f0]">
            {step === 'credentials'
              ? 'Connectez-vous pour accéder au dashboard'
              : method === 'totp'
                ? "Entrez le code de votre application d'authentification"
                : 'Entrez le code reçu par email'}
          </p>
        </div>

        {(error || oauthError) && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/60 px-4 py-3">
            <p className="text-sm text-red-800 dark:text-red-100">
              {error ||
                "Connexion GitHub refusée. Ce compte n'est pas autorisé, ou la double authentification est active : utilisez votre email et votre mot de passe."}
            </p>
          </div>
        )}

        {notice && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-500/70 px-4 py-3">
            <p className="text-sm text-green-800 dark:text-green-100">{notice}</p>
          </div>
        )}

        {step === 'credentials' ? (
          <form className="mt-6 space-y-6" onSubmit={handleCredentials}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClass}
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff]"
                >
                  Mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block w-full px-3 py-2 pr-20 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba] text-sm"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-[#5f2eba] dark:text-[#c4b9f0] hover:text-[#4e2c9f] dark:hover:text-white focus:outline-none"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-center">
              <Link
                href="/protected_access/forgot-password"
                className="font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div className="mt-6">
              <div className="relative flex items-center">
                <div className="w-full border-t border-[#d4c9f5] dark:border-[#3b285f]" />
                <span className="mx-3 text-center text-xs text-[#8a7abf] dark:text-[#c4b9f0] bg-white dark:bg-[#0f041f] px-2">
                  Ou continuer avec
                </span>
                <div className="w-full border-t border-[#d4c9f5] dark:border-[#3b285f]" />
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() =>
                    signIn('github', { callbackUrl: '/protected_access' })
                  }
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-[#d4c9f5] dark:border-[#4e2c9f] rounded-lg bg-white dark:bg-[#140727] text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] hover:bg-[#f0eaff] dark:hover:bg-[#1b0b33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] transition-colors"
                >
                  Continuer avec GitHub
                </button>
                <p className="mt-2 text-center text-xs text-[#8a7abf] dark:text-[#c4b9f0]">
                  Réservé aux comptes existants sans double authentification.
                </p>
              </div>
            </div>
          </form>
        ) : (
          <form className="mt-6 space-y-6" onSubmit={handleCode}>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1"
              >
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
                className="mt-1 block w-full px-3 py-3 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-[#1f1238] dark:text-white placeholder-[#9e91d0] text-center text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba]"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                autoComplete="one-time-code"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>

            {method === 'email' && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white disabled:opacity-60"
                >
                  Renvoyer le code
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={backToCredentials}
                className="text-sm font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
