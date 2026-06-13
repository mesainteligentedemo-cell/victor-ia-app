import { NextRequest, NextResponse } from 'next/server';
import { AutomationService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const workflows = await AutomationService.listWorkflows(userId);
    return NextResponse.json(workflows);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, workflowId, data } = await request.json();

    if (action === 'create-webhook') {
      const webhook = await AutomationService.createWebhook(data.workflowId, data.path, data.method);
      return NextResponse.json(webhook);
    } else if (action === 'execute') {
      const result = await AutomationService.executeWorkflow(workflowId, data);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
