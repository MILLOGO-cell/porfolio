import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/dal';
import { projectSchema } from '@/lib/validations';
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  handleApiError,
  zodErrorsToRecord,
} from '@/lib/api-response';

// ====================================
// GET /api/projects
// Liste complète (admin) — la liste publique est /api/projects/public
// ====================================

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');

    const where: Prisma.ProjectWhereInput = {};

    if (featured === 'true') {
      where.featured = true;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });

    return successResponse({
      projects,
      count: projects.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// ====================================
// POST /api/projects
// Créer un nouveau projet (admin)
// ====================================

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(zodErrorsToRecord(validation.error.issues));
    }

    const project = await prisma.project.create({
      data: validation.data,
    });

    return successResponse(project, 201);
  } catch (error) {
    // P2002 = violation d'unicité ; ici ce ne peut être que le slug.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return validationErrorResponse({
        slug: ['Ce slug est déjà utilisé par un autre projet'],
      });
    }
    return handleApiError(error);
  }
}
