import { NextRequest, NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

// ==========================================
// TIPOS Y CONFIGURACIÓN
// ==========================================

interface RateLimitStore {
  [key: string]: {
    requests: number[];
    blocked: boolean;
    blockedUntil?: number;
  };
}

interface SecurityConfig {
  rateLimitPerIP: { requests: number; windowMs: number };
  rateLimitPerUser: { requests: number; windowMs: number };
  corsWhitelist: string[];
  blockList: Set<string>;
  suspiciousBots: RegExp;
}

// ==========================================
// RATE LIMITING EN MEMORIA
// ==========================================

let rateLimitStore: RateLimitStore = {};

// Tipado del global para el handle del cleanup interval
declare global {
  // eslint-disable-next-line no-var
  var rateLimitCleanup: ReturnType<typeof setInterval> | undefined;
}

// Limpiar store cada 5 minutos para evitar memory leak
if (globalThis.rateLimitCleanup === undefined) {
  globalThis.rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const key in rateLimitStore) {
      if (rateLimitStore[key].blockedUntil && now > rateLimitStore[key].blockedUntil!) {
        delete rateLimitStore[key];
      }
    }
  }, 5 * 60 * 1000);
}

// ==========================================
// CONFIGURACIÓN DE SEGURIDAD
// ==========================================

const securityConfig: SecurityConfig = {
  rateLimitPerIP: {
    requests: 100,
    windowMs: 60 * 1000, // 100 req/min
  },
  rateLimitPerUser: {
    requests: 500,
    windowMs: 60 * 1000, // 500 req/min
  },
  corsWhitelist: [
    'https://victor-ia.com.mx',
    'https://www.victor-ia.com.mx',
    'https://victor-ia-app.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  blockList: new Set<string>(),
  suspiciousBots: /bot|crawler|spider|scraper|java(?!script)/i,
};

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

/**
 * Extrae la IP del cliente (considerando proxies como Vercel)
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Valida el User-Agent contra lista de bots sospechosos
 */
function isSuspiciousBot(userAgent: string): boolean {
  if (!userAgent) return false;
  return securityConfig.suspiciousBots.test(userAgent);
}

/**
 * Verifica rate limit por IP o usuario
 */
function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();

  if (!rateLimitStore[identifier]) {
    rateLimitStore[identifier] = {
      requests: [now],
      blocked: false,
    };
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  const entry = rateLimitStore[identifier];

  if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
    };
  }

  entry.requests = entry.requests.filter((time) => now - time < windowMs);
  entry.blocked = false;

  if (entry.requests.length < limit) {
    entry.requests.push(now);
    return {
      allowed: true,
      remaining: limit - entry.requests.length,
      resetTime: now + windowMs,
    };
  }

  entry.blocked = true;
  entry.blockedUntil = now + windowMs;

  return {
    allowed: false,
    remaining: 0,
    resetTime: entry.blockedUntil,
  };
}

/**
 * Construye headers de seguridad
 */
function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    // CSP intentionally omitted here — also disabled in next.config.js while
    // stabilizing the deployment. Re-enable in BOTH places together once verified.
  };
}

/**
 * Registra acceso en stdout
 */
function logAccess(
  ip: string,
  method: string,
  pathname: string,
  status: number,
  duration: number,
  rateLimitData?: { allowed: boolean; remaining: number }
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ip,
    method,
    pathname,
    status,
    duration,
    allowed: rateLimitData?.allowed ?? true,
    remaining: rateLimitData?.remaining ?? null,
  };

  console.log(JSON.stringify(logEntry));
}

/**
 * Valida CORS por origen
 */
function validateCORS(origin: string | null): boolean {
  if (!origin) return true;
  return securityConfig.corsWhitelist.some(
    (allowed) => origin === allowed || origin.includes(allowed)
  );
}

/**
 * Aplica CORS headers
 */
