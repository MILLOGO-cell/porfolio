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
    setIsOpen(false);
  };

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <header className="fixed top-0 left-0 w-full z-10 px-5 py-4 backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-white/20">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" aria-label="Home">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </Link>

        {/* Tagline Section */}
        <div className="hidden md:block text-sm text-black dark:text-white">
          <span className="font-bold">Développeur - UX/UI Designer</span>
        </div>

        {/* ThemeSwitcher */}
        <div className="hidden md:block">
          <ThemeSwitcher />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-black dark:text-white items-center">
          {["travaux", "outils", "competences", "services"].map((section) => (
            <button
              key={section}
              onClick={() => navigateToSection(section)}
              className={`hover:underline ${
                pathname === `/#${section}` ? "text-blue-700 font-semibold" : ""
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          <Link
            href="/projets"
            className={`hover:underline ${
              pathname === "/projets" ? "text-blue-700 font-semibold" : ""
            }`}
          >
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
          <button
            onClick={toggleDrawer}
            className="text-2xl"
            aria-label="Toggle Menu"
          >
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
        className="transition-transform duration-300"
      >
        <DrawerContent>
          <>
            {/* Drawer Header */}
            <DrawerHeader className="flex items-center justify-between w-full">
              <span className="text-2xl font-bold">Menu</span>
              <Button
                isIconOnly
                variant="light"
                onPress={() => setIsOpen(false)}
                aria-label="Close Menu"
              >
                &times;
              </Button>
            </DrawerHeader>

            {/* Drawer Body */}
            <DrawerBody>
              <div className="flex flex-col space-y-4 items-start">
                <ThemeSwitcher />
                {["travaux", "outils", "competences", "services"].map(
                  (section) => (
                    <button
                      key={section}
                      onClick={() => navigateToSection(section)}
                      className="text-lg hover:underline"
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                  )
                )}
                <Link
                  href="/projets"
                  className="text-lg hover:underline"
                  onClick={() => setIsOpen(false)}
                >
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
