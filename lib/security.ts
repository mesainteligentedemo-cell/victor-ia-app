/**
 * lib/security.ts
 * Utilidades de seguridad reutilizables para API routes y componentes
 */

import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// TIPOS
// ==========================================

export interface SecurityHeaders {
  [key: string]: string;
}

export interface RateLimitResponse {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// ==========================================
// CONSTANTES
// ==========================================

export const SECURITY_HEADERS: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
};

export const CORS_WHITELIST = [
  'https://victor-ia.com.mx',
  'https://www.victor-ia.com.mx',
  'https://victor-ia-app.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

export const BOT_DETECTION_REGEX = /bot|crawler|spider|scraper|curl|wget|python|java(?!script)|perl|ruby/i;

// ==========================================
// EXTRACCIÓN DE INFORMACIÓN
// ==========================================

/**
 * Extrae la IP del cliente considerando proxies (Vercel, Cloudflare, etc.)
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Obtiene información del cliente desde headers
 */
export function getClientInfo(request: NextRequest) {
  return {
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || '',
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer'),
    method: request.method,
    pathname: request.nextUrl.pathname,
  };
}

// ==========================================
// VALIDACIONES DE SEGURIDAD
// ==========================================

/**
 * Valida si el User-Agent es sospechoso (bot o crawler)
 */
export function isSuspiciousBot(userAgent: string): boolean {
  if (!userAgent) return false;
  return BOT_DETECTION_REGEX.test(userAgent);
}

/**
 * Valida si el origen está en la whitelist CORS
 */
export function isValidOrigin(origin: string | null): boolean {
  if (!origin) return true; // Requests sin origin son válidos (SSR, etc.)
  return CORS_WHITELIST.some(
    (allowed) => origin === allowed || origin.includes(allowed.replace(/^https?:\/\//, ''))
  );
}

/**
 * Valida si una IP está bloqueada
 */
export function isIPBlocked(ip: string, blockList: Set<string>): boolean {
  return blockList.has(ip);
}

/**
 * Valida autenticación básica (Bearer token)
 */
export function validateBearerToken(request: NextRequest, validTokens: Set<string>): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return false;

  return validTokens.has(parts[1]);
}

// ==========================================
// APLICACIÓN DE HEADERS
// ==========================================

/**
 * Aplica headers de seguridad a una response
 */
export function applySafetyHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Aplica headers CORS a una response
 */
export function applyCORSHeaders(
  response: NextResponse,
  origin: string | null
): NextResponse {
  if (origin && isValidOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return response;
}

/**
 * Aplica headers de rate limit a una response
 */
export function applyRateLimitHeaders(
  response: NextResponse,
  ipLimit: number,
  ipRemaining: number,
  ipReset: number,
  userLimit?: number,
  userRemaining?: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit-IP', String(ipLimit));
  response.headers.set('X-RateLimit-Remaining-IP', String(ipRemaining));
  response.headers.set('X-RateLimit-Reset-IP', String(ipReset));

  if (userLimit) {
    response.headers.set('X-RateLimit-Limit-User', String(userLimit));
    response.headers.set('X-RateLimit-Remaining-User', String(userRemaining));
  }

  return response;
}

// ==========================================
// LOGGING
// ==========================================

export interface LogEntry {
  timestamp: string;
  ip: string;
  method: string;
  pathname: string;
  status: number;
  duration: number;
  userId?: string;
  allowed: boolean;
  remaining?: number;
  error?: string;
}

/**
 * Registra acceso a stdout en formato JSON
 */
export function logSecurityEvent(entry: LogEntry): void {
  console.log(JSON.stringify(entry));
}

/**
 * Registra advertencia de seguridad
 */
export function logSecurityWarning(
  type: 'bot-detected' | 'rate-limit-exceeded' | 'invalid-origin' | 'blocked-ip',
  clientInfo: { ip: string; userAgent: string; pathname: string }
): void {
  console.warn(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      type,
      ...clientInfo,
    })
  );
}

// ==========================================
// RESPUESTAS DE ERROR ESTÁNDAR
// ==========================================

/**
 * Respuesta 403 Forbidden
 */
export function forbiddenResponse(reason: string): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Forbidden',
      message: reason,
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Respuesta 429 Too Many Requests
 */
export function rateLimitedResponse(retryAfter: number): NextResponse {
  const response = new NextResponse(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  response.headers.set('Retry-After', String(retryAfter));
  return response;
}

/**
 * Respuesta 401 Unauthorized
 */
export function unauthorizedResponse(reason: string = 'Unauthorized'): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Unauthorized',
      message: reason,
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Respuesta 400 Bad Request
 */
export function badRequestResponse(message: string): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: 'Bad Request',
      message,
    }),
    {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// ==========================================
// VALIDACIÓN DE PAYLOAD
// ==========================================

/**
 * Valida que el Content-Type sea JSON
 */
export function isValidContentType(contentType: string | null): boolean {
  if (!contentType) return true;
  return contentType.includes('application/json');
}

/**
 * Extrae y valida JSON del body
 */
export async function parseJSONBody<T>(request: NextRequest): Promise<T | null> {
  try {
    const body = await request.json();
    return body as T;
  } catch {
    return null;
  }
}

/**
 * Valida tamaño máximo de request
 */
export function validateRequestSize(
  contentLength: string | null,
  maxBytes: number = 1024 * 1024 // 1MB default
): boolean {
  if (!contentLength) return true;
  const size = parseInt(contentLength, 10);
  return size <= maxBytes;
}

// ==========================================
// SANITIZACIÓN
// ==========================================

/**
 * Sanitiza string para prevenir XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida y sanitiza email
 */
export function sanitizeEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return null;
  return email.toLowerCase().trim();
}

/**
 * Valida URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
