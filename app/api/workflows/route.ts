import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';
import { isValidSlug } from '@/lib/security/validation';
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
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return secureResponse({ workflows: data });
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
    requiredFields: ['name', 'trigger_type', 'steps'],
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId, body } = guard;

  try {
    const { name, description, trigger_type, trigger_config, steps, enabled } = body as any;

    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: userId,
        name,
        description,
        trigger_type,
        trigger_config,
        steps,
        enabled: enabled ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return secureResponse({ success: true, data }, 201);
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error, 500);
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
    const workflowId = req.nextUrl.searchParams.get('id');
    if (!workflowId) return secureErrorResponse('Missing workflowId parameter', 400);

    const { data, error } = await supabase
      .from('workflows')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', workflowId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return secureErrorResponse('Workflow not found or unauthorized', 404);

    return secureResponse({ success: true, data });
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
    const workflowId = req.nextUrl.searchParams.get('id');
    if (!workflowId) return secureErrorResponse('Missing workflowId parameter', 400);

    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', workflowId)
      .eq('user_id', userId);

    if (error) throw error;
    return secureResponse({ success: true }, 204);
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error, 500);
  }
}