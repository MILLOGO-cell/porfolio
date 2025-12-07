"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  featured: boolean;
}

const gradientConfigs: {
  container: string;
  title: string;
  gradient: string;
  button: string;
  border: string;
}[] = [
  {
    container:
      "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800/30",
    title: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400",
    button: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
    border:
      "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30",
  },
  {
    container:
      "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800/30",
    title: "text-green-600 dark:text-green-400",
    gradient:
      "from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400",
    button:
      "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
    border:
      "border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30",
  },
  {
    container:
      "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 dark:border-orange-800/30",
    title: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400",
    button: "from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
    border:
      "border-orange-600 dark:border-orange-400 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30",
  },
  {
    container:
      "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 dark:border-purple-800/30",
    title: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400",
    button: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    border:
      "border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30",
  },
];

const logoMap: Record<string, string> = {
  "itouch-app": "/logo-itouch.png",
  agropole: "/logo-agropole.png",
  exclusivity: "/logo-exclusivity.png",
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeaturedProjects(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        const response = await fetch(
          "/api/projects/public?featured=true&limit=3"
        );
        const data = await response.json();
        if (isMounted && data.success && Array.isArray(data.data?.projects)) {
          setProjects(data.data.projects as Project[]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 dark:text-gray-400">
          Aucun projet en vedette pour le moment.
        </p>
      </div>
    );
  }

  return (
    <>
      {projects.map((project, index) => {
        const config = gradientConfigs[index % gradientConfigs.length];
        const logoSrc = logoMap[project.id] || "/logo.png";

        return (
          <motion.div
            key={project.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className={`mt-16 p-6 md:p-8 lg:p-12 py-16 md:py-20 lg:py-24 rounded-3xl bg-gradient-to-br ${config.container} dark:backdrop-blur-md dark:border mx-4 md:mx-8 lg:mx-auto max-w-screen-lg shadow-xl hover:shadow-2xl transition-shadow duration-300`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-6 lg:w-1/2"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={logoSrc}
                      alt={`Logo ${project.title}`}
                      width={50}
                      height={50}
                      className="drop-shadow-md"
                    />
                  </motion.div>
                  <h2
                    className={`text-xl md:text-2xl font-bold ${config.title}`}
                  >
                    {project.title}
                  </h2>
                </div>

                {project.tags.length > 0 && (
                  <motion.h3
                    variants={fadeInUp}
                    className={`text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${config.gradient}`}
                  >
                    {project.tags[0].toUpperCase()}
                  </motion.h3>
                )}

                {project.description && (
                  <motion.p
                    variants={fadeInUp}
                    className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    {project.description}
                  </motion.p>
                )}

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col md:flex-row gap-4"
                >
                  {project.url && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={project.url}
                        target="_blank"
                        className={`inline-block px-6 py-3 text-sm md:text-base lg:text-lg bg-gradient-to-r ${config.button} text-white rounded-full w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-300 text-center`}
                      >
                        Voir les détails
                      </Link>
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/contact"
                      className={`inline-block px-6 py-3 text-sm md:text-base lg:text-lg bg-transparent border-2 ${config.border} rounded-full w-full md:w-auto transition-all duration-300 text-center`}
                    >
                      Discutons-en
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {project.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="hidden md:block lg:w-1/2"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={500}
                      height={400}
                      className="w-full max-w-md lg:max-w-full h-auto drop-shadow-2xl rounded-2xl"
                    />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
