"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuMail, LuMenu, LuX } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import { buttonClass } from "@/components/ui/button-styles";
import { navItems, site, socialLinks } from "@/lib/site";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Le tiroir n'existe qu'en mobile : on le referme dès qu'on repasse en desktop.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent bg-background/40 backdrop-blur-sm"
        }`}
      >
        <div className={`mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-8 ${
            scrolled ? "py-1.5" : "py-3.5"
          }`}>
          {/* La marque est décorative : le lien porte déjà son intitulé et le nom
              est lu juste à côté. L'alignement sur la ligne de base reste sur le
              groupe de texte, un SVG s'y alignerait mal. */}
          <Link href="/" className="flex min-h-11 items-center gap-2.5">
            <Logo className="h-7 w-7 shrink-0" />
            <span className="flex items-baseline gap-2.5">
              <span className="text-[15px] font-bold tracking-tight text-foreground">
                {site.name}
              </span>
              <span className="hidden text-xs font-medium text-muted sm:inline">
                {site.role}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                  isActive(href)
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            <Link
              href="/contact"
              className={buttonClass("secondary", "sm", "hidden md:inline-flex")}
            >
              <LuMail className="h-4 w-4" aria-hidden />
              Me contacter
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-muted md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={isOpen}
            >
              <LuMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[290px] flex-col border-l border-border bg-background md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  aria-label="Fermer le menu"
                >
                  <LuX className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-foreground transition-colors hover:bg-surface-muted"
                  >
                    <Icon className="h-4 w-4 text-accent" aria-hidden />
                    <span className="text-sm font-semibold">{label}</span>
                  </Link>
                ))}

                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={buttonClass("primary", "md", "mt-4 w-full")}
                >
                  <LuMail className="h-4 w-4" aria-hidden />
                  Me contacter
                </Link>
              </nav>

              <div className="border-t border-border p-5">
                <div className="flex gap-2">
                  {socialLinks.map(({ name, url, icon: Icon }) => (
                    <a
                      key={name}
                      href={url}
                      target={url.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
