# Webhook Signing & Anti-Replay Protection

Production-ready webhook authentication using HMAC-SHA256 signatures with cryptographic nonce and timestamp validation.

## Setup

### 1. Environment Configuration

```bash
# .env.local
WEBHOOK_SECRET="your-strong-random-secret-32-chars-min"
```

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Dependencies

All required modules are built-in (no npm packages needed):
- `crypto` - HMAC signing
- `uuid` - Nonce generation
- `next/server` - HTTP handling

## Architecture

### Request/Response Flow

```
Client                          Server
  │                              │
  ├─ Generate nonce (UUID v4)   │
  ├─ Generate timestamp (ISO)   │
  ├─ Sign payload (HMAC-SHA256) │
  │                              │
  └─ POST /api/webhooks ────────→
     {
       payload: {...},
       signature: "hex",
       nonce: "uuid",
       timestamp: "ISO"
     }
     │
     ├─→ ✓ Validate signature
     ├─→ ✓ Validate timestamp (< 5 min)
     ├─→ ✓ Validate nonce (no replay)
     │
     └─ 200 OK ←────────────────
       {
         success: true,
         signature: "echo-sig",
         message: "processed"
       }
```

### Security Layers

| Layer | Method | Protection |
|-------|--------|-----------|
| **Signature** | HMAC-SHA256 | Payload integrity + authentication |
| **Timestamp** | ISO 8601 + validation | Prevents old/stale requests (5 min window) |
| **Nonce** | Cryptographic UUID v4 | Prevents replay attacks |

## Usage Examples

### TypeScript / Node.js

#### Using WebhookClient (Recommended)

```typescript
import { WebhookClient } from '@/lib/security/webhook-client';

const client = new WebhookClient(
  'https://api.example.com/api/webhooks',
  'your-webhook-secret',
  {
    timeout: 10000,
    retries: 3,
    onError: (error, attempt) => {
      console.log(`Attempt ${attempt} failed:`, error.message);
    }
  }
);

// Send single webhook
const result = await client.send({
  type: 'user.created',
  data: {
    id: '123',
    email: 'user@example.com',
    name: 'John Doe'
  }
});

console.log(result);
// {
//   success: true,
//   signature: "...",
//   message: "User created event processed",
//   statusCode: 200
// }

// Send multiple webhooks in parallel
const results = await client.sendBatch([
  { type: 'user.created', data: { id: '1' } },
  { type: 'user.updated', data: { id: '2' } },
  { type: 'generation.complete', data: { id: '3' } }
]);
```

#### Manual Signing

```typescript
import {
  generateNonce,
  signWebhookPayload
} from '@/lib/security/webhook-signing';

const payload = {
  type: 'user.created',
  data: { id: '123' }
};

const nonce = generateNonce();
const timestamp = new Date().toISOString();
const signature = signWebhookPayload(payload, 'your-secret');

const request = {
  payload,
  signature,
  nonce,
  timestamp
};

const response = await fetch('https://api.example.com/api/webhooks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});

const data = await response.json();
console.log(data);
```

### cURL Examples

#### 1. Basic User Event

```bash
#!/bin/bash

ENDPOINT="http://localhost:3000/api/webhooks"
SECRET="your-webhook-secret"

# Generate nonce and timestamp
NONCE=$(node -e "console.log(require('crypto').randomUUID())")
TIMESTAMP=$(node -e "console.log(new Date().toISOString())")

# Create payload
PAYLOAD='{"type":"user.created","data":{"id":"123","email":"user@example.com"}}'

# Calculate HMAC-SHA256 signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.*= //')

# Create request body
REQUEST=$(cat <<EOF
{
  "payload": $PAYLOAD,
  "signature": "$SIGNATURE",
  "nonce": "$NONCE",
  "timestamp": "$TIMESTAMP"
}
EOF
)

# Send webhook
curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$REQUEST"
```

#### 2. Generation Complete Event

```bash
#!/bin/bash

ENDPOINT="http://localhost:3000/api/webhooks"
SECRET="your-webhook-secret"

NONCE=$(node -e "console.log(require('crypto').randomUUID())")
TIMESTAMP=$(node -e "console.log(new Date().toISOString())")

PAYLOAD='{"type":"generation.complete","data":{"id":"gen-456","status":"complete","url":"https://example.com/video.mp4"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.*= //')

curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"payload\":$PAYLOAD,\"signature\":\"$SIGNATURE\",\"nonce\":\"$NONCE\",\"timestamp\":\"$TIMESTAMP\"}"
```

