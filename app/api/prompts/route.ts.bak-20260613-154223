import { NextRequest, NextResponse } from 'next/server';
import { PromptEnhancerService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { userId, prompt } = await request.json();
    const enhancement = await PromptEnhancerService.enhance(userId, prompt);
    return NextResponse.json(enhancement);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const history = await PromptEnhancerService.getHistory(userId);
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
