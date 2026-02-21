import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');
    const limit = searchParams.get('limit');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (featured === 'true') {
      where.featured = true;
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        imageUrl: true,
        tags: true,
        featured: true,
        createdAt: true,
      },
    });

    return successResponse({ projects });
  } catch (error) {
    return handleApiError(error);
  }
}