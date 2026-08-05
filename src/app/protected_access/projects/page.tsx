'use client';

import { useCallback, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LuExternalLink,
  LuFolderPlus,
  LuImageOff,
  LuPencil,
  LuPlus,
  LuTrash2,
  LuX,
} from 'react-icons/lu';
import AdminShell from '@/components/admin/AdminShell';
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
  client: string | null;
  period: string | null;
  stack: string[];
  url: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM = {
  slug: '',
  title: '',
  summary: '',
  description: '',
  context: '',
  role: '',
  challenges: '',
  outcome: '',
  client: '',
  period: '',
  stack: '',
  url: '',
  repoUrl: '',
  imageUrl: '',
  tags: '',
  featured: false,
  published: true,
  position: 0,
};

/** « React, Django, PostgreSQL » -> ['React', 'Django', 'PostgreSQL'] */
const splitList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const FIELD =
  'w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

const LABEL = 'mb-1.5 block text-sm font-medium text-foreground';
const HINT = 'mt-1.5 text-xs text-muted';

/** Les quatre blocs qui font la différence entre une vignette et une étude de cas. */
const CASE_STUDY_FIELDS = [
  {
    key: 'context' as const,
    label: 'Contexte',
    hint: 'Le besoin métier et les contraintes de départ.',
  },
  {
    key: 'role' as const,
    label: 'Mon rôle',
    hint: 'Le périmètre réellement tenu : conception, développement, intégration, encadrement.',
  },
  {
    key: 'challenges' as const,
    label: 'Approche technique',
    hint: 'Les décisions structurantes et ce qui les a motivées.',
  },
  {
    key: 'outcome' as const,
    label: 'Résultat',
    hint: 'Ce qui a été livré et ce que cela a changé.',
  },
];

