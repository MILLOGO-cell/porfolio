'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LuArrowUpRight,
  LuExternalLink,
  LuEye,
  LuFolder,
  LuPencil,
  LuPlus,
  LuSettings,
  LuStar,
  LuTag,
  LuUsers,
} from 'react-icons/lu';
import AdminShell from '@/components/admin/AdminShell';
import StatCard from '@/components/admin/StatCard';
import { buttonClass } from '@/components/ui/button-styles';

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  context: string | null;
  role: string | null;
  challenges: string | null;
  outcome: string | null;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  updatedAt: string;
}

interface AdminStats {
  projects: { total: number; featured: number };
  visitors: {
    totalVisible: number;
    totalVisits: number;
    today: number;
    visitsToday: number;
  };
  topPages: Array<{ path: string; _count: { id: number } }>;
}

export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Pas de setLoading(true) : l'état initial vaut déjà true, et un setState
  // synchrone appelé depuis un effet déclenche un rendu en cascade.
  const fetchDashboardData = useCallback(async () => {
    try {
      const [projectsRes, statsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/protected_access/stats'),
      ]);

      const projectsData = await projectsRes.json();
      const statsData = await statsRes.json();

      if (projectsData.success) setProjects(projectsData.data.projects);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
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
      // La règle ne suit pas les `await` : les setState de fetchDashboardData
      // sont postérieurs au fetch, donc asynchrones.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDashboardData();
    }
  }, [status, fetchDashboardData]);

  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  const featuredCount = projects.filter((p) => p.featured).length;
  const uniqueTags = new Set(projects.flatMap((p) => p.tags)).size;
  const recentProjects = projects.slice(0, 5);

  /** Une fiche « complète » a ses quatre blocs d'étude de cas renseignés. */
  const isComplete = (p: Project) =>
    Boolean(p.context && p.role && p.challenges && p.outcome);
  const incompleteProjects = projects.filter((p) => !isComplete(p));

  return (
    <AdminShell
      title="Tableau de bord"
      description="Vue d'ensemble du portfolio et de sa fréquentation."
      actions={
        <>
          <Link
            href="/"
            target="_blank"
            className={buttonClass('secondary', 'sm')}
          >
            <LuExternalLink className="h-4 w-4" aria-hidden />
            Voir le site
          </Link>
          <Link
            href="/protected_access/projects"
            className={buttonClass('primary', 'sm')}
          >
            <LuPlus className="h-4 w-4" aria-hidden />
            Nouveau projet
          </Link>
        </>
      }
    >
      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-border bg-surface-muted"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Contenu
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Projets" value={projects.length} icon={LuFolder} />
              <StatCard label="En vedette" value={featuredCount} icon={LuStar} />
              <StatCard label="Tags" value={uniqueTags} icon={LuTag} />
              <StatCard
                label="Fiches à compléter"
                value={incompleteProjects.length}
                icon={LuPencil}
                hint={
                  incompleteProjects.length > 0
                    ? "Sans étude de cas complète"
                    : 'Toutes les fiches sont complètes'
                }
              />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Fréquentation
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Visiteurs aujourd'hui"
                value={stats?.visitors?.today ?? 0}
                icon={LuUsers}
              />
              <StatCard
                label="Visites aujourd'hui"
                value={stats?.visitors?.visitsToday ?? 0}
                icon={LuEye}
              />
              <StatCard
                label="Visiteurs au total"
                value={stats?.visitors?.totalVisible ?? 0}
                icon={LuUsers}
              />
              <StatCard
                label="Visites au total"
                value={stats?.visitors?.totalVisits ?? 0}
                icon={LuEye}
              />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="rounded-2xl border border-border bg-surface p-6 lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Projets récents
                </h2>
                <Link
                  href="/protected_access/projects"
                  className="inline-flex items-center gap-1.5 text-sm text-accent transition-opacity hover:opacity-80"
                >
                  Tout gérer
                  <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>

              {recentProjects.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted">
                  Aucun projet pour le moment.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {recentProjects.map((project) => (
                    <li
                      key={project.id}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {project.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          /projets/{project.slug}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {!project.published && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                            Brouillon
                          </span>
                        )}
                        {project.featured && (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                            Vedette
                          </span>
                        )}
                        {!isComplete(project) && (
                          <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                            À compléter
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="space-y-6">
              <section className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="mb-5 text-sm font-semibold text-foreground">
                  Pages les plus visitées
                </h2>

                {!stats?.topPages || stats.topPages.length === 0 ? (
                  <p className="text-sm text-muted">
                    Aucune donnée de visite pour le moment.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {stats.topPages.map((page, index) => (
                      <li
                        key={page.path}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span className="w-4 shrink-0 text-xs tabular-nums text-muted">
                            {index + 1}
                          </span>
                          <span className="truncate text-sm text-foreground">
                            {page.path}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-muted">
                          {page._count.id}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  Raccourcis
                </h2>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/protected_access/projects"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    <LuFolder className="h-4 w-4 text-accent" aria-hidden />
                    Gérer les projets
                  </Link>
                  <Link
                    href="/protected_access/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    <LuSettings className="h-4 w-4 text-accent" aria-hidden />
                    Paramètres du compte
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    <LuExternalLink className="h-4 w-4 text-accent" aria-hidden />
                    Voir le site public
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
