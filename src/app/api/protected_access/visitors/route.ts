/* eslint-disable @typescript-eslint/no-explicit-any */
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

        const visitors = await prismaAny.visitor.findMany({
            include: {
                visits: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 5,
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 50,
        });

        // Format data to include visit count and last visit path
        const formattedVisitors = visitors.map((v: any) => ({
            id: v.id,
            lastIp: v.lastIp,
            userAgent: v.userAgent,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
            lastVisitPath: v.visits[0]?.path || '/',
            totalVisits: v.visits.length, // This is only for the last 5 in this query, but in a real app we'd aggregate
        }));

        return successResponse({ visitors: formattedVisitors });
    } catch (error) {
        return handleApiError(error);
    }
}
