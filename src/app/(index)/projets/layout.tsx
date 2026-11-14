import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Applications métiers, sites et API réalisés, du cadrage à la mise en production.",
  alternates: { canonical: "/projets" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
