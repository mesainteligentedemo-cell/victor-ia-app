/**
 * Product Analytics
 * User behavior tracking, funnels, retention, growth metrics
 */

import { Database } from '@supabase/supabase-js';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventName: string;
  eventCategory: string;
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  userCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface SegmentCriteria {
  planId?: string; // 'free' | 'pro' | 'business'
  minDocuments?: number;
  maxDocuments?: number;
  minCollaborators?: number;
  maxCollaborators?: number;
  daysActive?: number;
  createdAfter?: number;
  createdBefore?: number;
  lastActiveAfter?: number;
  lastActiveBefore?: number;
  signupSource?: string;
  country?: string;
}

export interface FunnelStep {
  name: string;
  eventName: string;
  userCount: number;
  dropoffRate: number;
  timeToComplete: number; // seconds
}

export interface FunnelMetrics {
  name: string;
  steps: FunnelStep[];
  conversionRate: number;
  totalUsers: number;
  completedUsers: number;
}

class ProductAnalytics {
  private db: Database | null = null;
  private sessionId: string = this.generateSessionId();

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Track analytics event
   */
  async trackEvent(
    userId: string,
    eventName: string,
    properties?: Record<string, any>,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<AnalyticsEvent | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const [category] = eventName.split('.');
      const now = Date.now();

      const { data, error } = await this.db
        .from('analytics_events')
        .insert([
          {
            user_id: userId,
            event_name: eventName,
            event_category: category,
            properties: properties || {},
            timestamp: Math.floor(now / 1000),
            session_id: this.sessionId,
            ip_address: metadata?.ipAddress,
            user_agent: metadata?.userAgent,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseEvent(data);
    } catch (error) {
      console.error('Failed to track event:', error);
      return null;
    }
  }

  /**
   * Track page view
   */
  async trackPageView(userId: string, page: string): Promise<void> {
    await this.trackEvent(userId, 'page.view', {
      page,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      timestamp: Date.now(),
    });
  }

  /**
   * Track button/feature click
   */
  async trackClick(
    userId: string,
    elementName: string,
    elementText?: string
  ): Promise<void> {
    await this.trackEvent(userId, 'element.click', {
      element_name: elementName,
      element_text: elementText,
    });
  }

  /**
   * Create user segment
   */
  async createSegment(
    name: string,
    description: string,
    criteria: SegmentCriteria
  ): Promise<UserSegment | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('user_segments')
        .insert([
          {
            name,
            description,
            criteria,
            created_at: now,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseSegment(data);
    } catch (error) {
      console.error('Failed to create segment:', error);
      return null;
    }
  }

  /**
   * Get users in segment
   */
  async getSegmentUsers(segmentId: string): Promise<string[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data: segment } = await this.db
        .from('user_segments')
        .select('criteria')
        .eq('id', segmentId)
        .single();

      if (!segment) {
        return [];
      }

      const criteria = segment.criteria;
      let query = this.db.from('users').select('id');

      // Apply criteria filters
      if (criteria.planId) {
        query = query.eq('plan_id', criteria.planId);
      }
      if (criteria.minDocuments) {
        query = query.gte('document_count', criteria.minDocuments);
      }
      if (criteria.maxDocuments) {
        query = query.lte('document_count', criteria.maxDocuments);
      }
      if (criteria.daysActive) {
        const cutoffDate = Date.now() - criteria.daysActive * 24 * 60 * 60 * 1000;
        query = query.gte('last_active_at', Math.floor(cutoffDate / 1000));
      }
      if (criteria.country) {
        query = query.eq('country', criteria.country);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(u => u.id);
    } catch (error) {
      console.error('Failed to get segment users:', error);
      return [];
    }
  }

  /**
   * Get funnel metrics
   */
  async getFunnelMetrics(
    funnelSteps: string[],
    startDate: number,
    endDate: number
  ): Promise<FunnelMetrics> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const steps: FunnelStep[] = [];
      let previousStepUsers: Set<string> = new Set();

      for (let i = 0; i < funnelSteps.length; i++) {
        const eventName = funnelSteps[i];

        const { data, error } = await this.db
          .from('analytics_events')
          .select('user_id')
          .eq('event_name', eventName)
          .gte('timestamp', Math.floor(startDate / 1000))
          .lte('timestamp', Math.floor(endDate / 1000));

        if (error) {
          throw error;
        }

        const uniqueUsers = new Set((data || []).map(e => e.user_id));

        if (i === 0) {
          previousStepUsers = uniqueUsers;
        }

        const userCount = uniqueUsers.size;
        const dropoffRate =
          i === 0 ? 0 : ((previousStepUsers.size - userCount) / previousStepUsers.size) * 100;

        steps.push({
          name: eventName,
          eventName,
          userCount,
          dropoffRate,
          timeToComplete: 0, // Would calculate from timestamps
        });

        previousStepUsers = uniqueUsers;
      }

      const firstStepUsers = steps[0]?.userCount || 0;
      const lastStepUsers = steps[steps.length - 1]?.userCount || 0;
      const conversionRate =
        firstStepUsers > 0 ? (lastStepUsers / firstStepUsers) * 100 : 0;

      return {
        name: `Funnel: ${funnelSteps.join(' → ')}`,
        steps,
        conversionRate,
        totalUsers: firstStepUsers,
        completedUsers: lastStepUsers,
      };
    } catch (error) {
      console.error('Failed to get funnel metrics:', error);
      return {
        name: 'Error',
        steps: [],
        conversionRate: 0,
        totalUsers: 0,
        completedUsers: 0,
      };
    }
  }

