import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateText, validateRange } from '@/lib/security/validation';
import { logger } from '@/lib/logger';
import { saveGeneration } from '@/lib/studio/generations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC_ERROR = 'An error occurred processing your request';

const MOODS = ['cinematic', 'energetic', 'ambient', 'indie', 'hip-hop'] as const;
type Mood = (typeof MOODS)[number];

interface MusicRequest {
  description?: unknown;
  mood?: unknown;
  duration?: unknown;
}

function moodPrompt(mood: Mood, description: string): string {
  const flavour: Record<Mood, string> = {
    cinematic: 'epic cinematic orchestral score, sweeping strings, deep percussion',
    energetic: 'high-energy upbeat electronic track, driving drums, bright synths',
    ambient: 'calm ambient soundscape, soft pads, slow evolving textures',
    indie: 'indie pop, warm guitars, organic drums, laid-back groove',
    'hip-hop': 'hip-hop instrumental, boom-bap drums, deep bass, melodic sample',
  };
  return `${description}. Style: ${flavour[mood]}. Instrumental, looping, broadcast quality.`;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: MusicRequest;
    try {
      body = (await req.json()) as MusicRequest;
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const description = validateText(body.description, 3, 1000);
    if (!description) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const mood: Mood = MOODS.includes(body.mood as Mood) ? (body.mood as Mood) : 'cinematic';

    const durationSec = validateRange(
      typeof body.duration === 'number' ? body.duration : 30,
      10,
      180
    );
    if (durationSec === null) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      logger.error('Music generation misconfigured: missing provider credentials');
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    const prompt = moodPrompt(mood, description);

    logger.info('Music generation requested', { userId, mood, durationSec });

    // ElevenLabs Music — text-to-music. Returns audio bytes.
    const response = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: durationSec * 1000,
      }),
    });

    if (!response.ok) {
      logger.error('Music provider returned an error', undefined, { status: response.status });
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    const metadata = {
      mood,
      durationSec,
      model: 'elevenlabs-music',
      bpm: mood === 'energetic' ? 128 : mood === 'hip-hop' ? 90 : mood === 'ambient' ? 70 : 100,
      key: mood === 'ambient' ? 'A minor' : 'C major',
    };

    await saveGeneration({
      userId,
      type: 'music',
      prompt: description,
      status: 'completed',
      metadata,
    });

    logger.info('Music generation succeeded', { userId, bytes: audioBuffer.byteLength });

    return NextResponse.json({
      success: true,
      audio: audioDataUrl,
      mimeType: 'audio/mpeg',
      metadata,
    });
  } catch (error) {
    logger.error('Music generation request failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
