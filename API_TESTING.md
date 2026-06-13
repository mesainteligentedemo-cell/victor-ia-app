# API Testing Guide — TDD-First Approach

Complete TDD test suite for Victor IA App API endpoints with 50+ tests per endpoint.

## Overview

This guide covers the complete test-driven development (TDD) suite for the Victor IA App API, including:

- **5 Main API Endpoints**: contact, auth, analytics, billing, user
- **50+ Tests per Endpoint**: 250+ total tests covering happy paths, edge cases, security
- **Mock Infrastructure**: Reusable fixtures, database mocks, token generators
- **Test-First Workflow**: Write tests first, then implement handlers

## Quick Start

### 1. Installation

```bash
npm install --save-dev node-mocks-http jest @types/jest ts-jest
```

### 2. Configure Jest

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/app/api/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific endpoint tests
npm test -- contact.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## File Structure

```
src/
├── __tests__/
│   └── api/
│       ├── fixtures.ts              # Shared mocks and data
│       ├── contact.test.ts          # Contact form tests (50+ tests)
│       ├── auth.test.ts             # Auth endpoint tests (70+ tests)
│       ├── analytics.test.ts        # Analytics tests (50+ tests)
│       ├── billing.test.ts          # Billing tests (60+ tests)
│       └── user.test.ts             # User profile tests (60+ tests)
└── app/
    └── api/
        ├── contact/
        │   └── route.ts             # ← Implement after tests pass
        ├── auth/
        │   └── route.ts
        ├── analytics/
        │   └── route.ts
        ├── billing/
        │   └── route.ts
        └── user/
            └── route.ts
```

## Test Suite Overview

### 1. Contact Form API Tests (src/__tests__/api/contact.test.ts)

**Endpoint**: `POST /api/contact`

**Test Coverage**:
- ✅ Valid form submissions with email delivery
- ✅ Input validation (email, name, message)
- ✅ XSS prevention and sanitization
- ✅ Rate limiting (3 per 10 minutes)
- ✅ HTTP method validation

**Sample Test**:

```typescript
it('should accept valid contact form submission', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      email: 'contact@example.com',
      name: 'John Doe',
      message: 'I have a question',
    },
  })

  await handler(req, res)

  expect(res._getStatusCode()).toBe(200)
  const data = JSON.parse(res._getData())
  expect(data.success).toBe(true)
})
```

### 2. Authentication API Tests (src/__tests__/api/auth.test.ts)

**Endpoints**: `POST /api/auth` (signup, login, logout, 2FA)

**Test Coverage**:
- ✅ User registration with password validation
- ✅ Email verification flow
- ✅ Login with rate limiting (after 5 failed attempts)
- ✅ Token refresh and expiration
- ✅ Two-factor authentication (TOTP)
- ✅ Password reset flow
- ✅ Session management

**Sample Test**:

```typescript
it('should create new user with strong password', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    query: { action: 'signup' },
    body: {
      email: 'newuser@example.com',
      password: 'SecurePass123!@#',
    },
  })

  await handler(req, res)

  expect(res._getStatusCode()).toBe(201)
  const data = JSON.parse(res._getData())
  expect(data.token).toBeDefined()
})
```

### 3. Analytics API Tests (src/__tests__/api/analytics.test.ts)

**Endpoints**: `POST|GET /api/analytics`

**Test Coverage**:
- ✅ Event tracking (page views, clicks, conversions)
- ✅ Real-time event retrieval
- ✅ Date range filtering
- ✅ Event aggregation and summaries
- ✅ Conversion funnel tracking
- ✅ WebSocket real-time streaming
- ✅ Batch event submission

**Sample Test**:

```typescript
it('should track page_view events', async () => {
  const token = generateTestToken('user_123')

  const { req, res } = createMocks({
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: {
      eventName: 'page_view',
      eventProperties: { page: '/pricing' },
      sessionId: 'session_123',
    },
  })

  await handler(req, res)

  expect(res._getStatusCode()).toBe(201)
})
```

### 4. Billing API Tests (src/__tests__/api/billing.test.ts)

**Endpoints**: `GET|POST /api/billing` (Stripe integration)

**Test Coverage**:
- ✅ Retrieve available plans
- ✅ Create subscriptions
- ✅ Upgrade / downgrade plans
- ✅ Cancel subscriptions
- ✅ Invoice management
- ✅ Payment method management
- ✅ Proration calculation
- ✅ Trial period handling
- ✅ Security: No exposure of card numbers

**Sample Test**:

```typescript
it('should create subscription with valid payment method', async () => {
  const token = generateTestToken('user_123')

  const { req, res } = createMocks({
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    query: { action: 'subscribe' },
    body: {
      priceId: 'price_pro_monthly',
      paymentMethodId: 'pm_test_visa',
    },
  })

  await handler(req, res)

  expect([200, 201]).toContain(res._getStatusCode())
})
```

### 5. User Profile API Tests (src/__tests__/api/user.test.ts)

**Endpoints**: `GET|PUT|DELETE /api/user`

**Test Coverage**:
- ✅ Retrieve user profile
- ✅ Update profile (name, bio, avatar, timezone)
- ✅ Change email address
- ✅ Change password
- ✅ Delete account (with confirmation)
- ✅ Session management
- ✅ Notification preferences
- ✅ Security: No password hash exposure

**Sample Test**:

```typescript
it('should update user profile', async () => {
  const token = generateTestToken('user_123')

  const { req, res } = createMocks({
    method: 'PUT',
    headers: { authorization: `Bearer ${token}` },
    query: { resource: 'profile' },
    body: {
      name: 'Updated Name',
      bio: 'Updated bio',
    },
  })

  await handler(req, res)

  expect(res._getStatusCode()).toBe(200)
})
```

