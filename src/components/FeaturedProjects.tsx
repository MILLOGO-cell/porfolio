"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuImageOff } from "react-icons/lu";

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
}

function ProjectSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-3 w-24 rounded bg-surface-muted" />
          <div className="h-6 w-3/4 rounded bg-surface-muted" />
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-5/6 rounded bg-surface-muted" />
        </div>
        <div className="hidden h-44 rounded-xl bg-surface-muted lg:block" />
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProjects() {
      try {
        const response = await fetch(
          "/api/projects/public?featured=true&limit=3",
          { signal: controller.signal }
        );
        const data = await response.json();
        if (data.success && Array.isArray(data.data?.projects)) {
          setProjects(data.data.projects as Project[]);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <ProjectSkeleton />
        <ProjectSkeleton />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <LuImageOff className="h-6 w-6 text-muted" aria-hidden />
        <p className="text-sm text-muted">Aucun projet publié pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, index) => {
        // Le contexte court prime ; la description longue ne sert que de repli.
        const teaser = project.summary ?? project.description;
        const meta = [project.client, project.period].filter(Boolean);

        return (
          <article
            key={project.id}
            className="group grid items-center gap-8 rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/40 md:p-10 lg:grid-cols-2"
          >
            <div
              className={`flex flex-col gap-4 ${
                // Alternance : l'image change de côté un rang sur deux.
                index % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              {meta.length > 0 && (
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {meta.join(" · ")}
                </p>
              )}

              <h3 className="text-pretty text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                <Link
                  href={`/projets/${project.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {project.title}
                </Link>
              </h3>

              {teaser && (
                <p className="text-pretty leading-relaxed text-muted">
                  {teaser}
                </p>
              )}

              {project.stack.length > 0 && (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {project.stack.slice(0, 5).map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/projets/${project.slug}`}
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
              >
                Lire l&apos;étude de cas
                <LuArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>

            {project.imageUrl && (
              <div
                className={`relative hidden aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-muted lg:block ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
