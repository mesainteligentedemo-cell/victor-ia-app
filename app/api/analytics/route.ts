import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAdvancedService } from '@/lib/services';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const snapshot = await AnalyticsAdvancedService.getMetricsSnapshot(userId);
    return NextResponse.json(snapshot);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, eventName, eventData } = await request.json();

    const log = await AnalyticsAdvancedService.trackEvent(userId, eventName, eventData);
    return NextResponse.json(log);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}
