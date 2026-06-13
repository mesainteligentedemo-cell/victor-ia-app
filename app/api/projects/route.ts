import { NextResponse } from 'next/server';

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

// In-memory storage (replace with Supabase)
const projects: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ProjectRequest;
    const { userId, name, description, status, progress, deadline, teamCount, priority } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const project = {
      id: crypto.randomUUID(),
      userId,
      name,
      description,
      status: status || 'planning',
      progress: progress || 0,
      deadline,
      teamCount: teamCount || 1,
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects[project.id] = project;

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    let userProjects = Object.values(projects).filter(
      (p) => p.userId === userId
    );

    if (status) {
      userProjects = userProjects.filter((p) => p.status === status);
    }

    return NextResponse.json({
      success: true,
      projects: userProjects,
      count: userProjects.length,
    });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}