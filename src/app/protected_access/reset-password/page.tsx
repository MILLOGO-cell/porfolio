'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LuLoaderCircle } from 'react-icons/lu';
import AuthCard, {
  AUTH_FIELD,
  AUTH_LABEL,
  AuthError,
  AuthSuccess,
} from '@/components/admin/AuthCard';
import { buttonClass } from '@/components/ui/button-styles';

/** Doit rester aligné sur `passwordSchema` côté serveur. */
const MIN_PASSWORD_LENGTH = 12;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (password !== confirmPassword) {
      setSubmitError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setSubmitError(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`
      );
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
        setSubmitError(data.error || 'Une erreur est survenue');
      }
    } catch {
      setSubmitError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const loginLink = (
    <Link
      href="/protected_access/login"
      className="text-accent transition-opacity hover:opacity-80"
    >
      Retour à la connexion
    </Link>
  );

  // Dérivé du rendu plutôt que posé par un effet : le token est connu dès le
  // premier rendu.
  if (!token) {
    return (
      <AuthCard title="Lien invalide" footer={loginLink}>
        <AuthError>
          Le lien de réinitialisation est invalide ou a expiré.
        </AuthError>
        <Link
          href="/protected_access/forgot-password"
          className={buttonClass('secondary', 'md', 'w-full')}
        >
          Demander un nouveau lien
        </Link>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard title="Mot de passe modifié">
        <AuthSuccess>
          Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous
          connecter.
        </AuthSuccess>
        <Link
          href="/protected_access/login"
          className={buttonClass('primary', 'md', 'w-full')}
        >
          Se connecter
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Nouveau mot de passe"
      description={`Choisissez un mot de passe d'au moins ${MIN_PASSWORD_LENGTH} caractères.`}
      footer={loginLink}
    >
      {submitError && <AuthError>{submitError}</AuthError>}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password" className={AUTH_LABEL}>
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className={`${AUTH_FIELD} pr-20`}
              placeholder={`${MIN_PASSWORD_LENGTH} caractères minimum`}
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

        <div>
          <label htmlFor="confirmPassword" className={AUTH_LABEL}>
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            className={AUTH_FIELD}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={
            loading ||
            password.length < MIN_PASSWORD_LENGTH ||
            password !== confirmPassword
          }
          className={buttonClass('primary', 'md', 'w-full')}
        >
          {loading && (
            <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          )}
          {loading ? 'Enregistrement…' : 'Réinitialiser'}
        </button>
      </form>
    </AuthCard>
  );
}
