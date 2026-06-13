/**
 * Webhook Signing Tests
 * Run with: npm test -- lib/security/webhook-signing.test.ts
 * Or: vitest lib/security/webhook-signing.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  signWebhookPayload,
  verifyWebhookSignature,
  generateNonce,
  validateNonce,
  validateTimestamp,
  validateWebhookRequest,
  cleanupNonceStore,
  getNonceStoreStats,
} from './webhook-signing';

const TEST_SECRET = 'test-secret-key-12345';
const TEST_PAYLOAD = { type: 'user.created', id: '123', name: 'John' };

describe('Webhook Signing', () => {
  afterEach(() => {
    cleanupNonceStore();
  });

  describe('signWebhookPayload', () => {
    it('should sign a payload with HMAC-SHA256', () => {
      const signature = signWebhookPayload(TEST_PAYLOAD, TEST_SECRET);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature).toMatch(/^[a-f0-9]{64}$/); // SHA256 hex = 64 chars
    });

    it('should produce consistent signatures', () => {
      const sig1 = signWebhookPayload(TEST_PAYLOAD, TEST_SECRET);
      const sig2 = signWebhookPayload(TEST_PAYLOAD, TEST_SECRET);

      expect(sig1).toBe(sig2);
    });

    it('should produce different signatures for different payloads', () => {
      const sig1 = signWebhookPayload({ id: '1' }, TEST_SECRET);
      const sig2 = signWebhookPayload({ id: '2' }, TEST_SECRET);

      expect(sig1).not.toBe(sig2);
    });

    it('should produce different signatures for different secrets', () => {
      const sig1 = signWebhookPayload(TEST_PAYLOAD, 'secret1');
      const sig2 = signWebhookPayload(TEST_PAYLOAD, 'secret2');

      expect(sig1).not.toBe(sig2);
    });

    it('should handle string payloads', () => {
      const stringPayload = JSON.stringify(TEST_PAYLOAD);
      const sig1 = signWebhookPayload(TEST_PAYLOAD, TEST_SECRET);
      const sig2 = signWebhookPayload(stringPayload, TEST_SECRET);

      expect(sig1).toBe(sig2);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify a correct signature', () => {
      const signature = signWebhookPayload(TEST_PAYLOAD, TEST_SECRET);
      const isValid = verifyWebhookSignature(
        TEST_PAYLOAD,
        signature,
        TEST_SECRET
      );

      expect(isValid).toBe(true);
    });

    it('should reject an incorrect signature', () => {
      const isValid = verifyWebhookSignature(
        TEST_PAYLOAD,
        'wrong-signature',
        TEST_SECRET
      );

      expect(isValid).toBe(false);
    });

    it('should reject signature with wrong secret', () => {
      const signature = signWebhookPayload(TEST_PAYLOAD, 'secret1');
      const isValid = verifyWebhookSignature(
        TEST_PAYLOAD,
        signature,
        'secret2'
      );

      expect(isValid).toBe(false);
    });

    it('should be resistant to timing attacks', () => {
      const signature = signWebhookPayload(TEST_PAYLOAD, TEST_SECRET);
      const wrongSig1 = 'a' + signature.slice(1); // Change first char
      const wrongSig2 = signature.slice(0, -1) + 'a'; // Change last char

      const result1 = verifyWebhookSignature(
        TEST_PAYLOAD,
        wrongSig1,
        TEST_SECRET
      );
      const result2 = verifyWebhookSignature(
        TEST_PAYLOAD,
        wrongSig2,
        TEST_SECRET
      );

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });

  describe('generateNonce', () => {
    it('should generate a nonce', () => {
      const nonce = generateNonce();

      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
    });

    it('should generate unique nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      const nonce3 = generateNonce();

      expect(nonce1).not.toBe(nonce2);
      expect(nonce2).not.toBe(nonce3);
      expect(nonce1).not.toBe(nonce3);
    });

    it('should generate valid UUID v4 format', () => {
      const nonce = generateNonce();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(nonce).toMatch(uuidRegex);
    });
  });

  describe('validateNonce', () => {
    it('should accept a new nonce', () => {
      const nonce = generateNonce();
      const isValid = validateNonce(nonce);

      expect(isValid).toBe(true);
    });

    it('should reject a replayed nonce', () => {
      const nonce = generateNonce();

      // First use is valid
      expect(validateNonce(nonce)).toBe(true);

      // Second use (replay) is invalid
      expect(validateNonce(nonce)).toBe(false);
    });

    it('should respect expiry time', async () => {
      const nonce = generateNonce();

      // Validate with 1 second expiry
      expect(validateNonce(nonce, 1)).toBe(true);

      // Wait for expiry
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Nonce should be expired and accepted as new
      expect(validateNonce(nonce, 1)).toBe(true);
    });
  });

  describe('validateTimestamp', () => {
    it('should accept current timestamp', () => {
      const now = Date.now();
      const isValid = validateTimestamp(now);

      expect(isValid).toBe(true);
    });

    it('should accept ISO 8601 timestamp', () => {
      const now = new Date().toISOString();
      const isValid = validateTimestamp(now);

      expect(isValid).toBe(true);
    });

    it('should reject old timestamp', () => {
      const oneHourAgo = Date.now() - 3600000;
      const isValid = validateTimestamp(oneHourAgo, 300); // 5 min max age

      expect(isValid).toBe(false);
    });

    it('should reject future timestamp (with limit)', () => {
      const oneDayInFuture = Date.now() + 86400000;
      const isValid = validateTimestamp(oneDayInFuture, 300);

      expect(isValid).toBe(false);
    });

    it('should allow clock skew', () => {
      // 20 seconds in future (within 30 sec skew tolerance)
      const nearFuture = Date.now() + 20000;
      const isValid = validateTimestamp(nearFuture);

      expect(isValid).toBe(true);
    });

    it('should reject invalid timestamp format', () => {
      const isValid = validateTimestamp('not-a-timestamp');

      expect(isValid).toBe(false);
    });
  });

  describe('validateWebhookRequest', () => {
    it('should validate a correct webhook request', () => {
      const payload = TEST_PAYLOAD;
      const signature = signWebhookPayload(payload, TEST_SECRET);
      const nonce = generateNonce();
      const timestamp = new Date().toISOString();

      const result = validateWebhookRequest(
        { payload, signature, nonce, timestamp },
        TEST_SECRET
      );

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(payload);
    });

    it('should reject invalid signature', () => {
      const payload = TEST_PAYLOAD;
      const nonce = generateNonce();
      const timestamp = new Date().toISOString();

      const result = validateWebhookRequest(
        { payload, signature: 'wrong-sig', nonce, timestamp },
        TEST_SECRET
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('signature');
    });

    it('should reject old timestamp', () => {
      const payload = TEST_PAYLOAD;
      const signature = signWebhookPayload(payload, TEST_SECRET);
      const nonce = generateNonce();
      const timestamp = Date.now() - 600000; // 10 minutes ago

      const result = validateWebhookRequest(
        { payload, signature, nonce, timestamp },
        TEST_SECRET,
        300 // 5 min max age
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Timestamp');
    });

    it('should reject replayed nonce', () => {
      const payload = TEST_PAYLOAD;
      const signature = signWebhookPayload(payload, TEST_SECRET);
      const nonce = generateNonce();
      const timestamp = new Date().toISOString();

      // First request
      const result1 = validateWebhookRequest(
        { payload, signature, nonce, timestamp },
        TEST_SECRET
      );
      expect(result1.isValid).toBe(true);

      // Second request with same nonce (replay attack)
      const result2 = validateWebhookRequest(
        { payload, signature, nonce, timestamp },
        TEST_SECRET
      );
      expect(result2.isValid).toBe(false);
      expect(result2.error).toContain('Nonce');
    });
  });

  describe('getNonceStoreStats', () => {
    it('should return nonce store size', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();

      validateNonce(nonce1);
      validateNonce(nonce2);

      const stats = getNonceStoreStats();

      expect(stats.size).toBe(2);
    });
  });

  describe('Real-world scenarios', () => {
    it('should handle concurrent webhook validations', async () => {
      const requests = Array.from({ length: 10 }, () => {
        const payload = TEST_PAYLOAD;
        const signature = signWebhookPayload(payload, TEST_SECRET);
        const nonce = generateNonce();
        const timestamp = new Date().toISOString();

        return validateWebhookRequest(
          { payload, signature, nonce, timestamp },
          TEST_SECRET
        );
      });

      const results = await Promise.all(requests);

      expect(results).toHaveLength(10);
      expect(results.every((r) => r.isValid)).toBe(true);
    });

    it('should detect replay attacks in concurrent requests', async () => {
      const payload = TEST_PAYLOAD;
      const signature = signWebhookPayload(payload, TEST_SECRET);
      const nonce = generateNonce();
      const timestamp = new Date().toISOString();

      // Send same request 3 times concurrently
      const requests = [
        validateWebhookRequest(
          { payload, signature, nonce, timestamp },
          TEST_SECRET
        ),
        validateWebhookRequest(
          { payload, signature, nonce, timestamp },
          TEST_SECRET
        ),
        validateWebhookRequest(
          { payload, signature, nonce, timestamp },
          TEST_SECRET
        ),
      ];

      const results = await Promise.all(requests);

      // Only one should be valid
      const validCount = results.filter((r) => r.isValid).length;
      expect(validCount).toBe(1);
    });
  });
});
