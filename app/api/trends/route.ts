import { NextRequest, NextResponse } from 'next/server';
import { TrendingService } from '@/lib/services';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') as any;
    if (!category) return NextResponse.json({ error: 'Missing category' }, { status: 400 });

    const trending = await TrendingService.getTrendingItems(category, 10);
    return NextResponse.json(trending);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category, itemId, type } = await request.json();
    await TrendingService.recordInteraction(category, itemId, type);
    return NextResponse.json({ success: true });
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}