#### 3. Payment Received Event

```bash
#!/bin/bash

ENDPOINT="http://localhost:3000/api/webhooks"
SECRET="your-webhook-secret"

NONCE=$(node -e "console.log(require('crypto').randomUUID())")
TIMESTAMP=$(node -e "console.log(new Date().toISOString())")

PAYLOAD='{"type":"payment.received","data":{"amount":100.00,"currency":"USD","invoice":"INV-789"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.*= //')

curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"payload\":$PAYLOAD,\"signature\":\"$SIGNATURE\",\"nonce\":\"$NONCE\",\"timestamp\":\"$TIMESTAMP\"}"
```

#### 4. Test Event (for verification)

```bash
#!/bin/bash

ENDPOINT="http://localhost:3000/api/webhooks"
SECRET="your-webhook-secret"

NONCE=$(node -e "console.log(require('crypto').randomUUID())")
TIMESTAMP=$(node -e "console.log(new Date().toISOString())")

PAYLOAD='{"type":"test","data":{"message":"Hello webhook"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | sed 's/^.*= //')

curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"payload\":$PAYLOAD,\"signature\":\"$SIGNATURE\",\"nonce\":\"$NONCE\",\"timestamp\":\"$TIMESTAMP\"}"
```

#### 5. Python Helper Script

```python
#!/usr/bin/env python3
import hmac
import hashlib
import json
import uuid
from datetime import datetime
import requests

ENDPOINT = "http://localhost:3000/api/webhooks"
SECRET = "your-webhook-secret"

def sign_webhook(payload, secret):
    """Generate HMAC-SHA256 signature"""
    payload_str = json.dumps(payload, separators=(',', ':'))
    return hmac.new(
        secret.encode(),
        payload_str.encode(),
        hashlib.sha256
    ).hexdigest()

def send_webhook(payload):
    """Send signed webhook"""
    nonce = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat() + 'Z'
    signature = sign_webhook(payload, SECRET)
    
    request = {
        "payload": payload,
        "signature": signature,
        "nonce": nonce,
        "timestamp": timestamp
    }
    
    response = requests.post(
        ENDPOINT,
        json=request,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response

# Examples
send_webhook({
    "type": "user.created",
    "data": {"id": "123", "email": "user@example.com"}
})

send_webhook({
    "type": "generation.complete",
    "data": {"id": "gen-456", "status": "complete"}
})

send_webhook({
    "type": "payment.received",
    "data": {"amount": 100.00, "currency": "USD"}
})
```

## Error Responses

### Invalid JSON
```json
{
  "error": "Invalid JSON in request body",
  "code": "INVALID_JSON"
}
```

### Invalid Structure
```json
{
  "error": "Invalid request structure. Expected: { payload, signature, nonce, timestamp }",
  "code": "INVALID_STRUCTURE"
}
```

### Invalid Signature
```json
{
  "error": "Invalid signature",
  "code": "INVALID_SIGNATURE"
}
```

### Timestamp Out of Range
```json
{
  "error": "Timestamp outside acceptable range",
  "code": "TIMESTAMP_OUT_OF_RANGE"
}
```

### Nonce Replay Detected
```json
{
  "error": "Nonce already used or invalid",
  "code": "NONCE_REPLAY_DETECTED"
}
```

### Webhook Secret Not Configured
```json
{
  "error": "Webhook signing not configured",
  "code": "WEBHOOK_SECRET_MISSING"
}
```

## Testing

### Run Tests
```bash
npm test -- lib/security/webhook-signing.test.ts
# or
vitest lib/security/webhook-signing.test.ts
```

### Test Coverage
- ✓ HMAC-SHA256 signing consistency
- ✓ Signature verification
- ✓ Timing-safe comparison
- ✓ Nonce uniqueness
- ✓ Nonce replay detection
- ✓ Timestamp validation
- ✓ Clock skew tolerance (±30 seconds)
- ✓ Concurrent request handling
- ✓ Replay attack detection

