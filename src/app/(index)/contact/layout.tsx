import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Décrivez votre projet : objectifs, contraintes, échéance. Réponse sous 48 heures.",
  alternates: { canonical: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
