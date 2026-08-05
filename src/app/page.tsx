import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuArrowUpRight,
  LuMail,
  LuPencilRuler,
  LuServer,
  LuShieldCheck,
} from "react-icons/lu";
import Template from "./Template";
import FeaturedProjects from "@/components/FeaturedProjects";
import SectionHeader from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { buttonClass } from "@/components/ui/button-styles";
import { Chip } from "@/components/ui/Badge";
import { site } from "@/lib/site";

/**
 * Domaines d'intervention — ce que je construis, pas un catalogue de
 * prestations. Trois entrées, volontairement : au-delà, ça redevient une
 * plaquette commerciale.
 */
/**
 * Domaines d'intervention. Formulés par métier plutôt que par secteur : le
 * détail du contexte bancaire est renvoyé à la mention de LICELI plus bas,
 * ce qui évite d'enfermer le profil dans une seule industrie.
 * Chaque carte porte sa teinte pour se distinguer au premier coup d'œil.
 */
const expertise: {
  icon: IconType;
  title: string;
  description: string;
  tint: string;
}[] = [
  {
    icon: LuServer,
    title: "Applications métiers et API",
    description:
      "Conception et développement de services backend, d'API REST et d'intégrations entre systèmes existants, jusqu'à la recette et la mise en production.",
    tint: "bg-info-soft text-info",
  },
  {
    icon: LuShieldCheck,
    title: "Contrôle interne, audit et risques",
    description:
      "Cartographie des risques, plans de contrôle, missions d'audit, suivi des incidents et des actions correctives.",
    tint: "bg-accent-soft text-accent",
  },
  {
    icon: LuPencilRuler,
    title: "Interfaces et parcours utilisateur",
    description:
      "Wireframes, maquettes haute fidélité et prototypes sous Figma, puis développement des interfaces en React et Next.js.",
    tint: "bg-warning-soft text-warning",
  },
];

const stack: { label: string; items: string[] }[] = [
  {
    label: "Backend",
    items: ["Python", "Django", "Django REST Framework", "Spring Boot", "API REST", "SOAP"],
  },
  {
    label: "Frontend",
    items: ["TypeScript", "React", "Next.js", "React Native"],
  },
  {
    label: "Données",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Elasticsearch"],
  },
  {
    label: "Infrastructure et exploitation",
    items: ["Docker", "Ansible", "CI/CD", "Linux", "Prometheus", "Grafana"],
  },
];

export default function Home() {
  return (
    <Template>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — typographique. L'illustration a été retirée : elle tirait  */}
      {/* la page vers la plaquette de freelance.                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {site.role}
        </p>

        <h1 className="mt-5 max-w-4xl text-pretty font-display text-5xl font-normal leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Je construis des applications métiers{" "}
          <span className="text-gradient">qui tiennent en production</span>.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
          {site.tagline}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/projets" className={buttonClass("primary", "lg")}>
            Voir les projets
            <LuArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/contact" className={buttonClass("secondary", "lg")}>
            Me contacter
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Projets — la section la plus haute de la page, volontairement.   */}
      {/* ---------------------------------------------------------------- */}
      {/* Fonds de section alternés, teintés très légèrement : ils rythment la
          lecture sans que la couleur devienne le sujet. En sombre, les teintes
          sont atténuées pour ne pas écraser le texte. */}
      <section className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="projets"
            eyebrow="Projets"
            title="Ce que j'ai construit"
            subtitle="Quelques réalisations détaillées : le contexte, les décisions techniques et le résultat."
          />

          <div className="mt-12">
            <FeaturedProjects />
          </div>

          <ScrollReveal y={20}>
            <div className="mt-12">
              <Link
                href="/projets"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
              >
                Tous les projets
                <LuArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Expertise                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border bg-accent-soft/50 dark:bg-accent-soft/25">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="expertise"
            eyebrow="Expertise"
            title="Les domaines sur lesquels j'interviens"
            subtitle="Des environnements où l'exactitude, la traçabilité et le contrôle des accès ne sont pas négociables."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {expertise.map(({ icon: Icon, title, description, tint }, index) => (
              <ScrollReveal key={title} delay={0.1 + index * 0.08} y={24}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/40">
                  <span
                    className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {description}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* Le contexte bancaire et conformité tient en une phrase, rattaché à
              l'employeur : mentionné sans occuper toute la section. */}
          <ScrollReveal delay={0.3} y={16}>
            <p className="mt-8 text-sm leading-relaxed text-muted">
              Ces travaux sont menés chez{" "}
              <a
                href={site.employer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-accent transition-opacity hover:opacity-80"
              >
                {site.employer.name}
                <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              , notamment sur des projets bancaires, de conformité et de
              détection de fraude.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stack                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="stack"
            eyebrow="Stack"
            title="Les outils que j'utilise"
            subtitle="Ce avec quoi je travaille réellement au quotidien, pas une liste exhaustive."
          />

          <dl className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {stack.map(({ label, items }, index) => (
              <ScrollReveal key={label} delay={0.05 + index * 0.06} y={20}>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {label}
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Chip key={item}>{item}</Chip>
                    ))}
                  </dd>
                </div>
              </ScrollReveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Contact                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border bg-info-soft/40 dark:bg-info-soft/20">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <ScrollReveal y={24}>
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-surface p-10">
              <h2 className="max-w-xl text-balance font-display text-3xl font-normal tracking-tight md:text-4xl">
                Un projet, un poste, une question technique ?
              </h2>
              <p className="max-w-xl text-pretty leading-relaxed text-muted">
                Décrivez le contexte en quelques lignes, je vous réponds sous 48
                heures.
              </p>
              <Link href="/contact" className={buttonClass("primary", "lg")}>
                <LuMail className="h-4 w-4" aria-hidden />
                Me contacter
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Template>
  );
}
