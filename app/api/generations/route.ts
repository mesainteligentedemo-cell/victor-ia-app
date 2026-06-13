import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

interface GenerationRequest {
  userId: string;
  type: string;
  prompt: string;
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

// In-memory storage for demo (replace with Supabase in production)
const generations: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const { userId, type, prompt, jobId, status, metadata } = (await req.json()) as GenerationRequest;

    if (!userId || !type || !jobId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const generation = {
      id: crypto.randomUUID(),
      userId,
      type,
      prompt,
      jobId,
      status,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    generations[generation.id] = generation;

    return NextResponse.json({
      success: true,
      generation,
    });
  } catch (error) {
    logger.error('Generation save error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to save generation' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const userGenerations = Object.values(generations).filter(
      (g) => g.userId === userId
    );

    return NextResponse.json({
      success: true,
      generations: userGenerations,
      count: userGenerations.length,
    });
  } catch (error) {
    logger.error('Generations fetch error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch generations' },
      { status: 500 }
    );
  }
}
