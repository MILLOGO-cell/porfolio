'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGravatarUrl } from '@/lib/gravatar';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiUser, HiShieldCheck, HiLockClosed, HiCamera, HiMail, HiDeviceMobile, HiCheck, HiX } from 'react-icons/hi';

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
type Step2FA = 'choose' | 'totp-setup' | 'totp-verify' | 'email-setup' | 'email-verify';

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        setName(data.data.name || '');
        setUploadedImage(data.data.profileImage || '');
        setUseGravatar(!data.data.profileImage);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

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
        setError(data.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setError('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          profileImage: useGravatar ? null : uploadedImage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Profil mis à jour avec succès');
        await update();
        fetchProfile();
      } else {
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleChangePassword = async () => {
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
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
        setMessage('Mot de passe modifié avec succès');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du changement de mot de passe');
    }
  };

  const handleSetupTOTP = async () => {
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/2fa/totp/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setQrCode(data.data.qrCode);
        setTotpSecret(data.data.secret);
        setStep2FA('totp-verify');
      } else {
        setError(data.error || 'Erreur lors de la configuration');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la configuration');
    }
  };

  const handleVerifyTOTP = async () => {
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/2fa/totp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: totpToken }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('2FA TOTP activé avec succès');
        setStep2FA('choose');
        setTotpToken('');
        fetchProfile();
      } else {
        setError(data.error || 'Code invalide');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la vérification');
    }
  };

  const handleDisableTOTP = async () => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver le 2FA ?')) return;

    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/2fa/totp/disable', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('2FA désactivé avec succès');
        fetchProfile();
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur');
    }
  };

  const handleSetupEmail2FA = async () => {
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/2fa/email/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Code envoyé par email');
        setStep2FA('email-verify');
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur');
    }
  };

  const handleVerifyEmail2FA = async () => {
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/2fa/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: emailCode }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('2FA par email activé avec succès');
        setStep2FA('choose');
        setEmailCode('');
        fetchProfile();
      } else {
        setError(data.error || 'Code invalide');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur');
    }
  };

  const handleDisableEmail2FA = async () => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver le 2FA ?')) return;

    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/user/2fa/email/disable', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('2FA par email désactivé avec succès');
        fetchProfile();
      } else {
        setError(data.error || 'Erreur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (status === 'loading' || loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-lg h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400"
        />
      </div>
    );
  }

  const gravatarUrl = getGravatarUrl(profile.email);
  const displayImage = useGravatar ? gravatarUrl : (uploadedImage || gravatarUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <HiArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Paramètres
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gérez votre compte et vos préférences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={displayImage}
                alt="Profile"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg ring-2 ring-indigo-500 dark:ring-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
          >
            <HiCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">{message}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3"
          >
            <HiX className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <nav className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
              {[
                { id: 'profile', label: 'Profil', icon: HiUser },
                { id: 'security', label: 'Sécurité', icon: HiLockClosed },
                { id: '2fa', label: '2FA', icon: HiShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <HiUser className="h-6 w-6" />
                      Photo de profil
                    </h2>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="relative">
                        <Image
                          src={displayImage}
                          alt="Profile"
                          width={120}
                          height={120}
                          className="h-28 w-28 md:h-32 md:w-32 rounded-lg object-cover ring-4 ring-indigo-500 dark:ring-indigo-400 shadow-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg p-2 shadow-lg">
                          <HiCamera className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                            <input
                              type="radio"
                              id="gravatar"
                              checked={useGravatar}
                              onChange={() => setUseGravatar(true)}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                            />
                            <label htmlFor="gravatar" className="flex-1 text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                              Utiliser Gravatar
                            </label>
                          </div>
                          <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                id="upload"
                                checked={!useGravatar}
                                onChange={() => setUseGravatar(false)}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                              />
                              <label htmlFor="upload" className="flex-1 text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                Télécharger une photo
                              </label>
                            </div>
                            {!useGravatar && (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 dark:file:bg-indigo-900/30
                                file:text-indigo-700 dark:file:text-indigo-400
                                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50
                                file:transition-colors"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                        placeholder="Votre nom"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Adresse email
                      </label>
                      <div className="relative">
                        <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Enregistrer les modifications
                    </motion.button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <HiLockClosed className="h-6 w-6" />
                    Changer le mot de passe
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Changer le mot de passe
                  </motion.button>
                </div>
              )}

              {activeTab === '2fa' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <HiShieldCheck className="h-6 w-6" />
                      Authentification à deux facteurs
                    </h2>
                    {profile.twoFactorEnabled ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 mt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-green-500 rounded-lg p-2">
                            <HiCheck className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-800 dark:text-green-300">
                              2FA activé
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              via {profile.twoFactorMethod === 'totp' ? 'Application TOTP' : 'Email'}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={profile.twoFactorMethod === 'totp' ? handleDisableTOTP : handleDisableEmail2FA}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg transition-colors"
                        >
                          Désactiver le 2FA
                        </motion.button>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          Renforcez la sécurité de votre compte en activant l&apos;authentification à deux facteurs.
                        </p>
                      </div>
                    )}
                  </div>

                  {!profile.twoFactorEnabled && (
                    <>
                      {step2FA === 'choose' && (
                        <div className="space-y-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSetupTOTP}
                            className="w-full flex items-center justify-between p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-4 group-hover:scale-110 transition-transform">
                                <HiDeviceMobile className="h-7 w-7 text-white" />
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white text-lg">Application TOTP</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Google Authenticator, Authy, etc.</p>
                              </div>
                            </div>
                            <svg className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSetupEmail2FA}
                            className="w-full flex items-center justify-between p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 group-hover:scale-110 transition-transform">
                                <HiMail className="h-7 w-7 text-white" />
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white text-lg">Email</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Recevoir un code par email</p>
                              </div>
                            </div>
                            <svg className="h-6 w-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        </div>
                      )}

                      {step2FA === 'totp-verify' && (
                        <div className="space-y-6">
                          <button
                            onClick={() => setStep2FA('choose')}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-2"
                          >
                            <HiArrowLeft className="h-4 w-4" />
                            Retour
                          </button>
                          
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-indigo-200 dark:border-indigo-800">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                              Scannez ce QR code
                            </h3>
                            {qrCode && (
                              <div className="flex justify-center mb-4">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                  <Image
                                    src={qrCode}
                                    alt="QR Code"
                                    width={200}
                                    height={200}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Clé manuelle :
                              </p>
                              <code className="block bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-gray-900 dark:text-white font-mono text-sm break-all">
                                {totpSecret}
                              </code>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Entrez le code à 6 chiffres
                            </label>
                            <input
                              type="text"
                              value={totpToken}
                              onChange={(e) => setTotpToken(e.target.value)}
                              maxLength={6}
                              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-300 text-center text-2xl font-mono tracking-widest"
                              placeholder="000000"
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleVerifyTOTP}
                            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Vérifier et activer
                          </motion.button>
                        </div>
                      )}

                      {step2FA === 'email-verify' && (
                        <div className="space-y-6">
                          <button
                            onClick={() => setStep2FA('choose')}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-2"
                          >
                            <HiArrowLeft className="h-4 w-4" />
                            Retour
                          </button>

                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-3 mb-3">
                              <HiMail className="h-6 w-6 text-green-600 dark:text-green-400" />
                              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                Vérifiez votre email
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Un code de vérification a été envoyé à <strong>{profile.email}</strong>
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Entrez le code reçu par email
                            </label>
                            <input
                              type="text"
                              value={emailCode}
                              onChange={(e) => setEmailCode(e.target.value)}
                              maxLength={6}
                              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-300 text-center text-2xl font-mono tracking-widest"
                              placeholder="000000"
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleVerifyEmail2FA}
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Vérifier et activer
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSetupEmail2FA}
                            className="w-full px-6 py-3 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg font-semibold border-2 border-green-200 dark:border-green-800 transition-all duration-300"
                          >
                            Renvoyer le code
                          </motion.button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}