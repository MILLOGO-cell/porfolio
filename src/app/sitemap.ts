import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

// Régénéré toutes les heures : un projet publié apparaît sans redéploiement.
export const revalidate = 3600;

const PAGES = ["", "/projets", "/contact", "/mentions-legales", "/confidentialite", "/conditions"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = PAGES.map((path) => ({ url: `${site.url}${path}` }));

  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    return [
      ...pages,
      ...projects.map((p) => ({
        url: `${site.url}/projets/${p.slug}`,
        lastModified: p.updatedAt,
      })),
    ];
  } catch {
    // Base injoignable (build sans base) : le sitemap reste valide, sans les projets.
    return pages;
  }
}
