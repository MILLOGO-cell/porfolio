import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LuArrowLeft, LuArrowUpRight, LuGithub, LuLock } from 'react-icons/lu';
import Template from '../../../Template';
import { prisma } from '@/lib/db';
import { buttonClass } from '@/components/ui/button-styles';
import { Chip, StatusBadge } from '@/components/ui/Badge';

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
      gallery: true,
      confidential: true,
      status: true,
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

/** Habillage commun aux liens insérés dans un texte d'étude de cas. */
const LIEN_TEXTE =
  'font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-opacity hover:opacity-80';

/**
 * Rend cliquables les adresses présentes dans un texte saisi en administration.
 * Le contenu vient de la base sous forme de texte brut : sans cela, une
 * référence à un site partenaire resterait une chaîne inerte.
 *
 * Deux formes sont acceptées. Une adresse nue s'affiche débarrassée de son
 * protocole. La forme `[libellé](adresse)` pose le lien sur des mots choisis :
 * « chez Exemple SA » se lit mieux, en pleine phrase, que
 * « chez exemple.com/a-propos ».
 *
 * Les liens sont construits en éléments React, jamais injectés en HTML : le
 * texte de la base ne peut donc pas transporter de balise.
 */
function linkify(text: string) {
  const motif = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
  const morceaux: React.ReactNode[] = [];
  let curseur = 0;
  let trouve: RegExpExecArray | null;

  while ((trouve = motif.exec(text)) !== null) {
    if (trouve.index > curseur) {
      morceaux.push(text.slice(curseur, trouve.index));
    }

    const adresse = trouve[2] ?? trouve[3];
    const libelle =
      trouve[1] ??
      adresse.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

    morceaux.push(
      <a
        key={trouve.index}
        href={adresse}
        target="_blank"
        rel="noopener noreferrer"
        className={LIEN_TEXTE}
      >
        {libelle}
      </a>
    );

    curseur = trouve.index + trouve[0].length;
  }

  if (curseur < text.length) morceaux.push(text.slice(curseur));
  return morceaux;
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
        {linkify(children)}
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
          {project.status && (
            <div className="mb-4">
              <StatusBadge status={project.status} />
            </div>
          )}

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

        {/* Produit non diffusable : on l'annonce plutôt que de laisser un vide
            qui ressemblerait à une fiche incomplète. */}
        {project.confidential && (
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-5">
            <LuLock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <p className="text-sm leading-relaxed text-muted">
              Les écrans de cette application ne sont pas diffusés. Il s&apos;agit
              d&apos;un produit exploité en entreprise, dont les interfaces et les
              données relèvent de la confidentialité. La fiche décrit la
              conception et les choix techniques, sans visuel.
            </p>
          </div>
        )}

        {/* 16/9, cadré sur le haut : une capture de site est reconnaissable par
            son en-tête et sa bannière, pas par son pied de page. */}
        {!project.confidential && project.imageUrl && (
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

        {!project.confidential && project.gallery.length > 0 && (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Aperçus
            </h2>
            {/* Pleine largeur et cadrage haut : ce sont des captures d'écran,
                les rogner en vignette rendrait l'interface illisible. */}
            <div className="space-y-4">
              {project.gallery.map((src, index) => (
                <div
                  key={src}
                  className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-surface-muted"
                >
                  <Image
                    src={src}
                    alt={`${project.title}, aperçu ${index + 1}`}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* La stack n'est pas affichée pour un produit confidentiel : elle
            indiquerait quelles vulnérabilités connues aller chercher. */}
        {!project.confidential && project.stack.length > 0 && (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
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
