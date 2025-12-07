"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  url: string | null;
  tags: string[];
  featured: boolean;
  gradient: string;
  logo?: string;
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
  url,
  tags,
  gradient,
  logo,
}: ProjectCardProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className={`mt-16 p-6 md:p-8 lg:p-12 py-16 md:py-20 lg:py-24 rounded-3xl bg-gradient-to-br ${gradient} dark:backdrop-blur-md dark:border dark:border-opacity-30 mx-4 md:mx-8 lg:mx-auto max-w-screen-lg shadow-xl hover:shadow-2xl transition-shadow duration-300`}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <motion.div variants={fadeInUp} className="flex flex-col gap-6 lg:w-1/2">
          {logo && (
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={logo}
                  alt={`Logo ${title}`}
                  width={50}
                  height={50}
                  className="drop-shadow-md"
                />
              </motion.div>
              <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
            </div>
          )}

          {tags.length > 0 && (
            <motion.h3
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-current to-current"
            >
              {tags[0].toUpperCase()}
            </motion.h3>
          )}

          <motion.p
            variants={fadeInUp}
            className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            {description}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row gap-4"
          >
            {url && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href={url} 
                  target="_blank"
                  className="inline-block px-6 py-3 text-sm md:text-base lg:text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  Voir les détails
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/contact"
                className="inline-block px-6 py-3 text-sm md:text-base lg:text-lg bg-transparent border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-full w-full md:w-auto transition-all duration-300 text-center"
              >
                Discutons-en
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block lg:w-1/2"
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Image
                src={imageUrl}
                alt={title}
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
}