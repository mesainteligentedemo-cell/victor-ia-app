import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Supabase (service-role when available, falls back to null)
// ---------------------------------------------------------------------------
const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
      )
    : null;

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function withCors(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

// ---------------------------------------------------------------------------
// Email sending helper
// ---------------------------------------------------------------------------
async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.info('[Email] Email service not configured (RESEND_API_KEY missing)');
    console.info('[Email] Would send to:', to);
    console.info('[Email] Subject:', subject);
    return { success: true, messageId: 'logged-to-console' };
  }

  try {
    const formData = new FormData();
    formData.append('from', 'info@victor-ia.com.mx');
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('html', htmlContent);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[Resend] API error:', response.status, errorData);
      return {
        success: false,
        error: `Resend error ${response.status}`,
      };
    }

    const data = await response.json();
    console.info('[Email] Sent successfully:', { to, messageId: data.id });

    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('[Email] Send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CreateResult {
  status: string;
  result_url?: string | null;
  html_content?: string;
  job_id?: string | null;
  message?: string;
  metadata?: Record<string, unknown>;
  result?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Supabase save helper (never throws)
// ---------------------------------------------------------------------------
async function saveCreation(
  action: string,
  config: Record<string, unknown>,
  userId: string,
  result: CreateResult,
): Promise<void> {
  if (!supabaseAdmin) return;
  try {
    await supabaseAdmin.from('creations').insert({
      id: crypto.randomUUID(),
      user_id: userId,
      action_type: action,                          // matches SQL schema column name
      config,
      status: result.status === 'success' ? 'completed' : result.status === 'processing' ? 'processing' : 'processing',
      result_url: result.result_url ?? null,
      content: result.html_content                 // SQL column is 'content', not 'html_content'
        ? { html: result.html_content.slice(0, 50_000), job_id: result.job_id ?? null }
        : result.job_id ? { job_id: result.job_id } : null,
      metadata: result.metadata ?? {},
    });
  } catch {
    // Supabase not connected — ignore silently
  }
}

// ---------------------------------------------------------------------------
// OpenRouter call helper
// ---------------------------------------------------------------------------
async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY not configured');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://victor-ia-app.vercel.app',
      'X-Title': 'Victor IA Studio',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 8192,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

// 1. IMAGE — Higgsfield REST
async function handleImage(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    return {
      status: 'pending',
      message: 'Configure HIGGSFIELD_API_KEY',
      result_url: null,
      metadata: { config },
    };
  }

  const res = await fetch('https://api.higgsfield.ai/v1/generate/image', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: config.prompt,
      model: 'flux-pro',
      aspect_ratio: config.aspectRatio ?? '16:9',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Higgsfield image error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    status: 'success',
    result_url: data.url ?? data.result_url ?? null,
    job_id: data.id ?? data.job_id ?? null,
    metadata: { prompt: config.prompt, style: config.style, model: 'flux-pro' },
  };
}

// 2. VIDEO — Higgsfield REST
async function handleVideo(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    return {
      status: 'pending',
      message: 'Configure HIGGSFIELD_API_KEY',
      result_url: null,
      job_id: null,
      metadata: { config },
    };
  }

  const res = await fetch('https://api.higgsfield.ai/v1/generate/video', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: config.prompt,
      model: 'seedance-1-pro',
      duration: config.duration ?? 5,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Higgsfield video error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    status: 'processing',
    job_id: data.id ?? data.job_id ?? null,
    result_url: null,
    message: 'Video en proceso — polling en 30s',
    metadata: {
      prompt: config.prompt,
      duration: config.duration ?? 5,
      model: 'seedance-1-pro',
    },
  };
}

