'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    HiOutlineCollection,
    HiOutlineStar,
    HiOutlineTag,
    HiOutlinePhotograph,
    HiOutlineLink,
    HiOutlinePlus,
    HiOutlineCog,
    HiOutlineExternalLink,
    HiOutlineTrash,
    HiOutlinePencil,
    HiOutlineLogout,
    HiOutlineChartBar
} from 'react-icons/hi';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';

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

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchProjects();
        }
    }, [status]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/projects');
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

    const handleDeleteProject = async (id: string) => {
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

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-lg h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400"
                />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const featuredProjects = projects.filter(p => p.featured).length;
    const recentProjects = projects.slice(0, 5);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
            <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-3">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
                                >
                                    <span className="text-white font-bold text-xl">P</span>
                                </motion.div>
                                <div>
                                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                        Portfolio Admin
                                    </h1>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                                        Tableau de bord
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-4">
                                <Link
                                    href="/admin"
                                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm shadow-lg"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/projects"
                                    className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm transition-colors"
                                >
                                    Projets
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm transition-colors"
                                >
                                    Paramètres
                                </Link>

                                <div className="ml-4 pl-4 border-l border-gray-300 dark:border-gray-700">
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <ThemeSwitcher />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {session.user?.name || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {session.user?.email}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-indigo-500 dark:ring-indigo-400">
                                    {session.user?.name?.charAt(0) || 'A'}
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                                className="inline-flex items-center px-4 py-2 border-2 border-red-500 dark:border-red-400 text-sm font-semibold rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                            >
                                <HiOutlineLogout className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 rounded-lg shadow-2xl p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-extrabold text-white mb-2"
                            >
                                Bienvenue, {session.user?.name || 'Admin'}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-indigo-100 text-lg"
                            >
                                Voici un aperçu de votre portfolio
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="hidden md:block"
                        >
                            <HiOutlineChartBar className="h-32 w-32 text-white/20" />
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {[
                        {
                            title: 'Projets Totaux',
                            value: projects.length,
                            icon: HiOutlineCollection,
                            color: 'from-indigo-500 to-indigo-600',
                            bgColor: 'bg-indigo-500',
                            delay: 0.1
                        },
                        {
                            title: 'En Vedette',
                            value: featuredProjects,
                            icon: HiOutlineStar,
                            color: 'from-yellow-500 to-yellow-600',
                            bgColor: 'bg-yellow-500',
                            delay: 0.2
                        },
                        {
                            title: 'Tags Uniques',
                            value: new Set(projects.flatMap(p => p.tags)).size,
                            icon: HiOutlineTag,
                            color: 'from-purple-500 to-purple-600',
                            bgColor: 'bg-purple-500',
                            delay: 0.3
                        }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                transition={{ duration: 0.5, delay: stat.delay }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white dark:bg-gray-800/50 backdrop-blur-lg overflow-hidden shadow-xl rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-4 shadow-lg`}>
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-semibold text-gray-500 dark:text-gray-400 truncate">
                                                    {stat.title}
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                                        {stat.value}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3">
                                    <Link
                                        href="/admin/projects"
                                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        Gérer
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2 bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <HiOutlineChartBar className="h-6 w-6" />
                            Statistiques
                        </h3>
                        <div className="space-y-6">
                            {[
                                {
                                    label: 'Projets avec images',
                                    value: projects.filter(p => p.imageUrl).length,
                                    total: projects.length,
                                    color: 'bg-indigo-600',
                                    icon: HiOutlinePhotograph
                                },
                                {
                                    label: 'Projets avec URL',
                                    value: projects.filter(p => p.url).length,
                                    total: projects.length,
                                    color: 'bg-green-600',
                                    icon: HiOutlineLink
                                },
                                {
                                    label: 'Projets en vedette',
                                    value: featuredProjects,
                                    total: projects.length,
                                    color: 'bg-yellow-600',
                                    icon: HiOutlineStar
                                }
                            ].map((stat, index) => {
                                const Icon = stat.icon;
                                const percentage = stat.total ? (stat.value / stat.total) * 100 : 0;
                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {stat.label}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {stat.value} / {stat.total}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                                className={`${stat.color} h-3 rounded-full shadow-lg`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            Actions Rapides
                        </h3>
                        <div className="space-y-3">
                            {[
                                {
                                    href: '/admin/projects',
                                    label: 'Nouveau Projet',
                                    icon: HiOutlinePlus,
                                    color: 'from-indigo-500 to-indigo-600',
                                    hoverColor: 'hover:from-indigo-600 hover:to-indigo-700'
                                },
                                {
                                    href: '/admin/projects',
                                    label: 'Gérer Projets',
                                    icon: HiOutlineCollection,
                                    color: 'from-gray-500 to-gray-600',
                                    hoverColor: 'hover:from-gray-600 hover:to-gray-700'
                                },
                                {
                                    href: '/admin/settings',
                                    label: 'Paramètres',
                                    icon: HiOutlineCog,
                                    color: 'from-green-500 to-green-600',
                                    hoverColor: 'hover:from-green-600 hover:to-green-700'
                                },
                                {
                                    href: '/',
                                    label: 'Voir le Site',
                                    icon: HiOutlineExternalLink,
                                    color: 'from-purple-500 to-purple-600',
                                    hoverColor: 'hover:from-purple-600 hover:to-purple-700',
                                    external: true
                                }
                            ].map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.03, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            href={action.href}
                                            target={action.external ? '_blank' : undefined}
                                            className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-lg hover:shadow-lg transition-all duration-300 group border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className={`bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-lg p-3 group-hover:shadow-lg transition-all duration-300`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <span className="ml-4 text-sm font-semibold text-gray-900 dark:text-white">
                                                {action.label}
                                            </span>
                                            <svg className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <HiOutlineCollection className="h-6 w-6" />
                            Projets Récents
                        </h3>
                        <Link
                            href="/admin/projects"
                            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                        >
                            Voir tout
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    {recentProjects.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Aucun projet
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Commencez par créer votre premier projet.
                            </p>
                            <motion.div
                                className="mt-6"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/admin/projects"
                                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    <HiOutlinePlus className="h-5 w-5 mr-2" />
                                    Créer un projet
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Projet
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Tags
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="relative px-6 py-4">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentProjects.map((project, index) => (
                                        <motion.tr
                                            key={project.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                                        {project.imageUrl ? (
                                                            <Image
                                                                src={project.imageUrl}
                                                                alt={project.title}
                                                                width={48}
                                                                height={48}
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <HiOutlineCollection className="h-7 w-7 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {project.title}
                                                        </div>
                                                        {project.featured && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 mt-1">
                                                                Vedette
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tags.slice(0, 3).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {project.tags.length > 3 && (
                                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                            +{project.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold space-x-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => router.push('/admin/projects')}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1"
                                                >
                                                    <HiOutlinePencil className="h-4 w-4" />
                                                    Modifier
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 inline-flex items-center gap-1"
                                                >
                                                    <HiOutlineTrash className="h-4 w-4" />
                                                    Supprimer
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}