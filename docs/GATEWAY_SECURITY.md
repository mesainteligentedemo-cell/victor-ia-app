# API Gateway Security Documentation

## Overview

The API Gateway implements the **Proxy Pattern** to mask backend infrastructure, enforce authentication, and sanitize responses. This document outlines the security architecture and threat model.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  Knows only: /api/proxy/stripe, /api/proxy/data, etc            │
│  Never knows: Actual API URLs, keys, backend servers            │
└────────────────┬──────────────────────────────────────────────────┘
                 │ HTTP Request with Bearer Token
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              API GATEWAY (Route: app/api/proxy/.../route.ts)     │
│                                                                   │
│  1. Parse path: /api/proxy/{service}/{endpoint}                 │
│  2. Validate Bearer token (Clerk JWT)                           │
│  3. Check IP whitelist (if configured)                          │
│  4. Check rate limits                                           │
│  5. Inject backend API keys (never forwarded to client)         │
│  6. Forward request to actual backend                           │
│  7. Sanitize response headers                                   │
│  8. Return response to client                                   │
│  9. Audit log (if sensitive operation)                          │
└────────────────┬──────────────────────────────────────────────────┘
                 │ HTTPS Request with Backend Key
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                              │
│  - Stripe API (https://api.stripe.com/v1)                       │
│  - Supabase REST API (https://[project].supabase.co/rest/v1)    │
│  - OpenAI API (https://api.openai.com/v1)                       │
│  - Mailgun API (https://api.mailgun.net/v3)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Features

### 1. URL Masking (Infrastructure Hiding)

**Threat**: Exposing backend API URLs reveals infrastructure details.

**Solution**:
```
Client URL:     /api/proxy/stripe/customers
Backend URL:    https://api.stripe.com/v1/customers
                (hidden from client)
```

**Implementation**:
- Single proxy endpoint routes to all backends
- Client never sees real URLs in logs, errors, or responses
- Backend URLs configured server-side only (.env)

**Benefits**:
- ✅ Reduces reconnaissance attack surface
- ✅ Enables backend URL rotation without client changes
- ✅ Simplifies API versioning strategy
- ✅ Centralizes rate limiting and monitoring

---

### 2. API Key Management

**Threat**: API keys exposed in client code, requests, or responses.

**Solution**:
```
Client Request:
  POST /api/proxy/stripe/customers
  Authorization: Bearer <CLERK_JWT>
  (NO API KEYS in request)

Gateway Internal:
  POST https://api.stripe.com/v1/customers
  Authorization: Basic <base64(STRIPE_SECRET_KEY:)>
  X-Gateway-ID: victor-ia-app
  (KEYS INJECTED server-side only)

Client Response:
  { id: "cus_123abc", email: "..." }
  (NO KEYS in response)
```

**Implementation**:
- API keys stored in server-side `.env` files only
- Keys injected by gateway, never forwarded from client
- Keys never included in responses or logs

**Key Rotation Strategy**:
```
Old Key: sk_test_old_key
↓
1. Add new key to .env (STRIPE_SECRET_KEY=sk_test_new_key)
2. Deploy
3. Update external API to revoke old key
4. No client changes needed
```

---

### 3. Authentication & Authorization

**Threat**: Unauthorized users accessing protected endpoints.

**Solution**:
```
All gateway routes require:
  Authorization: Bearer <CLERK_JWT_TOKEN>
```

**Validation Flow**:
```typescript
1. Extract Bearer token from Authorization header
2. Validate JWT signature using Clerk's public keys
3. Extract userId from JWT claims
4. Check user permissions (if needed)
5. Allow/deny request
```

**Example Configurations**:
```typescript
// Endpoint requiring auth
const config = {
  requireAuth: true,      // Must have valid JWT
  requireAdmin: false,    // Optional: role-based access
  rateLimitPerMinute: 100
};

// Admin-only endpoint (future)
const adminConfig = {
  requireAuth: true,
  requireAdmin: true,
  rateLimitPerMinute: 1000
};
```

---

### 4. Rate Limiting

**Threat**: DoS attacks, resource exhaustion, cost overruns.

**Solution**:
```
Per user, per service rate limits:
  - Stripe: 100 req/min
  - Supabase: 1000 req/min
  - OpenAI: 500 req/min
  - Mailgun: 50 req/min
```

**Implementation** (in-memory for single server):
```typescript
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string, service: string, limit: number): boolean {
  const key = `${userId}:${service}`;  // Independent per service
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (entry.count >= limit) {
    return false;  // Rate limit exceeded
  }

  entry.count++;
  return true;
}
```

**For Production** (Redis-based):
```typescript
// Use Redis instead of in-memory map
// Enables rate limiting across multiple servers
// Example with Redis:
const redis = new Redis();

async function checkRateLimit(userId: string, service: string, limit: number): Promise<boolean> {
  const key = `ratelimit:${userId}:${service}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60);  // Reset after 60 seconds
  }

  return count <= limit;
}
```

**Response on Rate Limit**:
```
HTTP 429 Too Many Requests
Retry-After: 60
```

---

### 5. IP Whitelist (Optional)

**Threat**: Requests from untrusted networks.

**Solution**:
```env
# In production, restrict to internal networks
GATEWAY_IP_WHITELIST=10.0.0.0/8,172.16.0.0/12,203.0.113.50
```

**Implementation**:
```typescript
function validateIPWhitelist(req: NextRequest): boolean {
  const whitelist = process.env.GATEWAY_IP_WHITELIST?.split(',') || [];
  if (whitelist.length === 0) return true;  // No whitelist = allow all

  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   req.headers.get('x-real-ip') ||
                   req.ip;

  return whitelist.includes(clientIP);
}
```

**Common IP Ranges**:
- `10.0.0.0/8` - Private network
- `172.16.0.0/12` - Private network
- `192.168.0.0/16` - Private network
- `203.0.113.50` - Specific IP

---

### 6. Response Header Sanitization

**Threat**: Information disclosure through response headers.

**Vulnerable Headers**:
```
X-Powered-By: Express
Server: nginx/1.24.0
X-AspNet-Version: 4.0.30319
X-Runtime-Version: 1.8.5
X-Backend-Server: backend-api-5
X-Internal-Id: 12345
X-Real-IP: 10.0.0.1
```

**Solution** - Sanitize and add security headers:
```typescript
const SENSITIVE_RESPONSE_HEADERS = [
  'x-powered-by',
  'server',
  'x-aspnet-version',
  'x-runtime-version',
  'x-backend-server',
  'x-internal-id',
  'x-real-ip',
  'x-forwarded-for',
];

function sanitizeResponseHeaders(headers: Headers): Headers {
  const sanitized = new Headers(headers);

  SENSITIVE_RESPONSE_HEADERS.forEach((header) => {
    sanitized.delete(header);
  });

  // Add security headers
  sanitized.set('X-Content-Type-Options', 'nosniff');
  sanitized.set('X-Frame-Options', 'DENY');
  sanitized.set('X-XSS-Protection', '1; mode=block');

  return sanitized;
}
```

**Safe Response Headers**:
```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

### 7. Audit Logging

**Threat**: Unauthorized or suspicious activity goes undetected.

**Solution**:
```typescript
async function auditLog(
  userId: string,
  service: string,
  endpoint: string,
  method: string,
  statusCode: number,
  isSensitive: boolean
): Promise<void> {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId,
    service,
    endpoint,
    method,
    statusCode,
    gatewayId: process.env.GATEWAY_ID,
  };

  // Log sensitive operations
  if (isSensitive) {
    console.log('AUDIT_LOG:', JSON.stringify(logEntry));
    // TODO: Send to audit service
  }
}
```

**Sensitive Operations Logged**:
```typescript
const SENSITIVE_ENDPOINTS = [
  /^stripe\/charges\/.+\/refund/,
  /^stripe\/customers\/.+\/delete/,
  /^data\/users\/.+/,
  /^ai\/models\/.+\/(delete|update)/,
];
```

**Audit Log Example**:
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "userId": "user_abc123",
  "service": "stripe",
  "endpoint": "charges/ch_123abc/refund",
  "method": "POST",
  "statusCode": 200,
  "gatewayId": "victor-ia-app-prod"
}
```

**Audit Log Best Practices**:
- ✅ Store in immutable audit database
- ✅ Send to secure logging service (CloudWatch, Datadog, etc.)
- ✅ Implement log retention policies (90 days+)
- ✅ Set up alerts for suspicious patterns
- ✅ Regular audit log reviews

---

## Threat Model

### Threat 1: Backend Infrastructure Reconnaissance

**Attack**: Attacker discovers backend APIs by examining network traffic.

**Mitigation**:
- URL masking: Client never sees real backend URLs
- Infrastructure details removed from error messages
- IP addresses removed from response headers
- Example: Client calls `/api/proxy/stripe/customers`, not `https://api.stripe.com/v1/customers`

