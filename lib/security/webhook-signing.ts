/**
 * Webhook Signing & Verification Library
 * Production-ready HMAC-SHA256 signing with anti-replay protection
 *
 * Usage:
 *   const signature = signWebhookPayload(payload, secret);
 *   const isValid = verifyWebhookSignature(payload, signature, secret);
 */

import { createHmac, randomUUID } from 'crypto';

/**
 * In-memory nonce store with automatic expiry
 * For production, replace with Redis
 */
class NonceStore {
  private nonces: Map<string, { expiresAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timer | null = null;

  constructor() {
    // Cleanup expired nonces every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [nonce, data] of this.nonces.entries()) {
      if (data.expiresAt < now) {
        this.nonces.delete(nonce);
      }
    }
  }

  add(nonce: string, expirySeconds: number): void {
    this.nonces.set(nonce, {
      expiresAt: Date.now() + expirySeconds * 1000,
    });
  }

  has(nonce: string): boolean {
    const data = this.nonces.get(nonce);
    if (!data) return false;

    const isExpired = data.expiresAt < Date.now();
    if (isExpired) {
      this.nonces.delete(nonce);
      return false;
    }

    return true;
  }

  remove(nonce: string): boolean {
    return this.nonces.delete(nonce);
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.nonces.clear();
  }
}

// Global instance
const nonceStore = new NonceStore();

/**
 * Sign a webhook payload with HMAC-SHA256
 * @param payload - The payload to sign (string or object)
 * @param secret - The signing secret
 * @returns Hex-encoded HMAC signature
 */
export function signWebhookPayload(
  payload: string | Record<string, any>,
  secret: string
): string {
  const payloadString =
    typeof payload === 'string' ? payload : JSON.stringify(payload);

  return createHmac('sha256', secret).update(payloadString).digest('hex');
}

/**
 * Verify a webhook signature
 * @param payload - The original payload (string or object)
 * @param signature - The signature to verify
 * @param secret - The signing secret
 * @returns true if signature is valid, false otherwise
 */
export function verifyWebhookSignature(
  payload: string | Record<string, any>,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = signWebhookPayload(payload, secret);

  // Use timing-safe comparison to prevent timing attacks
  return (
    expectedSignature.length === signature.length &&
    expectedSignature
      .split('')
      .every((char, index) => char === signature[index])
  );
}

/**
 * Generate a cryptographically secure nonce
 * @returns UUID v4 string
 */
export function generateNonce(): string {
  return randomUUID();
}

/**
 * Validate a nonce against replay attacks
 * @param nonce - The nonce to validate
 * @param expirySeconds - How long the nonce is valid (default 300 = 5 min)
 * @returns true if nonce is valid and not seen before, false otherwise
 */
export function validateNonce(nonce: string, expirySeconds: number = 300): boolean {
  // Check if nonce exists and is not expired
  const isValid = nonceStore.has(nonce);

  if (isValid) {
    // Nonce is a replay - already seen
    return false;
  }

  // Add nonce to store
  nonceStore.add(nonce, expirySeconds);
  return true;
}

/**
 * Validate request timestamp to prevent old requests
 * @param timestamp - Timestamp in milliseconds (ISO 8601 string or number)
 * @param maxAgeSeconds - Maximum age allowed (default 300 = 5 min)
 * @returns true if timestamp is within acceptable range, false otherwise
 */
export function validateTimestamp(
  timestamp: string | number,
  maxAgeSeconds: number = 300
): boolean {
  const timestampMs =
    typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;

  if (isNaN(timestampMs)) {
    return false;
  }

  const now = Date.now();
  const age = now - timestampMs;
  const maxAge = maxAgeSeconds * 1000;

  // Allow 30 seconds of clock skew in the future
  return age >= -30000 && age <= maxAge;
}

/**
 * Webhook request payload structure
 */
export interface WebhookRequest {
  payload: Record<string, any>;
  signature: string;
  nonce: string;
  timestamp: string | number; // ISO 8601 or milliseconds
}

/**
 * Webhook validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: Record<string, any>;
}

/**
 * Validate complete webhook request
 * @param request - The webhook request
 * @param secret - The signing secret
 * @param maxAgeSeconds - Maximum age for request (default 300)
 * @param nonceExpirySeconds - How long nonce is valid (default 300)
 * @returns Validation result with details
 */
export function validateWebhookRequest(
  request: WebhookRequest,
  secret: string,
  maxAgeSeconds: number = 300,
  nonceExpirySeconds: number = 300
): ValidationResult {
  // Validate signature
  if (!verifyWebhookSignature(request.payload, request.signature, secret)) {
    return {
      isValid: false,
      error: 'Invalid signature',
    };
  }

  // Validate timestamp
  if (!validateTimestamp(request.timestamp, maxAgeSeconds)) {
    return {
      isValid: false,
      error: 'Timestamp outside acceptable range',
    };
  }

  // Validate nonce (anti-replay)
  if (!validateNonce(request.nonce, nonceExpirySeconds)) {
    return {
      isValid: false,
      error: 'Nonce already used or invalid',
    };
  }

  return {
    isValid: true,
    data: request.payload,
  };
}

/**
 * Clean up nonce store (for testing or shutdown)
 */
export function cleanupNonceStore(): void {
  nonceStore.destroy();
}

/**
 * Get nonce store stats (for monitoring/testing)
 */
export function getNonceStoreStats(): { size: number } {
  return {
    size: nonceStore['nonces'].size,
  };
}

export { nonceStore };
