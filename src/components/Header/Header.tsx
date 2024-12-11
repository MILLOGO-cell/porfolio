"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation"; // Import depuis next/navigation
import Link from "next/link";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import Image from "next/image";

export default function Header(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Hook pour la navigation
  const pathname = usePathname(); // Récupère l'URL actuelle

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigateToSection = (sectionId: string) => {
    if (pathname === "/") {
      // Si sur la page d'accueil, scroller vers la section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Sinon, rediriger vers la page d'accueil avec un hash
      router.push(`/#${sectionId}`);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 left-0 w-full z-10 px-5 py-5 backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-white/20">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </Link>

        {/* Tagline Section */}
        <div className="hidden md:block text-sm text-black dark:text-white">
          <span className="font-bold">
            Développeur - UX/UI Designer basé au
          </span>
          <br />
          <span className="font-bold">Burkina Faso</span>
        </div>

        {/* ThemeSwitcher */}
        <div className="hidden md:block">
          <ThemeSwitcher />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-black dark:text-white items-center">
          <button
            onClick={() => navigateToSection("travaux")}
            className="hover:underline"
          >
            Travaux
          </button>
          <button
            onClick={() => navigateToSection("outils")}
            className="hover:underline"
          >
            Outils
          </button>
          <button
            onClick={() => navigateToSection("competences")}
            className="hover:underline"
          >
            Compétences
          </button>
          <button
            onClick={() => navigateToSection("tarification")}
            className="hover:underline"
          >
            Tarification
          </button>
          <Link
            href="/contact"
            className="px-4 py-2 bg-[#1B255A] text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Contactez-moi
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {isOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white dark:bg-black shadow-lg z-50 flex flex-col items-start px-8 py-6 space-y-6"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-5 right-5 text-2xl"
            >
              <HiX />
            </button>
            <button onClick={() => navigateToSection("travaux")}>
              Travaux
            </button>
            <button onClick={() => navigateToSection("outils")}>Outils</button>
            <button onClick={() => navigateToSection("competences")}>
              Compétences
            </button>
            <button onClick={() => navigateToSection("tarification")}>
              Tarification
            </button>
            <Link
              href="/contact"
              className="px-4 py-2 bg-[#1B255A] text-white rounded-full shadow-lg hover:bg-blue-700 transition"
            >
              Contactez-moi
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
