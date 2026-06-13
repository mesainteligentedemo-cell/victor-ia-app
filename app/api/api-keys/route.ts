import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';
import { isValidUUID, isNumberInRange } from '@/lib/security/validation';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

function generateApiKey(): string {
  return `vctria_${crypto.randomBytes(20).toString('hex')}`;
}

export async function GET(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'GET',
    requireAuth: true,
    rateLimit: 'api',
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId } = guard;

  try {
    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, created_at, last_used_at, rate_limit_per_hour, expires_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return secureResponse({ keys });
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error, 500);
  }
}

export async function POST(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'POST',
    requireAuth: true,
    rateLimit: 'api',
    requiredFields: ['name'],
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId, body } = guard;

  try {
    const { name, rateLimitPerHour, expiresAt } = body as any;

    if (rateLimitPerHour && !isNumberInRange(rateLimitPerHour, 1, 1000000)) {
      return secureErrorResponse('Invalid rate limit', 400);
    }

    const apiKey = generateApiKey();
    const keyHash = hashKey(apiKey);

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        key_hash: keyHash,
        name,
        rate_limit_per_hour: rateLimitPerHour || 1000,
        expires_at: expiresAt || null,
      })
      .select()
      .single();

    if (error) throw error;
    return secureResponse({ success: true, data: { ...data, key: apiKey } }, 201);
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error, 500);
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'DELETE',
    requireAuth: true,
    rateLimit: 'api',
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId } = guard;

  try {
    const keyId = req.nextUrl.searchParams.get('id');
    if (!keyId || !isValidUUID(keyId)) {
      return secureErrorResponse('Invalid or missing key id', 400);
    }

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId)
      .eq('user_id', userId);

    if (error) throw error;
    return secureResponse({ success: true }, 204);
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error, 500);
  }
}