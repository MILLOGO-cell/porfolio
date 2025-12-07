'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";

interface Project {
    id: string;
    title: string;
    description: string | null;
    url: string | null;
    imageUrl: string | null;
    tags: string[];
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

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
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        imageUrl: '',
        tags: '',
        featured: false,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
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
                setFormData(prev => ({ ...prev, imageUrl: data.data.url }));
            } else {
                alert(data.error || 'Erreur lors de l\'upload');
            }
        } catch (error) {
            console.error('Erreur upload:', error);
            alert('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

        const payload = {
            title: formData.title,
            description: formData.description || null,
            url: formData.url || null,
            imageUrl: formData.imageUrl || null,
            tags,
            featured: formData.featured,
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
                setFormData({
                    title: '',
                    description: '',
                    url: '',
                    imageUrl: '',
                    tags: '',
                    featured: false,
                });
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
            title: project.title,
            description: project.description || '',
            url: project.url || '',
            imageUrl: project.imageUrl || '',
            tags: project.tags.join(', '),
            featured: project.featured,
        });
        setImageInputType(project.imageUrl?.startsWith('/uploads') ? 'upload' : 'url');
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            url: '',
            imageUrl: '',
            tags: '',
            featured: false,
        });
        setFormErrors({});
        setImageInputType('upload');
        setShowModal(true);
    };

    if (status === 'loading' || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Gestion des Projets</h1>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nouveau Projet
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par tag</label>
                            <input
                                type="text"
                                placeholder="React, Next.js, TypeScript..."
                                value={searchTag}
                                onChange={(e) => setSearchTag(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Affichage</label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    Tous ({projects.length})
                                </button>
                                <button
                                    onClick={() => setFilter('featured')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'featured'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-white rounded-lg shadow text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun projet</h3>
                        <p className="mt-1 text-sm text-gray-500">Commencez par créer votre premier projet.</p>
                        <div className="mt-6">
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nouveau Projet
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
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
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                                        {project.featured && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                Vedette
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {project.description || 'Aucune description'}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        {project.url ? (
                                            <Link
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                                            >
                                                Voir le projet
                                                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        ) : (
                                            <span></span>
                                        )}
                                        <div className="flex space-x-2 ml-auto">
                                            <button
                                                onClick={() => openEditModal(project)}
                                                className="p-2 text-gray-400 hover:text-indigo-600"
                                                title="Modifier"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 text-gray-400 hover:text-red-600"
                                                title="Supprimer"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {formErrors.title && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.title[0]}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL du projet</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                
                                <div className="flex space-x-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setImageInputType('upload')}
                                        className={`px-4 py-2 text-sm rounded-md ${imageInputType === 'upload'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Upload fichier
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageInputType('url')}
                                        className={`px-4 py-2 text-sm rounded-md ${imageInputType === 'url'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                                        />
                                        {uploading && (
                                            <p className="mt-2 text-sm text-gray-500">Upload en cours...</p>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                )}

                                {formData.imageUrl && (
                                    <div className="mt-3 relative">
                                        <Image
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            width={400}
                                            height={200}
                                            className="w-full h-40 object-cover rounded-md border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags <span className="text-gray-500 text-xs">(séparés par des virgules)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="React, Next.js, TypeScript"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                                    Projet en vedette
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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