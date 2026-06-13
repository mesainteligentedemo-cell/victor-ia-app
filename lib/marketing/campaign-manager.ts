/**
 * Campaign Manager
 * Email marketing, drip campaigns, nurture sequences
 */

import { Database } from '@supabase/supabase-js';

export interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  type: 'promotional' | 'educational' | 'transactional' | 'nurture';
  subject: string;
  htmlContent: string;
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  scheduledTime?: number;
  sentTime?: number;
  targetSegmentId?: string;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  createdAt: number;
  updatedAt: number;
}

export interface DripCampaign {
  id: string;
  name: string;
  description: string;
  triggerEvent: string; // 'user.signup', 'user.free_trial_ending', etc.
  emails: DripEmail[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DripEmail {
  order: number; // 1st email, 2nd email, etc.
  delayDays: number; // Send N days after trigger
  subject: string;
  htmlContent: string;
  cta: {
    text: string;
    url: string;
  };
}

export interface EmailMetrics {
  campaignId: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounced: number;
  unsubscribed: number;
  openRate: number; // %
  clickRate: number; // %
  conversionRate: number; // %
  unsubscribeRate: number; // %
}

class CampaignManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create email campaign
   */
  async createCampaign(
    name: string,
    options: {
      description?: string;
      type: 'promotional' | 'educational' | 'transactional' | 'nurture';
      subject: string;
      htmlContent: string;
      targetSegmentId?: string;
    }
  ): Promise<EmailCampaign | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('email_campaigns')
        .insert([
          {
            name,
            description: options.description,
            type: options.type,
            subject: options.subject,
            html_content: options.htmlContent,
            status: 'draft',
            target_segment_id: options.targetSegmentId,
            metrics: {
              sent: 0,
              opened: 0,
              clicked: 0,
              converted: 0,
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

      return this._mapDatabaseCampaign(data);
    } catch (error) {
      console.error('Failed to create campaign:', error);
      return null;
    }
  }

  /**
   * Create drip campaign (automated sequence)
   */
  async createDripCampaign(
    name: string,
    triggerEvent: string,
    emails: DripEmail[]
  ): Promise<DripCampaign | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('drip_campaigns')
        .insert([
          {
            name,
            trigger_event: triggerEvent,
            emails,
            is_active: false,
            created_at: now,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseDripCampaign(data);
    } catch (error) {
      console.error('Failed to create drip campaign:', error);
      return null;
    }
  }

  /**
   * Schedule campaign
   */
  async scheduleCampaign(campaignId: string, scheduledTime: number): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('email_campaigns')
        .update({
          status: 'scheduled',
          scheduled_time: Math.floor(scheduledTime / 1000),
          updated_at: Date.now(),
        })
        .eq('id', campaignId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to schedule campaign:', error);
      return false;
    }
  }

  /**
   * Send campaign immediately
   */
  async sendCampaign(campaignId: string, dryRun: boolean = false): Promise<number> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const campaign = await this.getCampaign(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Get target users
      let targetUsers: string[] = [];
      if (campaign.targetSegmentId) {
        // Get segment users
        targetUsers = await this._getSegmentUsers(campaign.targetSegmentId);
      } else {
        // Get all users
        targetUsers = await this._getAllUsers();
      }

      if (dryRun) {
        return targetUsers.length;
      }

      // Send emails (would call SendGrid API in production)
      for (const userId of targetUsers) {
        await this._sendEmail(userId, campaign);
      }

      // Update campaign metrics
      await this.db
        .from('email_campaigns')
        .update({
          status: 'sent',
          sent_time: Math.floor(Date.now() / 1000),
          metrics: {
            sent: targetUsers.length,
            opened: 0,
            clicked: 0,
            converted: 0,
          },
        })
        .eq('id', campaignId);

      return targetUsers.length;
    } catch (error) {
      console.error('Failed to send campaign:', error);
      return 0;
    }
  }

  /**
   * Get campaign metrics
   */
  async getCampaignMetrics(campaignId: string): Promise<EmailMetrics | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('email_campaigns')
        .select('metrics')
        .eq('id', campaignId)
        .single();

      if (error) {
        return null;
      }

      const metrics = data.metrics;
      const sent = metrics.sent || 1; // Avoid division by zero

      return {
        campaignId,
        sent: metrics.sent,
        delivered: metrics.sent, // Assume all delivered
        opened: metrics.opened || 0,
        clicked: metrics.clicked || 0,
        converted: metrics.converted || 0,
        bounced: 0,
        unsubscribed: 0,
        openRate: (metrics.opened / sent) * 100,
        clickRate: (metrics.clicked / sent) * 100,
        conversionRate: (metrics.converted / sent) * 100,
        unsubscribeRate: 0,
      };
    } catch (error) {
      console.error('Failed to get campaign metrics:', error);
      return null;
    }
  }

  /**
   * Get campaign
   */
  async getCampaign(campaignId: string): Promise<EmailCampaign | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('email_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseCampaign(data);
    } catch (error) {
      console.error('Failed to get campaign:', error);
      return null;
    }
  }

  /**
   * List campaigns
   */
  async listCampaigns(): Promise<EmailCampaign[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(c => this._mapDatabaseCampaign(c));
    } catch (error) {
      console.error('Failed to list campaigns:', error);
      return [];
    }
  }

  // Private helpers

  private async _getSegmentUsers(segmentId: string): Promise<string[]> {
    // In production, would fetch from user_segments
    return [];
  }

  private async _getAllUsers(): Promise<string[]> {
    if (!this.db) return [];
    const { data } = await this.db.from('users').select('id');
    return (data || []).map(u => u.id);
  }

  private async _sendEmail(userId: string, campaign: EmailCampaign): Promise<void> {
    // In production, would call SendGrid API
    console.log(`Sending ${campaign.type} email to user ${userId}`);
  }

  private _mapDatabaseCampaign(data: any): EmailCampaign {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      subject: data.subject,
      htmlContent: data.html_content,
      status: data.status,
      scheduledTime: data.scheduled_time ? data.scheduled_time * 1000 : undefined,
      sentTime: data.sent_time ? data.sent_time * 1000 : undefined,
      targetSegmentId: data.target_segment_id,
      metrics: data.metrics,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private _mapDatabaseDripCampaign(data: any): DripCampaign {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      triggerEvent: data.trigger_event,
      emails: data.emails,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export default CampaignManager;