  /**
   * Get retention metrics
   */
  async getRetentionMetrics(
    days: number = 30
  ): Promise<{ day: number; retentionRate: number }[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const cohorts: Record<number, { signups: Set<string>; active: Set<string> }> = {};

      // Get all users and their activity by day
      const { data, error } = await this.db
        .from('analytics_events')
        .select('user_id, timestamp, created_at')
        .gte('timestamp', Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000));

      if (error) {
        throw error;
      }

      // Group by cohort day
      for (const event of data || []) {
        const dayIndex = Math.floor((event.timestamp - (event.created_at || 0)) / (24 * 60 * 60));

        if (!cohorts[dayIndex]) {
          cohorts[dayIndex] = {
            signups: new Set(),
            active: new Set(),
          };
        }

        cohorts[dayIndex].active.add(event.user_id);
      }

      // Calculate retention rates
      return Object.entries(cohorts)
        .map(([day, data]) => ({
          day: parseInt(day),
          retentionRate: (data.active.size / data.signups.size) * 100,
        }))
        .sort((a, b) => a.day - b.day);
    } catch (error) {
      console.error('Failed to get retention metrics:', error);
      return [];
    }
  }

  /**
   * Get cohort analysis
   */
  async getCohortAnalysis(granularity: 'day' | 'week' | 'month' = 'week'): Promise<any> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('users')
        .select('id, created_at')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Group users by signup cohort
      const cohorts: Record<string, { count: number; revenue: number }> = {};

      for (const user of data || []) {
        const cohortKey = this._getCohortKey(user.created_at, granularity);

        if (!cohorts[cohortKey]) {
          cohorts[cohortKey] = { count: 0, revenue: 0 };
        }

        cohorts[cohortKey].count++;
      }

      return cohorts;
    } catch (error) {
      console.error('Failed to get cohort analysis:', error);
      return {};
    }
  }

  /**
   * Track custom event (flexible)
   */
  async trackCustom(
    userId: string,
    eventType: string,
    data: Record<string, any>
  ): Promise<void> {
    await this.trackEvent(userId, `custom.${eventType}`, data);
  }

  // Private helpers

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private _getCohortKey(timestamp: number, granularity: string): string {
    const date = new Date(timestamp);

    switch (granularity) {
      case 'day':
        return date.toISOString().split('T')[0];
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().split('T')[0];
      case 'month':
        return date.toISOString().slice(0, 7);
      default:
        return '';
    }
  }

  private _mapDatabaseEvent(data: any): AnalyticsEvent {
    return {
      id: data.id,
      userId: data.user_id,
      eventName: data.event_name,
      eventCategory: data.event_category,
      properties: data.properties,
      timestamp: data.timestamp * 1000,
      sessionId: data.session_id,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
    };
  }

  private _mapDatabaseSegment(data: any): UserSegment {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      criteria: data.criteria,
      userCount: data.user_count || 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export default ProductAnalytics;