import { NextResponse } from 'next/server';
import { saveAnalyticsEvent } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const { eventType, eventData, userId } = (await req.json()) as AnalyticsEvent;

    if (!eventType || !userId) {
      return NextResponse.json(
        { error: 'Missing eventType or userId' },
        { status: 400 }
      );
    }

    const event = await saveAnalyticsEvent({
      userId,
      eventType,
      eventData: eventData || {},
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
    });
  } catch (error) {
    logger.error('Analytics error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to save event' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const days = parseInt(url.searchParams.get('days') || '7');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Placeholder for analytics retrieval
    // In production, fetch from Supabase
    return NextResponse.json({
      success: true,
      data: {
        events: [],
        summary: {
          totalEvents: 0,
          eventTypes: {},
          timeline: [],
        },
      },
    });
  } catch (error) {
    logger.error('Analytics fetch error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}