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
      router.push('/admin/login');
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
        router.push('/admin/login');
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
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
        router.push('/admin/login');
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
        setError(data.error || 'Erreur lors de l\'envoi');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Erreur lors de l\'envoi');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email || !method) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Vérification 2FA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {method === 'totp' 
              ? 'Entrez le code de votre application d\'authentification'
              : 'Entrez le code reçu par email'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {resendMessage && (
            <div className="rounded-md bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-green-800">{resendMessage}</p>
            </div>
          )}

          <div>
            <label htmlFor="code" className="sr-only">
              Code de vérification
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength={6}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 text-center text-2xl tracking-widest focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-3xl"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                {resendLoading ? 'Envoi...' : 'Renvoyer le code'}
              </button>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/admin/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}