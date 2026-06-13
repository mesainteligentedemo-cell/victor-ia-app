# API Gateway — Proxy Pattern Implementation

A production-ready API Gateway that masks backend infrastructure, validates authentication, enforces rate limits, and sanitizes responses.

## Overview

The API Gateway implements the **Proxy Pattern** to provide a secure, centralized entry point for all external API calls.

### Key Benefits

✅ **Infrastructure Hiding** — Client never sees real API URLs (e.g., `api.stripe.com`)
✅ **API Key Protection** — Secret keys remain server-side, never exposed to client
✅ **Authentication** — All requests require valid Clerk JWT token
✅ **Rate Limiting** — Per-user, per-service limits (prevent abuse)
✅ **Header Sanitization** — Removes infrastructure details (X-Powered-By, Server, etc.)
✅ **Audit Logging** — Tracks sensitive operations (refunds, deletes, etc.)
✅ **Centralized Control** — Rotate APIs, adjust limits, or change backends without client changes

---

## Architecture

```
┌─────────────────┐
│  Client App     │
│  (Browser/JS)   │
└────────┬────────┘
         │
         │ POST /api/proxy/stripe/customers
         │ Authorization: Bearer <JWT>
         │
┌────────▼──────────────────────────┐
│     API GATEWAY                    │
│  (app/api/proxy/.../route.ts)      │
│                                     │
│  1. Parse path                     │
│  2. Validate token                 │
│  3. Check rate limit               │
│  4. Inject API keys                │
│  5. Forward to backend             │
│  6. Sanitize response              │
│  7. Audit log                      │
└────────┬──────────────────────────┘
         │
         │ POST https://api.stripe.com/v1/customers
         │ Authorization: Basic <base64(key:)>
         │
┌────────▼─────────────────────────┐
│  EXTERNAL API                     │
│  (Stripe, Supabase, OpenAI, etc)  │
└───────────────────────────────────┘
```

---

## Files Included

### Route Handler
- **`app/api/proxy/[...path]/route.ts`** — Main gateway implementation
  - Parses dynamic paths: `/api/proxy/{service}/{endpoint}`
  - Validates authentication & rate limits
  - Injects backend API keys
  - Sanitizes response headers
  - Audits sensitive operations

### Client Library
- **`lib/gateway/client.ts`** — Type-safe client for calling proxied APIs
  - Simple methods: `.stripe()`, `.data()`, `.ai()`, `.mail()`
  - Error handling with custom `GatewayError`
  - Can be used client-side or server-side

### Type Definitions
- **`lib/gateway/types.ts`** — TypeScript types for all services
  - `Stripe.*` — Stripe types (Customer, Charge, etc.)
  - `Supabase.*` — Supabase types (User, etc.)
  - `OpenAI.*` — OpenAI types (ChatCompletionResponse, etc.)
  - `Mailgun.*` — Mailgun types (SendEmailRequest, etc.)
  - Custom error classes (`GatewayError`, `RateLimitError`, etc.)

### Tests
- **`__tests__/api/proxy.test.ts`** — Comprehensive test suite
  - URL masking tests
  - Authentication tests
  - Header sanitization tests
  - Rate limiting tests
  - IP whitelist tests
  - Service routing tests
  - Audit logging tests

### Configuration
- **`.env.gateway.example`** — Environment variable template
  - Backend URLs
  - Rate limit settings
  - IP whitelist configuration
  - Audit log settings

### Documentation
- **`docs/GATEWAY_README.md`** — This file
- **`docs/GATEWAY_QUICKSTART.md`** — Get started in 5 minutes
- **`docs/GATEWAY_EXAMPLES.md`** — curl and TypeScript examples
- **`docs/GATEWAY_SECURITY.md`** — Deep dive into security architecture

---

## Quick Start

### 1. Configure Environment

```bash
cp .env.gateway.example .env.local
```

Edit `.env.local` and set your backend URLs (optional, defaults provided):

```env
STRIPE_API_BACKEND=https://api.stripe.com/v1
SUPABASE_BACKEND=https://your-project.supabase.co/rest/v1
OPENAI_API_BACKEND=https://api.openai.com/v1
MAIL_API_BACKEND=https://api.mailgun.net/v3

GATEWAY_ID=victor-ia-app-dev
GATEWAY_IP_WHITELIST=  # Leave empty to allow all IPs
```

