# API Gateway — Usage Examples

This document provides curl examples demonstrating how to use the API Gateway proxy pattern.

## Overview

The API Gateway intercepts client requests, validates authorization, rewrites URLs to actual backends, and ensures sensitive infrastructure details remain hidden.

### Key Security Features

- ✅ Bearer token validation (Clerk JWT)
- ✅ URL rewriting (client calls `/api/proxy/stripe/*`, actual call goes to `https://api.stripe.com/v1/*`)
- ✅ IP whitelist enforcement (optional)
- ✅ Rate limiting per user
- ✅ Response header sanitization (no `X-Powered-By`, `Server`, etc.)
- ✅ Audit logging for sensitive operations
- ✅ Internal token injection for backend identification

---

## 1. Stripe API Proxy

### Create a Stripe Customer

**From Client Side (masked infrastructure):**

```bash
curl -X POST https://victor-ia-app.vercel.app/api/proxy/stripe/customers \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "name": "John Doe"
  }'
```

**What the Gateway does internally:**
- Validates the Clerk JWT
- Checks rate limits (100 req/min per user)
- Rewrites the URL from `/api/proxy/stripe/customers` → `https://api.stripe.com/v1/customers`
- Adds `X-Gateway-ID: victor-ia-app` header
- Adds `Authorization: Basic <base64(STRIPE_SECRET_KEY:)>` (NOT forwarded to client)
- Makes the actual request to Stripe API
- Removes sensitive response headers before returning to client

**Response (safe for client):**

```json
{
  "id": "cus_123abc",
  "email": "customer@example.com",
  "name": "John Doe",
  "created": 1234567890
}
```

**What the client will NOT see:**
- ❌ Actual Stripe API endpoint (`https://api.stripe.com/v1/...`)
- ❌ Stripe secret key (never exposed, always server-side)
- ❌ X-Powered-By header
- ❌ Server information
- ❌ Any internal infrastructure details

---

### Refund a Charge (Sensitive Operation)

```bash
curl -X POST https://victor-ia-app.vercel.app/api/proxy/stripe/charges/ch_123abc/refund \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000
  }'
```

**Audit Trail (server-side only):**
```
AUDIT_LOG: {
  "timestamp": "2024-01-15T10:30:45.123Z",
  "userId": "user_abc123",
  "service": "stripe",
  "endpoint": "charges/ch_123abc/refund",
  "method": "POST",
  "statusCode": 200,
  "gatewayId": "victor-ia-app-prod"
}
```

---

### Retrieve Customer (Non-sensitive)

```bash
curl -X GET https://victor-ia-app.vercel.app/api/proxy/stripe/customers/cus_123abc \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN"
```

---

## 2. Supabase REST API Proxy

### Query Users Table

**From Client Side:**

```bash
curl -X GET "https://victor-ia-app.vercel.app/api/proxy/data/users?select=id,email,name&limit=10" \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN"
```

**Gateway internally:**
- Rewrites to: `https://[project].supabase.co/rest/v1/users?select=id,email,name&limit=10`
- Injects: `Authorization: Bearer SUPABASE_SERVICE_ROLE_KEY` (NOT forwarded to client)
- Uses service role key for full access (not the limited anon key)

---

### Insert a Record

```bash
curl -X POST https://victor-ia-app.vercel.app/api/proxy/data/users \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "subscription_status": "free"
  }'
```

---

### Update a Record

```bash
curl -X PUT "https://victor-ia-app.vercel.app/api/proxy/data/users?id=eq.user123" \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_status": "pro",
    "credits": 1000
  }'
```

---

## 3. OpenAI/Anthropic API Proxy

### Create a Chat Completion

```bash
curl -X POST https://victor-ia-app.vercel.app/api/proxy/ai/chat/completions \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "max_tokens": 100
  }'
```

**Gateway rewrites to:**
- `https://api.openai.com/v1/chat/completions`
- Injects: `Authorization: Bearer $OPENAI_API_KEY` (NOT forwarded)

---

### List Available Models

```bash
curl -X GET https://victor-ia-app.vercel.app/api/proxy/ai/models \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN"
```

---

## 4. Email Service Proxy (Mailgun)

### Send Email

```bash
curl -X POST https://victor-ia-app.vercel.app/api/proxy/mail/messages \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@victor-ia.com",
    "to": "user@example.com",
    "subject": "Welcome!",
    "text": "Welcome to Victor IA"
  }'
```

---

## 5. Rate Limiting

### Exceeding Rate Limit

After 100 Stripe requests in a minute:

```bash
curl -X POST https://victor-ia-app.vercel.app/api/proxy/stripe/customers \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (429):**
```json
{
  "error": "Rate limit exceeded"
}
```

**Headers:**
```
Retry-After: 60
```

---

## 6. Authentication Failures

### Missing Authorization Header

```bash
curl -X GET https://victor-ia-app.vercel.app/api/proxy/stripe/customers/cus_123
```

**Response (401):**
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

---

### Invalid Token

```bash
curl -X GET https://victor-ia-app.vercel.app/api/proxy/stripe/customers/cus_123 \
  -H "Authorization: Bearer invalid_token"
