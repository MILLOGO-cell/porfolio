/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { projectSchema } from '@/lib/validations';
import { successResponse, validationErrorResponse, handleApiError } from '@/lib/api-response';

// ====================================
// GET /api/projects
// Liste tous les projets
// ====================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const tag = searchParams.get('tag');

    // Construire les filtres
    const where: any = {};
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    // Récupérer les projets
    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
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
    // TODO: Vérifier l'authentification admin
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return errorResponse('Non autorisé', 401);
    // }

    // Récupérer et valider les données
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

    // Créer le projet
    const project = await prisma.project.create({
      data: validation.data,
    });

    return successResponse(project, 201);
  } catch (error) {
    return handleApiError(error);
  }
}