"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuImageOff, LuLock, LuSearchX, LuStar } from "react-icons/lu";
import Template from "../../Template";
import { ScrollReveal } from "@/components/ScrollReveal";
import Badge, { Chip, StatusBadge } from "@/components/ui/Badge";
import { PROJECT_CATEGORIES } from "@/lib/validations";

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  tags: string[];
  stack: string[];
  category: string | null;
  client: string | null;
  period: string | null;
  featured: boolean;
  confidential: boolean;
  status: string | null;
}

const UNCATEGORIZED = "Autres";

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-44 bg-surface-muted" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-3/4 rounded bg-surface-muted" />
        <div className="h-3 w-full rounded bg-surface-muted" />
        <div className="h-3 w-2/3 rounded bg-surface-muted" />
      </div>
    </div>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const teaser = project.summary ?? project.description;
  const meta = [project.client, project.period].filter(Boolean);

  return (
    <ScrollReveal delay={delay} y={24}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-accent/40">
        <div className="relative h-44 overflow-hidden bg-surface-muted">
          {project.confidential ? (
            // Vignette assumée plutôt qu'une icône d'image manquante : l'absence
            // de visuel est un choix, pas un oubli.
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-accent-soft/40 px-6 text-center">
              <LuLock className="h-5 w-5 text-accent" aria-hidden />
              <span className="text-xs font-medium text-muted">
                Visuels non diffusés
              </span>
            </div>
          ) : project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <LuImageOff className="h-6 w-6 text-muted" aria-hidden />
            </div>
          )}

          <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1.5">
            <StatusBadge status={project.status} />
            {project.featured && (
              <Badge tone="accent" icon={LuStar}>
                Vedette
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          {meta.length > 0 && (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {meta.join(" · ")}
            </p>
          )}

          <h3 className="text-base font-bold text-foreground">
            <Link
              href={`/projets/${project.slug}`}
              className="transition-colors hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>

          {teaser && (
            <p className="mt-2 line-clamp-3 hyphens-auto text-justify text-sm leading-relaxed text-muted">
              {teaser}
            </p>
          )}

          {project.stack.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 3).map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          )}

          <Link
            href={`/projets/${project.slug}`}
            className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-accent transition-opacity hover:opacity-80"
          >
            Lire l&apos;étude de cas
            <LuArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function Projets() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects/public", {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success) setProjects(data.data.projects);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Erreur lors du chargement des projets:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchProjects();
    return () => controller.abort();
  }, []);

  const categoryOf = (p: Project) => p.category ?? UNCATEGORIZED;

  // Catégories réellement présentes, dans l'ordre du vocabulaire de référence
  // pour que l'affichage ne dépende pas de l'ordre d'insertion en base.
  const present = new Set(projects.map(categoryOf));
  const categories = [
    ...PROJECT_CATEGORIES.filter((c) => present.has(c)),
    ...(present.has(UNCATEGORIZED) ? [UNCATEGORIZED] : []),
  ];

  const visible = selected
    ? projects.filter((p) => categoryOf(p) === selected)
    : projects;

  // Sans filtre, on regroupe par catégorie : une grille plate devient illisible
  // dès que le nombre de fiches augmente.
  const groups = selected
    ? [{ category: selected, items: visible }]
    : categories.map((category) => ({
        category,
        items: projects.filter((p) => categoryOf(p) === category),
      }));

  const filterClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-bold transition-colors duration-200 ${
      active
        ? "bg-accent text-white shadow-subtle"
        : "bg-accent-soft/60 text-accent hover:bg-accent-soft"
    }`;

  return (
    <Template>
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
        <header>
          <p className="inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold uppercase tracking-[0.14em] text-accent">
            Projets
          </p>
          <h1 className="mt-4 max-w-2xl text-pretty text-4xl font-bold tracking-tight md:text-5xl">
            Ce que j&apos;ai construit
          </h1>
          <p className="mt-4 max-w-2xl hyphens-auto text-justify leading-relaxed text-muted">
            Applications métiers, API et interfaces. Chaque fiche détaille le
            contexte, les décisions techniques et le résultat.
          </p>
        </header>

        {categories.length > 1 && (
          <div className="mt-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className={filterClass(selected === null)}
            >
              Tout ({projects.length})
            </button>
            {categories.map((category) => {
              const count = projects.filter(
                (p) => categoryOf(p) === category
              ).length;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelected(category)}
                  className={filterClass(selected === category)}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
            <LuSearchX className="h-7 w-7 text-muted" aria-hidden />
            <div>
              <h2 className="font-bold text-foreground">Aucun projet trouvé</h2>
              <p className="mt-1 text-sm text-muted">
                {selected
                  ? `Aucun projet dans la catégorie « ${selected} ».`
                  : "Aucun projet n'est publié pour le moment."}
              </p>
            </div>
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-sm font-bold text-accent hover:opacity-80"
              >
                Voir tous les projets
              </button>
            )}
          </div>
        )}

        {!loading &&
          visible.length > 0 &&
          groups.map(({ category, items }) => (
            <section key={category} className="mt-12">
              {/* L'intitulé n'apparaît que dans la vue d'ensemble : filtré, il
                  répéterait le bouton déjà actif juste au-dessus. */}
              {!selected && categories.length > 1 && (
                <h2 className="mb-5 flex items-baseline gap-3 text-sm font-bold uppercase tracking-[0.18em] text-muted">
                  {category}
                  <span className="h-px flex-1 bg-border" aria-hidden />
                  <span className="text-xs tabular-nums">{items.length}</span>
                </h2>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    delay={0.05 + Math.min(index, 5) * 0.05}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>
    </Template>
  );
}
