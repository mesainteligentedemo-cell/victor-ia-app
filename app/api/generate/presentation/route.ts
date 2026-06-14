import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateText, validateRange } from '@/lib/security/validation';
import { logger } from '@/lib/logger';
import { generateText, extractJson } from '@/lib/studio/llm';
import { saveGeneration } from '@/lib/studio/generations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC_ERROR = 'An error occurred processing your request';

const STYLES = ['dark-luxury', 'minimal-white', 'corporate', 'creative'] as const;
type Style = (typeof STYLES)[number];

interface PresentationRequest {
  topic?: unknown;
  objective?: unknown;
  audience?: unknown;
  slides?: unknown;
  style?: unknown;
}

interface Slide {
  title: string;
  bullets: string[];
  speakerNotes: string;
  backgroundImagePrompt: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: PresentationRequest;
    try {
      body = (await req.json()) as PresentationRequest;
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const topic = validateText(body.topic, 3, 300);
    const objective = validateText(body.objective, 0, 500) ?? '';
    const audience = validateText(body.audience, 0, 300) ?? '';
    const slideCount = validateRange(typeof body.slides === 'number' ? body.slides : 8, 6, 20);
    const style: Style = STYLES.includes(body.style as Style) ? (body.style as Style) : 'dark-luxury';

    if (!topic || slideCount === null) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const system =
      'Eres un experto en diseño de presentaciones ejecutivas. Devuelves SIEMPRE JSON válido, sin texto extra. El JSON es un arreglo de slides.';

    const prompt = `Crea una presentación de exactamente ${slideCount} slides.
Tema: ${topic}
Objetivo: ${objective || 'No especificado'}
Audiencia: ${audience || 'General'}
Estilo visual: ${style}

Devuelve SOLO un arreglo JSON. Cada elemento:
{
  "title": "string corto y potente",
  "bullets": ["3-5 bullets concisos"],
  "speakerNotes": "notas del presentador, 2-3 frases",
  "backgroundImagePrompt": "prompt en inglés para generar la imagen de fondo acorde al estilo ${style}"
}
La primera slide es portada, la última es cierre/CTA.`;

    logger.info('Presentation generation requested', { userId, slideCount, style });

    const raw = await generateText({ system, prompt, maxTokens: 3500, temperature: 0.7 });

    let slides: Slide[];
    try {
      const parsed = extractJson<Slide[]>(raw);
      slides = Array.isArray(parsed) ? parsed : [];
    } catch {
      logger.error('Presentation JSON parse failed');
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    if (slides.length === 0) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    const content = { topic, objective, audience, style, slides };

    const saved = await saveGeneration({
      userId,
      type: 'presentation',
      prompt: topic,
      status: 'completed',
      content,
      metadata: { slideCount: slides.length, style, model: 'claude' },
    });

    return NextResponse.json({ success: true, id: saved?.id ?? null, ...content });
  } catch (error) {
    logger.error('Presentation generation failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
