import { NextRequest, NextResponse } from 'next/server';
import { CRMService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const metrics = await CRMService.getPipeline(userId);
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json();

    if (action === 'create') {
      const prospect = await CRMService.createProspect(userId, data);
      return NextResponse.json(prospect);
    } else if (action === 'update') {
      const prospect = await CRMService.updateProspect(data.id, data);
      return NextResponse.json(prospect);
    } else if (action === 'move') {
      await CRMService.moveProspectInPipeline(data.prospectId, data.stage);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
