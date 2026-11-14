import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Les informations que ce site collecte, et ce que j'en fais.",
  alternates: { canonical: "/confidentialite" },
};

export default function Confidentialite() {
  return (
    <LegalPage title="Confidentialité" updated="14 novembre 2026">
      <p>
        Voici, simplement, ce que ce site retient de vous. Je ne vends ni
        n&apos;échange aucune information.
      </p>

      <h2>Si vous m&apos;écrivez</h2>
      <p>
        Votre nom, votre e-mail et votre message me sont envoyés par e-mail,
        uniquement pour vous répondre. Ils ne sont pas enregistrés sur le site.
      </p>

      <h2>Si vous acceptez les cookies</h2>
      <p>
        Le site note les pages que vous visitez, d&apos;où vous venez, votre
        adresse IP et votre navigateur, avec un identifiant aléatoire gardé 12
        mois dans un cookie. Cela sert seulement à savoir quelles pages sont
        lues. Ces données sont supprimées au bout de 13 mois. Si vous refusez,
        rien de tout cela n&apos;est enregistré, et le site fonctionne pareil.
      </p>

      <h2>Mesure sans cookie</h2>
      <p>
        L&apos;hébergeur (Vercel) mesure l&apos;audience et la vitesse du site de
        façon anonyme, sans cookie.
      </p>

      <h2>Sur votre appareil</h2>
      <p>
        Votre navigateur garde votre choix de cookies et votre thème clair ou
        sombre. Cela reste chez vous.
      </p>

      <h2>Vos choix</h2>
      <p>
        Vous pouvez changer d&apos;avis avec « Gérer les cookies » en bas de
        page. Pour consulter, corriger ou faire effacer ce que j&apos;ai sur
        vous, écrivez-moi à{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
