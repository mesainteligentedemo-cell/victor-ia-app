/**
 * Marketing Automation
 * Automated workflows, triggers, and nurture sequences
 */

import { Database } from '@supabase/supabase-js';

export interface MarketingWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  isActive: boolean;
  metrics: {
    entrances: number;
    completions: number;
    conversions: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface WorkflowTrigger {
  type: 'event' | 'date' | 'behavior' | 'segment';
  condition: string; // 'user.signup', 'trial_ending', 'high_engagement', etc.
}

export interface WorkflowStep {
  id: string;
  type: 'email' | 'sms' | 'wait' | 'condition' | 'action';
  delayDays?: number;
  content?: {
    subject?: string;
    template?: string;
    message?: string;
  };
  conditions?: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
    value: any;
  }[];
  action?: string; // 'upgrade_prompt', 'win_back', etc.
}

class MarketingAutomation {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create marketing workflow
   */
  async createWorkflow(
    name: string,
    trigger: WorkflowTrigger,
    steps: WorkflowStep[]
  ): Promise<MarketingWorkflow | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('marketing_workflows')
        .insert([
          {
            name,
            trigger,
            steps,
            is_active: false,
            metrics: {
              entrances: 0,
              completions: 0,
              conversions: 0,
            },
            created_at: now,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseWorkflow(data);
    } catch (error) {
      console.error('Failed to create workflow:', error);
      return null;
    }
  }

  /**
   * Activate workflow
   */
  async activateWorkflow(workflowId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('marketing_workflows')
        .update({
          is_active: true,
          updated_at: Date.now(),
        })
        .eq('id', workflowId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to activate workflow:', error);
      return false;
    }
  }

  /**
   * Enroll user in workflow
   */
  async enrollUser(userId: string, workflowId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { error } = await this.db.from('workflow_enrollments').insert([
        {
          user_id: userId,
          workflow_id: workflowId,
          current_step: 0,
          entered_at: Math.floor(now / 1000),
          status: 'active',
        },
      ]);

      if (error) {
        throw error;
      }

      // Increment entrance count
      await this.db
        .from('marketing_workflows')
        .update({
          metrics: this.db.raw("jsonb_set(metrics, '{entrances}', (metrics->>'entrances')::int + 1)"),
        })
        .eq('id', workflowId);

      return true;
    } catch (error) {
      console.error('Failed to enroll user:', error);
      return false;
    }
  }

  /**
   * Process workflow step for user
   */
  async processWorkflowStep(userId: string, workflowId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        return false;
      }

      // Get enrollment
      const { data: enrollment } = await this.db
        .from('workflow_enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('workflow_id', workflowId)
        .single();

      if (!enrollment) {
        return false;
      }

      const currentStep = workflow.steps[enrollment.current_step];
      if (!currentStep) {
        return false;
      }

      // Execute step
      switch (currentStep.type) {
        case 'email':
          await this._sendWorkflowEmail(userId, currentStep);
          break;
        case 'sms':
          // Would send SMS
          break;
        case 'wait':
          // Just move to next step after delay
          break;
        case 'action':
          await this._executeAction(userId, currentStep);
          break;
      }

      // Move to next step
      const nextStep = enrollment.current_step + 1;

      if (nextStep >= workflow.steps.length) {
        // Workflow complete
        await this.db
          .from('workflow_enrollments')
          .update({
            status: 'completed',
          })
          .eq('id', enrollment.id);

        // Increment completion count
        await this.db
          .from('marketing_workflows')
          .update({
            metrics: this.db.raw("jsonb_set(metrics, '{completions}', (metrics->>'completions')::int + 1)"),
          })
          .eq('id', workflowId);
      } else {
        // Move to next step
        await this.db
          .from('workflow_enrollments')
          .update({
            current_step: nextStep,
          })
          .eq('id', enrollment.id);
      }

      return true;
    } catch (error) {
      console.error('Failed to process workflow step:', error);
      return false;
    }
  }

  /**
   * Get workflow
   */
  async getWorkflow(workflowId: string): Promise<MarketingWorkflow | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('marketing_workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseWorkflow(data);
    } catch (error) {
      console.error('Failed to get workflow:', error);
      return null;
    }
  }

  /**
   * List workflows
   */
  async listWorkflows(): Promise<MarketingWorkflow[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('marketing_workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(w => this._mapDatabaseWorkflow(w));
    } catch (error) {
      console.error('Failed to list workflows:', error);
      return [];
    }
  }

  // Private helpers

  private async _sendWorkflowEmail(userId: string, step: WorkflowStep): Promise<void> {
    if (!step.content) return;

    console.log(`Sending workflow email to ${userId}:`, {
      subject: step.content.subject,
      template: step.content.template,
    });

    // In production, would call SendGrid API
  }

  private async _executeAction(userId: string, step: WorkflowStep): Promise<void> {
    console.log(`Executing action for ${userId}:`, step.action);

    // Common actions
    switch (step.action) {
      case 'upgrade_prompt':
        // Send upgrade email
        break;
      case 'win_back':
        // Send re-engagement email
        break;
      case 'feature_announcement':
        // Send feature announcement
        break;
    }
  }

  private _mapDatabaseWorkflow(data: any): MarketingWorkflow {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      steps: data.steps,
      isActive: data.is_active,
      metrics: data.metrics,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export default MarketingAutomation;