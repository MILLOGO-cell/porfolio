"use client";

import Image from "next/image";
import Link from "next/link";
import Template from "./Template";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <Template>
      <div className="relative isolate px-10 pt-14 lg:px-16 bg-white dark:bg-black text-black dark:text-white">
        {/* Background Elements */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mx-8">
          {/* Left Section */}
          <div className="flex flex-col items-start gap-6 w-full lg:w-auto">
            <p className="text-sm   border-white border-2 p-2 rounded-full">
              Salut je suis Nicolas 👋
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Je conçois des applications <br /> et sites web qui donnent vie{" "}
              <br /> à vos idées.
            </h1>
            <p className="text-lg">
              Avez-vous une idée de projet en tête ? Transformons-la ensemble en
              une réalité exceptionnelle.
            </p>
            <Button className="px-6 py-3 text-lg font-medium rounded-full bg-[#1B255A] text-white shadow-lg">
              Discutons-en
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center">
              <Image
                src="/hero.png"
                alt="Mockup de l'application"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div id="travaux" className="flex justify-center items-center mt-16">
          <Button className="px-6 py-3 text-lg font-medium rounded-full bg-blue-100 text-black shadow-md flex items-center gap-2">
            Mes travaux{" "}
            <span role="img" aria-label="briefcase">
              💼
            </span>
          </Button>
        </div>

        {/* New Section with Glassmorphism and Content */}
        <div className="mt-16 p-8 py-24 rounded-3xl bg-blue-100 dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 mx-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Content */}
            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo-itouch.png"
                  alt="Logo Itouch App"
                  width={40}
                  height={40}
                />
                <h2 className="text-xl font-bold text-blue-600">Itouch App</h2>
              </div>
              <h3 className="text-2xl font-semibold">DESIGN UX/UI</h3>
              <p className="text-lg text-justify">
                Une application complète pour la gestion des bars et
                restaurants, intégrant la gestion des employés, des salaires, et
                la génération automatisée des fiches de paie, pour une gestion
                simplifiée et efficace.
              </p>
              <div className="flex gap-4">
                <Button className="px-4 py-2 bg-blue-600 text-white rounded-full">
                  Voir la maquette
                </Button>
                <Button className="px-4 py-2 bg-transparent border border-blue-600 text-blue-600 rounded-full">
                  Discutons-en
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2">
              <Image
                src="/itouch.png"
                alt="Itouch App"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Agropole Section */}
        <div className="mt-16 p-8 py-24 rounded-3xl bg-green-100 dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 mx-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Content */}
            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo-agropole.png"
                  alt="Logo Agropole"
                  width={40}
                  height={40}
                />
                <h2 className="text-xl font-bold text-green-600">Agropole</h2>
              </div>
              <h3 className="text-2xl font-semibold">AGRICULTURE INNOVANTE</h3>
              <p className="text-lg text-justify">
                Agropole est une plateforme complète dédiée à
                l&apos;agriculture, offrant une marketplace pour l&apos;achat et
                la vente de produits agricoles avec commandes et paiements en
                ligne, ainsi qu&apos;un service de prévisions météorologiques
                pour aider les agriculteurs à suivre les conditions climatiques.
              </p>
              <div className="flex gap-4">
                <Button className="px-4 py-2 bg-green-600 text-white rounded-full">
                  Voir la maquette
                </Button>
                <Button className="px-4 py-2 bg-transparent border border-green-600 text-green-600 rounded-full">
                  Discutons-en
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2">
              <Image
                src="/agropole.png"
                alt="Agropole"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Exclusivity Section */}
        <div className="mt-16 p-8 py-24 rounded-3xl bg-orange-100 dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 mx-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Content */}
            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo-exclusivity.png"
                  alt="Logo Exclusivity"
                  width={40}
                  height={40}
                />
                <h2 className="text-xl font-bold text-black">Exclusivity</h2>
              </div>
              <h3 className="text-2xl font-semibold">INNOVATION UNIQUE</h3>
              <p className="text-lg text-justify">
                Exclusivity est un réseau social dédié aux échanges exclusifs
                entre utilisateurs, intégrant une gestion de followers pour
                suivre et interagir avec les publications. Il permet de partager
                du contenu, de gérer son audience et de créer des interactions
                personnalisées dans un environnement sécurisé et convivial.
              </p>
              <div className="flex gap-4">
                <Button className="px-4 py-2 bg-orange-600 text-white rounded-full">
                  Voir la maquette
                </Button>
                <Button className="px-4 py-2 bg-transparent border border-orange-600 text-orange-600 rounded-full">
                  Discutons-en
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2">
              <Image
                src="/exclusivity.png"
                alt="Exclusivity"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-8">
          <Link href="/projets">
            <span className="px-6 py-3 text-lg font-medium rounded-full bg-[#1B255A] text-white shadow-lg flex items-center gap-2">
              Voir plus →
            </span>
          </Link>
        </div>

        {/* Call to Action Section */}
        <div id="outils" className="flex justify-center items-center mt-16">
          <Button className="px-6 py-3 text-lg font-medium rounded-full bg-blue-100 text-black shadow-md flex items-center gap-2">
            Mes outils favoris
            <span role="img" aria-label="briefcase">
              🛠️
            </span>
          </Button>
        </div>

        {/* Tools Section */}
        <div className="mt-16 p-8 dark:rounded-3xl bg-transparent dark:bg-black/20 mx-8">
          <h2 className="text-3xl font-extrabold text-center mb-8">
            Les outils que j’utilise au quotidien
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool Cards */}
            <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow-md">
              <Image src="/figma-logo.png" alt="Figma" width={40} height={40} />
              <h4 className="text-xl font-semibold mt-2">Figma</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                UX/UI Design & Prototypage
              </p>
            </div>
            <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow-md">
              <Image
                src="/framer-logo.png"
                alt="Framer"
                width={40}
                height={40}
              />
              <h4 className="text-xl font-semibold mt-2">Framer</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Web design & développement
              </p>
            </div>
            <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow-md">
              <Image src="/rive-logo.png" alt="Rive" width={40} height={40} />
              <h4 className="text-xl font-semibold mt-2">Rive</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Animations interactives
              </p>
            </div>
            <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow-md">
              <Image
                src="/nextjs-logo.png"
                alt="Next.js"
                width={40}
                height={40}
              />
              <h4 className="text-xl font-semibold mt-2">Next.js</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Développement frontend
              </p>
            </div>
            <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow-md">
              <Image
                src="/react-native-logo.png"
                alt="React"
                width={40}
                height={40}
              />
              <h4 className="text-xl font-semibold mt-2">
                React / React Native
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Développement mobile
              </p>
            </div>
            <div className="bg-white dark:bg-white/10 p-4 rounded-xl shadow-md">
              <Image
                src="/django-logo.png"
                alt="Django REST Framework"
                width={40}
                height={40}
              />
              <h4 className="text-xl font-semibold mt-2">
                Django REST Framework
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Développement backend
              </p>
            </div>
          </div>
        </div>

        <div
          id="competences"
          className="flex justify-center items-center mt-16"
        >
          <Button className="px-6 py-3 text-lg font-medium rounded-full bg-blue-100 text-black shadow-md flex items-center gap-2">
            Méthodes de travail
            <span role="img" aria-label="briefcase">
              💡
            </span>
          </Button>
        </div>

        {/* Methods Section */}
        <div className="mt-16 p-8 rounded-3xl bg-transparent dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 mx-8">
          <div className="flex items-center gap-2 mb-4"></div>
          <h2 className="text-3xl font-extrabold text-center mb-8">
            Les compétences que j’utilise pour créer mes produits.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="flex flex-col items-center gap-2">
              <Image src="/skill-ux.png" alt="UX/UI" width={60} height={60} />
              <p className="text-center text-sm font-medium">UX/UI</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-dev.png"
                alt="Développement"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">
                Développement Frontend
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-dev-back.png"
                alt="Développement"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">
                Développement Backend
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-github.png"
                alt="GitHub"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">GitHub</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-docker.png"
                alt="Docker"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">Docker</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-communication.png"
                alt="Communication"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">Communication</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-collaboration.png"
                alt="Collaboration"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">Collaboration</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-agile.png"
                alt="Méthodes Agile"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">Méthodes Agile</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-testing.png"
                alt="Testing"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">Testing</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-prix-abordable.png"
                alt="Testing"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">
                Coûts abordables
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-trust.png"
                alt="Testing"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">Confiance</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/skill-ingenious.png"
                alt="Testing"
                width={60}
                height={60}
              />
              <p className="text-center text-sm font-medium">Ingéniosité</p>
            </div>
          </div>
        </div>

        <div
          id="tarification"
          className="flex justify-center items-center mt-16"
        >
          <Button className="px-6 py-3 text-lg font-medium rounded-full bg-blue-100 text-black shadow-md flex items-center gap-2">
            Tarification
            <span role="img" aria-label="briefcase">
              💰
            </span>
          </Button>
        </div>
        {/* Pricing Section */}
        <div className="mt-16 p-8 rounded-3xl bg-gray-100 dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 mx-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <div className="bg-white dark:bg-white/10 p-6 rounded-xl shadow-md flex flex-col items-start justify-between">
              <Image
                src="/pricing-ux.png"
                alt="UX Design"
                width={60}
                height={60}
              />
              <h3 className="text-xl font-bold mt-4">UX/UI Design</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Donnez naissance à vos idées.
              </p>
              <ul className="list-disc pl-4 mt-4 space-y-2">
                <li>Wireframes</li>
                <li>Recherche UX</li>
                <li>Prototype</li>
              </ul>
              <p className="mt-4 text-lg font-bold text-green-600">
                À partir de 10 000 FCFA
              </p>
              <Link href="/contact">
                <span className="mt-4 w-full inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-center">
                  Discutons-en →
                </span>
              </Link>
            </div>
            <div className="bg-white dark:bg-white/10 p-6 rounded-xl shadow-md flex flex-col items-start justify-between">
              <Image
                src="/pricing-web.png"
                alt="Web Design"
                width={60}
                height={60}
              />
              <h3 className="text-xl font-bold mt-4">Web</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Transformez votre application en chef-d&apos;œuvre.
              </p>
              <ul className="list-disc pl-4 mt-4 space-y-2">
                <li>Design Figma</li>
                <li>Tests utilisateurs</li>
                <li>Conception d&apos;applications web</li>
              </ul>
              <p className="mt-4 text-lg font-bold text-green-600">
                À partir de 250 000 FCFA
              </p>
              <Link href="/contact">
                <span className="mt-4 w-full inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-center">
                  Discutons-en →
                </span>
              </Link>
            </div>
            <div className="bg-white dark:bg-white/10 p-6 rounded-xl shadow-md flex flex-col items-start justify-between">
              <Image
                src="/pricing-mobile.png"
                alt="Mobile Design"
                width={60}
                height={60}
              />
              <h3 className="text-xl font-bold mt-4">Mobile</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Votre app sur mesure, à portée de main.
              </p>
              <ul className="list-disc pl-4 mt-4 space-y-2">
                <li>Design Figma</li>
                <li>Recherche UX</li>
                <li>Prototype</li>
              </ul>
              <p className="mt-4 text-lg font-bold text-green-600">
                À partir de 350 000 FCFA
              </p>
              <Link href="/contact">
                <span className="mt-4 w-full inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-center">
                  Discutons-en →
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-xl font-extrabold text-center mb-8">
            Envie d’en savoir plus ?
          </h2>
          <div className="flex justify-center items-center mt-8">
            <Link href="/contact">
              <span className="px-6 py-3 text-lg font-medium rounded-full bg-[#1B255A] text-white shadow-lg flex items-center gap-2">
                Contactez-moi
                <Image
                  src="/smiley.png"
                  alt="Smiley Icon"
                  width={20}
                  height={20}
                />
              </span>
            </Link>
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 w-full bg-gray-100 dark:bg-black text-gray-700 dark:text-gray-400 py-4">
          <div className="container mx-auto flex justify-between items-center px-6">
            {/* Footer Left Section */}
            <div className="text-sm">
              NDev © 2024. Designed by O.Nicolas MILLOGO
            </div>

            {/* Footer Center Section */}
            <div className="flex items-center space-x-4">
              <Link href="/" legacyBehavior>
                <a className="flex items-center space-x-2">
                  <Image src="/logo.png" alt="Logo" width={20} height={20} />
                  <span className="font-bold">NDev</span>
                </a>
              </Link>
            </div>

            {/* Footer Right Section */}
            <div className="flex items-center space-x-4">
              <Link href="https://dribbble.com" target="_blank" legacyBehavior>
                <a className="text-gray-600 dark:text-gray-300">Dribbble</a>
              </Link>
              <Link href="https://behance.net" target="_blank" legacyBehavior>
                <a className="text-gray-600 dark:text-gray-300">Behance</a>
              </Link>
              <Link href="https://linkedin.com" target="_blank" legacyBehavior>
                <a className="text-gray-600 dark:text-gray-300">LinkedIn</a>
              </Link>
            </div>
          </div>
        </footer>

        {/* Footer Background Elements */}
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
      </div>
    </Template>
  );
}
