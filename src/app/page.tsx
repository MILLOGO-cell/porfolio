import Link from "next/link";
import type { IconType } from "react-icons";
import {
  LuArrowRight,
  LuClipboardList,
  LuContainer,
  LuDatabase,
  LuGitPullRequest,
  LuLandmark,
  LuMail,
  LuMonitor,
  LuNetwork,
  LuPencilRuler,
  LuRocket,
  LuServer,
  LuSmartphone,
} from "react-icons/lu";
import Template from "./Template";
import FeaturedProjects from "@/components/FeaturedProjects";
import Prototypes from "@/components/Prototypes";
import SectionHeader from "@/components/ui/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { IntroGroup } from "@/components/motion/Intro";
import { ChipWave, HeroParallax, Magnetic } from "@/components/motion/primitives";
import { buttonClass } from "@/components/ui/button-styles";
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

/*
 * Classées de la couche la plus visible à la plus transverse ; dans chaque
 * groupe, du plus utilisé au moins utilisé. Figma rejoint « Outils et
 * livraison » : seul, il aurait fait une catégorie d'un élément.
 */
/* Une teinte par groupe, en rotation : accent, violet, cyan. */
const tints = ["accent", "accent-2", "accent-3"] as const;

const stack: { label: string; icon: IconType; span?: 2; items: string[] }[] = [
  {
    label: "Frontend web",
    icon: LuMonitor,
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    label: "Mobile",
    icon: LuSmartphone,
    items: ["Flutter", "React Native", "Expo"],
  },
  {
    label: "Backend et API",
    icon: LuServer,
    span: 2,
    items: [
      "Python",
      "Django",
      "Django REST Framework",
      "API REST",
      "Java",
      "Spring Boot",
      "Authentification JWT",
      "WebSocket",
      "SOAP",
    ],
  },
  {
    label: "Données",
    icon: LuDatabase,
    items: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "Elasticsearch"],
  },
  {
    label: "Outils et livraison",
    icon: LuRocket,
    span: 2,
    items: ["Git", "GitHub Actions", "CI/CD", "Tests automatisés", "Figma"],
  },
  {
    label: "Infrastructure",
    icon: LuContainer,
    items: ["Docker", "Linux", "Coolify", "Ansible", "Prometheus", "Grafana"],
  },
];

/** Découpe un texte en mots animés en cascade (`--i` = rang du mot). */
const words = (text: string, from = 0, extra = "") =>
  text.split(" ").map((w, i) => (
    <span key={i}>
      <span className={`word-in ${extra}`} style={{ "--i": from + i } as React.CSSProperties}>
        {w}
      </span>{" "}
    </span>
  ));

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
        <HeroParallax
          y={[0, -80]}
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[760px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <div
            aria-hidden
            className="halo-drift absolute inset-y-0 -inset-x-[10%] bg-[radial-gradient(ellipse_at_top_left,rgb(var(--accent)/0.34),transparent_55%),radial-gradient(ellipse_at_top_right,rgb(var(--accent-2)/0.28),transparent_55%),radial-gradient(ellipse_at_50%_100%,rgb(var(--accent-3)/0.2),transparent_60%)]"
          />
        </HeroParallax>

        {/* Le hero était le seul bloc entièrement statique de la page, alors
            que tout le reste s'animait au défilement. La cascade rétablit
            l'équilibre : le regard descend le premier écran dans l'ordre où il
            doit le lire. */}
        <HeroParallax y={[0, 60]}>
        <IntroGroup className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-32">
          <p className="inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold uppercase tracking-[0.14em] text-accent">
            {site.role}
          </p>

          <h1 className="mt-5 max-w-4xl text-pretty text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {words("Je construis des applications métiers")}
            {/* Le dégradé est posé sur chaque mot : un parent en
                background-clip:text ne peint pas ses enfants inline-block. */}
            {words("qui tiennent en production.", 5, "text-gradient")}
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            {site.tagline}
          </p>

          <div className="mt-12 flex flex-wrap gap-3 md:mt-14">
            {/* Un seul appel à l'action : la prise de contact. Les projets
                restent à un clic dans le menu. */}
            <Magnetic>
              <Link href="/contact" className={buttonClass("primary", "lg")}>
                Me contacter
                <LuArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Magnetic>
          </div>
        </IntroGroup>
        </HeroParallax>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Projets — la section la plus haute de la page, volontairement.   */}
      {/* ---------------------------------------------------------------- */}
      {/* Fonds de section alternés, teintés très légèrement : ils rythment la
          lecture sans que la couleur devienne le sujet. En sombre, les teintes
          sont atténuées pour ne pas écraser le texte. */}
      <section>
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
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent transition-opacity hover:opacity-80"
              >
                Tous les projets
                <LuArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Prototypes Figma, interactifs au clic. */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="prototypes"
            eyebrow="Design"
            title="Prototypes interactifs"
            subtitle="Des maquettes conçues sous Figma, à parcourir comme une vraie interface."
          />
          <div className="mt-12">
            <Prototypes />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Expertise                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="expertise"
            eyebrow="Expertise"
            title="De l'analyse métier à la mise en production"
            subtitle="J'interviens sur l'ensemble du cycle de réalisation de solutions numériques complexes : cadrage du besoin, conception fonctionnelle et technique, coordination des développements, intégration, sécurisation et mise en production."
          />

          {/* Deux colonnes plutôt que trois : les six entrees portent un texte
              dense, une colonne trop etroite les rendrait illisibles. */}
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:[&>:last-child:nth-child(odd)]:col-span-2">
            {expertise.map(({ icon: Icon, title, description, tint }, index) => (
              <ScrollReveal key={title} delay={0.08 + index * 0.06} y={24}>
                <article className="glass glass-hover flex h-full gap-4 rounded-3xl p-6">
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
                    <p className="mt-2 hyphens-auto lg:text-justify text-sm leading-relaxed text-muted">
                      {description}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stack                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <SectionHeader
            id="stack"
            eyebrow="Stack"
            title="Les outils que j'utilise"
            subtitle="Ce avec quoi je travaille réellement au quotidien, pas une liste exhaustive."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map(({ label, icon: Icon, span, items }, index) => (
              <ScrollReveal
                key={label}
                delay={0.05 + index * 0.06}
                y={20}
                className={span === 2 ? "sm:col-span-2" : ""}
              >
                <div className="glass h-full rounded-3xl p-6">
                  <div className="flex items-center gap-3">
                    {/* Pastille vitrée : même langage que les cartes. */}
                    <span
                      className="glass inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ color: `rgb(var(--${tints[index % 3]}))` }}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      {label}
                    </h3>
                  </div>
                  <ChipWave items={items} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Contact                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-8">
          <ScrollReveal y={24}>{/* Bloc de contact */}
            <div className="glass flex flex-col items-start gap-6 rounded-3xl p-10 md:p-14">
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