### 2. Use the Gateway Client

```typescript
import { gatewayClient } from '@/lib/gateway/client';

// Stripe
const customer = await gatewayClient.stripe('customers', 'POST', {
  email: 'user@example.com',
  name: 'John Doe',
});

// Supabase
const users = await gatewayClient.data('users', 'GET', undefined, {
  select: 'id,email',
  limit: 10,
});

// OpenAI
const completion = await gatewayClient.ai('chat/completions', 'POST', {
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 100,
});

// Mailgun
const email = await gatewayClient.mail('messages', 'POST', {
  from: 'noreply@victor-ia.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  text: 'Welcome to Victor IA',
});
```

### 3. Test with curl

```bash
# Get a Clerk JWT token
CLERK_JWT="your_token_here"

# Create a Stripe customer
curl -X POST http://localhost:3000/api/proxy/stripe/customers \
  -H "Authorization: Bearer $CLERK_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

---

## Supported Services

### Stripe
```
Endpoint: /api/proxy/stripe/{endpoint}
Backend: https://api.stripe.com/v1
Rate Limit: 100 req/min per user
Audit Log: Yes (sensitive operations)
Examples:
  - POST /api/proxy/stripe/customers
  - GET /api/proxy/stripe/customers/cus_123
  - POST /api/proxy/stripe/charges/ch_123/refund
```

### Supabase REST API
```
Endpoint: /api/proxy/data/{table}
Backend: https://[project].supabase.co/rest/v1
Rate Limit: 1000 req/min per user
Audit Log: No
Examples:
  - GET /api/proxy/data/users?select=id,email
  - POST /api/proxy/data/users
  - PUT /api/proxy/data/users?id=eq.123
  - DELETE /api/proxy/data/users?id=eq.123
```

### OpenAI/Anthropic
```
Endpoint: /api/proxy/ai/{endpoint}
Backend: https://api.openai.com/v1
Rate Limit: 500 req/min per user
Audit Log: No
Examples:
  - POST /api/proxy/ai/chat/completions
  - GET /api/proxy/ai/models
```

### Mailgun
```
Endpoint: /api/proxy/mail/{endpoint}
Backend: https://api.mailgun.net/v3
Rate Limit: 50 req/min per user
Audit Log: Yes (sensitive operations)
Examples:
  - POST /api/proxy/mail/messages
  - GET /api/proxy/mail/bounces
```

---

## Security Features

### 1. URL Masking
Client calls `/api/proxy/stripe/customers`, but the actual request goes to `https://api.stripe.com/v1/customers`. The real backend URL is never exposed to the client.

### 2. API Key Injection
API keys are stored server-side and injected by the gateway. The client never sees any keys:
- Request: `POST /api/proxy/stripe/customers` (no keys)
- Gateway adds: `Authorization: Basic base64(key:)`
- Response: Client gets clean JSON, no keys exposed

### 3. Authentication
All routes require a valid Clerk JWT token in the `Authorization` header.

### 4. Rate Limiting
Per-user, per-service rate limits prevent abuse:
- Stripe: 100 req/min
- Supabase: 1000 req/min
- OpenAI: 500 req/min
- Mailgun: 50 req/min

### 5. Header Sanitization
Sensitive response headers are removed:
- ❌ `X-Powered-By`
- ❌ `Server`
- ❌ `X-AspNet-Version`
- ❌ `X-Backend-Server`
- ✅ Safe headers only

### 6. Audit Logging
Sensitive operations are logged server-side:
- Stripe refunds
- Stripe customer deletions
- Database record modifications
- Email sending

### 7. IP Whitelist (Optional)
Restrict access to specific IP ranges:
```env
GATEWAY_IP_WHITELIST=10.0.0.0/8,203.0.113.50
```

---

## Error Handling

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```
**Fix**: Provide valid Clerk JWT token

### 429 Rate Limited
```json
{
  "error": "Rate limit exceeded"
}
```
Header: `Retry-After: 60`  
**Fix**: Wait 60 seconds and retry

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "IP address not whitelisted"
}
```
**Fix**: Add your IP to `GATEWAY_IP_WHITELIST`

