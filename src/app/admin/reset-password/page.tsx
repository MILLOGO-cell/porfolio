'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token manquant');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ff] dark:bg-[#090016] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/70 rounded-2xl px-6 py-6 text-center shadow-md">
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-100 mb-2">
              Lien invalide
            </h3>
            <p className="text-sm text-red-600 dark:text-red-100">
              Le lien de réinitialisation est invalide ou a expiré.
            </p>
          </div>

          <Link
            href="/admin/forgot-password"
            className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] transition-colors"
          >
            Demander un nouveau lien
          </Link>

          <Link
            href="/admin/login"
            className="w-full flex justify-center py-2.5 px-4 border border-[#d4c9f5] dark:border-[#4e2c9f] text-sm font-medium rounded-lg text-[#3b2b6a] dark:text-[#e7e0ff] bg-white dark:bg-[#140727] hover:bg-[#f0eaff] dark:hover:bg-[#1b0b33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ff] dark:bg-[#090016] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-500/70 rounded-2xl px-6 py-6 shadow-md">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-1">
              Succès
            </h3>
            <p className="text-sm text-green-700 dark:text-green-100 mb-2">
              Mot de passe réinitialisé
            </p>
            <p className="text-sm text-green-700 dark:text-green-100">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
          </div>

          <Link
            href="/admin/login"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] transition-colors"
          >
            Se connecter maintenant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ff] dark:bg-[#090016] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-[#0f041f] border border-[#9e91d0]/40 dark:border-[#4e2c9f] rounded-2xl shadow-lg px-8 py-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1f1238] dark:text-white">
            Nouveau mot de passe
          </h2>
          <p className="text-sm text-[#4b3a7a] dark:text-[#c4b9f0]">
            Choisissez un mot de passe sécurisé (minimum 6 caractères)
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/70 px-4 py-3">
              <p className="text-sm text-red-800 dark:text-red-100">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff]"
              >
                Nouveau mot de passe
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="mt-1 block w-full px-3 py-2 pr-20 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba] text-sm"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-0 top-8 px-3 text-xs font-medium text-[#5f2eba] dark:text-[#c4b9f0] hover:text-[#4e2c9f] dark:hover:text-white focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff]"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                className="mt-1 block w-full px-3 py-2 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba] text-sm"
                placeholder="Répétez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#090016] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/admin/login"
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
