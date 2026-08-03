import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/dal';
import { projectSchema } from '@/lib/validations';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  handleApiError,
  zodErrorsToRecord,
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return errorResponse('Projet non trouvé', 404);
    }

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProject) {
      return errorResponse('Projet non trouvé', 404);
    }

    const body = await request.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(zodErrorsToRecord(validation.error.issues));
    }

    const project = await prisma.project.update({
      where: { id },
      data: validation.data,
    });

    return successResponse(project);
  } catch (error) {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProject) {
      return errorResponse('Projet non trouvé', 404);
    }

    await prisma.project.delete({ where: { id } });

    return successResponse({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}
