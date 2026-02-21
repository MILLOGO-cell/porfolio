/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return errorResponse('Non autorisé', 401);
        }

        const prismaAny = prisma as any;

        // Statistiques de base
        const totalProjects = await prismaAny.project.count();
        const featuredProjects = await prismaAny.project.count({
            where: { featured: true },
        });

        // Statistiques des visiteurs
        const totalVisitors = await prismaAny.visitor.count();
        const totalVisits = await prismaAny.visit.count();

        // Visiteurs aujourd'hui
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const visitorsToday = await prismaAny.visitor.count({
            where: {
                createdAt: {
                    gte: startOfToday,
                },
            },
        });

        const visitsToday = await prismaAny.visit.count({
            where: {
                createdAt: {
                    gte: startOfToday,
                },
            },
        });

        // Pages les plus visitées
        const topPages = await prismaAny.visit.groupBy({
            by: ['path'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 5,
        });

        return successResponse({
            projects: {
                total: totalProjects,
                featured: featuredProjects,
            },
            visitors: {
                totalVisible: totalVisitors,
                totalVisits: totalVisits,
                today: visitorsToday,
                visitsToday: visitsToday,
            },
            topPages,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
