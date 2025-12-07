"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from "@nextui-org/react";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Header(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigateToSection = (sectionId: string) => {
    if (pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
    setIsOpen(false);
  };

  const toggleDrawer = () => setIsOpen(!isOpen);

  const navItems = [
    { id: "travaux", label: "Travaux", icon: "💼" },
    { id: "outils", label: "Outils", icon: "🛠️" },
    { id: "competences", label: "Compétences", icon: "💡" },
    { id: "services", label: "Services", icon: "💰" },
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: "💼", url: "https://linkedin.com" },
    { name: "GitHub", icon: "🐙", url: "https://github.com" },
    { name: "Dribbble", icon: "🎨", url: "https://dribbble.com" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-3 md:py-4 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-white/80 dark:bg-black/80 shadow-lg border-b border-gray-200/50 dark:border-gray-800/50"
          : "backdrop-blur-lg bg-white/60 dark:bg-black/60 border-b border-white/20 dark:border-gray-800/20"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" aria-label="Home" className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={45}
              height={45}
              className="drop-shadow-lg"
            />
          </motion.div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              NDev
            </span>
            <span className="text-[10px] text-gray-600 dark:text-gray-400 -mt-1">
              Portfolio
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/50">
          <span className="text-xs md:text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Développeur Full Stack
          </span>
          <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
            •
          </span>
          <span className="text-xs md:text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            UX/UI Designer
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => navigateToSection(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                pathname === `/#${item.id}`
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="hidden lg:inline mr-1">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/projets"
              className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 inline-block ${
                pathname === "/projets"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="hidden lg:inline mr-1">📁</span>
              Projets
            </Link>
          </motion.div>

          <div className="hidden lg:block ml-2">
            <ThemeSwitcher />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2"
          >
            <Link
              href="/contact"
              className="px-4 lg:px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-semibold flex items-center gap-2"
            >
              <span className="hidden lg:inline">✉️</span>
              Contact
            </Link>
          </motion.div>
        </nav>

        <div className="flex md:hidden items-center gap-3">
          <ThemeSwitcher />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleDrawer}
            className="p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 hover:shadow-lg transition-all duration-300"
            aria-label="Toggle Menu"
          >
            <HiOutlineMenuAlt3 className="text-2xl" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Drawer
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            size="sm"
            placement="right"
            radius="lg"
            backdrop="blur"
            hideCloseButton
            classNames={{
              base: "bg-white dark:bg-gray-900",
              backdrop: "bg-black/50 backdrop-blur-sm",
            }}
          >
            <DrawerContent>
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DrawerHeader className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Logo" width={35} height={35} />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      Menu
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Close Menu"
                  >
                    <HiX className="text-2xl text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </DrawerHeader>

                <DrawerBody className="pt-6">
                  <div className="flex flex-col space-y-3">
                    {navItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigateToSection(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                          pathname === `/#${item.id}`
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/projets"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          pathname === "/projets"
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-2xl">📁</span>
                        <span className="font-medium">Mes Projets</span>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="pt-4 border-t border-gray-200 dark:border-gray-800"
                    >
                      <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                      >
                        <span>✉️</span>
                        Contactez-moi
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="pt-6 border-t border-gray-200 dark:border-gray-800"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 px-2">
                        Suivez-moi
                      </p>
                      <div className="flex gap-3">
                        {socialLinks.map((social) => (
                          <Link
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 text-sm"
                          >
                            <span>{social.icon}</span>
                            <span>{social.name}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </DrawerBody>
              </motion.div>
            </DrawerContent>
          </Drawer>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
