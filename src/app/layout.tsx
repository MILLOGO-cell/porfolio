import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsent from '@/components/CookieConsent';
import { ScrollProgress } from "@/components/ScrollProgress";
import { MotionProvider } from "@/components/motion/MotionProvider";
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
    // `clip` et non `hidden` : voir globals.css. `hidden` faisait de <body> un
    // conteneur de defilement, ce qui cassait animation-timeline: view().
    <html lang="fr" suppressHydrationWarning className="overflow-x-clip">
      <body
        className="max-w-full overflow-x-clip antialiased"
      >
        <ThemeProvider>
          <AuthProvider>
            <MotionProvider>
              {/* Une seule barre en haut de l'écran. `PageLoader` en posait une
                  seconde, identique, qui ne mesurait rien : elle se déclenchait
                  après la navigation sur une minuterie de 500 ms. */}
              <ScrollProgress />
              <VisitorTracker />
              <CookieConsent />
              {children}
            </MotionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}