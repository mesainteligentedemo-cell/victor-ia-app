// Automation: n8n webhooks and workflows

export type WorkflowStatus = 'active' | 'inactive' | 'error';
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