---

### Threat 2: API Key Theft

**Attack**: Attacker extracts API keys from client code or network traffic.

**Mitigation**:
- Keys stored server-side only (.env files)
- Keys injected by gateway, never forwarded from client
- Keys never included in responses or logs
- Separate keys per environment (dev, staging, prod)
- Regular key rotation

---

### Threat 3: Unauthorized Access

**Attack**: Attacker makes requests without authentication.

**Mitigation**:
- All routes require Bearer token (Clerk JWT)
- Token validated server-side
- Token signature verified
- User extracted from token claims

---

### Threat 4: Rate Limit Bypass

**Attack**: Attacker floods endpoint with requests, causing DoS.

**Mitigation**:
- Per-user rate limits (100-1000 req/min)
- Per-service rate limits
- 60-second reset window
- Progressive backoff recommended

---

### Threat 5: Man-in-the-Middle Attack

**Attack**: Attacker intercepts requests between gateway and backend.

**Mitigation**:
- HTTPS only (enforced by Next.js)
- TLS certificate verification
- Optional mTLS for highly sensitive services
- Internal network isolation (if on VPC)

---

### Threat 6: Information Disclosure

**Attack**: Attacker extracts infrastructure details from response headers.

**Mitigation**:
- Sensitive headers removed
- Security headers added
- Error messages generic (no stack traces in production)
- Backend URLs never exposed

