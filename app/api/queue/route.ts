import { NextRequest, NextResponse } from 'next/server';
import { QueueService } from '@/lib/services';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const stats = await QueueService.getQueueStats();
    return NextResponse.json(stats);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, payload, priority } = await request.json();
    const item = await QueueService.enqueue(userId, type, payload, priority);
    return NextResponse.json(item);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}
