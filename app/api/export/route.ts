import { NextRequest, NextResponse } from 'next/server';
import { ExportService } from '@/lib/services';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId, type, dataType } = await request.json();
    const job = await ExportService.createExport(userId, type, dataType);
    return NextResponse.json(job);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get('jobId');
    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

    const status = await ExportService.getExportStatus(jobId);
    return NextResponse.json(status);
  } catch (error) {
  logger.error('API error', error as Error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}
