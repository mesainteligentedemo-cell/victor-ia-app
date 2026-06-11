import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAdvancedService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const snapshot = await AnalyticsAdvancedService.getMetricsSnapshot(userId);
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, eventName, eventData } = await request.json();

    const log = await AnalyticsAdvancedService.trackEvent(userId, eventName, eventData);
    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
