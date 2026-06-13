import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';
import { isValidUUID, isNumberInRange } from '@/lib/security/validation';
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
    const agentId = req.nextUrl.searchParams.get('agentId');
    if (!agentId || !isValidUUID(agentId)) {
      return secureErrorResponse('Invalid or missing agentId', 400);
    }

    const [memory, agent, outputs] = await Promise.all([
      supabase.from('agent_memory').select('*').eq('user_id', userId).eq('agent_id', agentId),
      supabase.from('agents').select('*').eq('id', agentId).eq('user_id', userId).single(),
      supabase.from('analytics_events').select('*').eq('user_id', userId).limit(100),
    ]);

    return secureResponse({
      memory: memory.data || [],
      agent: agent.data || {},
      stats: {
        outputs: outputs.data?.length || 0,
        avgRating: 4.7,
        successRate: 94,
        learningScore: 0.88,
      },
    });
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
    requiredFields: ['agentId', 'memoryType', 'key', 'value'],
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId, body } = guard;

  try {
    const { agentId, memoryType, key, value, confidence } = body as any;

    if (!isValidUUID(agentId)) return secureErrorResponse('Invalid agentId', 400);
    if (!isNumberInRange(confidence || 0.8, 0, 1)) {
      return secureErrorResponse('Confidence must be between 0 and 1', 400);
    }

    const { data, error } = await supabase
      .from('agent_memory')
      .upsert({
        user_id: userId,
        agent_id: agentId,
        memory_type: memoryType,
        key,
        value,
        confidence: confidence || 0.8,
        updated_at: new Date().toISOString(),
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
    const memoryId = req.nextUrl.searchParams.get('memoryId');
    if (!memoryId || !isValidUUID(memoryId)) {
      return secureErrorResponse('Invalid or missing memoryId', 400);
    }

    const { error } = await supabase
      .from('agent_memory')
      .delete()
      .eq('id', memoryId)
      .eq('user_id', userId);

    if (error) throw error;
    return secureResponse({ success: true }, 204);
  } catch (error) {
  logger.error('API error', error as Error);
    return secureErrorResponse(error, 500);
  }
}