## Fixtures & Shared Utilities

### Mock Data

```typescript
import {
  mockUser,
  mockUserPremium,
  mockContactFormSubmission,
  mockAuthCredentials,
  mockAnalyticsEvent,
  mockStripePlan,
  mockBillingSubscription,
} from './fixtures'
```

### Mock Database

```typescript
import { mockDatabase } from './fixtures'

// Create user
mockDatabase.createUser({ email: 'test@example.com' })

// Get user by ID
mockDatabase.getUser('user_123')

// Reset all data (do this in beforeEach)
mockDatabase.reset()
```

### Utility Functions

```typescript
import {
  generateTestToken,           // Generate JWT tokens
  createRateLimitStore,        // Rate limit tracking
  isValidEmail,                // Email validation
  isValidPassword,             // Password strength check
  containsXSS,                 // XSS detection
  createErrorResponse,         // Build error responses
  createSuccessResponse,       // Build success responses
} from './fixtures'
```

## TDD Workflow

### Step 1: Write Tests First

```typescript
// contact.test.ts - Write test BEFORE implementation
it('should accept valid contact form submission', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { email: '...', name: '...', message: '...' },
  })
  await handler(req, res)
  expect(res._getStatusCode()).toBe(200)
})
```

### Step 2: Run Tests (Expect Failure)

```bash
npm test -- contact.test.ts
# ✗ should accept valid contact form submission
# Error: handler is not defined
```

### Step 3: Implement Minimal Code

```typescript
// src/app/api/contact/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  return Response.json({ success: true })
}
```

### Step 4: Run Tests (Expect Pass)

```bash
npm test -- contact.test.ts
# ✓ should accept valid contact form submission
```

### Step 5: Refactor & Optimize

Once tests pass, refactor the implementation for:
- Better error handling
- Performance optimization
- Code maintainability
- Security hardening

## Security Testing

All endpoints include security tests for:

### Authentication & Authorization

```typescript
it('should require authentication token', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { /* data */ },
    // Missing: headers: { authorization: 'Bearer ...' }
  })
  await handler(req, res)
  expect(res._getStatusCode()).toBe(401)
})
```

### Input Validation & Sanitization

```typescript
it('should reject XSS attempts', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      message: '<script>alert(1)</script>',
    },
  })
  await handler(req, res)
  expect(res._getStatusCode()).toBe(400)
})
```

### Rate Limiting

```typescript
it('should enforce rate limit', async () => {
  for (let i = 0; i < 4; i++) {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { 'x-forwarded-for': '192.168.1.1' },
      body: { /* data */ },
    })
    await handler(req, res)
    if (i < 3) expect([200, 201]).toContain(res._getStatusCode())
    if (i === 3) expect(res._getStatusCode()).toBe(429)
  }
})
```

### Data Exposure Prevention

```typescript
it('should not expose sensitive data', async () => {
  const { req, res } = createMocks({
    method: 'GET',
    headers: { authorization: 'Bearer ...' },
  })
  await handler(req, res)
  const data = JSON.parse(res._getData())
  expect(data.password).toBeUndefined()
  expect(data.passwordHash).toBeUndefined()
})
```

## Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

## Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 80% | 0% (before implementation) |
| Branches | 80% | 0% |
| Functions | 80% | 0% |
| Lines | 80% | 0% |

Run coverage reports:

```bash
npm test -- --coverage
```

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { /* data */ },
  })

  // Wait for async handler
  await handler(req, res)

  expect(res._getStatusCode()).toBe(200)
})
```

### Testing Error Scenarios

```typescript
it('should handle validation errors', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { /* missing required fields */ },
  })

  await handler(req, res)

  expect(res._getStatusCode()).toBe(400)
  const data = JSON.parse(res._getData())
  expect(data.error).toBeDefined()
})
```

### Testing with Query Parameters

```typescript
it('should filter with query params', async () => {
  const { req, res } = createMocks({
    method: 'GET',
    query: {
      page: '1',
      limit: '10',
      sort: 'createdAt:desc',
    },
  })

  await handler(req, res)

  expect(res._getStatusCode()).toBe(200)
})
```

### Mocking External Services

```typescript
it('should handle email service failure', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValueOnce(
    new Error('Service unavailable')
  )

  const { req, res } = createMocks({
    method: 'POST',
    body: { /* data */ },
  })

  await handler(req, res)

  // Should still return 200 (queued for retry)
  expect([200, 202]).toContain(res._getStatusCode())
})
```

## Debugging Tests

### Enable Debug Logging

```typescript
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(console.error)
})
```

### Print Request/Response

```typescript
it('should debug request/response', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: { email: 'test@example.com' },
  })

  await handler(req, res)

  console.log('Status:', res._getStatusCode())
  console.log('Body:', res._getData())
  console.log('Headers:', res._getHeaders())
})
```

### Run Single Test

```bash
npm test -- contact.test.ts -t "should accept valid contact"
```

## Next Steps

1. ✅ Tests written (you're here)
2. → Implement API handlers one endpoint at a time
3. → Run tests to validate implementation
4. → Add integration tests
5. → Deploy with confidence

## Resources

- [node-mocks-http](https://github.com/howardabrams/node-mocks-http) - Mock HTTP requests
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Test framework
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - API handler patterns
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)

---

**Created**: June 2026  
**Framework**: Next.js 16.2 + TypeScript  
**Test Total**: 250+ tests across 5 endpoints
