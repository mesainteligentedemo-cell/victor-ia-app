import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateText, validateRange } from '@/lib/security/validation';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface VoiceRequest {
  text?: unknown;
  voiceId?: unknown;
  stability?: unknown;
  similarity?: unknown;
}

const GENERIC_ERROR = 'An error occurred processing your request';

export async function POST(req: Request) {
  try {
    // 1. Authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse body safely
    let body: VoiceRequest;
    try {
      body = (await req.json()) as VoiceRequest;
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 3. Validate text: 1-1000 chars
    const text = validateText(body.text, 1, 1000);
    if (!text) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 4. Validate stability: 0-1 range (default 0.5)
    const stability = validateRange(
      body.stability === undefined || body.stability === null ? 0.5 : body.stability,
      0,
      1
    );
    if (stability === null) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 5. Validate similarity: 0-1 range (default 0.75)
    const similarity = validateRange(
      body.similarity === undefined || body.similarity === null ? 0.75 : body.similarity,
      0,
      1
    );
    if (similarity === null) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // 6. Resolve credentials (never logged, never returned)
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      logger.error('Voice generation misconfigured: missing provider credentials');
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    const voiceId =
      typeof body.voiceId === 'string' && body.voiceId.trim().length > 0
        ? body.voiceId.trim()
        : process.env.ELEVENLABS_VOICE_ID || 'iDEmt5MnqUotdwCIVplo';

    // 7. Call ElevenLabs API
    logger.info('Voice generation requested', {
      userId,
      textLength: text.length,
      voiceId,
      stability,
      similarity,
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
          voice_settings: {
            stability,
            similarity_boost: similarity,
          },
        }),
      }
    );

    if (!response.ok) {
      // Do not expose provider response body/status to client.
      logger.error('Voice provider returned an error', undefined, {
        status: response.status,
      });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    // 8. Return base64 audio
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    logger.info('Voice generation succeeded', {
      userId,
      bytes: audioBuffer.byteLength,
    });

    return NextResponse.json({
      success: true,
      audio: `data:audio/mpeg;base64,${base64Audio}`,
      mimeType: 'audio/mpeg',
      duration: Math.ceil(text.length / 15),
    });
  } catch (error) {
    logger.error(
      'Voice generation request failed',
      error instanceof Error ? error : undefined
    );
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
