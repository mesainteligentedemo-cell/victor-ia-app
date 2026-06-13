/**
 * Usage Meter
 * Track and bill for metered usage (API calls, storage, etc)
 */

import { Database } from '@supabase/supabase-js';

export interface UsageRecord {
  id: string;
  userId: string;
  metric: 'api_calls' | 'storage_gb' | 'collaborators' | 'documents' | 'exports';
  amount: number;
  timestamp: number;
  period: string; // YYYY-MM
  createdAt: number;
}

export interface UsageThreshold {
  metric: string;
  freeLimit: number;
  proLimit: number;
  businessLimit: number;
  costPerUnit: number; // in cents
}

export const USAGE_THRESHOLDS: Record<string, UsageThreshold> = {
  api_calls: {
    metric: 'api_calls',
    freeLimit: 1000,
    proLimit: 100000,
    businessLimit: 1000000,
    costPerUnit: 0.0001, // $0.0001 per API call
  },
  storage_gb: {
    metric: 'storage_gb',
    freeLimit: 1,
    proLimit: 100,
    businessLimit: 1000,
    costPerUnit: 0.1, // $0.10 per GB
  },
  collaborators: {
    metric: 'collaborators',
    freeLimit: 2,
    proLimit: 10,
    businessLimit: 999,
    costPerUnit: 5, // $5 per additional collaborator
  },
  documents: {
    metric: 'documents',
    freeLimit: 3,
    proLimit: 999,
    businessLimit: 999,
    costPerUnit: 0,
  },
  exports: {
    metric: 'exports',
    freeLimit: 10,
    proLimit: 1000,
    businessLimit: 10000,
    costPerUnit: 0.05, // $0.05 per export
  },
};

class UsageMeter {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Record usage event
   */
  async recordUsage(
    userId: string,
    metric: string,
    amount: number
  ): Promise<UsageRecord | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();
      const period = new Date(now).toISOString().slice(0, 7); // YYYY-MM

      const { data, error } = await this.db
        .from('usage_records')
        .insert([
          {
            user_id: userId,
            metric,
            amount,
            timestamp: Math.floor(now / 1000),
            period,
            created_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseUsageRecord(data);
    } catch (error) {
      console.error('Failed to record usage:', error);
      return null;
    }
  }

  /**
   * Get usage for current period
   */
  async getUsageForPeriod(
    userId: string,
    metric: string,
    period: string
  ): Promise<number> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('usage_records')
        .select('amount')
        .eq('user_id', userId)
        .eq('metric', metric)
        .eq('period', period);

      if (error) {
        throw error;
      }

      return data.reduce((sum, record) => sum + record.amount, 0);
    } catch (error) {
      console.error('Failed to get usage for period:', error);
      return 0;
    }
  }

  /**
   * Check if usage exceeds limit for plan
   */
  async isUsageExceeded(
    userId: string,
    planId: string,
    metric: string
  ): Promise<boolean> {
    try {
      const period = new Date().toISOString().slice(0, 7);
      const currentUsage = await this.getUsageForPeriod(userId, metric, period);
      const threshold = USAGE_THRESHOLDS[metric];

      if (!threshold) {
        return false;
      }

      const limits: Record<string, number> = {
        free: threshold.freeLimit,
        pro: threshold.proLimit,
        business: threshold.businessLimit,
      };

      const limit = limits[planId] || 0;
      return currentUsage > limit;
    } catch (error) {
      console.error('Failed to check if usage exceeded:', error);
      return false;
    }
  }

  /**
   * Calculate overage cost
   */
  async calculateOverageCost(
    userId: string,
    planId: string,
    metric: string
  ): Promise<number> {
    try {
      const period = new Date().toISOString().slice(0, 7);
      const currentUsage = await this.getUsageForPeriod(userId, metric, period);
      const threshold = USAGE_THRESHOLDS[metric];

      if (!threshold) {
        return 0;
      }

      const limits: Record<string, number> = {
        free: threshold.freeLimit,
        pro: threshold.proLimit,
        business: threshold.businessLimit,
      };

      const limit = limits[planId] || 0;
      const overage = Math.max(0, currentUsage - limit);

      return Math.ceil(overage * threshold.costPerUnit * 100); // Return in cents
    } catch (error) {
      console.error('Failed to calculate overage cost:', error);
      return 0;
    }
  }

  /**
   * Get usage summary for user
   */
  async getUsageSummary(userId: string): Promise<Record<string, number>> {
    try {
      const period = new Date().toISOString().slice(0, 7);
      const summary: Record<string, number> = {};

      for (const metric of Object.keys(USAGE_THRESHOLDS)) {
        const usage = await this.getUsageForPeriod(userId, metric, period);
        summary[metric] = usage;
      }

      return summary;
    } catch (error) {
      console.error('Failed to get usage summary:', error);
      return {};
    }
  }

  /**
   * Get usage history (last 12 months)
   */
  async getUsageHistory(
    userId: string,
    metric: string
  ): Promise<{ period: string; amount: number }[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('usage_records')
        .select('period, amount')
        .eq('user_id', userId)
        .eq('metric', metric)
        .order('period', { ascending: false })
        .limit(12);

      if (error) {
        throw error;
      }

      // Group by period
      const grouped: Record<string, number> = {};
      for (const record of data) {
        grouped[record.period] = (grouped[record.period] || 0) + record.amount;
      }

      return Object.entries(grouped).map(([period, amount]) => ({
        period,
        amount,
      }));
    } catch (error) {
      console.error('Failed to get usage history:', error);
      return [];
    }
  }

  /**
   * Alert if usage approaching limit
   */
  async checkUsageAlerts(
    userId: string,
    planId: string
  ): Promise<
    { metric: string; currentUsage: number; limit: number; percentage: number }[]
  > {
    try {
      const alerts = [];
      const period = new Date().toISOString().slice(0, 7);

      for (const [metricName, threshold] of Object.entries(USAGE_THRESHOLDS)) {
        const currentUsage = await this.getUsageForPeriod(
          userId,
          metricName,
          period
        );

        const limits: Record<string, number> = {
          free: threshold.freeLimit,
          pro: threshold.proLimit,
          business: threshold.businessLimit,
        };

        const limit = limits[planId] || threshold.freeLimit;
        const percentage = (currentUsage / limit) * 100;

        // Alert if usage > 80%
        if (percentage > 80) {
          alerts.push({
            metric: metricName,
            currentUsage,
            limit,
            percentage: Math.round(percentage),
          });
        }
      }

      return alerts;
    } catch (error) {
      console.error('Failed to check usage alerts:', error);
      return [];
    }
  }

  /**
   * Map database usage record to interface
   */
  private _mapDatabaseUsageRecord(data: any): UsageRecord {
    return {
      id: data.id,
      userId: data.user_id,
      metric: data.metric,
      amount: data.amount,
      timestamp: data.timestamp,
      period: data.period,
      createdAt: data.created_at,
    };
  }
}

export default UsageMeter;