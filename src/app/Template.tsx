import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

/**
 * Coquille commune aux pages publiques : header fixe, contenu, footer partagé.
 * Le `pt-20` compense la hauteur du header en position fixed.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-foreground">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
