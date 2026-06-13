/**
 * Onboarding Manager
 * User onboarding flows, in-app guidance, and customer success tracking
 */

import { Database } from '@supabase/supabase-js';

export interface OnboardingFlow {
  id: string;
  userId: string;
  planId: string; // 'free' | 'pro' | 'business'
  currentStep: number;
  completedSteps: string[];
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: number;
  completedAt?: number;
  metrics: {
    timeToFirstDocument: number; // seconds
    timeToFirstCollaborator: number; // seconds
    timeToCompletion: number; // seconds
  };
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string; // 'create_document' | 'invite_collaborator' | 'enable_feature'
  estimatedMinutes: number;
  reward?: {
    type: 'badge' | 'credit' | 'feature_unlock';
    value: string;
  };
}

export interface InAppGuide {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
  triggerEvent: string; // 'feature_accessed' | 'user_action'
  targetSegments?: string[];
  hasBeenShown: boolean;
  dismissedAt?: number;
}

export interface GuideStep {
  order: number;
  title: string;
  content: string;
  targetElement?: string; // CSS selector to highlight
  actionButton?: {
    text: string;
    action: string;
  };
}

class OnboardingManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create onboarding flow for user
   */
  async createOnboardingFlow(userId: string, planId: string): Promise<OnboardingFlow | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('onboarding_flows')
        .insert([
          {
            user_id: userId,
            plan_id: planId,
            current_step: 0,
            completed_steps: [],
            status: 'in_progress',
            started_at: Math.floor(now / 1000),
            metrics: {
              timeToFirstDocument: 0,
              timeToFirstCollaborator: 0,
              timeToCompletion: 0,
            },
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseFlow(data);
    } catch (error) {
      console.error('Failed to create onboarding flow:', error);
      return null;
    }
  }

  /**
   * Get onboarding tasks for user
   */
  async getOnboardingTasks(planId: string): Promise<OnboardingTask[]> {
    const tasks: Record<string, OnboardingTask[]> = {
      free: [
        {
          id: 'create_first_doc',
          title: 'Create your first document',
          description: 'Start documenting your ideas',
          icon: '📝',
          action: 'create_document',
          estimatedMinutes: 5,
          reward: { type: 'badge', value: '📝 Document Creator' },
        },
        {
          id: 'invite_team',
          title: 'Invite a team member',
          description: 'Collaborate with your team',
          icon: '👥',
          action: 'invite_collaborator',
          estimatedMinutes: 3,
          reward: { type: 'badge', value: '👥 Team Builder' },
        },
        {
          id: 'try_ai',
          title: 'Try AI features',
          description: 'Let AI help you write',
          icon: '✨',
          action: 'enable_feature',
          estimatedMinutes: 5,
          reward: { type: 'credit', value: '$5 credit' },
        },
      ],
      pro: [
        {
          id: 'team_workspace',
          title: 'Set up workspace',
          description: 'Organize your team workspace',
          icon: '🏢',
          action: 'create_document',
          estimatedMinutes: 10,
          reward: { type: 'badge', value: '🏢 Workspace Manager' },
        },
        {
          id: 'permissions',
          title: 'Configure permissions',
          description: 'Control who can access what',
          icon: '🔒',
          action: 'enable_feature',
          estimatedMinutes: 5,
          reward: { type: 'badge', value: '🔒 Security Expert' },
        },
        {
          id: 'integrations',
          title: 'Connect tools',
          description: 'Integrate with Slack, Zapier, etc.',
          icon: '🔗',
          action: 'enable_feature',
          estimatedMinutes: 10,
          reward: { type: 'feature_unlock', value: 'advanced_integrations' },
        },
      ],
      business: [
        {
          id: 'sso_setup',
          title: 'Configure SSO',
          description: 'Set up single sign-on',
          icon: '🔐',
          action: 'enable_feature',
          estimatedMinutes: 15,
          reward: { type: 'badge', value: '🔐 Enterprise Admin' },
        },
        {
          id: 'audit_review',
          title: 'Review audit logs',
          description: 'Understand compliance & security',
          icon: '📋',
          action: 'enable_feature',
          estimatedMinutes: 10,
          reward: { type: 'badge', value: '📋 Compliance Master' },
        },
      ],
    };

    return tasks[planId] || tasks.free;
  }

  /**
   * Complete onboarding task
   */
  async completeTask(
    flowId: string,
    taskId: string,
    timeSpentSeconds: number
  ): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Get current flow
      const { data: flow } = await this.db
        .from('onboarding_flows')
        .select('completed_steps, metrics')
        .eq('id', flowId)
        .single();

      if (!flow) {
        return false;
      }

      const updatedSteps = [...(flow.completed_steps || []), taskId];
      const now = Date.now();

      // Update metrics based on task
      let updatedMetrics = { ...flow.metrics };
      if (taskId === 'create_first_doc' && updatedMetrics.timeToFirstDocument === 0) {
        updatedMetrics.timeToFirstDocument = timeSpentSeconds;
      }
      if (taskId === 'invite_team' && updatedMetrics.timeToFirstCollaborator === 0) {
        updatedMetrics.timeToFirstCollaborator = timeSpentSeconds;
      }

      // Update flow
      await this.db
        .from('onboarding_flows')
        .update({
          completed_steps: updatedSteps,
          metrics: updatedMetrics,
        })
        .eq('id', flowId);

      return true;
    } catch (error) {
      console.error('Failed to complete task:', error);
      return false;
    }
  }

  /**
   * Complete onboarding flow
   */
  async completeOnboarding(flowId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data: flow } = await this.db
        .from('onboarding_flows')
        .select('started_at')
        .eq('id', flowId)
        .single();

      if (!flow) {
        return false;
      }

      const timeToCompletion = Math.floor((now - flow.started_at * 1000) / 1000);

      await this.db
        .from('onboarding_flows')
        .update({
          status: 'completed',
          completed_at: Math.floor(now / 1000),
          metrics: {
            timeToCompletion,
          },
        })
        .eq('id', flowId);

      return true;
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      return false;
    }
  }

  /**
   * Get in-app guide
   */
  async getGuide(guideId: string): Promise<InAppGuide | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('in_app_guides')
        .select('*')
        .eq('id', guideId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseGuide(data);
    } catch (error) {
      console.error('Failed to get guide:', error);
      return null;
    }
  }

  /**
   * Mark guide as dismissed
   */
  async dismissGuide(guideId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('in_app_guides')
        .update({
          dismissed_at: Math.floor(Date.now() / 1000),
        })
        .eq('id', guideId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to dismiss guide:', error);
      return false;
    }
  }

  /**
   * Get onboarding progress
   */
  async getProgress(flowId: string): Promise<{ progress: number; completed: number; total: number } | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data: flow } = await this.db
        .from('onboarding_flows')
        .select('completed_steps, plan_id')
        .eq('id', flowId)
        .single();

      if (!flow) {
        return null;
      }

      const tasks = await this.getOnboardingTasks(flow.plan_id);
      const completed = flow.completed_steps?.length || 0;
      const total = tasks.length;
      const progress = Math.round((completed / total) * 100);

      return { progress, completed, total };
    } catch (error) {
      console.error('Failed to get progress:', error);
      return null;
    }
  }

  // Private helpers

  private _mapDatabaseFlow(data: any): OnboardingFlow {
    return {
      id: data.id,
      userId: data.user_id,
      planId: data.plan_id,
      currentStep: data.current_step,
      completedSteps: data.completed_steps || [],
      status: data.status,
      startedAt: data.started_at * 1000,
      completedAt: data.completed_at ? data.completed_at * 1000 : undefined,
      metrics: data.metrics,
    };
  }

  private _mapDatabaseGuide(data: any): InAppGuide {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      steps: data.steps,
      triggerEvent: data.trigger_event,
      targetSegments: data.target_segments,
      hasBeenShown: !!data.dismissed_at,
      dismissedAt: data.dismissed_at ? data.dismissed_at * 1000 : undefined,
    };
  }
}

export default OnboardingManager;