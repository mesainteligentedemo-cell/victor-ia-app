/**
 * Webhook Endpoint with HMAC & Anti-Replay Protection
 * POST /api/webhooks
 *
 * Request body:
 * {
 *   payload: { ...any JSON data... },
 *   signature: "hex-encoded HMAC-SHA256",
 *   nonce: "UUID v4",
 *   timestamp: "ISO 8601 or milliseconds"
 * }
 *
 * Response:
 * 200: { success: true, signature: "echo of request signature" }
 * 400: { error: "reason", code: "error_code" }
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validateWebhookRequest,
  signWebhookPayload,
  WebhookRequest,
  ValidationResult,
} from '@/lib/security/webhook-signing';
import { logger } from '@/lib/logger';

// Get webhook secret from environment
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.warn(
    '⚠️  WEBHOOK_SECRET not set. Webhook signing will fail. Set WEBHOOK_SECRET in .env.local'
  );
}

/**
 * Webhook payload processor
 * Extend this function to handle specific webhook types
 */
async function processWebhookPayload(
  payload: Record<string, any>
): Promise<{
  success: boolean;
  message: string;
  processed?: Record<string, any>;
}> {
  const { type, event, data } = payload;

  try {
    // Handle both 'type' and 'event' fields for compatibility
    const eventType = (type || event || '').toLowerCase();

    switch (eventType) {
      case 'user.created':
        logger.info('Webhook: New user created', { userId: data?.id });
        return { success: true, message: 'User created event processed' };

      case 'user.updated':
        logger.info('Webhook: User updated', { userId: data?.id });
        return { success: true, message: 'User updated event processed' };

      case 'generation.complete':
        logger.info('Webhook: Generation completed', { generationId: data?.id });
        return { success: true, message: 'Generation complete event processed' };

      case 'agent.execution':
        logger.info('Webhook: Agent execution', { agentId: data?.id });
        return { success: true, message: 'Agent execution event processed' };

      case 'project.completed':
        logger.info('Webhook: Project completed', { projectId: data?.id });
        return { success: true, message: 'Project completion event processed' };

      case 'payment.received':
        logger.info('Webhook: Payment received', { amount: data?.amount });
        return { success: true, message: 'Payment received event processed' };

      case 'prospect.created':
        logger.info('Webhook: Prospect created', { prospectId: data?.id });
        return { success: true, message: 'Prospect created event processed' };

      case 'test':
        logger.info('Webhook: Test event', { testId: data?.id });
        return { success: true, message: 'Test event processed' };

      default:
        logger.warn('Webhook: Unknown event type', { type: eventType });
        return {
          success: false,
          message: `Unknown event type: ${eventType}`,
        };
    }
  } catch (error) {
    logger.error('Webhook processing error', { error, type: payload.type });
    throw error;
  }
}

/**
 * Validate request structure
 */
function validateRequestStructure(body: unknown): body is WebhookRequest {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const req = body as Record<string, unknown>;

  return (
    typeof req.payload === 'object' &&
    req.payload !== null &&
    typeof req.signature === 'string' &&
    typeof req.nonce === 'string' &&
    (typeof req.timestamp === 'string' || typeof req.timestamp === 'number')
  );
}

/**
 * Helper para verificar token de admin
 */
function isValidAdminToken(token: string): boolean {
  const ADMIN_TOKENS = (process.env.ADMIN_TOKENS || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  if (ADMIN_TOKENS.length === 0) {
    return false;
  }

  return ADMIN_TOKENS.includes(token);
}

/**
 * POST /api/webhooks
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check for webhook secret
    if (!WEBHOOK_SECRET) {
      logger.error('Webhook: WEBHOOK_SECRET not configured');
      return NextResponse.json(
        {
          error: 'Webhook signing not configured',
          code: 'WEBHOOK_SECRET_MISSING',
        },
        { status: 500 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      logger.error('Webhook: Invalid JSON', { error });
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON',
        },
        { status: 400 }
      );
    }

    // Validate request structure
    if (!validateRequestStructure(body)) {
      logger.error('Webhook: Invalid request structure', { body });
      return NextResponse.json(
        {
          error:
            'Invalid request structure. Expected: { payload, signature, nonce, timestamp }',
          code: 'INVALID_STRUCTURE',
        },
        { status: 400 }
      );
    }

    const webhookRequest = body;

    // Validate webhook request (signature, timestamp, nonce)
    const validation: ValidationResult = validateWebhookRequest(
      webhookRequest,
      WEBHOOK_SECRET,
      300, // 5 minute max age
      300  // 5 minute nonce expiry
    );

    if (!validation.isValid) {
      logger.warn('Webhook: Validation failed', {
        error: validation.error,
        nonce: webhookRequest.nonce.substring(0, 8),
      });

      // Determine error code
      let code = 'VALIDATION_FAILED';
      if (validation.error?.includes('signature')) {
        code = 'INVALID_SIGNATURE';
      } else if (validation.error?.includes('Timestamp')) {
        code = 'TIMESTAMP_OUT_OF_RANGE';
      } else if (validation.error?.includes('Nonce')) {
        code = 'NONCE_REPLAY_DETECTED';
      }

      return NextResponse.json(
        {
          error: validation.error,
          code,
        },
        { status: 400 }
      );
    }

    // Process the webhook payload
    const processResult = await processWebhookPayload(webhookRequest.payload);

    if (!processResult.success) {
      logger.warn('Webhook: Processing failed', processResult);
      return NextResponse.json(
        {
          error: processResult.message,
          code: 'PROCESSING_FAILED',
        },
        { status: 400 }
      );
    }

    // Generate echo signature for response
    const responsePayload = { success: true };
    const echoSignature = signWebhookPayload(responsePayload, WEBHOOK_SECRET);

    const duration = Date.now() - startTime;
    logger.info('Webhook: Processed successfully', {
      type: webhookRequest.payload.type || webhookRequest.payload.event,
      nonce: webhookRequest.nonce.substring(0, 8),
      duration: `${duration}ms`,
    });

    return NextResponse.json(
      {
        success: true,
        signature: echoSignature,
        message: processResult.message,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Webhook: Unexpected error', { error });
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks
 * Health check endpoint — requiere autenticación de admin (Bearer token)
 */
export async function GET(request: NextRequest) {
  // ✅ SOLO ADMIN PUEDE VER ESTADO
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  if (!token || !isValidAdminToken(token)) {
    logger.warn('Webhook: Unauthorized GET attempt');
    return NextResponse.json(
      {
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      },
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
 * OPTIONS /api/webhooks
 * CORS headers
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
