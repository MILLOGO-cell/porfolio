import Link from "next/link";
import Logo from "@/components/Logo";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { navItems, site, socialLinks } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface-muted/50 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-muted">{site.role}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.location}
            </p>

            {/* Plus grande qu'en tête de page : le pied est le seul endroit où la
                marque a la place de se lire, et le nom juste au-dessus la rend
                décorative. */}
            <Logo className="mt-6 h-14 w-14" />
          </div>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Navigation
            </span>
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-block py-3 text-sm font-medium text-muted transition-colors hover:text-accent md:py-1"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-block py-3 text-sm font-medium text-muted transition-colors hover:text-accent md:py-1"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Me joindre
            </span>
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
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <span>© {year} {site.name}</span>
            <nav aria-label="Informations légales" className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/mentions-legales" className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0">Mentions légales</Link>
              <Link href="/confidentialite" className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0">Confidentialité</Link>
              <Link href="/conditions" className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0">Conditions</Link>
              <CookieSettingsButton className="inline-flex min-h-11 items-center hover:text-accent md:min-h-0" />
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
