import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const maxDuration = 30;

const GENERIC_ERROR = 'An error occurred processing your request';
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp'];

/**
 * POST /api/user/avatar — multipart form with field "file".
 * Uploads to Cloudinary (unsigned preset) server-side and returns the secure URL.
 * Credentials never reach the client.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) {
      logger.error('Avatar upload misconfigured: missing Cloudinary settings');
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'La imagen supera 5MB.' }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no soportado (PNG/JPG/WebP).' }, { status: 400 });
    }

    const upload = new FormData();
    upload.append('file', file);
    upload.append('upload_preset', preset);
    upload.append('folder', 'victor-ia/avatars');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: 'POST',
      body: upload,
    });

    if (!res.ok) {
      logger.error('Cloudinary upload failed', undefined, { status: res.status });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    const data = (await res.json()) as { secure_url?: string };
    if (!data.secure_url) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    return NextResponse.json({ success: true, url: data.secure_url });
  } catch (error) {
    logger.error('Avatar upload failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
