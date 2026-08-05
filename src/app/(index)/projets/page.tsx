"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuImageOff, LuSearchX, LuStar } from "react-icons/lu";
import Template from "../../Template";
import { ScrollReveal } from "@/components/ScrollReveal";
import Badge, { Chip } from "@/components/ui/Badge";

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  tags: string[];
  stack: string[];
  client: string | null;
  period: string | null;
  featured: boolean;
}

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

export default function Projets() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects/public", {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success) {
          setProjects(data.data.projects);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Erreur lors du chargement des projets:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();
    return () => controller.abort();
  }, []);

  // Dérivés de `projects` : pas d'état miroir à synchroniser par effet.
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));
  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  const filterClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
      active
        ? "bg-accent text-white shadow-subtle"
        : "bg-accent-soft/60 text-accent hover:bg-accent-soft"
    }`;

  return (
    <Template>
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-20">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Projets
          </p>
          <h1 className="mt-4 max-w-2xl text-pretty font-display text-4xl font-normal tracking-tight md:text-5xl">
            Ce que j&apos;ai construit
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted">
            Applications métiers, API et interfaces. Chaque fiche détaille le
            contexte, les décisions techniques et le résultat.
          </p>
        </header>

        {allTags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={filterClass(selectedTag === null)}
            >
              Tous ({projects.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={filterClass(selectedTag === tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
            <LuSearchX className="h-7 w-7 text-muted" aria-hidden />
            <div>
              <h2 className="font-semibold text-foreground">
                Aucun projet trouvé
              </h2>
              <p className="mt-1 text-sm text-muted">
                {selectedTag
                  ? `Aucun projet ne porte le tag « ${selectedTag} ».`
                  : "Aucun projet n'est publié pour le moment."}
              </p>
            </div>
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="text-sm font-medium text-accent hover:opacity-80"
              >
                Voir tous les projets
              </button>
            )}
          </div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const teaser = project.summary ?? project.description;
              const meta = [project.client, project.period].filter(Boolean);

              return (
                <ScrollReveal
                  key={project.id}
                  delay={0.05 + Math.min(index, 6) * 0.05}
                  y={24}
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-accent/40">
                    <div className="relative h-44 overflow-hidden bg-surface-muted">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <LuImageOff className="h-6 w-6 text-muted" aria-hidden />
                        </div>
                      )}

                      {project.featured && (
                        <div className="absolute right-3 top-3">
                          <Badge tone="warning" icon={LuStar}>
                            Vedette
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      {meta.length > 0 && (
                        <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted">
                          {meta.join(" · ")}
                        </p>
                      )}

                      <h2 className="text-base font-semibold text-foreground">
                        <Link
                          href={`/projets/${project.slug}`}
                          className="transition-colors hover:text-accent"
                        >
                          {project.title}
                        </Link>
                      </h2>

                      {teaser && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
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
                        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-accent transition-opacity hover:opacity-80"
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
            })}
          </div>
        )}
      </div>
    </Template>
  );
}
