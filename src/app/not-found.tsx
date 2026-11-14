import type { Metadata } from "next";
import Link from "next/link";
import Template from "@/app/Template";
import { buttonClass } from "@/components/ui/button-styles";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Template>
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center gap-6 px-4 py-20 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Erreur 404
        </p>
        <h1 className="text-balance text-5xl font-bold tracking-tight md:text-6xl">
          Cette page n&apos;existe pas, ou plus.
        </h1>
        <p className="max-w-xl text-pretty leading-relaxed text-muted">
          Le lien est peut-être ancien ou mal saisi. Retrouvez les projets
          depuis l&apos;accueil, ou écrivez-moi si vous cherchiez autre chose.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className={buttonClass("primary", "lg")}>
            Retour à l&apos;accueil
          </Link>
          <Link href="/projets" className={buttonClass("secondary", "lg")}>
            Voir les projets
          </Link>
        </div>
      </section>
    </Template>
  );
}
