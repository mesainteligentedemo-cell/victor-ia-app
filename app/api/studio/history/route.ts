import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';
import { listGenerations, GenerationType } from '@/lib/studio/generations';

export const runtime = 'nodejs';

const GENERIC_ERROR = 'An error occurred processing your request';

const VALID_TYPES: GenerationType[] = [
  'voice',
  'music',
  'presentation',
  'proposal',
  'email',
  'image',
  'video',
  'document',
  'website',
];

/**
 * GET /api/studio/history?type=voice&limit=5
 * Returns the current user's most recent generations of a given type.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const typeParam = req.nextUrl.searchParams.get('type');
    const limitParam = Number(req.nextUrl.searchParams.get('limit') ?? '5');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 20) : 5;

    const type =
      typeParam && VALID_TYPES.includes(typeParam as GenerationType)
        ? (typeParam as GenerationType)
        : undefined;

    const items = await listGenerations(userId, type, limit);
    return NextResponse.json({ success: true, items });
  } catch (error) {
    logger.error('Studio history fetch failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
