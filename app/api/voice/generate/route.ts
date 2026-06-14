import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateText, validateRange } from '@/lib/security/validation';
import { logger } from '@/lib/logger';
import { isValidVoiceId, DEFAULT_VOICE_ID, VOICE_ID_MAP } from '@/lib/studio/voices';
import { saveGeneration } from '@/lib/studio/generations';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface VoiceRequest {
  text?: unknown;
  voiceId?: unknown;
  stability?: unknown;
  similarity?: unknown;
  style?: unknown;
}

const GENERIC_ERROR = 'An error occurred processing your request';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: VoiceRequest;
    try {
      body = (await req.json()) as VoiceRequest;
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Text: 1-5000 chars (studio allows long scripts)
    const text = validateText(body.text, 1, 5000);
    if (!text) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const stability = validateRange(
      body.stability === undefined || body.stability === null ? 0.5 : body.stability,
      0,
      1
    );
    const similarity = validateRange(
      body.similarity === undefined || body.similarity === null ? 0.75 : body.similarity,
      0,
      1
    );
    const style = validateRange(
      body.style === undefined || body.style === null ? 0 : body.style,
      0,
      1
    );
    if (stability === null || similarity === null || style === null) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const voiceId = isValidVoiceId(body.voiceId) ? body.voiceId : DEFAULT_VOICE_ID;

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      logger.error('Voice generation misconfigured: missing provider credentials');
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    logger.info('Voice generation requested', {
      userId,
      textLength: text.length,
      voiceId,
      stability,
      similarity,
      style,
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
            style,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      logger.error('Voice provider returned an error', undefined, { status: response.status });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;
    const estDuration = Math.ceil(text.length / 15);
    const voiceName = VOICE_ID_MAP[voiceId]?.name ?? 'Voz';

    // Persist (best-effort; never blocks the response).
    await saveGeneration({
      userId,
      type: 'voice',
      prompt: text.slice(0, 500),
      status: 'completed',
      metadata: {
        voiceId,
        voiceName,
        stability,
        similarity,
        style,
        durationSec: estDuration,
        model: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
      },
    });

    logger.info('Voice generation succeeded', { userId, bytes: audioBuffer.byteLength });

    return NextResponse.json({
      success: true,
      audio: audioDataUrl,
      mimeType: 'audio/mpeg',
      duration: estDuration,
      voiceName,
    });
  } catch (error) {
    logger.error('Voice generation request failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
