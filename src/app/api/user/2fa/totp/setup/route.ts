import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/dal';
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
} from '@/lib/api-response';

export async function POST() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const secret = speakeasy.generateSecret({
      name: `Portfolio (${admin.email})`,
      issuer: 'Portfolio Admin',
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    await prisma.user.update({
      where: { id: admin.id },
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
