import { NextRequest, NextResponse } from 'next/server';
import { ExportService } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { userId, type, dataType } = await request.json();
    const job = await ExportService.createExport(userId, type, dataType);
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get('jobId');
    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

    const status = await ExportService.getExportStatus(jobId);
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