---

### Threat 7: Privilege Escalation

**Attack**: User with limited permissions accesses admin endpoints.

**Mitigation**:
- Implement `requireAdmin` flag on sensitive endpoints
- Verify user role from Clerk JWT
- Audit all privileged operations
- Example:
```typescript
const adminConfig = {
  requireAuth: true,
  requireAdmin: true,
  rateLimitPerMinute: 1000,
};
```

---

## Security Checklist

### Development Phase
- [ ] API Gateway route created (`app/api/proxy/[...path]/route.ts`)
- [ ] Environment variables documented (`.env.gateway.example`)
- [ ] Gateway client utility created (`lib/gateway/client.ts`)
- [ ] Tests written (`__tests__/api/proxy.test.ts`)
- [ ] Documentation complete

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Rate limits verified for each service
- [ ] IP whitelist configured (if needed)
- [ ] API keys rotated (fresh credentials)
- [ ] Audit logging configured
- [ ] TLS/HTTPS enabled
- [ ] Error handling reviewed
- [ ] Response headers sanitized

### Production
- [ ] Monitoring/alerting configured
- [ ] Rate limit metrics tracked
- [ ] Audit logs stored in secure database
- [ ] Daily log reviews automated
- [ ] Incident response plan documented
- [ ] Key rotation scheduled (monthly)
- [ ] Security headers verified
- [ ] Penetration testing completed

### Ongoing
- [ ] Monthly audit log reviews
- [ ] Quarterly rate limit adjustments
- [ ] Semi-annual security audit
- [ ] Annual penetration testing
- [ ] Key rotation (every 90 days)

---

## Configuration Best Practices

### Development (.env.local)
```
GATEWAY_ID=victor-ia-app-dev
GATEWAY_IP_WHITELIST=          # Allow all IPs
STRIPE_RATE_LIMIT=100
SUPABASE_RATE_LIMIT=1000
OPENAI_RATE_LIMIT=500
MAIL_RATE_LIMIT=50
AUDIT_LOG_ENABLED=false        # Verbose logging
NODE_ENV=development
```

### Staging (.env.staging)
```
GATEWAY_ID=victor-ia-app-staging
GATEWAY_IP_WHITELIST=203.0.113.50  # Staging server IP
STRIPE_RATE_LIMIT=500
SUPABASE_RATE_LIMIT=5000
OPENAI_RATE_LIMIT=2000
MAIL_RATE_LIMIT=250
AUDIT_LOG_ENABLED=true
NODE_ENV=staging
```

### Production (.env.production)
```
GATEWAY_ID=victor-ia-app-prod
GATEWAY_IP_WHITELIST=10.0.0.0/8,172.16.0.0/12,203.0.113.50
STRIPE_RATE_LIMIT=1000
SUPABASE_RATE_LIMIT=5000
OPENAI_RATE_LIMIT=2000
MAIL_RATE_LIMIT=500
AUDIT_LOG_ENABLED=true
AUDIT_LOG_WEBHOOK=https://audit.victor-ia.com/log
NODE_ENV=production
```

---

## Monitoring & Alerting

### Key Metrics

1. **Rate Limit Hits**
   ```
   Alert: If >10% of requests hit rate limit
   Action: Review and adjust limits
   ```

2. **Failed Authentications**
   ```
   Alert: If >5 401s in 5 minutes from same IP
   Action: Investigate potential attack
   ```

3. **Backend Errors (5xx)**
   ```
   Alert: If backend returns 5xx
   Action: Check backend service status
   ```

4. **Sensitive Operations**
   ```
   Log: All refunds, deletions, writes
   Alert: If unusual pattern detected
   ```

---

## Troubleshooting

### 401 Unauthorized
```
Root Cause: Invalid/expired token
Fix: Request new token, verify Clerk integration
```

### 429 Rate Limited
```
Root Cause: Exceeded per-user rate limit
Fix: Wait 60 seconds, implement exponential backoff
```

### 403 Forbidden (IP Whitelist)
```
Root Cause: IP not whitelisted
Fix: Add IP to GATEWAY_IP_WHITELIST
```

### 500 Gateway Error
```
Root Cause: Backend service down or misconfigured
Fix: Check backend health, verify environment variables
```

---

## References

- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Next.js Security Best Practices](https://nextjs.org/docs/basic-features/data-fetching/security)
- [Clerk Authentication](https://clerk.com/docs)
- [Stripe API Security](https://stripe.com/docs/security)
