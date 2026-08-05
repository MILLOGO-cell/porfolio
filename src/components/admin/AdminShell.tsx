'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LuLogOut } from 'react-icons/lu';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import { getGravatarUrl } from '@/lib/gravatar';

const navItems = [
  { href: '/protected_access', label: 'Tableau de bord' },
  { href: '/protected_access/projects', label: 'Projets' },
  { href: '/protected_access/settings', label: 'Paramètres' },
];

/**
 * Coquille commune aux pages d'administration.
 *
 * Elle existe pour supprimer la barre de navigation qui était recopiée à
 * l'identique dans les trois pages : toute modification devait être répétée
 * trois fois, et les trois versions avaient déjà divergé.
 */
export default function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  /** Boutons propres à la page, alignés à droite du titre. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const email = session?.user?.email;
  const userImage = session?.user?.image || (email ? getGravatarUrl(email) : null);

  const isActive = (href: string) =>
    href === '/protected_access' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link
                href="/protected_access"
                className="text-sm font-bold tracking-tight text-foreground"
              >
                Administration
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isActive(href)
                        ? 'bg-accent-soft text-accent'
                        : 'text-muted hover:bg-surface-muted hover:text-foreground'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <ThemeSwitcher />

              <div className="hidden items-center gap-2.5 sm:flex">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm font-medium text-accent">
                    {session?.user?.name?.charAt(0) ?? 'A'}
                  </div>
                )}
                <span className="max-w-[14rem] truncate text-sm text-muted">
                  {email}
                </span>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/protected_access/login' })}
                className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-3.5 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-600/50 hover:bg-red-600/15 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/15"
              >
                <LuLogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Navigation mobile : le tiroir latéral serait excessif pour trois liens. */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-3 md:hidden">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive(href)
                    ? 'bg-accent-soft text-accent'
                    : 'text-muted hover:bg-surface-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1.5 text-sm text-muted">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {children}
      </main>
    </div>
  );
}
