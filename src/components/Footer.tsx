import Link from "next/link";
import { navItems, site, socialLinks } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface-muted">
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
          </div>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Navigation
            </span>
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-muted transition-colors hover:text-accent"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="text-sm font-medium text-muted transition-colors hover:text-accent"
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
                  className="rounded-lg border border-border p-2.5 text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {year} {site.name}
        </div>
      </div>
    </footer>
  );
}