function applyCORSHeaders(response: NextResponse, origin: string | null): NextResponse {
  if (origin && validateCORS(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return response;
}

// ==========================================
// MIDDLEWARE PRINCIPAL CON CLERK + SEGURIDAD
// ==========================================

// Crear handler de seguridad personalizado
async function securityHandler(request: NextRequest) {
  const startTime = performance.now();
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const origin = request.headers.get('origin');

  // 1. VALIDACIÓN DE BOTS SOSPECHOSOS
  //    Excepción: /api/health debe responder a monitores de uptime y health checks
  if (pathname !== '/api/health' && isSuspiciousBot(userAgent)) {
    logAccess(clientIP, method, pathname, 403, 0, { allowed: false, remaining: 0 });
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. VALIDACIÓN DE IP BLOQUEADA
  if (securityConfig.blockList.has(clientIP)) {
    logAccess(clientIP, method, pathname, 403, 0, { allowed: false, remaining: 0 });
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 3. RATE LIMITING POR IP
  const ipRateLimit = checkRateLimit(
    `ip:${clientIP}`,
    securityConfig.rateLimitPerIP.requests,
    securityConfig.rateLimitPerIP.windowMs
  );

  if (!ipRateLimit.allowed) {
    const duration = Math.round(performance.now() - startTime);
    logAccess(clientIP, method, pathname, 429, duration, {
      allowed: false,
      remaining: 0,
    });
    const response = new NextResponse('Too Many Requests', { status: 429 });
    response.headers.set('Retry-After', String(Math.ceil((ipRateLimit.resetTime - Date.now()) / 1000)));
    return response;
  }

  // 4. RATE LIMITING POR USUARIO (si existe token Bearer)
  let userRateLimit = { allowed: true, remaining: securityConfig.rateLimitPerUser.requests, resetTime: Date.now() };
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    // Usar el header de Authorization como identificador de usuario
    const userId = authHeader.replace('Bearer ', '').slice(0, 10); // Primeros 10 chars del token
    userRateLimit = checkRateLimit(
      `user:${userId}`,
      securityConfig.rateLimitPerUser.requests,
      securityConfig.rateLimitPerUser.windowMs
    );

    if (!userRateLimit.allowed) {
      const duration = Math.round(performance.now() - startTime);
      logAccess(clientIP, method, pathname, 429, duration, {
        allowed: false,
        remaining: 0,
      });
      const response = new NextResponse('Too Many Requests (User Quota)', { status: 429 });
      response.headers.set(
        'Retry-After',
        String(Math.ceil((userRateLimit.resetTime - Date.now()) / 1000))
      );
      return response;
    }
  }

  // 5. RESPUESTA CON HEADERS DE SEGURIDAD
  const response = NextResponse.next();

  // Agregar headers de seguridad
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Agregar headers de rate limit
  response.headers.set('X-RateLimit-Limit-IP', String(securityConfig.rateLimitPerIP.requests));
  response.headers.set('X-RateLimit-Remaining-IP', String(ipRateLimit.remaining));
  response.headers.set('X-RateLimit-Reset-IP', String(ipRateLimit.resetTime));

  if (authHeader) {
    response.headers.set('X-RateLimit-Limit-User', String(securityConfig.rateLimitPerUser.requests));
    response.headers.set('X-RateLimit-Remaining-User', String(userRateLimit.remaining));
  }

  // Aplicar CORS
  applyCORSHeaders(response, origin);

  // 6. LOGGING
  const duration = Math.round(performance.now() - startTime);
  logAccess(clientIP, method, pathname, 200, duration, {
    allowed: true,
    remaining: Math.min(ipRateLimit.remaining, userRateLimit.remaining),
  });

  if (duration > 100) {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        warning: 'Slow middleware response',
        duration,
        ip: clientIP,
        pathname,
      })
    );
  }

  return response;
}

// ==========================================
// MIDDLEWARE PRINCIPAL CON CLERK
// ==========================================

export default clerkMiddleware(async (auth, request) => {
  // Proteger rutas de dashboard
  const { userId } = await auth();
  const pathname = request.nextUrl.pathname;

  // Rutas públicas (sin autenticación requerida)
  // OJO: '/' debe ser coincidencia EXACTA; el resto coinciden por prefijo.
  // Usar startsWith('/') marcaría TODA ruta como pública y desactivaría el auth.
  const exactPublicRoutes = ['/'];
  const prefixPublicRoutes = ['/sign-in', '/sign-up', '/api/webhooks', '/api/health'];
  const isPublicRoute =
    exactPublicRoutes.includes(pathname) ||
    prefixPublicRoutes.some(route => pathname.startsWith(route));

  // Si es ruta pública, permitir
  if (isPublicRoute) {
    return securityHandler(request);
  }

  // Si no está autenticado y no es ruta pública, redirigir a sign-in
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Usuario autenticado, continuar
  return securityHandler(request);
});

// ==========================================
// CONFIGURACIÓN DE RUTAS A PROTEGER
// ==========================================

export const config = {
  matcher: [
    // Aplicar middleware a todas las rutas excepto Next.js internas
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
