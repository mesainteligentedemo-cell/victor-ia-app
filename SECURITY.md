# Victor IA App — HTTP Security Middleware

Documentación completa del sistema de seguridad HTTP implementado en el middleware de Next.js.

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Rate Limiting](#rate-limiting)
4. [CORS](#cors)
5. [Headers de Seguridad](#headers-de-seguridad)
6. [Detección de Bots](#detección-de-bots)
7. [Logging](#logging)
8. [Uso en API Routes](#uso-en-api-routes)
9. [Testing](#testing)
10. [Mejoras Futuras](#mejoras-futuras)

---

## Visión General

El middleware de seguridad protege la aplicación Victor IA contra:

- **Ataques de tasa (Rate Limiting):** Máximo 100 req/min por IP, 500 req/min por usuario
- **Inyección de contenido (CORS):** Solo orígenes whitelistados
- **Clickjacking y XSS:** Headers de seguridad HTTP
- **Bots maliciosos:** Detección por User-Agent
- **Ataques de protocolo:** Validación de headers y payload

### Componentes

| Componente | Ubicación | Responsabilidad |
|---|---|---|
| **Middleware** | `middleware.ts` | Protección global, rate limiting, headers HTTP |
| **Utilities** | `lib/security.ts` | Funciones reutilizables para API routes |
| **Ejemplo** | `app/api/secure-example/route.ts` | Referencia de implementación en API routes |

---

## Arquitectura

```
Request HTTP
    ↓
┌─────────────────────────────┐
│   middleware.ts             │
├─────────────────────────────┤
│ 1. Detectar bot             │ ← User-Agent regex
│ 2. Validar IP bloqueada     │ ← Blacklist
│ 3. Rate limit por IP        │ ← 100 req/min
│ 4. Rate limit por usuario   │ ← 500 req/min (si autenticado)
│ 5. Headers seguridad        │ ← X-Content-Type-Options, etc.
│ 6. CORS validation          │ ← Whitelist orígenes
│ 7. Logging                  │ ← JSON a stdout
└─────────────────────────────┘
    ↓
  ✓ Next.js App (< 100ms)
    ↓
Response con headers de seguridad
```

### Flujo de Validación

1. **Validación de User-Agent** — Rechaza bots conocidos (curl, wget, python, etc.)
2. **Validación de IP** — Rechaza IPs bloqueadas
3. **Rate Limiting por IP** — Máximo 100 peticiones por minuto
4. **Rate Limiting por Usuario** — Máximo 500 peticiones por minuto (con Clerk auth)
5. **Aplicación de Headers** — Seguridad HTTP estándar
6. **CORS** — Solo orígenes permitidos
7. **Logging** — Registro en JSON para monitoring

---

## Rate Limiting

### Configuración

```typescript
rateLimitPerIP: {
  requests: 100,      // 100 peticiones
  windowMs: 60 * 1000 // por minuto
}

rateLimitPerUser: {
  requests: 500,      // 500 peticiones
  windowMs: 60 * 1000 // por minuto (solo usuarios autenticados)
}
```

### Implementación

- **En Memoria:** Almacenamiento en `Map` con auto-cleanup cada 5 minutos
- **Bloqueo Temporal:** IP/usuario bloqueada por el resto de la ventana
- **Headers Informativos:**
  ```
  X-RateLimit-Limit-IP: 100
  X-RateLimit-Remaining-IP: 87
  X-RateLimit-Reset-IP: 1686578400000
  X-RateLimit-Limit-User: 500
  X-RateLimit-Remaining-User: 425
  ```

### Respuesta al Exceder Límite

```json
HTTP/1.1 429 Too Many Requests
Retry-After: 45

{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded..."
}
```

### Migración a Redis (Producción)

Para escalar a múltiples servidores, cambiar a Redis:

```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimit(identifier: string, limit: number, windowMs: number) {
  const key = `rl:${identifier}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, Math.ceil(windowMs / 1000));
  }
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetTime: Date.now() + (await redis.pttl(key)),
  };
}
```

---

## CORS

### Whitelist

```typescript
corsWhitelist: [
  'https://victor-ia.com.mx',
  'https://www.victor-ia.com.mx',
  'https://victor-ia-app.vercel.app',
  'http://localhost:3000',    // desarrollo local
  'http://127.0.0.1:3000',    // desarrollo local
]
```

### Headers CORS Aplicados (si origen válido)

```
Access-Control-Allow-Origin: https://victor-ia.com.mx
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
Access-Control-Allow-Credentials: true
```

### Requests OPTIONS (Preflight)

El middleware responde automáticamente a requests `OPTIONS` con status 204 si el origen es válido.

---

## Headers de Seguridad

### Lista Completa

| Header | Valor | Propósito |
|--------|-------|----------|
| `X-Content-Type-Options` | `nosniff` | Previene MIME sniffing |
| `X-Frame-Options` | `DENY` | Previene clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Protección XSS en navegadores antiguos |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | HTTPS obligatorio |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control de referrer |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Permisos de navegador |
| `Content-Security-Policy` | (ver abajo) | Política de seguridad de contenido |

### Content-Security-Policy Detallado

```
default-src 'self'                          # Permite solo mismo dominio
script-src 'self' 'unsafe-inline' 'unsafe-eval' https:
                                             # Scripts locales, inline, y HTTPS
style-src 'self' 'unsafe-inline' https:      # Estilos locales, inline, y HTTPS
img-src 'self' data: https:                  # Imágenes locales, data URIs, HTTPS
font-src 'self' data:                        # Fuentes locales y data URIs
connect-src 'self' https:                    # APIs locales y HTTPS
frame-ancestors 'none'                      # No embebible en iframes
```

---

## Detección de Bots

### Regex

```typescript
/bot|crawler|spider|scraper|curl|wget|python|java(?!script)|perl|ruby/i
```

### Bots Detectados (Ejemplos)

- `curl/7.64.1`
- `wget/1.20.3`
- `python-requests/2.28.1`
- `scrapy/2.10.0`
- `googlebot/2.1`
- `bingbot/2.0`

### Personalización

Editar en `middleware.ts`:

```typescript
suspiciousBots: /bot|crawler|spider|scraper|curl|wget|python|java(?!script)|perl|ruby|tupatron/i
```

---

## Logging

### Formato JSON

Cada petición genera un log JSON:

```json
{
  "timestamp": "2026-06-13T14:30:45.123Z",
  "ip": "192.168.1.100",
  "method": "POST",
  "pathname": "/api/users",
  "status": 200,
  "duration": 45,
  "allowed": true,
  "remaining": 87
}
```

### Logs de Seguridad (warnings)

```json
{
  "timestamp": "2026-06-13T14:30:45.123Z",
  "type": "bot-detected",
  "ip": "203.0.113.42",
  "userAgent": "curl/7.64.1",
  "pathname": "/api/users"
}
```

### Monitoreo

Los logs se escriben a `stdout`:

```bash
# Ver logs en tiempo real
pm2 logs victor-ia-app

# Filtrar solo errores de seguridad
journalctl -u victor-ia-app | grep "bot-detected"

# Análisis con jq (JSON Query)
pm2 logs victor-ia-app | jq 'select(.status == 429)'
```

### Integración con Monitoring (Vercel)

Los logs aparecen automáticamente en:
- **Vercel Analytics:** Edge Logs
- **CloudWatch:** Si está configurado
- **ELK Stack:** Si está conectado

---

## Uso en API Routes

### Patrón Básico

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  getClientInfo,
  isSuspiciousBot,
  applySafetyHeaders,
  applyCORSHeaders,
  logSecurityEvent,
  forbiddenResponse,
} from '@/lib/security';

export async function POST(request: NextRequest) {
  const startTime = performance.now();
  const clientInfo = getClientInfo(request);

  // Validar bot
  if (isSuspiciousBot(clientInfo.userAgent)) {
    return forbiddenResponse('Bot access denied');
  }

  // ... lógica de la API ...

  const duration = Math.round(performance.now() - startTime);
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    ip: clientInfo.ip,
    method: clientInfo.method,
    pathname: clientInfo.pathname,
    status: 200,
    duration,
    allowed: true,
  });

  const response = new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

  applySafetyHeaders(response);
  applyCORSHeaders(response, clientInfo.origin);

  return response;
}
```

### Utilidades Disponibles

```typescript
// Extracción de información
getClientIP(request)
getClientInfo(request)

// Validaciones
isSuspiciousBot(userAgent)
isValidOrigin(origin)
isIPBlocked(ip, blockList)
validateBearerToken(request, validTokens)

// Aplicación de headers
applySafetyHeaders(response)
applyCORSHeaders(response, origin)
applyRateLimitHeaders(response, ...)

// Logging
logSecurityEvent(entry)
logSecurityWarning(type, clientInfo)

// Respuestas estándar
forbiddenResponse(reason)
rateLimitedResponse(retryAfter)
unauthorizedResponse(reason)
badRequestResponse(message)

// Validación de payload
isValidContentType(contentType)
parseJSONBody<T>(request)
validateRequestSize(contentLength, maxBytes)

// Sanitización
sanitizeString(input)
sanitizeEmail(email)
isValidURL(url)
```

---

## Testing

### Curl (Verificación Local)

```bash
# Petición exitosa
curl -X POST http://localhost:3000/api/secure-example \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'

# Ver headers de respuesta
curl -i -X POST http://localhost:3000/api/secure-example \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'

# Simulación de bot (será rechazado)
curl -X GET http://localhost:3000/api/secure-example \
  -H "User-Agent: curl/7.64.1"

# Rate limiting (100 peticiones en rápida sucesión)
for i in {1..110}; do
  curl -X GET http://localhost:3000/api/secure-example
done

# Verificar headers de rate limit
curl -i -X GET http://localhost:3000/api/secure-example | grep "X-RateLimit"

# CORS preflight
curl -X OPTIONS http://localhost:3000/api/secure-example \
  -H "Origin: https://victor-ia.com.mx" \
  -H "Access-Control-Request-Method: POST"
```

### Playwright (Testing Automatizado)

```typescript
import { test, expect } from '@playwright/test';

test('API endpoint with rate limit', async ({ request }) => {
  // Petición 1-100: OK
  for (let i = 0; i < 100; i++) {
    const response = await request.get('http://localhost:3000/api/secure-example');
    expect(response.status()).toBe(200);
  }

  // Petición 101: Rate limited
  const rateLimited = await request.get('http://localhost:3000/api/secure-example');
  expect(rateLimited.status()).toBe(429);
  expect(rateLimited.headers()['retry-after']).toBeDefined();
});

test('CORS validation', async ({ request }) => {
  const response = await request.post('http://localhost:3000/api/secure-example', {
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://victor-ia.com.mx',
    },
    data: { message: 'test' },
  });

  expect(response.headers()['access-control-allow-origin']).toBe('https://victor-ia.com.mx');
});

test('Bot detection', async ({ request }) => {
  const response = await request.get('http://localhost:3000/api/secure-example', {
    headers: {
      'User-Agent': 'curl/7.64.1',
    },
  });

  expect(response.status()).toBe(403);
});
```

---

## Mejoras Futuras

### Fase 1 (Inmediato)

- [ ] Migrar rate limiting a Redis para múltiples servidores
- [ ] Agregar dashboard de seguridad en tiempo real
- [ ] Integración con Sentry para error tracking
- [ ] WAF (Web Application Firewall) con Cloudflare

### Fase 2 (1-2 semanas)

- [ ] Detección de ataques DDoS (por patrón de IPs)
- [ ] IP reputation scoring (AbuseIPDB API)
- [ ] Verificación de token JWT centralizado
- [ ] Rate limiting por endpoint (granular)

### Fase 3 (1 mes)

- [ ] Machine Learning para detección de anomalías
- [ ] Integración con OAuth2/OIDC
- [ ] Encriptación de sensitive data en logs
- [ ] Audit trail completamente persistente

---

## Changelog

### v1.0 (2026-06-13)

- ✅ Middleware con rate limiting por IP y usuario
- ✅ CORS whitelist
- ✅ Headers de seguridad HTTP
- ✅ Detección de bots por User-Agent
- ✅ Logging en JSON
- ✅ Ejemplo de API route asegurada
- ✅ Utilidades reutilizables en `lib/security.ts`

---

## Contacto

Para reportar vulnerabilidades de seguridad:
- Email: security@victor-ia.com.mx
- Reporte confidencial: [HackerOne - Victor IA]

Para preguntas técnicas:
- GitHub Issues: [victor-ia-app/issues]
- Slack: #security-engineering
