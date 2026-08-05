import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LuArrowLeft, LuArrowUpRight, LuGithub } from 'react-icons/lu';
import Template from '../../../Template';
import { prisma } from '@/lib/db';
import { buttonClass } from '@/components/ui/button-styles';
import { Chip } from '@/components/ui/Badge';

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Server Component : la fiche est rendue côté serveur, donc indexable et
 * partageable. Une étude de cas n'a pas sa place dans une modale.
 */
async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    select: {
      slug: true,
      title: true,
      summary: true,
      description: true,
      context: true,
      role: true,
      challenges: true,
      outcome: true,
      client: true,
      period: true,
      stack: true,
      tags: true,
      url: true,
      repoUrl: true,
      imageUrl: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: 'Projet introuvable' };
  }

  const description = project.summary ?? project.description ?? undefined;

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: 'article',
      images: project.imageUrl ? [project.imageUrl] : undefined,
    },
  };
}

/** Bloc de l'étude de cas — n'apparaît que s'il est renseigné. */
function CaseSection({
  label,
  children,
}: {
  label: string;
  children: string | null;
}) {
  if (!children) return null;

  return (
    <section className="border-t border-border pt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {label}
      </h2>
      {/* whitespace-pre-line : les sauts de ligne saisis en admin sont conservés.
          `hyphens-auto` accompagne la justification : sans césure, un texte
          justifié en français creuse des rivières de blanc entre les mots. */}
      <p className="hyphens-auto whitespace-pre-line text-justify leading-relaxed text-foreground">
        {children}
      </p>
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const meta = [
    project.client ? { label: 'Client', value: project.client } : null,
    project.period ? { label: 'Période', value: project.period } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const hasCaseStudy = Boolean(
    project.context || project.role || project.challenges || project.outcome
  );

  return (
    <Template>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <Link
          href="/projets"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <LuArrowLeft className="h-4 w-4" aria-hidden />
          Tous les projets
        </Link>

        <header className="mt-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>

          {project.summary && (
            <p className="mt-4 hyphens-auto text-justify text-lg leading-relaxed text-muted">
              {project.summary}
            </p>
          )}

          {meta.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {meta.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        {/* 16/9, cadré sur le haut : une capture de site est reconnaissable par
            son en-tête et sa bannière, pas par son pied de page. */}
        {project.imageUrl && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-surface-muted">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover object-top"
              priority
            />
          </div>
        )}

        <div className="mt-12 space-y-8">
          <CaseSection label="Contexte">{project.context}</CaseSection>
          <CaseSection label="Mon rôle">{project.role}</CaseSection>
          <CaseSection label="Approche technique">{project.challenges}</CaseSection>
          <CaseSection label="Résultat">{project.outcome}</CaseSection>
          {/* Repli : les fiches créées avant l'étude de cas n'ont qu'une description. */}
          {!hasCaseStudy && (
            <CaseSection label="Présentation">{project.description}</CaseSection>
          )}
        </div>

        {project.stack.length > 0 && (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Stack technique
            </h2>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(project.url || project.repoUrl) && (
          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('primary', 'md')}
              >
                Voir le projet
                <LuArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('secondary', 'md')}
              >
                <LuGithub className="h-4 w-4" aria-hidden />
                Code source
              </a>
            )}
          </div>
        )}
      </article>
    </Template>
  );
}
