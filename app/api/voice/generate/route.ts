import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface VoiceRequest {
  text: string;
  voiceId?: string;
  stability?: number;
  similarity?: number;
}

export async function POST(req: Request) {
  try {
    const { text, voiceId, stability, similarity } = (await req.json()) as VoiceRequest;

    if (!text) {
      return NextResponse.json(
        { error: 'Missing text' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceIdToUse = voiceId || process.env.ELEVENLABS_VOICE_ID || 'iDEmt5MnqUotdwCIVplo';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs not configured' },
        { status: 500 }
      );
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceIdToUse}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            voice_settings: {
              stability: stability || 0.5,
              similarity_boost: similarity || 0.75,
            },
            model_id: 'eleven_monolingual_v1',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return NextResponse.json({
        success: true,
        audio: `data:audio/mpeg;base64,${base64Audio}`,
        duration: Math.ceil(text.length / 15), // Rough estimate
      });
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate voice' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
}