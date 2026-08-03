'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

const FIELD_CLASS =
  'w-full px-3 py-2 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-sm text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba]';

/** Les quatre blocs qui font la différence entre une vignette et une étude de cas. */
const CASE_STUDY_FIELDS = [
  {
    key: 'context' as const,
    label: 'Contexte',
    hint: "Le besoin métier et les contraintes de départ.",
  },
  {
    key: 'role' as const,
    label: 'Mon rôle',
    hint: 'Le périmètre réellement tenu : conception, développement, intégration, encadrement.',
  },
  {
    key: 'challenges' as const,
    label: 'Enjeux techniques',
    hint: 'Décisions structurantes et difficultés rencontrées — et pourquoi ces choix.',
  },
  {
    key: 'outcome' as const,
    label: 'Résultat',
    hint: 'Ce qui a été livré et ce que cela a changé.',
  },
];

export default function ProjectsPage() {
  const { data: session, status } = useSession();
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/protected_access/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, filter, searchTag]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let url = '/api/projects';
      const params = new URLSearchParams();

      if (filter === 'featured') {
        params.append('featured', 'true');
      }
      if (searchTag) {
        params.append('tag', searchTag);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProjects(data.data.projects);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
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

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
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

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ff] dark:bg-[#090016]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f2eba]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ff] dark:bg-[#090016]">
      <div className="bg-white/95 dark:bg-[#0f041f] border-b border-[#d4c9f5] dark:border-[#3b285f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white underline-offset-4 hover:underline"
              >
                Retour au dashboard
              </Link>
              <h1 className="text-2xl font-bold text-[#1f1238] dark:text-white">
                Gestion des projets
              </h1>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#0f041f] transition-colors"
            >
              Nouveau projet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 dark:bg-[#0f041f] rounded-2xl shadow-md border border-[#d4c9f5] dark:border-[#3b285f] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-2">
                Filtrer par tag
              </label>
              <input
                type="text"
                placeholder="React, Next.js, TypeScript..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-sm text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-2">
                Affichage
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'all'
                    ? 'bg-[#5f2eba] text-white'
                    : 'bg-white dark:bg-[#140727] text-[#3b2b6a] dark:text-[#e7e0ff] border border-[#d4c9f5] dark:border-[#4e2c9f] hover:bg-[#f0eaff] dark:hover:bg-[#1b0b33]'
                    }`}
                >
                  Tous ({projects.length})
                </button>
                <button
                  onClick={() => setFilter('featured')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'featured'
                    ? 'bg-[#5f2eba] text-white'
                    : 'bg-white dark:bg-[#140727] text-[#3b2b6a] dark:text-[#e7e0ff] border border-[#d4c9f5] dark:border-[#4e2c9f] hover:bg-[#f0eaff] dark:hover:bg-[#1b0b33]'
                    }`}
                >
                  En vedette
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5f2eba]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white/95 dark:bg-[#0f041f] rounded-2xl shadow-md border border-[#d4c9f5] dark:border-[#3b285f] text-center py-12 px-6">
            <h3 className="text-sm font-semibold text-[#1f1238] dark:text-white">
              Aucun projet
            </h3>
            <p className="mt-1 text-sm text-[#4b3a7a] dark:text-[#c4b9f0]">
              Commencez par créer votre premier projet.
            </p>
            <div className="mt-6">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#5f2eba] hover:bg-[#4e2c9f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#0f041f]"
              >
                Nouveau projet
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/95 dark:bg-[#0f041f] rounded-2xl shadow-md border border-[#d4c9f5] dark:border-[#3b285f] overflow-hidden hover:shadow-lg transition-shadow"
              >
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={800}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[#1f1238] dark:text-white mb-2">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3ecff] text-[#5f2eba] dark:bg-[#1b0b33] dark:text-[#e7e0ff]">
                        Vedette
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#4b3a7a] dark:text-[#c4b9f0] mb-4 line-clamp-2">
                    {project.description || 'Aucune description'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e3dcff] text-[#3b2b6a] dark:bg-[#1b0b33] dark:text-[#e7e0ff]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#e3dcff] dark:border-[#3b285f]">
                    {project.url ? (
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white underline-offset-4 hover:underline"
                      >
                        Voir le projet
                      </Link>
                    ) : (
                      <span />
                    )}
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => openEditModal(project)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#f5f2ff] text-[#3b2b6a] hover:bg-[#e3dcff] dark:bg-[#1b0b33] dark:text-[#e7e0ff] dark:hover:bg-[#261145] focus:outline-none"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#ffe9eb] text-[#b3261e] hover:bg-[#ffd5da] dark:bg-[#3a0b16] dark:text-[#ffb4ab] dark:hover:bg-[#4b1220] focus:outline-none"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white/95 dark:bg-[#0f041f] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#d4c9f5] dark:border-[#3b285f]">
            <div className="sticky top-0 bg-white/95 dark:bg-[#0f041f] border-b border-[#d4c9f5] dark:border-[#3b285f] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1f1238] dark:text-white">
                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-sm font-medium text-[#5f2eba] hover:text-[#4e2c9f] dark:text-[#c4b9f0] dark:hover:text-white underline-offset-4 hover:underline"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-sm text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba]"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                    {formErrors.title[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="laissez vide pour le dériver du titre"
                  className={FIELD_CLASS}
                />
                <p className="mt-1 text-xs text-[#8a7abf] dark:text-[#c4b9f0]">
                  Adresse de la fiche : /projets/{formData.slug || 'mon-projet'}
                </p>
                {formErrors.slug && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                    {formErrors.slug[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                  Accroche
                </label>
                <textarea
                  rows={2}
                  maxLength={300}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Une ou deux phrases : ce qui apparaît sur la carte et dans les résultats de recherche."
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={FIELD_CLASS}
                />
              </div>

              <fieldset className="border-t border-[#d4c9f5] dark:border-[#3b285f] pt-4 space-y-4">
                <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f2eba] dark:text-[#c4b9f0]">
                  Étude de cas
                </legend>

                {CASE_STUDY_FIELDS.map(({ key, label, hint }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                      {label}
                    </label>
                    <textarea
                      rows={4}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className={FIELD_CLASS}
                    />
                    <p className="mt-1 text-xs text-[#8a7abf] dark:text-[#c4b9f0]">
                      {hint}
                    </p>
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                      Client ou secteur
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      placeholder="Banque de détail"
                      className={FIELD_CLASS}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                      Période
                    </label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) =>
                        setFormData({ ...formData, period: e.target.value })
                      }
                      placeholder="2024 — 2025"
                      className={FIELD_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                    Stack technique
                  </label>
                  <input
                    type="text"
                    value={formData.stack}
                    onChange={(e) =>
                      setFormData({ ...formData, stack: e.target.value })
                    }
                    placeholder="Django REST, PostgreSQL, Docker, SOAP"
                    className={FIELD_CLASS}
                  />
                  <p className="mt-1 text-xs text-[#8a7abf] dark:text-[#c4b9f0]">
                    Séparées par des virgules. Distinct des tags, qui servent au filtrage.
                  </p>
                </div>
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                    URL du projet
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                    Code source
                  </label>
                  <input
                    type="url"
                    value={formData.repoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, repoUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-2">
                  Image
                </label>

                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageInputType('upload')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg ${imageInputType === 'upload'
                      ? 'bg-[#5f2eba] text-white'
                      : 'bg-[#f5f2ff] text-[#3b2b6a] hover:bg-[#e3dcff] dark:bg-[#140727] dark:text-[#e7e0ff] dark:hover:bg-[#1b0b33]'
                      }`}
                  >
                    Upload fichier
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType('url')}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg ${imageInputType === 'url'
                      ? 'bg-[#5f2eba] text-white'
                      : 'bg-[#f5f2ff] text-[#3b2b6a] hover:bg-[#e3dcff] dark:bg-[#140727] dark:text-[#e7e0ff] dark:hover:bg-[#1b0b33]'
                      }`}
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
                      className="block w-full text-sm text-[#4b3a7a] dark:text-[#c4b9f0] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f3ecff] file:text-[#5f2eba] hover:file:bg-[#e3dcff] disabled:opacity-60"
                    />
                    {uploading && (
                      <p className="mt-2 text-sm text-[#4b3a7a] dark:text-[#c4b9f0]">
                        Upload en cours...
                      </p>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-sm text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba]"
                  />
                )}

                {formData.imageUrl && (
                  <div className="mt-3 relative">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg border border-[#d4c9f5] dark:border-[#3b285f]"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-lg bg-[#ffe9eb] text-[#b3261e] hover:bg-[#ffd5da] dark:bg-[#3a0b16] dark:text-[#ffb4ab] dark:hover:bg-[#4b1220] focus:outline-none"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                  Tags{' '}
                  <span className="text-xs text-[#8a7abf] dark:text-[#c4b9f0]">
                    (séparés par des virgules)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, Next.js, TypeScript"
                  className="w-full px-3 py-2 rounded-lg border border-[#d4c9f5] dark:border-[#4e2c9f] bg-white dark:bg-[#140727] text-sm text-[#1f1238] dark:text-white placeholder-[#9e91d0] focus:outline-none focus:ring-2 focus:ring-[#5f2eba] focus:border-[#5f2eba]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 text-[#5f2eba] focus:ring-[#5f2eba] border-[#d4c9f5] rounded"
                />
                <label
                  htmlFor="featured"
                  className="text-sm text-[#3b2b6a] dark:text-[#e7e0ff]"
                >
                  Projet en vedette
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="h-4 w-4 text-[#5f2eba] focus:ring-[#5f2eba] border-[#d4c9f5] rounded"
                />
                <label
                  htmlFor="published"
                  className="text-sm text-[#3b2b6a] dark:text-[#e7e0ff]"
                >
                  Publié{' '}
                  <span className="text-xs text-[#8a7abf] dark:text-[#c4b9f0]">
                    (décochez pour préparer une fiche sans la rendre visible)
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3b2b6a] dark:text-[#e7e0ff] mb-1">
                  Ordre d&apos;affichage
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: Number(e.target.value) })
                  }
                  className={`${FIELD_CLASS} max-w-[8rem]`}
                />
                <p className="mt-1 text-xs text-[#8a7abf] dark:text-[#c4b9f0]">
                  Croissant : 0 apparaît en premier. À égalité, tri par date.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4c9f5] dark:border-[#3b285f]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-[#3b2b6a] dark:text-[#e7e0ff] bg-white dark:bg-[#140727] border border-[#d4c9f5] dark:border-[#4e2c9f] hover:bg-[#f5f2ff] dark:hover:bg-[#1b0b33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#0f041f]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#5f2eba] hover:bg-[#4e2c9f] border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5f2eba] focus:ring-offset-[#f5f2ff] dark:focus:ring-offset-[#0f041f] disabled:opacity-60"
                >
                  {editingProject ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
