/**
 * Webhook Security Module - Barrel Export
 * Import: import { signWebhookPayload, WebhookClient } from '@/lib/security';
 */

export {
  signWebhookPayload,
  verifyWebhookSignature,
  generateNonce,
  validateNonce,
  validateTimestamp,
  validateWebhookRequest,
  cleanupNonceStore,
  getNonceStoreStats,
  type WebhookRequest,
  type ValidationResult,
} from './webhook-signing';

export {
  WebhookClient,
  sendSignedWebhook,
  type WebhookClientOptions,
  type WebhookSendResult,
} from './webhook-client';
