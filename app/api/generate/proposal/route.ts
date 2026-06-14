import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateText } from '@/lib/security/validation';
import { logger } from '@/lib/logger';
import { generateText } from '@/lib/studio/llm';
import { saveGeneration } from '@/lib/studio/generations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC_ERROR = 'An error occurred processing your request';

interface ProposalRequest {
  client?: unknown;
  services?: unknown;
  amount?: unknown;
  currency?: unknown;
  timeline?: unknown;
  paymentTerms?: unknown;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: ProposalRequest;
    try {
      body = (await req.json()) as ProposalRequest;
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const client = validateText(body.client, 2, 200);
    const services = Array.isArray(body.services)
      ? body.services.filter((s): s is string => typeof s === 'string').slice(0, 20)
      : [];
    const amount = typeof body.amount === 'number' && Number.isFinite(body.amount) ? body.amount : 0;
    const currency = body.currency === 'USD' ? 'USD' : 'MXN';
    const timeline = validateText(body.timeline, 0, 200) ?? '';
    const paymentTerms = validateText(body.paymentTerms, 0, 300) ?? '';

    if (!client || services.length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const system =
      'Eres un consultor senior de Victor IA que redacta propuestas comerciales persuasivas y concisas en español. Devuelves texto plano profesional.';

    const prompt = `Redacta el cuerpo de una propuesta comercial para el cliente "${client}".
Servicios: ${services.join(', ')}.
Inversión: ${amount.toLocaleString('es-MX')} ${currency}.
Plazo: ${timeline || 'a definir'}.
Términos de pago: ${paymentTerms || 'a definir'}.

Incluye: (1) un párrafo de introducción/entendimiento del cliente, (2) una breve descripción de valor por cada servicio, (3) un párrafo de cierre. NO incluyas tablas ni precios (se renderizan aparte). Máx 350 palabras.`;

    logger.info('Proposal generation requested', { userId, servicesCount: services.length });

    const narrative = await generateText({ system, prompt, maxTokens: 1200, temperature: 0.6 });

    const content = {
      client,
      services,
      amount,
      currency,
      timeline,
      paymentTerms,
      narrative,
      issuedAt: new Date().toISOString(),
    };

    const saved = await saveGeneration({
      userId,
      type: 'proposal',
      prompt: `Propuesta · ${client}`,
      status: 'completed',
      content,
      metadata: { amount, currency, servicesCount: services.length },
    });

    return NextResponse.json({ success: true, id: saved?.id ?? null, ...content });
  } catch (error) {
    logger.error('Proposal generation failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
