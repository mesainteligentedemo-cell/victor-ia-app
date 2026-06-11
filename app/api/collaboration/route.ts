import { NextRequest, NextResponse } from 'next/server';
import { CollaborationService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId');
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });

    const collaborators = await CollaborationService.getProjectCollaborators(projectId);
    return NextResponse.json(collaborators);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, projectId, action, data } = await request.json();

    if (action === 'add-collaborator') {
      const collaborator = await CollaborationService.addCollaborator(userId, projectId, data.email, data.role);
      return NextResponse.json(collaborator);
    } else if (action === 'add-comment') {
      const comment = await CollaborationService.addComment(userId, projectId, data.content);
      return NextResponse.json(comment);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
