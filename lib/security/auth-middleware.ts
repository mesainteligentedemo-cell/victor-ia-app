import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Middleware to ensure user is authenticated
 * Apply to all protected endpoints
 */
export async function requireAuth(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing authentication' },
      { status: 401 }
    );
  }

  return { userId };
}

/**
 * Middleware to ensure specific role/permission
 */
export async function requireRole(req: NextRequest, requiredRole: string) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing authentication' },
      { status: 401 }
    );
  }

  // TODO: Implement role checking from database
  // For now, all authenticated users are admins
  // In production, fetch user role from DB and verify

  return { userId };
}

/**
 * Verify API Key (alternative to Clerk auth)
 */
export async function verifyApiKey(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing API key' },
      { status: 401 }
    );
  }

  const apiKey = authHeader.slice(7); // Remove "Bearer " prefix

  if (!apiKey || apiKey.length < 20) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid API key format' },
      { status: 401 }
    );
  }

  // TODO: Verify API key against database
  // Check: key_hash matches, not expired, rate limit not exceeded

  return { apiKey };
}

/**
 * Extract and validate Bearer token
 */
export function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice(7);
}