import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return errorResponse('Non autorisé', 401);
    }

    const secret = speakeasy.generateSecret({
      name: `Portfolio (${session.user.email})`,
      issuer: 'Portfolio Admin',
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    await prisma.user.update({
      where: { email: session.user.email },
      data: { totpSecret: secret.base32 },
    });

    return successResponse({
      secret: secret.base32,
      qrCode: qrCodeUrl,
    });
  } catch (error) {
    return handleApiError(error);
  }
}