import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsent from '@/components/CookieConsent';
import { ScrollProgress } from "@/components/ScrollProgress";
import { PageLoader } from "@/components/PageLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Mon portfolio professionnel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden max-w-full`}
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