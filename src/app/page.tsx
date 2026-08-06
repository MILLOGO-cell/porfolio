import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuArrowUpRight,
  LuClipboardList,
  LuGitPullRequest,
  LuLandmark,
  LuMail,
  LuNetwork,
  LuPencilRuler,
  LuShieldCheck,
} from "react-icons/lu";
import Template from "./Template";
import FeaturedProjects from "@/components/FeaturedProjects";
import SectionHeader from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { IntroGroup } from "@/components/motion/Intro";
import { buttonClass } from "@/components/ui/button-styles";
import { Chip } from "@/components/ui/Badge";
import { site } from "@/lib/site";

/**
 * Domaines d'intervention — ce que je construis, pas un catalogue de
 * prestations. Trois entrées, volontairement : au-delà, ça redevient une
 * plaquette commerciale.
 */
/**
 * Domaines d'expertise, ordonnés comme un cycle de réalisation : du cadrage
 * jusqu'à la mise en production. Le rang est affiché, il porte cette lecture.
 */
const expertise: {
  icon: IconType;
  title: string;
  description: string;
  tint: string;
}[] = [
  {
    icon: LuClipboardList,
    title: "Cadrage et conception fonctionnelle",
    description:
      "Analyse des besoins, animation d'ateliers métier, modélisation des processus et rédaction de cahiers des charges et de spécifications fonctionnelles détaillées.",
    tint: "bg-accent-soft text-accent",
  },
  {
    icon: LuNetwork,
    title: "Architecture logicielle et API",
    description:
      "Conception d'architectures modulaires, de services backend et d'API sécurisées pour intégrer des applications, des systèmes existants et des partenaires externes.",
    tint: "bg-info-soft text-info",
  },
  {
    icon: LuLandmark,
    title: "Banque digitale et systèmes de paiement",
    description:
      "Conception de solutions de mobile banking, de gestion des comptes, de transferts, de paiements et d'intégration avec les systèmes bancaires et les infrastructures financières.",
    tint: "bg-success-soft text-success",
  },
  {
    icon: LuShieldCheck,
    title: "Conformité, fraude et contrôle interne",
    description:
      "Digitalisation des processus de LCB-FT, de filtrage des sanctions, de détection de fraude, de gestion des risques, de contrôle permanent et d'audit interne.",
    tint: "bg-warning-soft text-warning",
  },
  {
    icon: LuGitPullRequest,
    title: "Pilotage technique et qualité",
    description:
      "Organisation du travail des équipes, découpage des fonctionnalités, revues de code, suivi des développements, stratégie de tests et accompagnement jusqu'à la mise en production.",
    tint: "bg-accent-soft text-accent",
  },
  {
    icon: LuPencilRuler,
    title: "Interfaces et parcours métier",
    description:
      "Conception de parcours utilisateurs, de tableaux de bord et d'interfaces adaptées aux réalités opérationnelles, depuis les premières maquettes jusqu'à leur développement.",
    tint: "bg-info-soft text-info",
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
      <section className="relative isolate overflow-hidden">
        {/* Halo coloré derrière le hero : il donne le ton chromatique de la
            page sans poser d'aplat derrière le texte, qui perdrait en lisibilité. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top_left,rgb(var(--accent)/0.30),transparent_55%),radial-gradient(ellipse_at_top_right,rgb(var(--info)/0.26),transparent_55%)]"
        />

        {/* Le hero était le seul bloc entièrement statique de la page, alors
            que tout le reste s'animait au défilement. La cascade rétablit
            l'équilibre : le regard descend le premier écran dans l'ordre où il
            doit le lire. */}
        <IntroGroup className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28">
          <p className="inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold uppercase tracking-[0.14em] text-accent">
            {site.role}
          </p>

          <h1 className="mt-5 max-w-4xl text-pretty text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
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
        </IntroGroup>
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
      <section className="border-t border-border bg-accent-soft/45 dark:bg-accent-soft/20">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="expertise"
            eyebrow="Expertise"
            title="De l'analyse métier à la mise en production"
            subtitle="J'interviens sur l'ensemble du cycle de réalisation de solutions numériques complexes : cadrage du besoin, conception fonctionnelle et technique, coordination des développements, intégration, sécurisation et mise en production."
          />

          {/* Deux colonnes plutôt que trois : les six entrees portent un texte
              dense, une colonne trop etroite les rendrait illisibles. */}
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {expertise.map(({ icon: Icon, title, description, tint }, index) => (
              <ScrollReveal key={title} delay={0.08 + index * 0.06} y={24}>
                <article className="flex h-full gap-4 rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/40">
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tint}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold tabular-nums text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        {title}
                      </h3>
                    </div>
                    <p className="mt-2 hyphens-auto text-justify text-sm leading-relaxed text-muted">
                      {description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3} y={16}>
            <p className="mt-8 hyphens-auto text-justify text-sm leading-relaxed text-muted">
              Ces expertises sont mises en œuvre au sein de{" "}
              <a
                href={site.employer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-bold text-accent transition-opacity hover:opacity-80"
              >
                {site.employer.name}
                <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              , principalement sur des projets bancaires, financiers,
              réglementaires et de digitalisation des processus métier.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stack                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border bg-warning-soft/30 dark:bg-warning-soft/15">
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
          <ScrollReveal y={24}>{/* Bloc de contact */}
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-surface p-10">
              <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight md:text-4xl">
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
