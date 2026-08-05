import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsent from '@/components/CookieConsent';
import { ScrollProgress } from "@/components/ScrollProgress";
import { PageLoader } from "@/components/PageLoader";
import { site } from "@/lib/site";

// Typographie : Helvetica via une pile système, définie dans tailwind.config.
// Aucune police n'est téléchargée, ce qui supprime le temps de chargement des
// fontes et le décalage de mise en page qui l'accompagne.

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name} · ${site.role}`,
    description: site.tagline,
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className="max-w-full overflow-x-hidden antialiased"
      >
        <ThemeProvider>
          <AuthProvider>
            <PageLoader />
            <ScrollProgress />
            <VisitorTracker />
            <CookieConsent />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}