/**
 * Public API Types & Interfaces
 * Core types for Victor IA Public API
 */

// ============================================================================
// API KEY MANAGEMENT
// ============================================================================

export interface APIKey {
  id: string;
  key: string; // hashed
  name: string;
  workspace_id: string;
  user_id: string;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
  rate_limit: RateLimitConfig;
  status: 'active' | 'revoked' | 'expired';
  metadata?: Record<string, any>;
}

export interface RateLimitConfig {
  tier: 'free' | 'pro' | 'enterprise';
  requests_per_hour: number;
  requests_per_day: number;
  max_batch_size: number;
  cost_per_request: number; // in USD cents
}

export interface CreateAPIKeyRequest {
  name: string;
  expires_in_days?: number;
  rate_limit_tier?: 'free' | 'pro' | 'enterprise';
}

export interface CreateAPIKeyResponse {
  id: string;
  key: string; // Only shown once
  name: string;
  rate_limit: RateLimitConfig;
  created_at: string;
  expires_at?: string;
}

// ============================================================================
// GENERATION API
// ============================================================================

export type GenerationType =
  | 'image'
  | 'video'
  | 'presentation'
  | 'email'
  | 'landing-page'
  | 'social-post'
  | 'audio'
  | 'pdf'
  | 'blog-post'
  | 'tweet-thread'
  | 'copy';

export interface GenerateRequest {
  type: GenerationType;
  prompt: string;
  params?: Record<string, any>;
  webhook_url?: string; // Optional webhook for completion
  metadata?: Record<string, any>;
}

export interface Generation {
  id: string;
  user_id: string;
  type: GenerationType;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string | Record<string, any>;
  error?: string;
  created_at: string;
  completed_at?: string;
  cost_cents: number;
  metadata?: Record<string, any>;
}

export interface GenerateResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string | Record<string, any>;
  error?: string;
  created_at: string;
  webhook_url?: string;
}

// ============================================================================
// BATCH GENERATION
// ============================================================================

export interface BatchItem {
  id?: string;
  type: GenerationType;
  prompt: string;
  params?: Record<string, any>;
}

export interface BatchGenerateRequest {
  items: BatchItem[];
  webhook_url?: string; // Called when batch completes
}

export interface BatchJob {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'partial_failure' | 'failed';
  items_total: number;
  items_completed: number;
  items_failed: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  webhook_url?: string;
  results?: Generation[];
  total_cost_cents: number;
}

export interface BatchGenerateResponse {
  id: string;
  status: 'accepted' | 'processing';
  items_total: number;
  created_at: string;
}

// ============================================================================
// WORKFLOWS
// ============================================================================

export interface WorkflowTriggerRequest {
  workflow_id: string;
  inputs: Record<string, any>;
  webhook_url?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  user_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  webhook_url?: string;
  cost_cents: number;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  public: boolean;
  steps: WorkflowStep[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface WorkflowStep {
  id: string;
  type: 'generation' | 'transformation' | 'filter' | 'merge';
  config: Record<string, any>;
  inputs: string[]; // references to previous steps
}

// ============================================================================
// AGENTS
// ============================================================================

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  input_schema: Record<string, any>; // JSON Schema
  output_schema: Record<string, any>;
  cost_cents?: number;
  rate_limit?: RateLimitConfig;
  public: boolean;
}

export interface AgentExecutionRequest {
  agent_id: string;
  inputs: Record<string, any>;
  webhook_url?: string;
  metadata?: Record<string, any>;
}

export interface AgentExecution {
  id: string;
  agent_id: string;
  user_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  error?: string;
  created_at: string;
  completed_at?: string;
  webhook_url?: string;
  cost_cents: number;
}

// ============================================================================
// WEBHOOKS
// ============================================================================

export interface WebhookEvent {
  id: string;
  event_type: 'generation.completed' | 'generation.failed' | 'batch.completed' | 'workflow.completed' | 'agent.completed';
  timestamp: string;
  data: Record<string, any>;
  signature: string; // HMAC-SHA256
}

export interface WebhookRetry {
  attempt: number;
  next_retry_at?: string;
  last_error?: string;
}

export interface WebhookLog {
  id: string;
  api_key_id: string;
  webhook_url: string;
  event_type: string;
  status: 'success' | 'failure' | 'pending';
  status_code?: number;
  response?: string;
  retries: WebhookRetry[];
  created_at: string;
}

// ============================================================================
// USAGE & BILLING
// ============================================================================

export interface UsageStats {
  api_key_id: string;
  period_start: string;
  period_end: string;
  requests_total: number;
  requests_by_type: Record<GenerationType, number>;
  total_cost_cents: number;
  rate_limit_exceeded_count: number;
}

export interface BillingInfo {
  api_key_id: string;
  balance_cents: number;
  month_to_date_cost_cents: number;
  estimated_month_end_cost_cents: number;
  billing_email: string;
  auto_recharge_enabled: boolean;
  auto_recharge_threshold_cents: number;
  auto_recharge_amount_cents: number;
}

// ============================================================================
// RATE LIMITING
// ============================================================================

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset_at: string;
  reset_in_seconds: number;
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

export interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export type APIErrorCode =
  | 'invalid_request'
  | 'invalid_api_key'
  | 'authentication_failed'
  | 'rate_limit_exceeded'
  | 'insufficient_balance'
  | 'resource_not_found'
  | 'invalid_parameter'
  | 'server_error'
  | 'service_unavailable';

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationParams {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}