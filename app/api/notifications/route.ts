import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';
import { isValidUUID } from '@/lib/security/validation';
import { logger } from '@/lib/logger';

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
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50'), 100);
    const unreadOnly = req.nextUrl.searchParams.get('unread') === 'true';

    let query = supabase.from('notifications').select('*').eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return secureResponse({ notifications: data });
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error as Error, 500);
  }
}

export async function POST(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'POST',
    requireAuth: true,
    rateLimit: 'api',
    requiredFields: ['type', 'title', 'message'],
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId, body } = guard;

  try {
    const { type, title, message, actionUrl, actionLabel, expiresAt, icon } = body as any;

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action_url: actionUrl,
        action_label: actionLabel,
        read: false,
        expires_at: expiresAt,
        icon,
      })
      .select()
      .single();

    if (error) throw error;
    return secureResponse({ success: true, data }, 201);
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error as Error, 500);
  }
}

export async function PUT(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'PUT',
    requireAuth: true,
    rateLimit: 'api',
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId, body } = guard;

  try {
    const notificationId = req.nextUrl.searchParams.get('id');
    if (!notificationId || !isValidUUID(notificationId)) {
      return secureErrorResponse('Invalid or missing notification id', 400);
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return secureErrorResponse('Notification not found or unauthorized', 404);

    return secureResponse({ success: true, data });
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error as Error, 500);
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
    const notificationId = req.nextUrl.searchParams.get('id');
    if (!notificationId || !isValidUUID(notificationId)) {
      return secureErrorResponse('Invalid or missing notification id', 400);
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
    return secureResponse({ success: true }, 204);
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error as Error, 500);
  }
}
