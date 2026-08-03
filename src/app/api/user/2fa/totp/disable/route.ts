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

    await prisma.user.update({
      where: { id: admin.id },
      data: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        totpSecret: null,
      },
    });

    return successResponse({ message: '2FA désactivé avec succès' });
  } catch (error) {
    return handleApiError(error);
  }
}