### 404 Service Not Found
```json
{
  "error": "Service not found",
  "message": "Service \"unknown\" is not available"
}
```
**Fix**: Use one of: `stripe`, `data`, `ai`, `mail`

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error details (development only)"
}
```
**Fix**: Check server logs, verify backend is online

---

## Response Header Security

### Before Gateway (Exposed)
```
X-Powered-By: Express
Server: nginx/1.24.0
X-AspNet-Version: 4.0.30319
X-Backend-Server: backend-api-5
X-Internal-Id: 12345
```

### After Gateway (Safe)
```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Rate limits adjusted for your usage
- [ ] IP whitelist configured (if needed)
- [ ] API keys rotated
- [ ] HTTPS enforced
- [ ] Error handling reviewed
- [ ] Response headers sanitized
- [ ] Audit logging configured
- [ ] Monitoring/alerting set up
- [ ] Penetration testing completed

---

## Configuration Examples

### Development
```env
GATEWAY_ID=victor-ia-app-dev
GATEWAY_IP_WHITELIST=
STRIPE_RATE_LIMIT=100
SUPABASE_RATE_LIMIT=1000
OPENAI_RATE_LIMIT=500
MAIL_RATE_LIMIT=50
AUDIT_LOG_ENABLED=false
NODE_ENV=development
```

### Production
```env
GATEWAY_ID=victor-ia-app-prod
GATEWAY_IP_WHITELIST=10.0.0.0/8,203.0.113.50
STRIPE_RATE_LIMIT=1000
SUPABASE_RATE_LIMIT=5000
OPENAI_RATE_LIMIT=2000
MAIL_RATE_LIMIT=500
AUDIT_LOG_ENABLED=true
AUDIT_LOG_WEBHOOK=https://audit.victor-ia.com/log
NODE_ENV=production
```

---

## Testing

Run the test suite:
```bash
npm test -- __tests__/api/proxy.test.ts
```

Test coverage includes:
- URL masking
- Authentication
- Rate limiting
- Header sanitization
- IP whitelist
- Service routing
- Audit logging
- Error handling

---

## Monitoring

### Key Metrics
- **Rate limit hits**: If >10%, adjust limits
- **Failed authentications**: If >5 in 5 min, investigate
- **Backend errors**: If 5xx, check backend status
- **Audit logs**: Review sensitive operations daily

### Example Metrics
```
Rate Limits Hit: 2.3% (acceptable)
Auth Failures: 0.1% (normal)
Backend 5xx: 0.01% (healthy)
Audit Events: 156 today (normal)
```

---

## Troubleshooting

### Gateway returning 500 errors
1. Check backend service is online
2. Verify environment variables are set
3. Check server logs for error details
4. Enable debug mode (development)

### Rate limiting too strict
1. Increase limits in `.env`
2. Check current usage patterns
3. Implement Redis-based limiting for production

### API keys not being injected
1. Verify keys are in `.env`
2. Check backend is using correct auth format
3. Test with curl to isolate issue

---

## Advanced Usage

### Custom Rate Limits
Edit `lib/gateway/service-config.ts`:
```typescript
const SERVICE_CONFIG = {
  stripe: {
    requireAuth: true,
    rateLimitPerMinute: 1000,  // Increase for high-volume
    auditLog: true,
  },
};
```

### Adding New Services
1. Add backend URL to `.env`
2. Update `BACKEND_ROUTES` in route handler
3. Add service config
4. Update types in `lib/gateway/types.ts`
5. Add tests

### Redis-based Rate Limiting
For multiple servers, use Redis:
```typescript
import Redis from 'redis';

const redis = new Redis();

async function checkRateLimit(userId: string, service: string, limit: number) {
  const key = `ratelimit:${userId}:${service}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60);
  }
  return count <= limit;
}
```

---

## Documentation Links

- **[Quick Start](GATEWAY_QUICKSTART.md)** — Get running in 5 minutes
- **[Examples](GATEWAY_EXAMPLES.md)** — curl and TypeScript examples
- **[Security](GATEWAY_SECURITY.md)** — Detailed security architecture
- **[Type Reference](../lib/gateway/types.ts)** — Full TypeScript types

---

## License

Part of the Victor IA App security infrastructure. Internal use only.

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `docs/GATEWAY_SECURITY.md`
3. Check server logs with `NODE_ENV=development`
4. Run tests: `npm test -- __tests__/api/proxy.test.ts`
