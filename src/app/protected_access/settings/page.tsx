'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LuCircleCheck,
  LuKeyRound,
  LuMail,
  LuShieldCheck,
  LuSmartphone,
  LuTriangleAlert,
  LuUser,
} from 'react-icons/lu';
import AdminShell from '@/components/admin/AdminShell';
import { buttonClass } from '@/components/ui/button-styles';
import { getGravatarUrl } from '@/lib/gravatar';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  profileImage: string | null;
  twoFactorEnabled: boolean;
  twoFactorMethod: string | null;
  createdAt: string;
}

type TabType = 'profile' | 'security' | '2fa';
type Step2FA = 'choose' | 'totp-verify' | 'email-verify';

/** Doit rester aligné sur `passwordSchema` côté serveur. */
const MIN_PASSWORD_LENGTH = 12;

const FIELD =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';
const LABEL = 'mb-1.5 block text-sm font-medium text-foreground';

const TABS: { id: TabType; label: string; icon: typeof LuUser }[] = [
  { id: 'profile', label: 'Profil', icon: LuUser },
  { id: 'security', label: 'Mot de passe', icon: LuKeyRound },
  { id: '2fa', label: 'Double authentification', icon: LuShieldCheck },
];

export default function SettingsPage() {
  const { status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [useGravatar, setUseGravatar] = useState(true);
  const [uploadedImage, setUploadedImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [qrCode, setQrCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [step2FA, setStep2FA] = useState<Step2FA>('choose');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Pas de setLoading(true) : l'état initial vaut déjà true, et un setState
  // synchrone appelé depuis un effet déclenche un rendu en cascade.
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setName(data.data.name || '');
        setUploadedImage(data.data.profileImage || '');
        setUseGravatar(!data.data.profileImage);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/protected_access/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      // La règle ne suit pas les `await` : les setState de fetchProfile sont
      // postérieurs au fetch, donc asynchrones.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfile();
    }
  }, [status, fetchProfile]);

  const resetFeedback = () => {
    setMessage('');
    setError('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    resetFeedback();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedImage(data.data.url);
        setUseGravatar(false);
      } else {
        setError(data.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      setError("Erreur lors de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    resetFeedback();

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          // Chaîne vide = retirer l'image et retomber sur Gravatar.
          profileImage: useGravatar ? '' : uploadedImage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Profil mis à jour.');
        await update();
        fetchProfile();
      } else {
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleChangePassword = async () => {
    resetFeedback();

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`
      );
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Mot de passe modifié.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du changement de mot de passe');
    }
  };

  const handleSetupTOTP = async () => {
    resetFeedback();

    try {
      const response = await fetch('/api/user/2fa/totp/setup', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setQrCode(data.data.qrCode);
        setTotpSecret(data.data.secret);
        setStep2FA('totp-verify');
      } else {
        setError(data.error || 'Erreur lors de la configuration');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la configuration');
    }
  };

  const handleVerifyTOTP = async () => {
    resetFeedback();

    try {
      const response = await fetch('/api/user/2fa/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: totpToken }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Double authentification activée.');
        setStep2FA('choose');
        setTotpToken('');
        fetchProfile();
      } else {
        setError(data.error || 'Code invalide');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la vérification');
    }
  };

  const handleSetupEmail2FA = async () => {
    resetFeedback();

    try {
      const response = await fetch('/api/user/2fa/email/setup', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setMessage('Code envoyé par email.');
        setStep2FA('email-verify');
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur');
    }
  };

  const handleVerifyEmail2FA = async () => {
    resetFeedback();

    try {
      const response = await fetch('/api/user/2fa/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: emailCode }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Double authentification par email activée.');
        setStep2FA('choose');
        setEmailCode('');
        fetchProfile();
      } else {
        setError(data.error || 'Code invalide');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur');
    }
  };

  const handleDisable2FA = async (method: 'totp' | 'email') => {
    if (
      !confirm(
        'Désactiver la double authentification ? Votre compte ne sera plus protégé que par son mot de passe.'
      )
    ) {
      return;
    }

    resetFeedback();

    try {
      const response = await fetch(`/api/user/2fa/${method}/disable`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setMessage('Double authentification désactivée.');
        fetchProfile();
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur');
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  const avatarSrc = useGravatar
    ? profile?.email
      ? getGravatarUrl(profile.email)
      : null
    : uploadedImage || null;

  return (
    <AdminShell
      title="Paramètres"
      description="Profil, mot de passe et double authentification."
    >
      {loading || !profile ? (
        <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface-muted" />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  resetFeedback();
                }}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
                  activeTab === id
                    ? 'bg-accent-soft text-accent'
                    : 'text-muted hover:bg-surface-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {message && (
              <div
                role="status"
                className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <LuCircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
              >
                <LuTriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'profile' && (
              <section className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="mb-6 text-base font-semibold text-foreground">
                  Profil
                </h2>

                <div className="mb-6 flex items-center gap-5">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt=""
                      width={72}
                      height={72}
                      className="h-18 w-18 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-accent-soft text-xl font-medium text-accent">
                      {name.charAt(0) || profile.email.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <label className="mb-2 flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={useGravatar}
                        onChange={(e) => setUseGravatar(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                      />
                      Utiliser Gravatar
                    </label>

                    {!useGravatar && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3.5 file:py-1.5 file:text-sm file:font-medium file:text-accent disabled:opacity-60"
                      />
                    )}
                    {uploading && (
                      <p className="mt-1.5 text-xs text-muted">Envoi en cours…</p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className={LABEL}>
                      Nom affiché
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={LABEL}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className={`${FIELD} cursor-not-allowed opacity-60`}
                    />
                    <p className="mt-1.5 text-xs text-muted">
                      L&apos;email identifie le compte et ne peut pas être modifié
                      ici.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className={buttonClass('primary', 'md')}
                  >
                    Enregistrer
                  </button>
                </div>
              </section>
            )}

            {activeTab === 'security' && (
              <section className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="mb-6 text-base font-semibold text-foreground">
                  Mot de passe
                </h2>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="currentPassword" className={LABEL}>
                      Mot de passe actuel
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className={LABEL}>
                      Nouveau mot de passe
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={`${MIN_PASSWORD_LENGTH} caractères minimum`}
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className={LABEL}>
                      Confirmer
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={FIELD}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className={buttonClass('primary', 'md')}
                  >
                    Modifier le mot de passe
                  </button>
                </div>
              </section>
            )}

            {activeTab === '2fa' && (
              <section className="rounded-2xl border border-border bg-surface p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      Double authentification
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      Un second facteur est exigé à chaque connexion.
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      profile.twoFactorEnabled
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border border-amber-500/40 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {profile.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                  </span>
                </div>

                {profile.twoFactorEnabled ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted p-4">
                      {profile.twoFactorMethod === 'totp' ? (
                        <LuSmartphone className="h-5 w-5 text-accent" aria-hidden />
                      ) : (
                        <LuMail className="h-5 w-5 text-accent" aria-hidden />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {profile.twoFactorMethod === 'totp'
                            ? "Application d'authentification"
                            : 'Code par email'}
                        </p>
                        <p className="text-xs text-muted">
                          Méthode actuellement active
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDisable2FA(
                          profile.twoFactorMethod === 'totp' ? 'totp' : 'email'
                        )
                      }
                      className="rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400"
                    >
                      Désactiver
                    </button>
                  </div>
                ) : step2FA === 'choose' ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleSetupTOTP}
                      className="flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-colors hover:border-accent/40"
                    >
                      <LuSmartphone className="h-5 w-5 text-accent" aria-hidden />
                      <span className="text-sm font-medium text-foreground">
                        Application d&apos;authentification
                      </span>
                      <span className="text-xs text-muted">
                        Google Authenticator, Authy… Recommandé : fonctionne hors
                        ligne.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSetupEmail2FA}
                      className="flex flex-col items-start gap-3 rounded-xl border border-border p-5 text-left transition-colors hover:border-accent/40"
                    >
                      <LuMail className="h-5 w-5 text-accent" aria-hidden />
                      <span className="text-sm font-medium text-foreground">
                        Code par email
                      </span>
                      <span className="text-xs text-muted">
                        Un code à six chiffres envoyé à chaque connexion.
                      </span>
                    </button>
                  </div>
                ) : step2FA === 'totp-verify' ? (
                  <div className="space-y-5">
                    <p className="text-sm text-muted">
                      Scannez ce QR code avec votre application, puis entrez le
                      code affiché.
                    </p>

                    {qrCode && (
                      <div className="flex justify-center rounded-xl border border-border bg-white p-4">
                        {/* Image en data: URI générée par le serveur — next/image
                            n'apporte rien ici et refuserait le format. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCode} alt="QR code" className="h-44 w-44" />
                      </div>
                    )}

                    {totpSecret && (
                      <div>
                        <p className={LABEL}>Ou saisissez cette clé manuellement</p>
                        <code className="block break-all rounded-xl border border-border bg-surface-muted px-3.5 py-2.5 font-mono text-xs text-foreground">
                          {totpSecret}
                        </code>
                      </div>
                    )}

                    <div>
                      <label htmlFor="totpToken" className={LABEL}>
                        Code à six chiffres
                      </label>
                      <input
                        id="totpToken"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={totpToken}
                        onChange={(e) =>
                          setTotpToken(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="000000"
                        className={`${FIELD} text-center text-xl tracking-[0.4em]`}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep2FA('choose')}
                        className={buttonClass('secondary', 'md')}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyTOTP}
                        disabled={totpToken.length !== 6}
                        className={buttonClass('primary', 'md')}
                      >
                        Activer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <p className="text-sm text-muted">
                      Un code vient d&apos;être envoyé à {profile.email}. Il expire
                      dans dix minutes.
                    </p>

                    <div>
                      <label htmlFor="emailCode" className={LABEL}>
                        Code reçu
                      </label>
                      <input
                        id="emailCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={emailCode}
                        onChange={(e) =>
                          setEmailCode(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="000000"
                        className={`${FIELD} text-center text-xl tracking-[0.4em]`}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep2FA('choose')}
                        className={buttonClass('secondary', 'md')}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyEmail2FA}
                        disabled={emailCode.length !== 6}
                        className={buttonClass('primary', 'md')}
                      >
                        Activer
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
