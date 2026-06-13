# API Gateway — Quick Start Guide

Get the API Gateway proxy pattern up and running in 5 minutes.

---

## Step 1: Configure Environment Variables

Copy the gateway configuration template:

```bash
cp .env.gateway.example .env.local
```

Edit `.env.local` and add your backend URLs (if different from defaults):

```env
STRIPE_API_BACKEND=https://api.stripe.com/v1
SUPABASE_BACKEND=https://[your-project].supabase.co/rest/v1
OPENAI_API_BACKEND=https://api.openai.com/v1
MAIL_API_BACKEND=https://api.mailgun.net/v3

# Optional: restrict to specific IPs
GATEWAY_IP_WHITELIST=

# Gateway ID for audit logs
GATEWAY_ID=victor-ia-app-dev
```

---

## Step 2: Files Already Created

The following files are ready to use:

- ✅ **Route Handler**: `app/api/proxy/[...path]/route.ts`
  - Handles all proxy requests
  - Validates authentication & rate limits
  - Sanitizes responses

- ✅ **Client Utility**: `lib/gateway/client.ts`
  - Simple interface for making proxied requests
  - Error handling
  - Type-safe

- ✅ **Tests**: `__tests__/api/proxy.test.ts`
  - Security tests
  - Rate limiting tests
  - Header sanitization tests

- ✅ **Documentation**:
  - `docs/GATEWAY_EXAMPLES.md` - Usage examples
  - `docs/GATEWAY_SECURITY.md` - Security architecture
  - `docs/GATEWAY_QUICKSTART.md` - This file

---

## Step 3: Use the Gateway Client

### Stripe Operations

```typescript
import { gatewayClient, GatewayError } from '@/lib/gateway/client';

// Create a customer
try {
  const result = await gatewayClient.stripe('customers', 'POST', {
    email: 'user@example.com',
    name: 'John Doe',
  });

  console.log('Customer created:', result.data.id);
} catch (error) {
  if (error instanceof GatewayError) {
    console.error(`Error (${error.statusCode}):`, error.data);
  }
}
```

### Supabase Operations

```typescript
// Query users
const users = await gatewayClient.data('users', 'GET', undefined, {
  select: 'id,email,name',
  limit: 10,
});

// Insert a record
const newUser = await gatewayClient.data('users', 'POST', {
  email: 'new@example.com',
  name: 'New User',
  subscription_status: 'free',
});

// Update a record
const updated = await gatewayClient.data(
  'users?id=eq.user123',
  'PUT',
  { subscription_status: 'pro' }
);
```

### OpenAI/Anthropic Operations

```typescript
// Create chat completion
const completion = await gatewayClient.ai('chat/completions', 'POST', {
  model: 'gpt-4',
  messages: [
    {
      role: 'user',
      content: 'Hello, how are you?',
    },
  ],
  max_tokens: 100,
});

console.log('Response:', completion.data.choices[0].message.content);
```

### Email Operations

```typescript
// Send email via Mailgun
const email = await gatewayClient.mail('messages', 'POST', {
  from: 'noreply@victor-ia.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  text: 'Welcome to Victor IA',
});

console.log('Email sent:', email.data);
```

---

## Step 4: Test with curl

### Test Stripe Proxy

```bash
# Get your Clerk JWT token first
CLERK_JWT="your_clerk_jwt_token_here"

# Create a customer
curl -X POST http://localhost:3000/api/proxy/stripe/customers \
  -H "Authorization: Bearer $CLERK_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Test Supabase Proxy

```bash
# Query users table
curl -X GET "http://localhost:3000/api/proxy/data/users?select=id,email&limit=5" \
  -H "Authorization: Bearer $CLERK_JWT"
```

### Test OpenAI Proxy

```bash
# Create chat completion
curl -X POST http://localhost:3000/api/proxy/ai/chat/completions \
  -H "Authorization: Bearer $CLERK_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'
```

---

## Step 5: Verify Security

### Check URL Masking

Client calls:
```
POST /api/proxy/stripe/customers
```

Backend receives:
```
POST https://api.stripe.com/v1/customers
```

Client never sees the real URL ✅

### Check API Key Hiding

Response from gateway (safe):
```json
{
  "id": "cus_123abc",
  "email": "user@example.com"
}
```

What client will NOT see:
- ❌ Stripe secret key
- ❌ Backend URL (api.stripe.com)
- ❌ X-Powered-By header
- ❌ Server information

### Check Rate Limiting

Make 101 requests within 60 seconds:

```bash
for i in {1..101}; do
  curl -X POST http://localhost:3000/api/proxy/stripe/customers \
    -H "Authorization: Bearer $CLERK_JWT" \
    -H "Content-Type: application/json" \
    -d '{}' 2>/dev/null | grep -q "Rate limit" && echo "Rate limited after $i requests"
done
```

On request 101, you should see:
```json
{
  "error": "Rate limit exceeded"
}
```

With header:
```
Retry-After: 60
```

---

## Troubleshooting

### 401 Unauthorized

**Problem**: Getting unauthorized errors

**Solution**:
1. Verify Clerk JWT token is valid
2. Check token hasn't expired
3. Verify Authorization header format: `Bearer <token>`

```bash
# Debug: Check token claims
echo $CLERK_JWT | cut -d'.' -f2 | base64 -d | jq .
```

### 404 Service Not Found

**Problem**: Getting 404 for valid endpoint

**Solution**:
1. Verify service name is correct (stripe, data, ai, mail)
2. Check service backend URL in environment:
   ```bash
   echo $STRIPE_API_BACKEND
   ```

### 500 Internal Error

**Problem**: Getting 500 error from gateway

**Solution**:
1. Check server logs for error details
2. Verify backend service is online
3. Check environment variables are set:
   ```bash
   grep -E "STRIPE|SUPABASE|OPENAI" .env.local
   ```

### Rate Limit Too Strict

**Problem**: Hitting rate limits too quickly

**Solution**:
1. Increase limits in `.env.local`:
   ```env
   STRIPE_RATE_LIMIT=500  # Was 100
   SUPABASE_RATE_LIMIT=5000  # Was 1000
   ```
2. Use exponential backoff in client code
3. In production, implement Redis-based rate limiting

---

## Architecture Summary

```
Client
  ↓ POST /api/proxy/stripe/customers
  ↓ Bearer Token (Clerk JWT)
  ↓
API Gateway (app/api/proxy/[...path]/route.ts)
  ✓ Validate token
  ✓ Check rate limit
  ✓ Inject API key
  ↓ POST https://api.stripe.com/v1/customers
  ↓ Authorization: Basic (Stripe Key)
  ↓
Stripe API
  ↓ Response
  ↓
Gateway
  ✓ Sanitize headers (remove X-Powered-By, etc)
  ✓ Log audit trail (if sensitive)
  ↓
Client
  ← JSON response (no keys, no backend URL)
```

---

## Next Steps

1. **Deploy to staging**: Test with real services
2. **Monitor**: Set up alerts for rate limits and errors
3. **Rotate keys**: Schedule monthly key rotation
4. **Scale**: Move rate limiting to Redis for multi-server
5. **Audit**: Set up audit log storage

For detailed security info, see `docs/GATEWAY_SECURITY.md`

For more examples, see `docs/GATEWAY_EXAMPLES.md`
