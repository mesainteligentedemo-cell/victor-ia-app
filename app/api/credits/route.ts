import { NextRequest, NextResponse } from 'next/server';
import { CreditsService } from '@/lib/services';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const balance = await CreditsService.getBalance(userId);
    return NextResponse.json({ balance });
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, action, amount } = await request.json();

    if (action === 'deduct') {
      await CreditsService.deductCredits(userId, amount);
      return NextResponse.json({ success: true });
    } else if (action === 'add') {
      await CreditsService.addCredits(userId, amount);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}
