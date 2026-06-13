/**
 * API Gateway — Type Definitions
 * Strongly-typed interfaces for proxy requests and responses
 */

// Service types
export type GatewayService = 'stripe' | 'data' | 'ai' | 'mail';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

/**
 * Rate limit configuration per service
 */
export interface RateLimitConfig {
  service: GatewayService;
  requestsPerMinute: number;
  requestsPerHour?: number;
  requestsPerDay?: number;
}

/**
 * Service configuration
 */
export interface ServiceConfig {
  requireAuth: boolean;
  requireAdmin?: boolean;
  rateLimitPerMinute: number;
  auditLog: boolean;
  timeout?: number;
}

/**
 * Proxy request parameters
 */
export interface ProxyRequestOptions {
  service: GatewayService;
  endpoint: string;
  method?: HttpMethod;
  body?: Record<string, any>;
  query?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Proxy response
 */
export interface ProxyResponse<T = any> {
  data: T;
  status: number;
  statusText?: string;
  headers: Record<string, string>;
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  service: GatewayService;
  endpoint: string;
  method: HttpMethod;
  statusCode: number;
  gatewayId: string;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  requestSize?: number;
  responseSize?: number;
  error?: string;
}

/**
 * Rate limit state
 */
export interface RateLimitState {
  count: number;
  resetTime: number;
  service: GatewayService;
}

/**
 * IP whitelist entry
 */
export type IPWhitelistEntry = string; // CIDR notation or single IP

/**
 * Gateway configuration
 */
export interface GatewayConfig {
  gatewayId: string;
  ipWhitelist: IPWhitelistEntry[];
  enableAuditLog: boolean;
  auditLogWebhook?: string;
  rateLimits: Record<GatewayService, number>;
  backends: Record<GatewayService, string>;
  corsOrigins?: string[];
}

/**
 * Backend response that might include error
 */
export interface BackendErrorResponse {
  error?: string;
  message?: string;
  code?: string;
  status?: number;
}

/**
 * Stripe-specific types
 */
export namespace Stripe {
  export interface Customer {
    id: string;
    email?: string;
    name?: string;
    created: number;
    metadata?: Record<string, string>;
  }

  export interface Charge {
    id: string;
    amount: number;
    currency: string;
    customer?: string;
    paid: boolean;
    created: number;
  }

  export interface RefundRequest {
    amount?: number;
    reason?: string;
    metadata?: Record<string, string>;
  }

  export interface CreateCustomerRequest {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }
}

/**
 * Supabase-specific types
 */
export namespace Supabase {
  export interface User {
    id: string;
    email: string;
    name?: string;
    credits: number;
    subscription_status: 'free' | 'pro' | 'enterprise';
    stripe_customer_id?: string;
    created_at?: string;
    updated_at?: string;
  }

  export interface QueryOptions {
    select?: string;
    filter?: string;
    order?: string;
    limit?: number;
    offset?: number;
  }

  export interface InsertOptions {
    return?: 'minimal' | 'representation';
  }

  export interface UpdateOptions {
    return?: 'minimal' | 'representation';
  }
}

/**
 * OpenAI-specific types
 */
export namespace OpenAI {
  export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  export interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  }

  export interface ChatCompletionResponse {
    id: string;
    object: 'chat.completion';
    created: number;
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    choices: Array<{
      index: number;
      message: ChatMessage;
      finish_reason: string;
    }>;
  }

  export interface Model {
    id: string;
    object: 'model';
    owned_by: string;
    permission: Array<{
      id: string;
      object: 'model_permission';
      created: number;
      allow_create_engine: boolean;
      allow_logprobs: boolean;
      allow_sample_discard: boolean;
      allow_search_indices: boolean;
      allow_view: boolean;
      allow_fine_tuning: boolean;
      organization: string;
      group_id: string;
      is_blocking: boolean;
    }>;
    root: string;
    parent: string | null;
  }
}

/**
 * Mailgun-specific types
 */
export namespace Mailgun {
  export interface SendEmailRequest {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    template?: string;
    'h:X-Custom-Header'?: Record<string, string>;
    'v:custom-variable'?: Record<string, string>;
  }

  export interface SendEmailResponse {
    id: string;
    message: string;
  }

  export interface EmailDeliveryStatus {
    timestamp: string;
    'log-level': string;
    message: {
      from: string;
      to: string;
      size: number;
    };
    delivery: {
      status: 'accepted' | 'rejected' | 'delivered' | 'failed';
      'failure-type'?: string;
      'failure-description'?: string;
    };
  }
}

/**
 * Gateway error with context
 */
export class GatewayError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any,
    public service?: GatewayService
  ) {
    super(message);
    this.name = 'GatewayError';
    Object.setPrototypeOf(this, GatewayError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      service: this.service,
      data: this.data,
    };
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends GatewayError {
  constructor(
    public resetTime: number,
    service?: GatewayService
  ) {
    super('Rate limit exceeded', 429, { resetTime }, service);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends GatewayError {
  constructor(message: string = 'Authentication required', service?: GatewayService) {
    super(message, 401, undefined, service);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends GatewayError {
  constructor(message: string = 'Insufficient permissions', service?: GatewayService) {
    super(message, 403, undefined, service);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Service not found error
 */
export class ServiceNotFoundError extends GatewayError {
  constructor(service: string) {
    super(`Service not found: ${service}`, 404, { service });
    this.name = 'ServiceNotFoundError';
    Object.setPrototypeOf(this, ServiceNotFoundError.prototype);
  }
}

/**
 * Backend service error
 */
export class BackendError extends GatewayError {
  constructor(
    service: GatewayService,
    statusCode: number,
    data: any
  ) {
    super(`Backend service error: ${service}`, statusCode, data, service);
    this.name = 'BackendError';
    Object.setPrototypeOf(this, BackendError.prototype);
  }
}

/**
 * Type guard functions
 */
export const TypeGuards = {
  isStripeError: (error: unknown): error is Stripe.Customer =>
    typeof error === 'object' && error !== null && 'id' in error && 'email' in error,

  isSupabaseUser: (data: unknown): data is Supabase.User =>
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data &&
    'subscription_status' in data,

  isOpenAIChatResponse: (data: unknown): data is OpenAI.ChatCompletionResponse =>
    typeof data === 'object' &&
    data !== null &&
    'choices' in data &&
    'usage' in data &&
    'model' in data,

  isMailgunResponse: (data: unknown): data is Mailgun.SendEmailResponse =>
    typeof data === 'object' && data !== null && 'id' in data && 'message' in data,

  isGatewayError: (error: unknown): error is GatewayError =>
    error instanceof GatewayError,

  isRateLimitError: (error: unknown): error is RateLimitError =>
    error instanceof RateLimitError,
};
