import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuBuilding2,
  LuMail,
  LuShieldCheck,
  LuTriangleAlert,
} from "react-icons/lu";
import Template from "./Template";
import FeaturedProjects from "@/components/FeaturedProjects";
import SectionHeader from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { buttonClass } from "@/components/ui/button-styles";
import { site } from "@/lib/site";

/**
 * Domaines d'intervention — ce que je construis, pas un catalogue de
 * prestations. Trois entrées, volontairement : au-delà, ça redevient une
 * plaquette commerciale.
 */
const expertise: { icon: IconType; title: string; description: string }[] = [
  {
    icon: LuBuilding2,
    title: "Systèmes bancaires et paiements",
    description:
      "Services backend, intégration de core banking et de plateformes de paiement, échanges REST et SOAP, recette et suivi des anomalies.",
  },
  {
    icon: LuShieldCheck,
    title: "Contrôle interne, audit et risques",
    description:
      "Cartographie des risques, plans de contrôle, missions d'audit, incidents et actions correctives — de la conception des parcours à la mise en production.",
  },
  {
    icon: LuTriangleAlert,
    title: "Conformité et détection de fraude",
    description:
      "Filtrage des clients, listes de sanctions, qualification des alertes et règles de surveillance des opérations, avec traçabilité et contrôle des accès.",
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

        <h1 className="mt-5 max-w-3xl text-pretty text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
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
      <section className="border-t border-border">
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
      <section className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="expertise"
            eyebrow="Expertise"
            title="Les domaines sur lesquels j'interviens"
            subtitle="Des environnements où l'exactitude, la traçabilité et le contrôle des accès ne sont pas négociables."
          />

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {expertise.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal key={title} delay={0.1 + index * 0.08} y={24}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-accent/40">
                  <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
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
                      <span
                        key={item}
                        className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
                      >
                        {item}
                      </span>
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
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <ScrollReveal y={24}>
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-surface p-10">
              <h2 className="max-w-xl text-balance text-2xl font-semibold tracking-tight md:text-3xl">
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
