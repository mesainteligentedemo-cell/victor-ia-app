/**
 * app/api/secure-example/route.ts
 * Ejemplo de API route con todas las protecciones de seguridad
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getClientInfo,
  isSuspiciousBot,
  isValidOrigin,
  applySafetyHeaders,
  applyCORSHeaders,
  applyRateLimitHeaders,
  logSecurityEvent,
  logSecurityWarning,
  forbiddenResponse,
  unauthorizedResponse,
  badRequestResponse,
  isValidContentType,
  parseJSONBody,
  validateRequestSize,
  sanitizeString,
} from '@/lib/security';

// ==========================================
// CONFIGURACIÓN ESPECÍFICA PARA ESTA RUTA
// ==========================================

const RATE_LIMIT_REQUESTS = 50; // 50 req/min por IP en esta ruta
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_PAYLOAD_SIZE = 512 * 1024; // 512 KB

// Simple in-memory store (en producción usar Redis)
let rateLimitStore: Map<
  string,
  {
    count: number;
    resetTime: number;
  }
> = new Map();

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now >= entry.resetTime) {
    const newEntry = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(identifier, newEntry);
    return {
      allowed: true,
      remaining: RATE_LIMIT_REQUESTS - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count < RATE_LIMIT_REQUESTS) {
    entry.count++;
    return {
      allowed: true,
      remaining: RATE_LIMIT_REQUESTS - entry.count,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.resetTime,
  };
}

// ==========================================
// HANDLER POST
// ==========================================

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  const clientInfo = getClientInfo(request);

  try {
    // 1. VALIDACIÓN: User-Agent sospechoso
    if (isSuspiciousBot(clientInfo.userAgent)) {
      logSecurityWarning('bot-detected', {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        pathname: clientInfo.pathname,
      });
      return forbiddenResponse('Bot access denied');
    }

    // 2. VALIDACIÓN: Origen CORS
    if (!isValidOrigin(clientInfo.origin)) {
      logSecurityWarning('invalid-origin', {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        pathname: clientInfo.pathname,
      });
      return forbiddenResponse('Invalid origin');
    }

    // 3. VALIDACIÓN: Content-Type
    const contentType = request.headers.get('content-type');
    if (!isValidContentType(contentType)) {
      return badRequestResponse('Content-Type must be application/json');
    }

    // 4. VALIDACIÓN: Tamaño del request
    const contentLength = request.headers.get('content-length');
    if (!validateRequestSize(contentLength, MAX_PAYLOAD_SIZE)) {
      return badRequestResponse(`Payload too large. Max: ${MAX_PAYLOAD_SIZE} bytes`);
    }

    // 5. RATE LIMITING
    const rateLimit = checkRateLimit(clientInfo.ip);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      logSecurityWarning('rate-limit-exceeded', {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        pathname: clientInfo.pathname,
      });

      const response = new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          retryAfter,
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
      response.headers.set('Retry-After', String(retryAfter));
      return response;
    }

    // 6. PARSEAR Y VALIDAR PAYLOAD
    const body = await parseJSONBody<{ message?: string; email?: string }>(request);
    if (!body) {
      return badRequestResponse('Invalid JSON payload');
    }

    if (!body.message || typeof body.message !== 'string') {
      return badRequestResponse('Field "message" is required and must be a string');
    }

    // 7. SANITIZAR INPUT
    const sanitizedMessage = sanitizeString(body.message);

    // 8. LOGGING EXITOSO
    const duration = Math.round(performance.now() - startTime);
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      ip: clientInfo.ip,
      method: clientInfo.method,
      pathname: clientInfo.pathname,
      status: 200,
      duration,
      allowed: true,
      remaining: rateLimit.remaining,
    });

    // 9. RESPUESTA EXITOSA
    const response = new NextResponse(
      JSON.stringify({
        success: true,
        message: 'Request processed',
        data: {
          received: sanitizedMessage,
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Aplicar headers de seguridad
    applySafetyHeaders(response);
    applyCORSHeaders(response, clientInfo.origin);
    applyRateLimitHeaders(
      response,
      RATE_LIMIT_REQUESTS,
      rateLimit.remaining,
      rateLimit.resetTime
    );

    return response;
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);

    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        type: 'api-error',
        pathname: clientInfo.pathname,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
      })
    );

    const response = new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );

    applySafetyHeaders(response);
    return response;
  }
}

// ==========================================
// HANDLER OPTIONS (CORS Preflight)
// ==========================================

export async function OPTIONS(request: NextRequest) {
  const clientInfo = getClientInfo(request);

  if (!isValidOrigin(clientInfo.origin)) {
    return forbiddenResponse('Invalid origin');
  }

  const response = new NextResponse(null, { status: 204 });
  applySafetyHeaders(response);
  applyCORSHeaders(response, clientInfo.origin);

  return response;
}

// ==========================================
// HANDLER GET (para testing)
// ==========================================

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const clientInfo = getClientInfo(request);

  if (isSuspiciousBot(clientInfo.userAgent)) {
    return forbiddenResponse('Bot access denied');
  }

  const rateLimit = checkRateLimit(clientInfo.ip);
  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      }
    );
  }

  const duration = Math.round(performance.now() - startTime);

  logSecurityEvent({
    timestamp: new Date().toISOString(),
    ip: clientInfo.ip,
    method: clientInfo.method,
    pathname: clientInfo.pathname,
    status: 200,
    duration,
    allowed: true,
    remaining: rateLimit.remaining,
  });

  const response = new NextResponse(
    JSON.stringify({
      message: 'Secure API endpoint is working',
      ip: clientInfo.ip,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  applySafetyHeaders(response);
  applyCORSHeaders(response, clientInfo.origin);
  applyRateLimitHeaders(
    response,
    RATE_LIMIT_REQUESTS,
    rateLimit.remaining,
    rateLimit.resetTime
  );

  return response;
}
