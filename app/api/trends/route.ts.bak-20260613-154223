import { NextRequest, NextResponse } from 'next/server';
import { TrendingService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') as any;
    if (!category) return NextResponse.json({ error: 'Missing category' }, { status: 400 });

    const trending = await TrendingService.getTrendingItems(category, 10);
    return NextResponse.json(trending);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category, itemId, type } = await request.json();
    await TrendingService.recordInteraction(category, itemId, type);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
