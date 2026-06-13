# 🔐 TEMPLATES DE REMEDIACIÓN — Security Fixes

Estos son templates prontos para copiar y pegar en los endpoints vulnerables.

---

## 1️⃣ FIX PARA `/api/chat` — AGREGAR AUTH + RATE LIMIT

**Archivo:** `app/api/chat/route.ts`

```typescript
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { logger } from '@/lib/logger';
import { validateText } from '@/lib/security/validation';

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    // ✅ 1. VERIFICAR AUTENTICACIÓN
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ✅ 2. RATE LIMITING
    const nextReq = new Request(req.clone());
    const rateLimit = await checkRateLimit(
      nextReq as any,
      userId,
      'api'
    );
    
    if (!rateLimit.allowed) {
      return rateLimit.response;
    }

    // ✅ 3. VALIDAR INPUTS
    const { message } = await req.json();
    
    let validatedMessage: string;
    try {
      validatedMessage = validateText(message, { maxLength: 5000 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid input: message must be between 1-5000 characters' },
        { status: 400 }
      );
    }

    // ✅ 4. USAR SYSTEM PROMPT FIJO (NO DEL USUARIO)
    const systemPrompt = `Eres Victor IA, una agencia de inteligencia artificial con 155 especialistas.
Tienes expertise en diseño, desarrollo, video, marketing, copywriting y más.
Responde con precisión, genera ideas innovadoras y estructura tus respuestas para ser claras y accionables.
Siempre sugiere pasos concretos y próximas acciones.`;

    // ✅ 5. LLAMAR A ANTHROPIC
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: validatedMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Anthropic API error', { status: response.status });
      return NextResponse.json(
        { error: "Failed to get response from Claude" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const responseText = data.content?.[0]?.text || "Sin respuesta";

    // ✅ 6. LOG SEGURO (sin keys)
    logger.info('Chat API call successful', {
      userId,
      messageLength: validatedMessage.length,
      tokensUsed: data.usage?.output_tokens || 0,
    });

    return NextResponse.json({
      response: responseText,
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
      },
    });
  } catch (error) {
    logger.error('Chat API error', error as Error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}
```

---

## 2️⃣ FIX PARA `/api/merge/versions` — CERRAR CORS

**Archivo:** `app/api/merge/versions/route.ts` (líneas 218-227)

```typescript
/**
 * OPTIONS handler for CORS — AHORA RESTRICTO
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // ✅ WHITELIST de orígenes permitidos
  const ALLOWED_ORIGINS = [
    'https://victor-ia.com',
    'https://app.victor-ia.com',
    'https://www.victor-ia.com',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ];

  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);

  return new NextResponse(null, {
    status: 200,
    headers: isAllowed ? {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    } : {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
```

**Plus: Agregar AUTH a POST:**

```typescript
// Al inicio del POST handler:
export async function POST(request: NextRequest) {
  try {
    // ✅ AGREGAR AUTENTICACIÓN
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: MergeRequest = await request.json();

    // ... resto del código ...
  }
}
```

---

## 3️⃣ FIX PARA ERROR MESSAGES — TEMPLATE GLOBAL

Buscar y reemplazar en TODOS los endpoints:

**ANTES (❌ MAL):**
```typescript
return NextResponse.json({ error: String(error) }, { status: 500 });
return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
console.error("API error:", error);
```

**DESPUÉS (✅ BIEN):**
```typescript
logger.error('Operation failed', error as Error);
return NextResponse.json(
  { error: 'An error occurred processing your request' },
  { status: 500 }
);
```

**Script de búsqueda y reemplazo global:**
```bash
cd app/api

# Encontrar todos los endpoints con error String()
grep -r "String(error)" . --include="*.ts"

# Encontrar todos los console.error
grep -r "console\.error" . --include="*.ts"

# Encontrar todos los error.message expuestos
grep -r "error\.message" . --include="*.ts" | grep -v logger | grep -v "in production"
```

---

## 4️⃣ FIX PARA `/api/webhooks` GET — AGREGAR AUTH

**Archivo:** `app/api/webhooks/route.ts` (líneas 249-260)

```typescript
/**
 * GET /api/webhooks — Health check con autenticación
 */
export async function GET(request: NextRequest) {
  // ✅ SOLO ADMIN PUEDE VER ESTADO
  const token = request.headers.get('authorization')?.slice(7);
  
  if (!token || !isValidAdminToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      status: 'ok',
      message: 'Webhook endpoint is running',
      endpoint: '/api/webhooks',
      method: 'POST',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

/**
 * Helper para verificar token de admin (implementar según tus tokens)
 */
function isValidAdminToken(token: string): boolean {
  // Opción 1: Verificar contra environment variable
  const ADMIN_TOKENS = (process.env.ADMIN_TOKENS || '').split(',');
  return ADMIN_TOKENS.includes(token);

  // Opción 2: Verificar JWT (si uses)
  // try {
  //   const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!);
  //   return decoded.role === 'admin';
  // } catch {
  //   return false;
  // }
}
```

---

## 5️⃣ FIX PARA STRIPE WEBHOOK — IDEMPOTENCY + TIMESTAMP

