import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';
import { isValidUUID } from '@/lib/security/validation';

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
    const specialty = req.nextUrl.searchParams.get('specialty');

    let query = supabase.from('skill_trees').select('*').eq('user_id', userId);
    if (specialty) query = query.eq('specialty', specialty);

    const [skillsResult, achievementsResult] = await Promise.all([
      query,
      supabase.from('achievements').select('*').eq('user_id', userId),
    ]);

    return secureResponse({
      skills: skillsResult.data || [],
      achievements: achievementsResult.data || [],
    });
  } catch (error) {
    return secureErrorResponse(error, 500);
  }
}

export async function POST(req: NextRequest) {
  const guard = await guardEndpoint(req, {
    method: 'POST',
    requireAuth: true,
    rateLimit: 'api',
    requiredFields: ['specialty'],
    audit: true,
  });

  if (!guard.ok) return guard.response;
  const { userId, body } = guard;

  try {
    const { specialty, currentLevel, xpTotal } = body as any;

    const { data, error } = await supabase
      .from('skill_trees')
      .insert({
        user_id: userId,
        specialty,
        current_level: currentLevel || 'novice',
        xp_total: xpTotal || 0,
        xp_to_next_level: 20,
      })
      .select()
      .single();

    if (error) throw error;
    return secureResponse({ success: true, data }, 201);
  } catch (error) {
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
    const skillId = req.nextUrl.searchParams.get('id');
    if (!skillId || !isValidUUID(skillId)) {
      return secureErrorResponse('Invalid or missing skill id', 400);
    }

    const { data, error } = await supabase
      .from('skill_trees')
      .update(body)
      .eq('id', skillId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return secureErrorResponse('Skill not found or unauthorized', 404);

    return secureResponse({ success: true, data });
  } catch (error) {
    return secureErrorResponse(error, 500);
  }
}