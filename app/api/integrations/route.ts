import { NextRequest, NextResponse } from 'next/server';
import { IntegrationsService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const integrations = await IntegrationsService.listIntegrations(userId);
    return NextResponse.json(integrations);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    if (action === 'connect') {
      return NextResponse.json({ success: true });
    } else if (action === 'sync') {
      return NextResponse.json({ synced: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
