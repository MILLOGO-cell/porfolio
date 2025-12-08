"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import Template from "../../Template";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiExternalLink, HiTag, HiCalendar, HiStar } from "react-icons/hi";

interface Project {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  featured: boolean;
  createdAt: string;
}

function ProjectModal({ 
  project, 
  onClose 
}: { 
  project: Project; 
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-all duration-300"
        >
          <HiX className="h-6 w-6 text-gray-900 dark:text-white" />
        </motion.button>

        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          {project.imageUrl ? (
            <div className="relative h-72 md:h-96 overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <h2 className="flex-1 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <div className="bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg flex-shrink-0">
                      <HiStar className="h-4 w-4" />
                      Vedette
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
              <div className="flex items-start gap-3">
                <h2 className="flex-1 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  {project.title}
                </h2>
                {project.featured && (
                  <div className="bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg flex-shrink-0">
                    <HiStar className="h-4 w-4" />
                    Vedette
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-8">
            {project.description && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Description
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {project.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiTag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold border border-indigo-200 dark:border-indigo-800"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiCalendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                Date de création
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300">
                {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              {project.url && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-center shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <HiExternalLink className="h-5 w-5" />
                  Voir le projet
                </motion.a>
              )}
              <Link href="/contact" className="flex-1">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold text-center transition-all duration-300"
                >
                  Discutons-en
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}

export default function Projets() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      setFilteredProjects(projects.filter(p => p.tags.includes(selectedTag)));
    } else {
      setFilteredProjects(projects);
    }
  }, [selectedTag, projects]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects/public');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data.projects);
        setFilteredProjects(data.data.projects);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Template>
      <div className="relative isolate px-4 sm:px-6 md:px-10 lg:px-16 pt-8 sm:pt-10 md:pt-14 pb-16 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center py-12 max-w-4xl mx-auto"
        >
          <motion.h1
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
          >
            Mes Projets
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300"
          >
            Découvrez mes réalisations et créations
          </motion.p>
        </motion.div>

        {allTags.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(null)}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedTag === null
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Tous ({projects.length})
            </motion.button>
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(tag)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400"
            />
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedTag 
                ? `Aucun projet avec le tag "${selectedTag}"`
                : "Aucun projet disponible pour le moment"}
            </p>
            {selectedTag && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(null)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg"
              >
                Voir tous les projets
              </motion.button>
            )}
          </motion.div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="group relative bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 backdrop-blur-lg"
              >
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <HiStar className="h-4 w-4" />
                      Vedette
                    </div>
                  </div>
                )}

                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      📁
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProject(project)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm shadow-lg transition-all duration-300"
                    >
                      Détails
                    </motion.button>
                    {project.url && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2"
                      >
                        <HiExternalLink className="h-4 w-4" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {selectedProject && (
            <ProjectModal 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
            />
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </Template>
  );
}