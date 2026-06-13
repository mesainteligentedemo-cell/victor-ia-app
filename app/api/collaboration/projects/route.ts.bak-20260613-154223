import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { guardEndpoint, secureResponse, secureErrorResponse } from '@/lib/security/endpoint-guard';

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
    const { data: projects, error } = await supabase
      .from('collaboration_projects')
      .select('*')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return secureResponse({ projects });
  } catch (error) {
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
    const { name, description, teamMembers, permissions } = body as any;

    const { data, error } = await supabase
      .from('collaboration_projects')
      .insert({
        owner_id: userId,
        name,
        description,
        team_members: teamMembers || [],
        permissions: permissions || {},
      })
      .select()
      .single();

    if (error) throw error;
    return secureResponse({ success: true, data }, 201);
  } catch (error) {
    return secureErrorResponse(error, 500);
  }
}