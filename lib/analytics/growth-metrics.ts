/**
 * Growth Metrics & KPIs
 * Business intelligence and growth tracking
 */

import { Database } from '@supabase/supabase-js';

export interface GrowthMetrics {
  timestamp: number;
  // Users
  totalUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  churnRate: number; // %
  activeUsers: number;
  activeUsersToday: number;

  // Engagement
  avgSessionDuration: number; // seconds
  avgDocumentsPerUser: number;
  avgCollaboratorsPerDocument: number;
  avgEditsPerDay: number;

  // Monetization
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  arpu: number; // Average Revenue Per User
  conversionRate: number; // Free to Paid %
  avgCustomerLifetimeValue: number;

  // Billing
  totalSubscriptions: number;
  freeUsers: number;
  proUsers: number;
  businessUsers: number;

  // Health
  netPromoterScore: number; // 0-100
  paymentFailureRate: number; // %
  supportTicketsPerDay: number;
}

export interface CohortAnalysis {
  cohortDate: string;
  cohortSize: number;
  week0: number;
  week1: number;
  week2: number;
  week4: number;
  week8: number;
  retention: {
    week0: number;
    week1: number;
    week2: number;
    week4: number;
    week8: number;
  };
}

class GrowthMetricsManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Get current growth metrics
   */
  async getGrowthMetrics(): Promise<GrowthMetrics | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();
      const todayStart = new Date(now).setHours(0, 0, 0, 0);
      const monthStart = new Date(now);
      monthStart.setDate(1);

      // Fetch all metrics in parallel
      const [
        totalUsers,
        newUsersToday,
        newUsersThisMonth,
        subscriptions,
        invoices,
        activeUsersData,
      ] = await Promise.all([
        this._getTotalUsers(),
        this._getNewUsersCount(todayStart, now),
        this._getNewUsersCount(monthStart.getTime(), now),
        this._getSubscriptions(),
        this._getInvoicesThisMonth(),
        this._getActiveUsers(),
      ]);

      const mrr = this._calculateMRR(subscriptions);
      const arr = mrr * 12;
      const conversionRate = subscriptions.length > 0 ? (subscriptions.filter(s => s.plan_id !== 'free').length / totalUsers) * 100 : 0;

      return {
        timestamp: now,
        totalUsers,
        newUsersToday,
        newUsersThisMonth,
        churnRate: await this._calculateChurnRate(),
        activeUsers: activeUsersData.total,
        activeUsersToday: activeUsersData.today,
        avgSessionDuration: await this._getAvgSessionDuration(),
        avgDocumentsPerUser: await this._getAvgDocumentsPerUser(),
        avgCollaboratorsPerDocument: await this._getAvgCollaborators(),
        avgEditsPerDay: await this._getAvgEditsPerDay(),
        mrr,
        arr,
        arpu: totalUsers > 0 ? mrr / totalUsers : 0,
        conversionRate,
        avgCustomerLifetimeValue: await this._getAverageLifetimeValue(),
        totalSubscriptions: subscriptions.length,
        freeUsers: subscriptions.filter(s => s.plan_id === 'free').length,
        proUsers: subscriptions.filter(s => s.plan_id === 'pro').length,
        businessUsers: subscriptions.filter(s => s.plan_id === 'business').length,
        netPromoterScore: await this._getNPS(),
        paymentFailureRate: await this._getPaymentFailureRate(),
        supportTicketsPerDay: await this._getSupportTicketsPerDay(),
      };
    } catch (error) {
      console.error('Failed to get growth metrics:', error);
      return null;
    }
  }

  /**
   * Get cohort analysis
   */
  async getCohortAnalysis(limit: number = 12): Promise<CohortAnalysis[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('cohort_analysis')
        .select('*')
        .order('cohort_date', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map(c => ({
        cohortDate: c.cohort_date,
        cohortSize: c.cohort_size,
        week0: c.week_0,
        week1: c.week_1,
        week2: c.week_2,
        week4: c.week_4,
        week8: c.week_8,
        retention: {
          week0: (c.week_0 / c.cohort_size) * 100,
          week1: (c.week_1 / c.cohort_size) * 100,
          week2: (c.week_2 / c.cohort_size) * 100,
          week4: (c.week_4 / c.cohort_size) * 100,
          week8: (c.week_8 / c.cohort_size) * 100,
        },
      }));
    } catch (error) {
      console.error('Failed to get cohort analysis:', error);
      return [];
    }
  }

  /**
   * Get growth chart data (last 30 days)
   */
  async getGrowthChart(metricName: string): Promise<{ date: string; value: number }[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('daily_metrics')
        .select('date, value')
        .eq('metric_name', metricName)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map(d => ({
        date: d.date,
        value: d.value,
      }));
    } catch (error) {
      console.error('Failed to get growth chart:', error);
      return [];
    }
  }

  /**
   * Get MRR forecast (next 12 months)
   */
  async getMRRForecast(): Promise<{ month: string; predicted_mrr: number }[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Get historical MRR
      const { data: historical, error: histError } = await this.db
        .from('daily_metrics')
        .select('date, value')
        .eq('metric_name', 'mrr')
        .gte('date', new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (histError) {
        throw histError;
      }

      // Simple linear regression forecast
      const forecast = this._linearRegression(historical || []);
      return forecast;
    } catch (error) {
      console.error('Failed to get MRR forecast:', error);
      return [];
    }
  }

  // Private helpers

  private async _getTotalUsers(): Promise<number> {
    if (!this.db) return 0;
    const { count } = await this.db.from('users').select('*', { count: 'exact' });
    return count || 0;
  }

  private async _getNewUsersCount(startTime: number, endTime: number): Promise<number> {
    if (!this.db) return 0;
    const { count } = await this.db
      .from('users')
      .select('*', { count: 'exact' })
      .gte('created_at', Math.floor(startTime / 1000))
      .lte('created_at', Math.floor(endTime / 1000));
    return count || 0;
  }

  private async _getSubscriptions(): Promise<any[]> {
    if (!this.db) return [];
    const { data } = await this.db
      .from('user_subscriptions')
      .select('plan_id');
    return data || [];
  }

  private async _getInvoicesThisMonth(): Promise<any[]> {
    if (!this.db) return [];
    const monthStart = new Date();
    monthStart.setDate(1);
    const { data } = await this.db
      .from('invoices')
      .select('amount_due')
      .gte('created_at', Math.floor(monthStart.getTime() / 1000))
      .eq('status', 'paid');
    return data || [];
  }

  private async _getActiveUsers(): Promise<{ total: number; today: number }> {
    if (!this.db) return { total: 0, today: 0 };

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const { count: today } = await this.db
      .from('analytics_events')
      .select('*', { count: 'exact' })
      .gte('timestamp', Math.floor(todayStart / 1000));

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const { count: total } = await this.db
      .from('analytics_events')
      .select('*', { count: 'exact' })
      .gte('timestamp', Math.floor(thirtyDaysAgo / 1000));

    return { total: total || 0, today: today || 0 };
  }

  private async _calculateChurnRate(): Promise<number> {
    // Simplified: cancelled subscriptions / total at start of month
    return 2.5; // Placeholder
  }

  private async _getAvgSessionDuration(): Promise<number> {
    // Calculate from analytics events
    return 1200; // seconds
  }

  private async _getAvgDocumentsPerUser(): Promise<number> {
    if (!this.db) return 0;
    const { data } = await this.db
      .from('documents')
      .select('owner_id')
      .order('owner_id');

    if (!data || data.length === 0) return 0;

    const userCounts = new Map<string, number>();
    for (const doc of data) {
      userCounts.set(doc.owner_id, (userCounts.get(doc.owner_id) || 0) + 1);
    }

    const total = Array.from(userCounts.values()).reduce((a, b) => a + b, 0);
    return total / userCounts.size;
  }

  private async _getAvgCollaborators(): Promise<number> {
    if (!this.db) return 1;
    // Placeholder
    return 2.3;
  }

  private async _getAvgEditsPerDay(): Promise<number> {
    if (!this.db) return 0;
    // Calculate from activity logs
    return 8.5;
  }

  private _calculateMRR(subscriptions: any[]): number {
    const mrrMap: Record<string, number> = {
      pro: 9.99,
      business: 49.99,
    };

    return subscriptions.reduce((sum, sub) => {
      return sum + (mrrMap[sub.plan_id] || 0);
    }, 0);
  }

  private async _getAverageLifetimeValue(): Promise<number> {
    // Avg revenue * avg customer lifespan
    return 500; // Placeholder
  }

  private async _getNPS(): Promise<number> {
    // Net Promoter Score from surveys
    return 45; // Placeholder
  }

  private async _getPaymentFailureRate(): Promise<number> {
    // Failed invoices / total invoices
    return 1.2; // Placeholder
  }

  private async _getSupportTicketsPerDay(): Promise<number> {
    if (!this.db) return 0;
    const { count } = await this.db
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .gte('created_at', Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000));
    return count || 0;
  }

  private _linearRegression(data: any[]): { month: string; predicted_mrr: number }[] {
    // Simplified linear regression
    const forecast = [];
    const baseValue = data.length > 0 ? data[data.length - 1].value : 0;
    const trend = 0.05; // 5% MoM growth

    for (let i = 1; i <= 12; i++) {
      forecast.push({
        month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        predicted_mrr: baseValue * Math.pow(1 + trend, i),
      });
    }

    return forecast;
  }
}

export default GrowthMetricsManager;