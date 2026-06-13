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
    const category = req.nextUrl.searchParams.get('category');
    const isPublic = req.nextUrl.searchParams.get('public') === 'true';

    let query = supabase.from('prompt_templates').select('*');

    if (isPublic) {
      query = query.eq('is_public', true);
    } else {
      query = query.or(`creator_id.eq.${userId},is_public.eq.true`);
    }

    if (category) query = query.eq('category', category);

    const { data: templates, error } = await query.order('usage_count', { ascending: false });

    if (error) throw error;
    return secureResponse({ templates });
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
    requiredFields: ['name', 'category', 'content'],
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId, body } = guard;

  try {
    const { name, category, description, content, isPublic } = body as any;

    const { data, error } = await supabase
      .from('prompt_templates')
      .insert({
        creator_id: userId,
        name,
        category,
        description,
        content,
        is_public: isPublic || false,
        version: 1,
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
    const templateId = req.nextUrl.searchParams.get('id');
    if (!templateId || !isValidUUID(templateId)) {
      return secureErrorResponse('Invalid or missing template id', 400);
    }

    const { data, error } = await supabase
      .from('prompt_templates')
      .update(body)
      .eq('id', templateId)
      .eq('creator_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return secureErrorResponse('Template not found or unauthorized', 404);

    return secureResponse({ success: true, data });
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error, 500);
  }
}