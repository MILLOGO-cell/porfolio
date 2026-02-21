/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
    try {
        // Check if admin is logged in, if so, skip tracking
        const session = await getServerSession(authOptions);
        if (session) {
            return successResponse({ skipped: true, message: 'Admin visit not tracked' });
        }

        const body = await request.json();
        const { path, referer } = body;

        // Get visitor ID from cookie
        let visitorId = request.cookies.get('visitor_id')?.value;
        const userAgent = request.headers.get('user-agent') || 'Unknown';
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            '0.0.0.0';

        const prismaAny = prisma as any;

        if (!visitorId) {
            // Create new visitor
            const visitor = await prismaAny.visitor.create({
                data: {
                    lastIp: ip,
                    userAgent: userAgent,
                },
            });
            visitorId = visitor.id;
        } else {
            // Update existing visitor's last known info
            await prismaAny.visitor.update({
                where: { id: visitorId },
                data: {
                    lastIp: ip,
                    userAgent: userAgent,
                },
            }).catch(() => {
                // If visitorId in cookie is invalid/not in DB, we'll handle it by creating a new one next time
                // but for this request we'll just continue if possible or fail gracefully
            });
        }

        // Log the visit
        await prismaAny.visit.create({
            data: {
                visitorId: visitorId!,
                path: path || '/',
                referer: referer || null,
                ip: ip,
                userAgent: userAgent,
            },
        });

        const response = successResponse({ visitorId });

        if (visitorId) {
            // Set or refresh the visitor_id cookie (expires in 1 year)
            response.cookies.set('visitor_id', visitorId, {
                maxAge: 365 * 24 * 60 * 60,
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
        }

        return response;
    } catch (error) {
        return handleApiError(error);
    }
}
