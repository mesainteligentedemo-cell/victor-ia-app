/**
 * Webhook Client Helper
 * Sign and send webhook requests with HMAC signature
 *
 * Usage:
 *   const client = new WebhookClient('https://api.example.com/api/webhooks', secret);
 *   const result = await client.send({ type: 'user.created', data: { id: '123' } });
 */

import {
  signWebhookPayload,
  generateNonce,
} from './webhook-signing';

export interface WebhookClientOptions {
  timeout?: number; // milliseconds
  retries?: number;
  onError?: (error: Error, attempt: number) => void;
}

export interface WebhookSendResult {
  success: boolean;
  signature: string;
  message?: string;
  error?: string;
  code?: string;
  statusCode?: number;
}

/**
 * Webhook client for sending signed requests
 */
export class WebhookClient {
  private url: string;
  private secret: string;
  private options: Required<WebhookClientOptions>;

  constructor(
    url: string,
    secret: string,
    options: WebhookClientOptions = {}
  ) {
    this.url = url;
    this.secret = secret;
    this.options = {
      timeout: options.timeout ?? 10000,
      retries: options.retries ?? 3,
      onError: options.onError ?? (() => {}),
    };
  }

  /**
   * Send a webhook payload
   */
  async send(
    payload: Record<string, any>
  ): Promise<WebhookSendResult> {
    const nonce = generateNonce();
    const timestamp = new Date().toISOString();
    const signature = signWebhookPayload(payload, this.secret);

    const request = {
      payload,
      signature,
      nonce,
      timestamp,
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.options.retries; attempt++) {
      try {
        const response = await this.sendRequest(request);

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            signature: data.signature || signature,
            message: data.message,
            statusCode: response.status,
          };
        } else {
          const data = await response.json().catch(() => ({}));
          return {
            success: false,
            signature,
            error: data.error || `HTTP ${response.status}`,
            code: data.code,
            statusCode: response.status,
          };
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.options.onError(lastError, attempt);

        if (attempt < this.options.retries) {
          // Exponential backoff: 100ms, 200ms, 400ms, ...
          const delay = Math.pow(2, attempt - 1) * 100;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    return {
      success: false,
      signature,
      error: lastError?.message || 'Request failed after retries',
      code: 'REQUEST_FAILED',
    };
  }

  /**
   * Send the actual HTTP request
   */
  private async sendRequest(
    body: Record<string, any>
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

    try {
      return await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Send multiple webhooks in parallel
   */
  async sendBatch(
    payloads: Record<string, any>[]
  ): Promise<WebhookSendResult[]> {
    return Promise.all(payloads.map((payload) => this.send(payload)));
  }
}

/**
 * Helper to create and send a signed webhook
 */
export async function sendSignedWebhook(
  url: string,
  secret: string,
  payload: Record<string, any>
): Promise<WebhookSendResult> {
  const client = new WebhookClient(url, secret);
  return client.send(payload);
}
