import { NextRequest, NextResponse } from 'next/server';
import { AgentsService } from '@/lib/services';

export async function GET() {
  try {
    const agents = await AgentsService.listAgents();
    return NextResponse.json(agents);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agentId, userId, params } = await request.json();

    if (!agentId || !userId) {
      return NextResponse.json({ error: 'Missing agentId or userId' }, { status: 400 });
    }

    const execution = await AgentsService.executeAgent(agentId, userId, params);
    return NextResponse.json(execution);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
