// Automation: Comprehensive Workflow Management

export type WorkflowStatus = 'active' | 'inactive' | 'paused' | 'error';
export type TriggerType = 'on-demand' | 'scheduled' | 'event-based' | 'webhook';
export type ActionType =
  | 'generate-image'
  | 'generate-video'
  | 'write-copy'
  | 'post-social'
  | 'send-email'
  | 'create-asset'
  | 'transform-data'
  | 'conditional-branch'
  | 'loop-batch'
  | 'delay';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type ExecutionStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

// ===== WORKFLOW CORE TYPES =====

export interface WorkflowTrigger {
  type: TriggerType;
  config: {
    // On-demand: no additional config needed
    // Scheduled
    frequency?: ScheduleFrequency;
    cronExpression?: string; // e.g., "0 9 * * 1" (Monday 9am)
    timezone?: string; // e.g., "America/Mexico_City"
    // Event-based
    event?: string; // e.g., "new-lead", "customer-purchase"
    // Webhook
    webhookPath?: string;
    webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  };
}

export interface WorkflowAction {
  id: string;
  type: ActionType;
  name: string;
  order: number;
  config: {
    // Generate Image
    imagePrompt?: string;
    imageStyle?: string;
    imageModel?: string;

    // Generate Video
    videoPrompt?: string;
    videoDuration?: number;
    videoFormat?: 'mp4' | 'webm';

    // Write Copy
    copyType?: 'social-post' | 'email' | 'landing-page' | 'blog-post';
    copyTone?: string;
    copyLength?: 'short' | 'medium' | 'long';

    // Post Social
    platforms?: ('twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok')[];
    scheduleTime?: string;

    // Send Email
    emailRecipients?: string[];
    emailTemplate?: string;
    emailSubject?: string;

    // Conditional
    condition?: {
      field: string;
      operator: 'equals' | 'contains' | 'greater' | 'less' | 'exists';
      value: string | number;
    };

    // Loop
    iterations?: number;
    loopVariablePrefix?: string;

    // Delay
    delaySeconds?: number;
  };
  inputs?: string[]; // References to previous action outputs
  outputs?: string[]; // Output variable names
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  isTemplate: boolean;
  templateCategory?: 'content-creation' | 'lead-nurture' | 'product-launch' | 'weekly-content' | 'custom';
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  nextScheduledRun?: Date;
  lastRunAt?: Date;
  lastRunStatus?: ExecutionStatus;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  avgExecutionTime?: number; // in seconds
  creditsCostPerRun?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  executionTime?: number; // in seconds
  creditsUsed?: number;
  triggerSource?: 'manual' | 'scheduled' | 'event' | 'webhook';
  triggerData?: Record<string, unknown>;

  // Step-by-step execution
  stepExecutions: StepExecution[];

  // Final output
  outputs?: Record<string, unknown>;
  errors?: WorkflowError[];
}

export interface StepExecution {
  actionId: string;
  actionName: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  executionTime?: number;
  creditsUsed?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
}

export interface WorkflowError {
  actionId: string;
  actionName: string;
  message: string;
  code?: string;
  timestamp: Date;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'content-creation' | 'lead-nurture' | 'product-launch' | 'weekly-content';
  thumbnail?: string;
  previewImage?: string;
  workflow: Workflow;
  usageCount: number;
  rating?: number;
  createdAt: Date;
}

// ===== SCHEDULE/CRON TYPES =====

export interface WorkflowSchedule {
  id: string;
  workflowId: string;
  frequency: ScheduleFrequency;
  cronExpression: string;
  timezone: string;
  nextRun?: Date;
  lastRun?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ===== LEGACY N8n TYPES (kept for backward compatibility) =====

export type WebhookMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface N8nWorkflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  n8nWorkflowId: string;
  trigger: {
    type: string;
    config: Record<string, unknown>;
  };
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    config: Record<string, unknown>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface N8nWebhook {
  id: string;
  workflowId: string;
  path: string;
  method: WebhookMethod;
  description?: string;
  active: boolean;
  secret?: string;
  createdAt: Date;
}

export interface WebhookExecution {
  id: string;
  webhookId: string;
  method: WebhookMethod;
  payload: Record<string, unknown>;
  response?: Record<string, unknown>;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  executedAt: Date;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  status: 'success' | 'failed';
  executionTime: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  executedAt: Date;
}