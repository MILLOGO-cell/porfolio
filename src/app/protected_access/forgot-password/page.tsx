'use client';

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  if (success) {
    return (
      <AuthCard
        title="Email envoyé"
        description="Si cet email existe, un lien de réinitialisation vient d'être envoyé."
        footer={
          <Link
            href="/protected_access/login"
            className="text-accent transition-opacity hover:opacity-80"
          >
            Retour à la connexion
          </Link>
        }
      >
        <AuthSuccess>
          Le lien expire dans une heure. Pensez à vérifier votre dossier
          indésirables.
        </AuthSuccess>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      description="Nous vous enverrons un lien de réinitialisation."
      footer={
        <Link
          href="/protected_access/login"
          className="text-accent transition-opacity hover:opacity-80"
        >
          Retour à la connexion
        </Link>
      }
    >
      {error && <AuthError>{error}</AuthError>}

      <form className="space-y-5" onSubmit={handleSubmit}>
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

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className={buttonClass('primary', 'md', 'w-full')}
        >
          {loading && (
            <LuLoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          )}
          {loading ? 'Envoi…' : 'Envoyer le lien'}
        </button>
      </form>
    </AuthCard>
  );
}
