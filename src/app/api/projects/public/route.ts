import { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { successResponse, handleApiError } from '@/lib/api-response';

/** Champs exposés publiquement — DTO explicite, pas l'entité complète. */
const publicSelect = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  description: true,
  url: true,
  imageUrl: true,
  tags: true,
  stack: true,
  category: true,
  client: true,
  period: true,
  featured: true,
  createdAt: true,
} satisfies Prisma.ProjectSelect;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');
    const limit = searchParams.get('limit');

    // Une fiche non publiée ne doit jamais sortir par l'API publique.
    const where: Prisma.ProjectWhereInput = { published: true };

    if (featured === 'true') {
      where.featured = true;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const parsedLimit = limit ? Number.parseInt(limit, 10) : NaN;
    const take =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 50)
        : undefined;

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      take,
      select: publicSelect,
    });

    return successResponse({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}
