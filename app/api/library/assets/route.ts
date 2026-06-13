import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

interface AssetRequest {
  userId: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'web';
  url: string;
  size?: number;
  isFavorite?: boolean;
  metadata?: Record<string, any>;
}

// In-memory storage (replace with Supabase)
const assets: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AssetRequest;
    const { userId, name, type, url, size, isFavorite, metadata } = body;

    if (!userId || !name || !type || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const asset = {
      id: crypto.randomUUID(),
      userId,
      name,
      type,
      url,
      size: size || 0,
      isFavorite: isFavorite || false,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assets[asset.id] = asset;

    return NextResponse.json({
      success: true,
      asset,
    });
  } catch (error) {
    logger.error('Asset creation error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type');
    const isFavorite = url.searchParams.get('favorite') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    let userAssets = Object.values(assets).filter(
      (a) => a.userId === userId
    );

    if (type) {
      userAssets = userAssets.filter((a) => a.type === type);
    }

    if (isFavorite) {
      userAssets = userAssets.filter((a) => a.isFavorite === true);
    }

    return NextResponse.json({
      success: true,
      assets: userAssets,
      count: userAssets.length,
    });
  } catch (error) {
    logger.error('Assets fetch error:', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}