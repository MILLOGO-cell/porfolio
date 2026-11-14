import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Qui édite ce site et où il est hébergé.`,
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="14 novembre 2026">
      <h2>Qui édite ce site</h2>
      <p>
        Ouettéré Nicolas MILLOGO, à {site.location}. Site personnel, sans
        société. Contact : <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <h2>Où il est hébergé</h2>
      <p>
        Le site chez Vercel Inc. (États-Unis) et la base de données chez Neon
        (Francfort, Allemagne).
      </p>

      <h2>Pour en savoir plus</h2>
      <p>
        Voir la <a href="/confidentialite">confidentialité</a> et les{" "}
        <a href="/conditions">conditions d&apos;utilisation</a>.
      </p>
    </LegalPage>
  );
}
