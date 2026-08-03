import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/dal';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from '@/lib/api-response';

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Extensions autorisées, déduites du type MIME — jamais du nom de fichier
 * fourni par le client. Un `file.name` de la forme `../../server.js` sortait
 * du dossier uploads une fois passé à path.join.
 */
const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Signatures binaires : le `type` d'un File vient du navigateur et se falsifie.
 * On vérifie les premiers octets du contenu réel.
 */
function detectMimeFromBytes(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  if (buffer.subarray(0, 3).toString('ascii') === 'GIF') {
    return 'image/gif';
  }
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return errorResponse('Aucun fichier fourni', 400);
    }

    if (file.size > MAX_BYTES) {
      return errorResponse('Fichier trop volumineux. Maximum 5 Mo.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const detectedMime = detectMimeFromBytes(buffer);
    const extension = detectedMime ? EXTENSION_BY_MIME[detectedMime] : undefined;

    if (!extension) {
      return errorResponse(
        'Type de fichier non valide. Utilisez JPG, PNG, WEBP ou GIF.',
        400
      );
    }

    // Nom généré côté serveur : rien de ce que le client envoie n'atteint le
    // système de fichiers.
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);

    return successResponse({ url: `/uploads/${filename}` });
  } catch (error) {
    return handleApiError(error);
  }
}
