# Webhook Security - Quick Start Guide

Production-ready webhook signing with HMAC-SHA256, anti-replay protection, and timestamp validation.

## 5-Minute Setup

### 1. Configure Environment

```bash
# Generate a strong secret (run once)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local
WEBHOOK_SECRET="your-generated-secret-here"
```

### 2. Endpoint is Ready

The webhook endpoint is already implemented at:
- **POST** `/api/webhooks` - Receive signed webhooks
- **GET** `/api/webhooks` - Health check

### 3. Send Your First Webhook

**Option A: Using WebhookClient (Recommended)**

```typescript
import { WebhookClient } from '@/lib/security';

const client = new WebhookClient(
  'https://your-app.vercel.app/api/webhooks',
  process.env.WEBHOOK_SECRET!
);

const result = await client.send({
  type: 'user.created',
  data: { id: '123', email: 'user@example.com' }
});

console.log(result); // { success: true, signature: "...", ... }
```

**Option B: Using cURL**

```bash
#!/bin/bash

ENDPOINT="https://your-app.vercel.app/api/webhooks"
SECRET="your-webhook-secret"

NONCE=$(node -e "console.log(require('crypto').randomUUID())")
TIMESTAMP=$(node -e "console.log(new Date().toISOString())")

PAYLOAD='{"type":"user.created","data":{"id":"123"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.*= //')

curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"payload\":$PAYLOAD,\"signature\":\"$SIGNATURE\",\"nonce\":\"$NONCE\",\"timestamp\":\"$TIMESTAMP\"}"
```

## What's Protected

✓ **Signature** - HMAC-SHA256 validates payload integrity  
✓ **Timestamp** - Rejects requests older than 5 minutes  
✓ **Nonce** - Prevents replay attacks (each request unique)  
✓ **Timing** - Safe string comparison prevents timing attacks  

## Supported Event Types

The endpoint handles these event types:

```
user.created, user.updated
generation.complete
agent.execution
project.completed
payment.received
prospect.created
test
```

Extend in `app/api/webhooks/route.ts` → `processWebhookPayload()` function.

## Verify It Works

### Health Check
```bash
curl https://your-app.vercel.app/api/webhooks

# Response:
# {
#   "status": "ok",
#   "message": "Webhook endpoint is running",
#   "endpoint": "/api/webhooks",
#   "method": "POST",
#   "timestamp": "2024-06-13T15:30:45.123Z"
# }
```

### Test Webhook
```bash
node -e "
const { signWebhookPayload, generateNonce } = require('./lib/security/webhook-signing');
const payload = { type: 'test', data: { msg: 'Hello' } };
const sig = signWebhookPayload(payload, process.env.WEBHOOK_SECRET);
const nonce = generateNonce();
console.log(JSON.stringify({
  payload,
  signature: sig,
  nonce,
  timestamp: new Date().toISOString()
}, null, 2));
"
```

## Error Responses

| Error | Code | Meaning |
|-------|------|---------|
| Invalid signature | `INVALID_SIGNATURE` | Payload was tampered with |
| Timestamp out of range | `TIMESTAMP_OUT_OF_RANGE` | Request too old (>5 min) |
| Nonce already used | `NONCE_REPLAY_DETECTED` | Same request sent twice |
| Invalid structure | `INVALID_STRUCTURE` | Missing payload/signature/nonce/timestamp |

## Testing

### Run Test Suite
```bash
npm test -- lib/security/webhook-signing.test.ts
```

### Manual Test
```bash
# 1. Start dev server
npm run dev

# 2. In another terminal, send test webhook
bash examples/webhook-test.sh
```

## Monitoring

Check logs for webhook activity:

```
[INFO] Webhook: Processed successfully {
  type: "user.created",
  nonce: "f3a2c1d4-...",
  duration: "42ms"
}

[WARN] Webhook: Validation failed {
  error: "Invalid signature",
  nonce: "f3a2c1d4"
}
```

## Key Files

```
lib/security/
├── webhook-signing.ts       ← Core library
├── webhook-client.ts        ← Client helper
├── webhook-signing.test.ts  ← Tests
└── index.ts                 ← Exports

app/api/webhooks/
└── route.ts                 ← Endpoint

Documentation:
├── WEBHOOK-SIGNING-EXAMPLES.md      ← Detailed examples
├── WEBHOOK-SECURITY-QUICKSTART.md   ← This file
└── .env.security.example             ← Config reference
```

## Common Tasks

### Handle a New Event Type

Edit `app/api/webhooks/route.ts`:

```typescript
// In processWebhookPayload() function:
case 'my.custom.event':
  logger.info('Webhook: My custom event', { data: data?.id });
  return { success: true, message: 'Custom event processed' };
```

### Increase Request Timeout

In `validateWebhookRequest()` call, change first number:

```typescript
const validation = validateWebhookRequest(
  webhookRequest,
  WEBHOOK_SECRET,
  600,  // ← Changed from 300 (5 min) to 600 (10 min)
  300
);
```

### Debug Validation Issues

Enable verbose logging:

```typescript
// In route.ts
logger.warn('Webhook: Validation failed', {
  error: validation.error,
  nonce: webhookRequest.nonce,        // ← Log full nonce
  payload: webhookRequest.payload,    // ← Log payload
  signature: webhookRequest.signature // ← Log signature
});
```

### Scale to Multiple Servers

Replace in-memory nonce store with Redis:

```typescript
// lib/security/webhook-signing.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

function validateNonce(nonce: string, expirySeconds = 300): boolean {
  const exists = redis.getdel(nonce);
  if (exists) return false; // Replay detected
  redis.setex(nonce, expirySeconds, '1');
  return true;
}
```

## Security Checklist

Before deploying to production:

- [ ] Set strong `WEBHOOK_SECRET` (32+ chars, random)
- [ ] Use HTTPS only (not HTTP)
- [ ] Review `.env.local` has secret (never commit)
- [ ] Test signature validation with curl
- [ ] Run full test suite: `npm test`
- [ ] Check logs for validation errors
- [ ] Set up monitoring/alerts for failures
- [ ] Document custom event types
- [ ] Test with real webhook sender service

## Support Files

- **Examples**: [WEBHOOK-SIGNING-EXAMPLES.md](WEBHOOK-SIGNING-EXAMPLES.md)
- **Full Docs**: [WEBHOOK-SIGNING-EXAMPLES.md](WEBHOOK-SIGNING-EXAMPLES.md)
- **Configuration**: [.env.security.example](.env.security.example)
- **Tests**: [lib/security/webhook-signing.test.ts](lib/security/webhook-signing.test.ts)

## Next Steps

1. ✓ Set `WEBHOOK_SECRET` in `.env.local`
2. ✓ Test with `npm test`
3. ✓ Send first webhook with WebhookClient or cURL
4. ✓ Check logs for "Webhook: Processed successfully"
5. ✓ Deploy to production with same secret
6. ✓ Set up monitoring for webhook health

Done! Your webhooks are now production-ready with enterprise-grade security.
