import { NextRequest, NextResponse } from 'next/server';
import { HRService } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const orgChart = await HRService.getOrgChart(userId);
    return NextResponse.json(orgChart);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    if (action === 'create-member') {
      return NextResponse.json({ success: true });
    } else if (action === 'generate-payroll') {
      return NextResponse.json({ payroll: {} });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
