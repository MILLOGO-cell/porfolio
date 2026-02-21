"use client";

import Image from "next/image";
import Link from "next/link";
import Template from "./Template";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FeaturedProjects from "@/components/FeaturedProjects";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/contact");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <Template>
      <div className="flex flex-col min-h-screen">
        <div className="relative isolate px-4 sm:px-3 md:px-8 lg:px-16 pt-8 sm:pt-10 md:pt-14 lg:pt-20 bg-white dark:bg-black text-black dark:text-white">
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

          <div className="flex-grow">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 w-full lg:w-full"
              >
                <motion.p
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                  className="text-xs md:text-sm border-2 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full font-medium shadow-sm"
                >
                  Salut je suis Nicolas
                </motion.p>
                <motion.h1
                  variants={fadeInUp}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
                >
                  Je conçois des applications et sites web qui donnent vie à vos
                  idées.
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  transition={{ delay: 0.4 }}
                  className="text-sm md:text-lg text-gray-600 dark:text-gray-300"
                >
                  Avez-vous une idée de projet en tête ? Transformons-la
                  ensemble en une réalité exceptionnelle.
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className="px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleNavigate}
                  >
                    Discutons-en
                  </button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex-shrink-0 hidden md:block"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex items-center justify-center"
                >
                  <Image
                    src="/hero.png"
                    alt="Mockup de l'application"
                    width={500}
                    height={400}
                    className="max-w-full h-auto drop-shadow-2xl"
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              id="travaux"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center mt-16 w-full px-4 md:px-0"
            >
              <p className="text-base md:text-lg font-medium text-center mb-4 text-gray-600 dark:text-gray-300">
                Découvrez mes derniers projets et créations.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex justify-center items-center mt-8"
              >
                <div className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 border border-indigo-200 dark:border-indigo-700">
                  Mes travaux
                </div>
              </motion.div>
            </motion.div>

            <ScrollReveal>
              <FeaturedProjects />
            </ScrollReveal>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center mt-12"
            >
              <Link href="/projets">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Voir plus →
                </motion.span>
              </Link>
            </motion.div>

            <ScrollReveal>
              <div id="outils" className="flex justify-center items-center mt-20">
                <div className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 border border-indigo-200 dark:border-indigo-700">
                  Mes outils favoris
                </div>
              </div>
            </ScrollReveal>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="mt-12 p-6 md:p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 dark:backdrop-blur-md mx-4 md:mx-8 lg:mx-12 shadow-xl"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Les outils que j&apos;utilise au quotidien
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { src: "/figma-logo.png", name: "Figma", desc: "UX/UI Design & Prototypage" },
                  { src: "/framer-logo.png", name: "Framer", desc: "Web design & développement" },
                  { src: "/rive-logo.png", name: "Rive", desc: "Animations interactives" },
                  { src: "/nextjs-logo.png", name: "Next.js", desc: "Développement frontend" },
                  { src: "/react-native-logo.png", name: "React / React Native", desc: "Développement mobile" },
                  { src: "/django-logo.png", name: "Django REST", desc: "Développement backend" },
                ].map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  >
                    <Image
                      src={tool.src}
                      alt={tool.name}
                      width={50}
                      height={50}
                      className="mb-3"
                    />
                    <h4 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">
                      {tool.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {tool.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <ScrollReveal>
              <div id="competences" className="flex justify-center items-center mt-20">
                <div className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 border border-indigo-200 dark:border-indigo-700">
                  Méthodes de travail
                </div>
              </div>
            </ScrollReveal>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 dark:backdrop-blur-md dark:border dark:border-indigo-800/30 mx-4 md:mx-8 shadow-xl"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Les outils et compétences que j&apos;utilise pour créer mes produits
              </h2>

              <div className="mb-16">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                  Compétences techniques
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {[
                    { src: "/skill-ux.png", alt: "UX/UI", label: "UX/UI" },
                    { src: "/skill-dev.png", alt: "Frontend", label: "Frontend" },
                    { src: "/skill-dev-back.png", alt: "Backend", label: "Backend" },
                    { src: "/skill-github.png", alt: "GitHub", label: "GitHub" },
                    { src: "/skill-docker.png", alt: "Docker", label: "Docker" },
                    { src: "/skill-testing.png", alt: "Testing", label: "Testing" },
                  ].map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Image
                        src={skill.src}
                        alt={skill.alt}
                        width={60}
                        height={60}
                      />
                      <p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {skill.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                  Valeurs et attributs
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {[
                    { src: "/skill-communication.png", alt: "Communication", label: "Communication" },
                    { src: "/skill-collaboration.png", alt: "Collaboration", label: "Collaboration" },
                    { src: "/skill-agile.png", alt: "Agile", label: "Méthode Agile" },
                    { src: "/skill-prix-abordable.png", alt: "Prix", label: "Prix abordables" },
                    { src: "/skill-trust.png", alt: "Confiance", label: "Confiance" },
                    { src: "/skill-ingenious.png", alt: "Ingéniosité", label: "Ingéniosité" },
                  ].map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <Image
                        src={value.src}
                        alt={value.alt}
                        width={60}
                        height={60}
                      />
                      <p className="text-center text-sm font-semibold text-gray-900 dark:text-white">
                        {value.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <ScrollReveal>
              <div id="services" className="flex justify-center items-center mt-20">
                <div className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 border border-indigo-200 dark:border-indigo-700">
                  Mes services
                </div>
              </div>
            </ScrollReveal>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="mt-12 p-6 md:p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900/50 dark:to-indigo-900/50 dark:backdrop-blur-md dark:border dark:border-indigo-800/30 mx-4 md:mx-8 lg:mx-12 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  {
                    img: "/pricing-ux.png",
                    title: "UX/UI Design",
                    desc: "Donnez naissance à vos idées.",
                    features: ["Wireframes", "Recherche UX", "Prototype"],
                    gradient: "from-purple-600 to-blue-600"
                  },
                  {
                    img: "/pricing-web.png",
                    title: "Web",
                    desc: "Transformez votre application en chef-d'œuvre.",
                    features: ["Design Figma", "Tests utilisateurs", "Conception web"],
                    gradient: "from-blue-600 to-indigo-600"
                  },
                  {
                    img: "/pricing-mobile.png",
                    title: "Mobile",
                    desc: "Votre app sur mesure, à portée de main.",
                    features: ["Design Figma", "Recherche UX", "Prototype"],
                    gradient: "from-indigo-600 to-purple-600"
                  },
                ].map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image
                        src={service.img}
                        alt={service.title}
                        width={70}
                        height={70}
                        className="mb-4"
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold mt-2 mb-3 text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {service.desc}
                    </p>
                    <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700 dark:text-gray-300 flex-grow">
                      {service.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`block w-full px-6 py-3 bg-gradient-to-r ${service.gradient} text-white rounded-full text-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                      >
                        Discutons-en →
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              transition={{ duration: 0.6 }}
              className="mt-20 mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
                Envie d&apos;en savoir plus ?
              </h2>
              <div className="flex justify-center items-center">
                <Link href="/contact">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Contactez-moi
                    <Image
                      src="/smiley.png"
                      alt="Smiley"
                      width={24}
                      height={24}
                    />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <footer className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 py-8 border-t border-gray-300 dark:border-gray-700">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-6 space-y-4 sm:space-y-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm"
            >
              NDev © {new Date().getFullYear()}. Designed by O.Nicolas MILLOGO
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3"
            >
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Image src="/logo.png" alt="Logo" width={24} height={24} />
                <span className="font-bold text-sm">NDev</span>
              </Link>
            </motion.div>
          </div>
        </footer>
      </div>
    </Template>
  );
}