**Archivo:** `app/api/stripe/webhook.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db/supabase";
import { logger } from "@/lib/logger";

// ✅ CONFIGURACIÓN SEGURA
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

const stripe = new Stripe(stripeKey);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
}

// ✅ ANTI-REPLAY: Store processed webhook IDs (usar Redis en producción)
const processedWebhookIds = new Set<string>();
const WEBHOOK_MAX_AGE_SECONDS = 300; // 5 minutos

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    logger.warn('Webhook signature verification failed');
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // ✅ 1. VERIFICAR TIMESTAMP (no procesar webhooks viejos)
  const now = Math.floor(Date.now() / 1000);
  const eventTimestamp = event.created;
  
  if (now - eventTimestamp > WEBHOOK_MAX_AGE_SECONDS) {
    logger.warn('Webhook timestamp out of range', { eventId: event.id, age: now - eventTimestamp });
    return NextResponse.json(
      { error: "Webhook timestamp too old" },
      { status: 400 }
    );
  }

  // ✅ 2. IDEMPOTENCY: No procesar el mismo webhook 2x
  if (processedWebhookIds.has(event.id)) {
    logger.info('Webhook already processed', { eventId: event.id });
    // Responder OK para no hacer retry
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await db
            .from("users")
            .update({ subscription_status: plan })
            .eq("id", userId);
          
          logger.info('User subscription updated', { userId, plan });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const status = subscription.status === "active" ? "active" : "inactive";
          await db
            .from("subscriptions")
            .update({ status })
            .eq("stripe_subscription_id", subscription.id);
          
          logger.info('Subscription updated', { userId, status });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await db
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);
        
        logger.info('Subscription canceled', { subscriptionId: subscription.id });
        break;
      }

      default:
        logger.info('Unhandled webhook event', { eventType: event.type });
    }

    // ✅ 3. SOLO MARCAR COMO PROCESADO DESPUÉS DE ÉXITO
    processedWebhookIds.add(event.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error', error as Error);
    // NO marcar como procesado → Stripe reintenará
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
```

---

## 6️⃣ FIX PARA VALIDACIÓN EN `/api/voice/generate`

**Archivo:** `app/api/voice/generate/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { validateText, validateRange } from '@/lib/security/validation';
import { logger } from '@/lib/logger';
import { auth } from '@clerk/nextjs/server';

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
    // ✅ AUTH
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, voiceId, stability, similarity } = (await req.json()) as VoiceRequest;

    // ✅ VALIDAR TEXT
    let validatedText: string;
    try {
      validatedText = validateText(text, { minLength: 1, maxLength: 1000 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Text must be between 1-1000 characters' },
        { status: 400 }
      );
    }

    // ✅ VALIDAR STABILITY Y SIMILARITY
    const validatedStability = stability ?? 0.5;
    const validatedSimilarity = similarity ?? 0.75;

    try {
      validateRange(validatedStability, 0, 1, 'stability');
      validateRange(validatedSimilarity, 0, 1, 'similarity');
    } catch (error) {
      return NextResponse.json(
        { error: 'stability and similarity must be between 0 and 1' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceIdToUse = voiceId || process.env.ELEVENLABS_VOICE_ID || 'iDEmt5MnqUotdwCIVplo';

    if (!apiKey) {
      logger.error('ElevenLabs API key not configured');
      return NextResponse.json(
        { error: 'Voice generation not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceIdToUse}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: validatedText,
          voice_settings: {
            stability: validatedStability,
            similarity_boost: validatedSimilarity,
          },
          model_id: 'eleven_monolingual_v1',
        }),
      }
    );

    if (!response.ok) {
      logger.error('ElevenLabs API error', { status: response.status });
      return NextResponse.json(
        { error: 'Failed to generate voice' },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    logger.info('Voice generated successfully', {
      userId,
      textLength: validatedText.length,
    });

    return NextResponse.json({
      success: true,
      audio: `data:audio/mpeg;base64,${base64Audio}`,
      duration: Math.ceil(validatedText.length / 15),
    });
  } catch (error) {
    logger.error('Voice generation error', error as Error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}
```

---

## 7️⃣ VERIFICAR `.env.local` — ANTES DE DEPLOYR

**CRÍTICO: Ejecutar esto antes de cualquier deployment:**

```bash
# ✅ Verificar que NO haya secrets reales en git
git log -p --all -- ".env.local" | grep -i "sk_\|api_key" | head -5

# ✅ Si encuentra algo → ROTAR INMEDIATAMENTE
echo "Rotating API keys..."

# ✅ Verificar que .gitignore bloquee .env.local
cat .gitignore | grep ".env"

# ✅ Remover cualquier archivo .env que fue commiteado
git rm --cached .env* 2>/dev/null || true

# ✅ Commit
git add .gitignore
git commit -m "chore: ensure .env files are never committed"
git push
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Rotar API keys en todos los servicios
- [ ] Actualizar `.env.local` con nuevas keys  
- [ ] Copiar `/api/chat/route.ts` fix
- [ ] Copiar `/api/merge/versions/route.ts` fix
- [ ] Buscar y reemplazar error messages en 26 endpoints
- [ ] Copiar `/api/webhooks` GET fix
- [ ] Copiar Stripe webhook fix
- [ ] Copiar `/api/voice/generate` fix
- [ ] Ejecutar git cleanup (remover .env de history)
- [ ] Tests de seguridad (si existen)
- [ ] Deploy a staging
- [ ] Verificación final

---

## ✅ TESTING POST-FIX

```bash
# Verificar que auth está funcionando
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola"}' \
  # Debería retornar 401 Unauthorized ✅

# Verificar CORS está cerrado
curl -X OPTIONS http://localhost:3000/api/merge/versions \
  -H "Origin: http://malicious.com" \
  # NO debería incluir Access-Control-Allow-Origin ✅

# Verificar validación de inputs
curl -X POST http://localhost:3000/api/voice/generate \
  -H "Content-Type: application/json" \
  -d '{"text": ""}' \
  # Debería retornar 400 Bad Request ✅
```

---

**Generado:** 13 de junio, 2026
