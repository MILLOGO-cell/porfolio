"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuImageOff, LuLock } from "react-icons/lu";
import { Chip, StatusBadge } from "@/components/ui/Badge";
import { GlassTilt, ParallaxImage } from "@/components/motion/primitives";

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
  confidential: boolean;
  status: string | null;
}

function ProjectSkeleton() {
  return (
    <div className="glass animate-pulse rounded-3xl p-6 md:p-8">
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
          <GlassTilt
            key={project.id}
            reveal
            delay={index * 0.12}
            className="glass glass-hover group grid items-center gap-8 rounded-3xl p-6 md:p-10 lg:grid-cols-2"
          >
            <div
              className={`flex flex-col gap-4 ${
                // Alternance : l'image change de côté un rang sur deux.
                index % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                {meta.length > 0 && (
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                    {meta.join(" · ")}
                  </p>
                )}
                <StatusBadge status={project.status} />
              </div>

              <h3 className="text-pretty text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                <Link
                  href={`/projets/${project.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {project.title}
                </Link>
              </h3>

              {teaser && (
                <p className="hyphens-auto md:text-justify leading-relaxed text-muted">
                  {teaser}
                </p>
              )}

              {!project.confidential && project.stack.length > 0 && (
                <ul className="flex flex-wrap gap-2 pt-1">
                  {project.stack.slice(0, 5).map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/projets/${project.slug}`}
                className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
              >
                Lire l&apos;étude de cas
                <LuArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>

            {project.confidential && (
              <div
                className={`flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-accent-soft/40 px-8 text-center ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <LuLock className="h-6 w-6 text-accent" aria-hidden />
                <p className="text-sm font-medium text-foreground">
                  Visuels non diffusés
                </p>
                <p className="max-w-xs text-xs leading-relaxed text-muted">
                  Produit exploité en entreprise, dont les interfaces relèvent de
                  la confidentialité.
                </p>
              </div>
            )}

            {/* 16/10 : les captures de sites arrivent en format large (autour
                de 2:1). Un cadre 4/3 les amputait de moitié. `object-top`
                conserve l'en-tête et la bannière, la partie reconnaissable. */}
            {!project.confidential && project.imageUrl && (
              <ParallaxImage
                className={`relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface-muted ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </ParallaxImage>
            )}
          </GlassTilt>
        );
      })}
    </div>
  );
}
