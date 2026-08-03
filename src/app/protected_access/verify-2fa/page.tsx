import { redirect } from 'next/navigation';

/**
 * PAGE NEUTRALISÉE — le dossier entier est à supprimer.
 *
 * L'étape 2FA se fait maintenant sur /protected_access/login, en deux temps,
 * sans navigation intermédiaire. L'ancienne page stockait le mot de passe en
 * clair dans sessionStorage pour survivre au changement d'URL.
 */
export default function Verify2FAPage() {
  redirect('/protected_access/login');
}