// 3. VOICE — ElevenLabs TTS
async function handleVoice(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured');

  const voiceId = (config.voice_id as string) ?? 'iDEmt5MnqUotdwCIVplo';
  const stability = (config.stability as number) ?? 0.5;
  const speed = (config.speed as number) ?? 1.0;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: config.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability,
          similarity_boost: 0.75,
          speed,
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${err}`);
  }

  const audioBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(audioBuffer).toString('base64');
  const dataUrl = `data:audio/mpeg;base64,${base64}`;

  // Rough duration estimate: ~150 words/min, ~5 chars/word
  const text = (config.text as string) ?? '';
  const wordCount = text.split(/\s+/).length;
  const durationEstimate = Math.ceil((wordCount / 150) * 60);

  return {
    status: 'success',
    result_url: dataUrl,
    job_id: null,
    metadata: {
      voice_id: voiceId,
      duration_estimate: durationEstimate,
      char_count: text.length,
    },
  };
}

// 4. PRESENTATION — OpenRouter → HTML
async function handlePresentation(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  const slides = config.slides ?? 10;
  const style = config.style ?? 'professional luxury dark';
  const audience = config.audience ?? 'professional';
  const topic = config.topic as string;

  const systemPrompt =
    'Generate a complete, visually stunning HTML presentation with CSS animations. Include navigation between slides (arrow keys + buttons). Use a dark luxury aesthetic with smooth transitions. Return ONLY the HTML — no markdown, no explanations.';

  const userPrompt = `Create a ${slides}-slide presentation about: ${topic}. Style: ${style}. Audience: ${audience}. Make it visually impressive with animated slide transitions, proper typography, and a coherent color palette.`;

  const html = await callOpenRouter(systemPrompt, userPrompt);

  return {
    status: 'success',
    result_url: null,
    html_content: html,
    metadata: { topic, slides, style, audience, model: 'claude-sonnet-4-5' },
  };
}

// 5. WEB — OpenRouter → landing page HTML
async function handleWeb(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  const style = config.style ?? 'luxury dark modern';
  const sections = config.sections ?? 'hero, features, pricing, CTA';

  const systemPrompt =
    'Generate a complete, production-ready landing page in a single HTML file. Include embedded CSS with animations and JavaScript for interactivity. Use a dark luxury aesthetic. Return ONLY the HTML — no markdown, no explanations.';

  const userPrompt = `Create a landing page for: ${config.description}. Style: ${style}. Sections: ${sections}. Include smooth scroll animations, a sticky nav, and a clear conversion funnel.`;

  const html = await callOpenRouter(systemPrompt, userPrompt);

  return {
    status: 'success',
    result_url: null,
    html_content: html,
    metadata: {
      description: config.description,
      style,
      sections,
      model: 'claude-sonnet-4-5',
    },
  };
}

// 6. TRAINING — OpenRouter → structured HTML training material + Email
async function handleTraining(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  const format = config.format ?? 'interactive module';
  const level = config.level ?? 'intermediate';
  const userEmail = config.userEmail as string;

  const systemPrompt =
    'Generate a complete HTML training module with clear sections, learning objectives, content, exercises, and a summary quiz. Use a clean professional dark design. Return ONLY the HTML — no markdown, no explanations.';

  const userPrompt = `Create a ${format} training on: ${config.topic}. Level: ${level}. Include: learning objectives, main content with examples, interactive exercises, and a final quiz.`;

  const html = await callOpenRouter(systemPrompt, userPrompt);

  // Generate email template for user
  const emailHtml = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tu Material de Capacitación</title>
</head>
<body style="margin:0;background:#060609;font-family:'Plus Jakarta Sans',Arial,sans-serif;color:#e5e1e7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060609;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#131317;border:1px solid rgba(255,255,255,0.09);border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.09);background:linear-gradient(135deg,#111316,#1a1a1f);">
          <span style="font-size:22px;font-weight:800;color:#E5B842;letter-spacing:-0.5px;">VICTOR IA</span>
          <span style="font-size:14px;color:rgba(229,225,231,0.6);margin-left:12px;">CAPACITACIÓN</span>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.7;color:#e5e1e7;">
          <h2 style="margin:0 0 20px;color:#E5B842;">Tu Material de Capacitación está Listo</h2>

          <p style="margin:0 0 16px;">Hemos preparado un módulo de capacitación personalizado para ti.</p>

          <div style="margin:24px 0;padding:16px;background:rgba(229,184,66,0.1);border-left:4px solid #E5B842;border-radius:4px;">
            <p style="margin:0 0 12px;font-size:14px;color:rgba(229,225,231,0.8);">
              <strong>Detalles del módulo:</strong>
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Tema:</strong> ${config.topic}
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Formato:</strong> ${format}
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>Nivel:</strong> ${level}
            </p>
          </div>

          <p style="margin:24px 0;">El material de capacitación ha sido generado y está disponible para tu acceso inmediato. El módulo incluye:</p>
          <ul style="margin:12px 0;padding-left:24px;color:#e5e1e7;">
            <li style="margin:8px 0;">Objetivos de aprendizaje claros</li>
            <li style="margin:8px 0;">Contenido estructurado con ejemplos</li>
            <li style="margin:8px 0;">Ejercicios interactivos</li>
            <li style="margin:8px 0;">Quiz final de evaluación</li>
          </ul>

          <p style="margin:24px 0;">
            <strong>Accede a tu material aquí:</strong><br/>
            <a href="https://victor-ia-app.vercel.app/training" style="display:inline-block;padding:12px 24px;background:#E5B842;color:#060609;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin-top:12px;">
              Ver Capacitación
            </a>
          </p>

          <hr style="margin:24px 0;border:none;border-top:1px solid rgba(255,255,255,0.09);">

          <p style="margin:16px 0 0;font-size:14px;color:rgba(229,225,231,0.6);">
            ¿Preguntas o necesitas otro formato? Responde a este correo.
          </p>

          <p style="margin:24px 0 0;color:rgba(229,225,231,0.6);">
            — Equipo Victor IA
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.09);font-size:12px;color:rgba(229,225,231,0.45);">
          Victor IA · Inteligencia Artificial aplicada a tu negocio<br/>
          <a href="https://victor-ia.com.mx" style="color:#3B82F6;text-decoration:none;">victor-ia.com.mx</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Send email if userEmail provided
  let messageId: string | undefined;
  let emailError: string | undefined;
  if (userEmail) {
    const emailResult = await sendEmail(
      userEmail,
      `[VICTOR IA] Tu Material de Capacitación - ${config.topic}`,
      emailHtml,
    );
    messageId = emailResult.messageId;
    emailError = emailResult.error;
  }

  return {
    status: 'success',
    result_url: null,
    html_content: html,
    job_id: messageId,
    message: emailError ? `HTML generado pero error al enviar email: ${emailError}` : undefined,
    metadata: {
      topic: config.topic,
      format,
      level,
      model: 'claude-sonnet-4-5',
      emailSent: !!messageId,
      sentTo: userEmail || null,
    },
  };
}

// 7. ADMIN — placeholder
async function handleAdmin(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  return {
    status: 'success',
    message: 'Tarea admin procesada',
    result: {
      task: config.task,
      timestamp: new Date().toISOString(),
    },
    metadata: { task: config.task },
  };
}

// 8. DASHBOARD — OpenRouter → HTML report/dashboard
async function handleDashboard(
  config: Record<string, unknown>,
): Promise<CreateResult> {
  const period = config.period ?? 'último mes';
  const format = config.format ?? 'executive dashboard';
  const metrics = config.metrics ?? 'KPIs generales, tendencias, proyecciones';

  const systemPrompt =
    'Generate a complete HTML dashboard/report with charts (use Chart.js from CDN), data tables, and KPI cards. Dark luxury design. Return ONLY the HTML — no markdown, no explanations.';

  const userPrompt = `Create a ${format} for period: ${period}. Metrics: ${metrics}. Include visual charts, summary cards, trend indicators, and executive insights.`;

  const html = await callOpenRouter(systemPrompt, userPrompt);

  return {
    status: 'success',
    result_url: null,
    html_content: html,
    metadata: { period, format, metrics, model: 'claude-sonnet-4-5' },
  };
}

// ---------------------------------------------------------------------------
// Action dispatcher
// ---------------------------------------------------------------------------
async function dispatchAction(
  action: string,
  config: Record<string, unknown>,
): Promise<CreateResult> {
  switch (action) {
    case 'image':
      return handleImage(config);
    case 'video':
      return handleVideo(config);
    case 'voice':
      return handleVoice(config);
    case 'presentation':
      return handlePresentation(config);
    case 'web':
      return handleWeb(config);
    case 'training':
      return handleTraining(config);
    case 'admin':
      return handleAdmin(config);
    case 'dashboard':
      return handleDashboard(config);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// ---------------------------------------------------------------------------
// POST /api/create
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      action,
      config = {},
      userId = 'anonymous',
    } = body as {
      action: string;
      config: Record<string, unknown>;
      userId?: string;
    };

    if (!action) {
      return withCors(
        NextResponse.json({ error: 'Missing required field: action' }, { status: 400 }),
      );
    }

    const result = await dispatchAction(action, config);

    // Fire-and-forget Supabase save
    saveCreation(action, config, userId, result).catch(() => {});

    return withCors(NextResponse.json(result, { status: 200 }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[/api/create] Error:', message);
    return withCors(
      NextResponse.json({ error: message }, { status: 500 }),
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/create?userId=xxx  — fetch recent creations
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? 'anonymous';

    if (!supabaseAdmin) {
      return withCors(
        NextResponse.json(
          { data: [], message: 'Supabase not configured' },
          { status: 200 },
        ),
      );
    }

    const { data, error } = await supabaseAdmin
      .from('creations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return withCors(
        NextResponse.json({ data: [], message: error.message }, { status: 200 }),
      );
    }

    return withCors(NextResponse.json({ data }, { status: 200 }));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('[/api/create GET] Error:', message);
    return withCors(
      NextResponse.json({ error: message }, { status: 500 }),
    );
  }
}