export default function ProjectsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [searchTag, setSearchTag] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  // Pas de setLoading(true) : l'état initial vaut déjà true, et un setState
  // synchrone appelé depuis un effet déclenche un rendu en cascade.
  const fetchProjects = useCallback(async () => {
    try {
      let url = '/api/projects';
      const params = new URLSearchParams();

      if (filter === 'featured') params.append('featured', 'true');
      if (searchTag) params.append('tag', searchTag);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) setProjects(data.data.projects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTag]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/protected_access/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      // La règle ne suit pas les `await` : les setState de fetchProjects sont
      // postérieurs au fetch, donc asynchrones.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProjects();
    }
  }, [status, fetchProjects]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
      } else {
        alert(data.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const payload = {
      // Laissé vide, le slug est dérivé du titre côté serveur.
      slug: formData.slug || undefined,
      title: formData.title,
      summary: formData.summary || null,
      description: formData.description || null,
      context: formData.context || null,
      role: formData.role || null,
      challenges: formData.challenges || null,
      outcome: formData.outcome || null,
      client: formData.client || null,
      period: formData.period || null,
      stack: splitList(formData.stack),
      url: formData.url || null,
      repoUrl: formData.repoUrl || null,
      imageUrl: formData.imageUrl || null,
      tags: splitList(formData.tags),
      featured: formData.featured,
      published: formData.published,
      position: Number(formData.position) || 0,
    };

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowModal(false);
        setEditingProject(null);
        setFormData(EMPTY_FORM);
        fetchProjects();
      } else if (data.errors) {
        setFormErrors(data.errors);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Supprimer définitivement « ${project.title} » ?`)) return;

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      if (response.ok) fetchProjects();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormErrors({});
    setFormData({
      slug: project.slug ?? '',
      title: project.title,
      summary: project.summary || '',
      description: project.description || '',
      context: project.context || '',
      role: project.role || '',
      challenges: project.challenges || '',
      outcome: project.outcome || '',
      client: project.client || '',
      period: project.period || '',
      stack: (project.stack ?? []).join(', '),
      url: project.url || '',
      repoUrl: project.repoUrl || '',
      imageUrl: project.imageUrl || '',
      tags: project.tags.join(', '),
      featured: project.featured,
      published: project.published ?? true,
      position: project.position ?? 0,
    });
    setImageInputType(project.imageUrl?.startsWith('/uploads') ? 'upload' : 'url');
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData(EMPTY_FORM);
    setFormErrors({});
    setImageInputType('upload');
    setShowModal(true);
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  const isComplete = (p: Project) =>
    Boolean(p.context && p.role && p.challenges && p.outcome);

  const filterButton = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm transition-colors ${
      active
        ? 'bg-accent text-white'
        : 'border border-border text-muted hover:border-accent/40 hover:text-foreground'
    }`;

  return (
    <AdminShell
      title="Projets"
      description="Créer, modifier et publier les fiches du portfolio."
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className={buttonClass('primary', 'sm')}
        >
          <LuPlus className="h-4 w-4" aria-hidden />
          Nouveau projet
        </button>
      }
    >
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="tag-filter" className={LABEL}>
            Filtrer par tag
          </label>
          <input
            id="tag-filter"
            type="text"
            placeholder="React, Django, Next.js…"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className={FIELD}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={filterButton(filter === 'all')}
          >
            Tous ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('featured')}
            className={filterButton(filter === 'featured')}
          >
            En vedette
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-border bg-surface-muted"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
          <LuFolderPlus className="h-7 w-7 text-muted" aria-hidden />
          <div>
            <h2 className="font-semibold text-foreground">Aucun projet</h2>
            <p className="mt-1 text-sm text-muted">
              {searchTag || filter === 'featured'
                ? 'Aucun projet ne correspond à ce filtre.'
                : 'Commencez par créer votre première fiche.'}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className={buttonClass('secondary', 'md')}
          >
            <LuPlus className="h-4 w-4" aria-hidden />
            Nouveau projet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/40"
            >
              <div className="relative h-36 bg-surface-muted">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <LuImageOff className="h-5 w-5 text-muted" aria-hidden />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
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

                <h2 className="text-base font-semibold text-foreground">
                  {project.title}
                </h2>
                <p className="mt-0.5 truncate text-xs text-muted">
                  /projets/{project.slug}
                </p>

                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {project.summary || project.description || 'Aucune description'}
                </p>

                {project.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex items-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className={buttonClass('secondary', 'sm', 'flex-1')}
                  >
                    <LuPencil className="h-3.5 w-3.5" aria-hidden />
                    Modifier
                  </button>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ouvrir ${project.title}`}
                      className="rounded-full border border-border p-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <LuExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    aria-label={`Supprimer ${project.title}`}
                    className="rounded-full border border-border p-2 text-muted transition-colors hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm md:p-8">
          <div className="custom-scrollbar relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background shadow-float">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label htmlFor="title" className={LABEL}>
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={FIELD}
                />
                {formErrors.title && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {formErrors.title[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="slug" className={LABEL}>
                  Slug (URL)
                </label>
                <input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="laissez vide pour le dériver du titre"
                  className={FIELD}
                />
                <p className={HINT}>
                  Adresse de la fiche : /projets/{formData.slug || 'mon-projet'}
                </p>
                {formErrors.slug && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                    {formErrors.slug[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="summary" className={LABEL}>
                  Accroche
                </label>
                <textarea
                  id="summary"
                  rows={2}
                  maxLength={300}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Une ou deux phrases : ce qui apparaît sur la carte et dans les résultats de recherche."
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor="description" className={LABEL}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={FIELD}
                />
              </div>

              <fieldset className="space-y-5 border-t border-border pt-5">
                <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  Étude de cas
                </legend>

                {/* Deux colonnes dès `lg` : la modale est large, une colonne
                    unique étirerait les zones de texte sur toute la largeur. */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {CASE_STUDY_FIELDS.map(({ key, label, hint }) => (
                    <div key={key}>
                      <label htmlFor={key} className={LABEL}>
                        {label}
                      </label>
                      <textarea
                        id={key}
                        rows={6}
                        value={formData[key]}
                        onChange={(e) =>
                          setFormData({ ...formData, [key]: e.target.value })
                        }
                        className={FIELD}
                      />
                      <p className={HINT}>{hint}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="client" className={LABEL}>
                      Client ou secteur
                    </label>
                    <input
                      id="client"
                      type="text"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      placeholder="Banque de détail"
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label htmlFor="period" className={LABEL}>
                      Période
                    </label>
                    <input
                      id="period"
                      type="text"
                      value={formData.period}
                      onChange={(e) =>
                        setFormData({ ...formData, period: e.target.value })
                      }
                      placeholder="2024 — 2025"
                      className={FIELD}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="stack" className={LABEL}>
                    Stack technique
                  </label>
                  <input
                    id="stack"
                    type="text"
                    value={formData.stack}
                    onChange={(e) =>
                      setFormData({ ...formData, stack: e.target.value })
                    }
                    placeholder="Django REST, PostgreSQL, Docker, SOAP"
                    className={FIELD}
                  />
                  <p className={HINT}>
                    Séparées par des virgules. Distinct des tags, qui servent au
                    filtrage.
                  </p>
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="url" className={LABEL}>
                    URL du projet
                  </label>
                  <input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://..."
                    className={FIELD}
                  />
                </div>

                <div>
                  <label htmlFor="repoUrl" className={LABEL}>
                    Code source
                  </label>
                  <input
                    id="repoUrl"
                    type="url"
                    value={formData.repoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, repoUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className={FIELD}
                  />
                </div>
              </div>

              <div>
                <span className={LABEL}>Image</span>

                <div className="mb-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageInputType('upload')}
                    className={filterButton(imageInputType === 'upload')}
                  >
                    Envoyer un fichier
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType('url')}
                    className={filterButton(imageInputType === 'url')}
                  >
                    URL externe
                  </button>
                </div>

                {imageInputType === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent disabled:opacity-60"
                    />
                    {uploading && (
                      <p className={HINT}>Envoi en cours…</p>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className={FIELD}
                  />
                )}

                {formData.imageUrl && (
                  <div className="relative mt-3">
                    <Image
                      src={formData.imageUrl}
                      alt="Aperçu"
                      width={400}
                      height={200}
                      className="h-40 w-full rounded-xl border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute right-2 top-2 rounded-full border border-border bg-background/90 px-3 py-1 text-xs text-muted backdrop-blur transition-colors hover:text-red-600 dark:hover:text-red-400"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="tags" className={LABEL}>
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="Banque, Conformité, Mobile"
                  className={FIELD}
                />
                <p className={HINT}>
                  Séparés par des virgules. Servent aux filtres du site public.
                </p>
              </div>

              <div className="space-y-3 border-t border-border pt-5">
                <label className="flex items-center gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  Mettre en vedette sur la page d&apos;accueil
                </label>

                <label className="flex items-center gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  Publié
                  <span className="text-xs text-muted">
                    (décochez pour préparer la fiche sans la rendre visible)
                  </span>
                </label>

                <div>
                  <label htmlFor="position" className={LABEL}>
                    Ordre d&apos;affichage
                  </label>
                  <input
                    id="position"
                    type="number"
                    min={0}
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: Number(e.target.value) })
                    }
                    className={`${FIELD} max-w-[8rem]`}
                  />
                  <p className={HINT}>
                    Croissant : 0 apparaît en premier. À égalité, tri par date.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={buttonClass('secondary', 'md')}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={buttonClass('primary', 'md')}
                >
                  {editingProject ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
