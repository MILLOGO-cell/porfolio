import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsent from '@/components/CookieConsent';
import { ScrollProgress } from "@/components/ScrollProgress";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "@/lib/site";

// Typographie : Helvetica via une pile système, définie dans tailwind.config.
// Aucune police n'est téléchargée, ce qui supprime le temps de chargement des
// fontes et le décalage de mise en page qui l'accompagne.

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
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
    siteName: site.name,
    url: "/",
  },
  // L'image d'aperçu vient de app/opengraph-image.tsx.
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description: site.tagline,
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
      <head>
        <noscript>
          <style>{`[data-motion]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/*
          Le thème est appliqué AVANT le premier rendu, par un script bloquant.

          Il était posé jusqu'ici dans un effet de `ThemeProvider`, donc après
          l'hydratation : un visiteur en préférence sombre voyait le site
          s'afficher en clair, puis basculer. Ce clignotement ne se corrige pas
          côté React — le serveur ne peut pas connaître la préférence, et tout
          ce qui s'exécute après l'hydratation arrive trop tard.

          Le script est court et synchrone : il coûte moins qu'un repaint. Le
          try/catch couvre les navigateurs où `localStorage` lève, en navigation
          privée verrouillée par exemple ; on retombe alors sur le thème clair.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
      </head>
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
              {/* Mesure d'audience sans cookie ni donnée personnelle. */}
              <Analytics />
              <SpeedInsights />
            </MotionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}