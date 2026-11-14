import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Les règles simples d'usage de ce site personnel.",
  alternates: { canonical: "/conditions" },
};

export default function Conditions() {
  return (
    <LegalPage title="Conditions d'utilisation" updated="14 novembre 2026">
      <p>
        Ce site est mon portfolio personnel. En l&apos;utilisant, vous acceptez
        ces quelques règles.
      </p>

      <h2>Ce que le site est</h2>
      <p>
        Une vitrine de mon travail. Il ne vend rien : une collaboration passe
        toujours par un échange puis un accord écrit, jamais par ce site seul.
      </p>

      <h2>Contenus</h2>
      <p>
        Les textes, visuels et le code sont de moi, sauf mention contraire. Vous
        pouvez les citer en indiquant la source ; pour le reste, demandez-moi.
        Les noms et logos des projets appartiennent à leurs propriétaires : ce
        sont des références, pas des partenariats. Si vous souhaitez qu&apos;une
        référence soit retirée ou corrigée, écrivez-moi.
      </p>

      <h2>À ne pas faire</h2>
      <p>
        Ne pas chercher à accéder à ce qui n&apos;est pas public, ne pas
        perturber le site, et ne pas utiliser le formulaire de contact pour du
        spam ou des messages abusifs.
      </p>

      <h2>Limites</h2>
      <p>
        Le site est fourni tel quel : il peut être indisponible ou contenir des
        erreurs, et je ne peux pas être tenu responsable de ce qui en résulte.
        Les liens vers d&apos;autres sites ne dépendent pas de moi.
      </p>

      <h2>En cas de souci</h2>
      <p>
        Écrivez-moi à <a href={`mailto:${site.email}`}>{site.email}</a>. Le
        droit applicable est le droit burkinabè.
      </p>
    </LegalPage>
  );
}
