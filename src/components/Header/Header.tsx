"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
} from "@nextui-org/react";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import Image from "next/image";

export default function Header(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
    setIsOpen(false); // Fermer le Drawer après navigation
  };

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 left-0 w-full z-10 px-5 py-5 backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-white/20">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="cursor-pointer">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </Link>

        {/* Tagline Section */}
        <div className="hidden md:block text-sm text-black dark:text-white">
          <span className="font-bold">Développeur - UX/UI Designer</span>
          <br />
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
            onClick={() => navigateToSection("services")}
            className="hover:underline"
          >
            Mes services
          </button>
          <Link href="/projets" className="hover:underline">
            Mes projets
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 bg-[#1B255A] text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            Contactez-moi
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleDrawer} className="text-2xl">
            <HiOutlineMenuAlt3 />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="xs"
        placement="right"
        radius="md"
        backdrop="blur"
        hideCloseButton
      >
        <DrawerContent>
          <>
            {/* Drawer Header */}
            <DrawerHeader>
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl font-bold">Menu</span>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setIsOpen(false)}
                >
                  &times;
                </Button>
              </div>
            </DrawerHeader>

            {/* Drawer Body */}
            <DrawerBody>
              <div className="flex flex-col space-y-4 items-start">
                <ThemeSwitcher />
                <button onClick={() => navigateToSection("travaux")}>
                  Travaux
                </button>
                <button onClick={() => navigateToSection("outils")}>
                  Outils
                </button>
                <button onClick={() => navigateToSection("competences")}>
                  Compétences
                </button>
                <button onClick={() => navigateToSection("services")}>
                  Mes services
                </button>
                <Link href="/projets" onClick={() => setIsOpen(false)}>
                  Mes projets
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-2 bg-[#1B255A] text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Contactez-moi
                </Link>
              </div>
            </DrawerBody>
          </>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