## Monitoring & Logging

### Successful Webhook
```
[INFO] Webhook: Processed successfully
{
  type: "user.created",
  nonce: "f3a2c1d4-...",
  duration: "42ms"
}
```

### Validation Failure
```
[WARN] Webhook: Validation failed
{
  error: "Invalid signature",
  nonce: "f3a2c1d4"
}
```

## Security Best Practices

### 1. Secret Management
- Use strong, random secrets (32+ characters)
- Rotate secrets periodically
- Never commit secrets to version control
- Store in environment variables or secrets manager

### 2. Transport Security
- Always use HTTPS in production
- Verify SSL certificates
- Use TLS 1.2 or higher

### 3. Rate Limiting
- Implement rate limiting per IP/nonce
- Use exponential backoff on retries
- Monitor for unusual patterns

### 4. Logging
- Log all webhook validations
- Track nonce usage for audit trail
- Alert on repeated failures

### 5. Nonce Management
- Automatic expiry after 5 minutes
- Garbage collection of expired nonces
- Consider Redis for distributed systems

## Production Deployment

### Environment Variables
```bash
# Required
WEBHOOK_SECRET="your-production-secret-32chars"

# Optional (defaults shown)
WEBHOOK_MAX_AGE_SECONDS=300
WEBHOOK_NONCE_EXPIRY_SECONDS=300
LOG_LEVEL="info"
```

### Redis Backend (Optional, for scale)
Replace in-memory nonce store with Redis for distributed deployments:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

function validateNonce(nonce: string, expirySeconds: number = 300): boolean {
  const exists = redis.getdel(nonce);
  if (exists) return false; // Replay detected
  
  redis.setex(nonce, expirySeconds, '1');
  return true;
}
```

### Health Check
```bash
curl http://localhost:3000/api/webhooks
```

Response:
```json
{
  "status": "ok",
  "message": "Webhook endpoint is running",
  "endpoint": "/api/webhooks",
  "method": "POST",
  "timestamp": "2024-06-13T15:30:45.123Z"
}
```

## Troubleshooting

### Signature Mismatch
- ✓ Verify secret matches on client & server
- ✓ Ensure payload JSON is serialized identically
- ✓ Check for whitespace differences in JSON

### Timestamp Out of Range
- ✓ Sync server clocks (NTP)
- ✓ Allow for clock skew (±30 seconds)
- ✓ Log timestamp differences for debugging

### Nonce Replay Error
- ✓ Generate new UUID v4 for each request
- ✓ Check for cached responses
- ✓ Verify nonce isn't reused

### High Latency
- ✓ Check network conditions
- ✓ Verify server load
- ✓ Consider connection pooling

## Architecture Files

```
lib/security/
├── webhook-signing.ts       # Core signing library (HMAC, nonce, timestamp)
├── webhook-signing.test.ts  # Comprehensive test suite
├── webhook-client.ts        # Client helper for sending webhooks
└── index.ts                 # Barrel export (optional)

app/api/webhooks/
├── route.ts                 # Webhook endpoint (POST/GET/OPTIONS)
└── [children]/              # Sub-routes (clerk, stripe, etc.)
```

## API Reference

### `signWebhookPayload(payload, secret): string`
Sign a webhook payload and return hex-encoded HMAC-SHA256 signature.

### `verifyWebhookSignature(payload, signature, secret): boolean`
Verify a webhook signature with timing-safe comparison.

### `generateNonce(): string`
Generate a cryptographically secure UUID v4 nonce.

### `validateNonce(nonce, expirySeconds): boolean`
Validate a nonce against replay attacks. Returns true if nonce is new and valid.

### `validateTimestamp(timestamp, maxAgeSeconds): boolean`
Validate request timestamp. Allows ±30 seconds clock skew.

### `validateWebhookRequest(request, secret, maxAgeSeconds, nonceExpirySeconds): ValidationResult`
Complete webhook validation (signature + timestamp + nonce).

### `WebhookClient(url, secret, options)`
Client class for signing and sending webhooks with retry logic.

## Support

For issues or questions:
1. Check the test suite (`webhook-signing.test.ts`)
2. Review example scripts
3. Enable debug logging via `LOG_LEVEL=debug`
4. Check server logs for validation errors
