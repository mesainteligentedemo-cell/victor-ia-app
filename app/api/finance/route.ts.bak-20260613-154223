import { NextRequest, NextResponse } from 'next/server';
import { FinanceService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const period = request.nextUrl.searchParams.get('period') || 'monthly';
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const pandl = await FinanceService.generatePandL(userId, period);
    return NextResponse.json(pandl);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    if (action === 'create-budget') {
      return NextResponse.json({ success: true });
    } else if (action === 'log-expense') {
      return NextResponse.json({ success: true });
    } else if (action === 'generate-invoice') {
      return NextResponse.json({ invoice: {} });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
