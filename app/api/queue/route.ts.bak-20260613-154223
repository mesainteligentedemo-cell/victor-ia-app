import { NextRequest, NextResponse } from 'next/server';
import { QueueService } from '@/lib/services';

export async function GET() {
  try {
    const stats = await QueueService.getQueueStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, payload, priority } = await request.json();
    const item = await QueueService.enqueue(userId, type, payload, priority);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
