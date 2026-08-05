import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsent from '@/components/CookieConsent';
import { ScrollProgress } from "@/components/ScrollProgress";
import { PageLoader } from "@/components/PageLoader";
import { site } from "@/lib/site";

/**
 * Geist est la police de Vercel : elle signale « projet Next.js » avant de
 * signaler quoi que ce soit sur son auteur. Remplacée par Inter, la référence
 * des interfaces (excellente en français, diacritiques compris), avec un serif
 * réservé aux grands titres pour donner une tenue éditoriale plutôt que
 * l'uniformité d'un gabarit.
 */
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

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
        className={`${sans.variable} ${display.variable} ${mono.variable} antialiased overflow-x-hidden max-w-full`}
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