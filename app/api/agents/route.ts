import { NextRequest, NextResponse } from 'next/server';
import { AgentsService } from '@/lib/services';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const agents = await AgentsService.listAgents();
    return NextResponse.json(agents);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agentId, userId, params } = await request.json();

    // Validación: agentId y userId
    if (!agentId || !userId) {
      return NextResponse.json({ error: 'Missing agentId or userId', code: 400 }, { status: 400 });
    }

    // Sanitizar inputs
    const sanitizedAgentId = String(agentId).trim();
    const sanitizedUserId = String(userId).trim();

    if (!sanitizedAgentId || !sanitizedUserId) {
      return NextResponse.json({ error: 'agentId and userId cannot be empty', code: 400 }, { status: 400 });
    }

    // Validación: params debe ser un objeto si existe
    if (params && typeof params !== 'object') {
      return NextResponse.json({ error: 'params must be an object', code: 400 }, { status: 400 });
    }

    console.log(`Executing agent: ${sanitizedAgentId} for user: ${sanitizedUserId}`);

    const execution = await AgentsService.executeAgent(sanitizedAgentId, sanitizedUserId, params);
    return NextResponse.json(execution);
  } catch (error) {
    logger.error('Agent execution error:', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request', code: 500 }, { status: 500 });
  }
}
