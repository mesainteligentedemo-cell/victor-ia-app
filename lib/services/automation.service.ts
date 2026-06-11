import { N8nWorkflow, N8nWebhook, WebhookExecution } from '@/lib/types';
import { db } from '@/lib/db/supabase';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5679';

export const AutomationService = {
  async createWebhook(workflowId: string, path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<N8nWebhook> {
    const webhook: N8nWebhook = {
      id: Math.random().toString(36).substring(7),
      workflowId,
      path,
      method,
      active: true,
      createdAt: new Date()
    };

    await db.from('webhooks').insert(webhook);
    return webhook;
  },

  async deleteWebhook(webhookId: string): Promise<void> {
    await db.from('webhooks').delete().eq('id', webhookId);
  },

  async executeWorkflow(workflowId: string, data: any): Promise<any> {
    const response = await fetch(`${N8N_BASE_URL}/webhook/trigger/${workflowId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // Log execution
    await db.from('workflow_executions').insert({
      workflow_id: workflowId,
      status: response.ok ? 'success' : 'failed',
      input: data,
      output: result,
      executed_at: new Date()
    });

    return result;
  },

  async getWorkflowStatus(executionId: string): Promise<any> {
    const { data } = await db
      .from('workflow_executions')
      .select('*')
      .eq('id', executionId)
      .single();
    return data;
  },

  async listWorkflows(userId: string): Promise<N8nWorkflow[]> {
    const { data } = await db
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  }
};