import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validateText } from '@/lib/security/validation';
import { logger } from '@/lib/logger';
import { generateText } from '@/lib/studio/llm';
import { saveGeneration } from '@/lib/studio/generations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const GENERIC_ERROR = 'An error occurred processing your request';

const TYPES = ['cold', 'follow-up', 'closing', 'thanks', 'support'] as const;
type EmailType = (typeof TYPES)[number];

const TYPE_LABEL: Record<EmailType, string> = {
  cold: 'Prospección en frío',
  'follow-up': 'Seguimiento de propuesta',
  closing: 'Cierre de venta',
  thanks: 'Agradecimiento',
  support: 'Soporte',
};

interface EmailRequest {
  type?: unknown;
  context?: unknown;
  clientName?: unknown;
  project?: unknown;
  value?: unknown;
  date?: unknown;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrapHtml(subject: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title></head>
<body style="margin:0;background:#060609;font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#e5e1e7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060609;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;background:#131317;border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.09);">
          <span style="font-size:22px;font-weight:800;color:#3B82F6;letter-spacing:-0.5px;">VICTOR IA</span>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.7;color:#e5e1e7;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.09);font-size:12px;color:rgba(229,225,231,0.45);">
          Victor IA · Inteligencia Artificial aplicada a tu negocio<br/>
          <a href="https://victor-ia.com.mx" style="color:#3B82F6;text-decoration:none;">victor-ia.com.mx</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: EmailRequest;
    try {
      body = (await req.json()) as EmailRequest;
    } catch {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const type: EmailType = TYPES.includes(body.type as EmailType) ? (body.type as EmailType) : 'cold';
    const context = validateText(body.context, 0, 1000) ?? '';
    const clientName = validateText(body.clientName, 0, 120) ?? 'cliente';
    const project = validateText(body.project, 0, 200) ?? '';
    const value = validateText(body.value, 0, 60) ?? '';
    const date = validateText(body.date, 0, 60) ?? '';

    const system =
      'Eres un copywriter experto de Victor IA. Escribes correos en español, cálidos, profesionales y breves. Devuelves SOLO el cuerpo del correo en párrafos separados por una línea en blanco. Sin asunto, sin firma (la firma se agrega aparte).';

    const prompt = `Escribe un correo de tipo "${TYPE_LABEL[type]}".
Cliente: ${clientName}
Proyecto: ${project || 'N/D'}
Valor: ${value || 'N/D'}
Fecha relevante: ${date || 'N/D'}
Contexto adicional: ${context || 'N/D'}

Usa las variables disponibles de forma natural. Máx 160 palabras. Tono Victor IA: confiado, claro, orientado a resultados.`;

    logger.info('Email generation requested', { userId, type });

    const bodyText = await generateText({ system, prompt, maxTokens: 800, temperature: 0.7 });

    // Build subject heuristically from type.
    const subjectMap: Record<EmailType, string> = {
      cold: `${clientName}, una idea para ${project || 'tu proyecto'}`,
      'follow-up': `Seguimiento — propuesta ${project || ''}`.trim(),
      closing: `Cerremos ${project || 'el proyecto'}, ${clientName}`,
      thanks: `Gracias, ${clientName}`,
      support: `Estamos contigo — ${project || 'soporte'}`,
    };
    const subject = subjectMap[type];

    const paragraphs = bodyText
      .split(/\n{2,}/)
      .map((p) => `<p style="margin:0 0 16px;">${escapeHtml(p.trim())}</p>`)
      .join('');

    const html = wrapHtml(subject, paragraphs + `<p style="margin:24px 0 0;color:rgba(229,225,231,0.6);">— Equipo Victor IA</p>`);

    const content = { type, subject, bodyText, html, clientName, project, value, date };

    const saved = await saveGeneration({
      userId,
      type: 'email',
      prompt: subject,
      status: 'completed',
      content,
      metadata: { type, model: 'claude' },
    });

    return NextResponse.json({ success: true, id: saved?.id ?? null, ...content });
  } catch (error) {
    logger.error('Email generation failed', error instanceof Error ? error : undefined);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