```

**Response (401):**
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

---

## 7. IP Whitelist (if configured)

### Blocked IP

If `GATEWAY_IP_WHITELIST=203.0.113.50,192.168.1.0/24` is set:

```bash
# Request from 198.51.100.1 (not whitelisted)
curl -X GET https://victor-ia-app.vercel.app/api/proxy/stripe/customers/cus_123 \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN"
```

**Response (403):**
```json
{
  "error": "Forbidden",
  "message": "IP address not whitelisted"
}
```

---

## 8. Unknown Service

```bash
curl -X GET https://victor-ia-app.vercel.app/api/proxy/unknown-service/endpoint \
  -H "Authorization: Bearer $CLERK_JWT_TOKEN"
```

**Response (404):**
```json
{
  "error": "Service not found",
  "message": "Service \"unknown-service\" is not available"
}
```

---

## JavaScript/TypeScript Client Usage

### Using the Gateway Client

```typescript
import { gatewayClient } from '@/lib/gateway/client';

// Stripe
const customer = await gatewayClient.stripe('customers', 'POST', {
  email: 'user@example.com',
  name: 'John Doe',
});

// Supabase
const users = await gatewayClient.data('users', 'GET', undefined, {
  select: 'id,email,name',
  limit: 10,
});

// OpenAI
const completion = await gatewayClient.ai('chat/completions', 'POST', {
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 100,
});

// Email
const sent = await gatewayClient.mail('messages', 'POST', {
  from: 'noreply@victor-ia.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  text: 'Welcome to Victor IA',
});
```

### Error Handling

```typescript
try {
  const result = await gatewayClient.stripe('customers', 'POST', {
    email: 'user@example.com',
  });
  console.log('Customer created:', result.data);
} catch (error) {
  if (error instanceof GatewayError) {
    console.error(`Gateway error (${error.statusCode}):`, error.data);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Response Header Security

### Before Gateway (exposed details)

```
X-Powered-By: Express
Server: nginx/1.24.0
X-AspNet-Version: 4.0.30319
X-Runtime-Version: 1.8.5
X-Backend-Server: backend-api-5
X-Internal-Id: 12345
```

### After Gateway (sanitized)

```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## Environment Configuration

### Development (.env.local)

```
# No IP whitelist, all requests allowed
GATEWAY_IP_WHITELIST=

# Lower rate limits for testing
STRIPE_RATE_LIMIT=100
SUPABASE_RATE_LIMIT=1000
OPENAI_RATE_LIMIT=500
MAIL_RATE_LIMIT=50
```

### Production (.env.production.local)

```
# Restrict to internal IPs only
GATEWAY_IP_WHITELIST=10.0.0.0/8,172.16.0.0/12,203.0.113.50

# Higher rate limits
STRIPE_RATE_LIMIT=1000
SUPABASE_RATE_LIMIT=5000
OPENAI_RATE_LIMIT=2000
MAIL_RATE_LIMIT=500

# Enable audit logging
AUDIT_LOG_ENABLED=true
AUDIT_LOG_WEBHOOK=https://audit.victor-ia.com/log
```

---

## Monitoring & Debugging

### Check Rate Limit Status

The Gateway stores rate limit state in memory (for production, use Redis):

```typescript
// In development, you can see rate limit resets in console
// Each user:service combination gets 60 seconds to reset
```

### View Audit Logs

Sensitive operations are logged to console in server output:

```
AUDIT_LOG: {"timestamp":"2024-01-15T10:30:45.123Z","userId":"user_abc123","service":"stripe","endpoint":"charges/ch_123abc/refund","method":"POST","statusCode":200,"gatewayId":"victor-ia-app-prod"}
```

### Debug Mode (Development)

Set `NODE_ENV=development` to see error details in responses:

```json
{
  "error": "Internal server error",
  "message": "Error details here..."
}
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Rotate API keys** regularly
3. **Use IP whitelisting** for internal services
4. **Monitor rate limits** and adjust based on usage patterns
5. **Enable audit logging** for sensitive operations
6. **Sanitize response headers** (already handled by Gateway)
7. **Validate input** on both client and server sides
8. **Use short-lived tokens** for API authentication
9. **Implement request signing** for additional security
10. **Log all gateway requests** to audit trail

---

## Troubleshooting

### 401 Unauthorized

- Verify Clerk JWT is valid
- Check if token has expired
- Ensure Authorization header format: `Bearer <token>`

### 429 Rate Limited

- Wait 60 seconds before retrying
- Implement exponential backoff
- Consider upgrading rate limits in production

### 500 Internal Server Error

- Check backend service status
- Verify environment variables are set
- Enable debug mode to see error details
- Check server logs for proxy errors

### 404 Service Not Found

- Verify service name is correct (stripe, data, ai, mail)
- Check BACKEND_ROUTES configuration
- Ensure environment variables are set for backend URLs
