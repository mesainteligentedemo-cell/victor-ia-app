import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

interface ProjectRequest {
  userId: string;
  name: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'review' | 'completed';
  progress?: number;
  deadline?: string;
  teamCount?: number;
  priority?: 'low' | 'medium' | 'high';
}

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ProjectRequest;
    const { userId, name, description, status, progress, deadline, teamCount, priority } = body;

    // Validación: userId y name requeridos
    if (!userId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and name are mandatory', code: 400 },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const sanitizedUserId = String(userId).trim();
    const sanitizedName = String(name).trim();
    const sanitizedDescription = description ? String(description).trim() : undefined;

    if (!sanitizedUserId || !sanitizedName) {
      return NextResponse.json(
        { error: 'userId and name cannot be empty', code: 400 },
        { status: 400 }
      );
    }

    // Validar status
    const validStatuses = ['planning', 'in-progress', 'review', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`, code: 400 },
        { status: 400 }
      );
    }

    // Validar priority
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`, code: 400 },
        { status: 400 }
      );
    }

    // Validar progress (0-100)
    if (progress !== undefined && (progress < 0 || progress > 100)) {
      return NextResponse.json(
        { error: 'progress must be between 0 and 100', code: 400 },
        { status: 400 }
      );
    }

    console.log(`Creating project for user: ${sanitizedUserId}`);

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: sanitizedUserId,
          name: sanitizedName,
          description: sanitizedDescription,
          status: status || 'planning',
          progress: progress || 0,
          deadline,
          team_count: teamCount || 1,
          priority: priority || 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      logger.error('Supabase insert error:', error as Error);
      return NextResponse.json(
        { error: 'An error occurred processing your request', code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project: data?.[0],
    });
  } catch (error) {
    logger.error('Project creation error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to create project', code: 500 },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');

    // Validación: userId requerido
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter', code: 400 },
        { status: 400 }
      );
    }

    const sanitizedUserId = String(userId).trim();
    if (!sanitizedUserId) {
      return NextResponse.json(
        { error: 'userId cannot be empty', code: 400 },
        { status: 400 }
      );
    }

    // Validar status si se proporciona
    if (status) {
      const validStatuses = ['planning', 'in-progress', 'review', 'completed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`, code: 400 },
          { status: 400 }
        );
      }
    }

    console.log(`Fetching projects for user: ${sanitizedUserId}${status ? ` with status: ${status}` : ''}`);

    // Consultar Supabase
    let query = supabase
      .from('projects')
      .select('*')
      .eq('user_id', sanitizedUserId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Supabase fetch error:', error as Error);
      return NextResponse.json(
        { error: 'An error occurred processing your request', code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      projects: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    logger.error('Projects fetch error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', code: 500 },
      { status: 500 }
    );
  }
}