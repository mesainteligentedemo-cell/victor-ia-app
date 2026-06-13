import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface GenerationRequest {
  type: 'image' | 'video' | 'website' | 'document' | 'email';
  prompt: string;
  options?: Record<string, any>;
}

// Higgsfield API integration
async function generateWithHiggsfield(
  type: string,
  prompt: string,
  options: Record<string, any> = {}
) {
  const higgsUrl = 'https://api.higgsfield.ai/v1/generate';

  const payload = {
    model: options.model || 'turbo',
    prompt,
    type,
    ...(type === 'image' && {
      aspect_ratio: options.aspect || '1:1',
      resolution: options.resolution || '1024x1024',
      num_images: 1,
    }),
    ...(type === 'video' && {
      duration: options.duration || 10,
      aspect_ratio: options.aspect || '16:9',
      fps: options.fps || 24,
    }),
  };

  try {
    const response = await fetch(higgsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Higgsfield API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      jobId: data.job_id,
      status: 'processing',
      estimatedTime: data.estimated_seconds || 30,
    };
  } catch (error) {
    logger.error('Higgsfield error:', error as Error);
    return {
      success: false,
      error: 'Failed to start generation',
    };
  }
}

// Claude API for text generation
async function generateWithClaude(prompt: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error('Claude API error');

    const data = await response.json();
    return {
      success: true,
      content: data.content[0].text,
    };
  } catch (error) {
    logger.error('Claude error:', error as Error);
    return {
      success: false,
      error: 'Generation failed',
    };
  }
}

export async function POST(req: Request) {
  try {
    const { type, prompt, options } = (await req.json()) as GenerationRequest;

    if (!type || !prompt) {
      return NextResponse.json(
        { error: 'Missing type or prompt' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'image':
      case 'video':
        result = await generateWithHiggsfield(type, prompt, options);
        break;

      case 'website':
      case 'document':
      case 'email':
        result = await generateWithClaude(prompt);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Generation error:', error as Error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}