'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Verify2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');
  const method = searchParams?.get('method');

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (!email || !method) {
      router.push('/protected_access/login');
    }
  }, [email, method, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const password = sessionStorage.getItem('temp_password');

      if (!password) {
        setError('Session expirée');
        router.push('/protected_access/login');
        return;
      }

      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, code, method }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.removeItem('temp_password');

        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Erreur de connexion');
          return;
        }

        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Code invalide');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      const password = sessionStorage.getItem('temp_password');

      if (!password) {
        setError('Session expirée');
        router.push('/protected_access/login');
        return;
      }

      const response = await fetch('/api/auth/send-2fa-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setResendMessage('Code renvoyé avec succès');
      } else {
        setError(data.error || "Erreur lors de l'envoi");
      }
    } catch {
      setError("Erreur lors de l'envoi");
    } finally {
      setResendLoading(false);
    }
  };

  if (!email || !method) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ff] dark:bg-[#090016] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-[#0f041f] border border-[#9e91d0]/40 dark:border-[#4e2c9f] rounded-2xl shadow-lg px-8 py-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1f1238] dark:text-white">
            Vérification 2FA
          </h2>
          <p className="text-sm text-[#4b3a7a] dark:text-[#c4b9f0]">
            {method === 'totp'
              ? "Entrez le code de votre application d'authentification"
              : 'Entrez le code reçu par email'}
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleVerify}>
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/70 px-4 py-3">
              <p className="text-sm text-red-800 dark:text-red-100">{error}</p>
            </div>
          )}

          {resendMessage && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-500/70 px-4 py-3">
              <p className="text-sm text-green-800 dark:text-green-100">
                {resendMessage}
              </p>
            </div>
          )}

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
              required
              maxLength={6}
              className="mt-1 block w-full px-3 py-3 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-[#1f1238] dark:text-white placeholder-[#9e91d0] text-center text-2xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba]"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              autoComplete="off"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="group relative w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </div>

          {method === 'email' && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-sm font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white disabled:opacity-60"
              >
                {resendLoading ? 'Envoi...' : 'Renvoyer le code'}
              </button>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/protected_access/login"
              className="text-sm font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white"
            >
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
