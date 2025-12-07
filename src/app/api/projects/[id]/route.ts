import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { projectSchema } from '@/lib/validations';
import { successResponse, errorResponse, validationErrorResponse, handleApiError } from '@/lib/api-response';

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
    const { id } = await params;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return errorResponse('Projet non trouvé', 404);
    }

    const body = await request.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return validationErrorResponse(errors);
    }

    const project = await prisma.project.update({
      where: { id },
      data: validation.data,
    });

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return errorResponse('Projet non trouvé', 404);
    }

    await prisma.project.delete({
      where: { id },
    });

    return successResponse({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}