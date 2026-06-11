import { ActivityLog, TimeTracking, Metric, AnalyticsDashboard } from '@/lib/types';
import { db } from '@/lib/db/supabase';

export const AnalyticsAdvancedService = {
  async trackEvent(userId: string, eventName: string, eventData: Record<string, any>): Promise<ActivityLog> {
    const activityLog: ActivityLog = {
      id: Math.random().toString(36).substring(7),
      userId,
      eventName,
      eventData,
      timestamp: new Date(),
      ipAddress: '',
      userAgent: ''
    };

    await db.from('activity_logs').insert(activityLog);
    return activityLog;
  },

  async getActivityFeed(userId: string, limit: number = 50): Promise<ActivityLog[]> {
    const { data } = await db
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async trackTimeSpent(userId: string, moduleId: string, duration: number): Promise<TimeTracking> {
    const tracking: TimeTracking = {
      id: Math.random().toString(36).substring(7),
      userId,
      moduleId,
      duration,
      timestamp: new Date()
    };

    await db.from('time_tracking').insert(tracking);
    return tracking;
  },

  async getMetricsSnapshot(userId: string): Promise<AnalyticsDashboard> {
    const { data: activities } = await db
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);

    const { data: timeData } = await db
      .from('time_tracking')
      .select('*')
      .eq('user_id', userId);

    const totalTime = (timeData || []).reduce((sum: number, t: any) => sum + t.duration, 0);
    const eventCounts: Record<string, number> = {};

    (activities || []).forEach((a: any) => {
      eventCounts[a.event_name] = (eventCounts[a.event_name] || 0) + 1;
    });

    return {
      userId,
      totalEvents: activities?.length || 0,
      totalTimeSpent: totalTime,
      topEvents: Object.entries(eventCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
      metrics: [],
      lastUpdated: new Date()
    };
  },

  async exportMetrics(userId: string, format: 'csv' | 'json' = 'csv'): Promise<string> {
    const { data: activities } = await db
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId);

    if (format === 'json') {
      return JSON.stringify(activities, null, 2);
    }

    // CSV format
    const headers = ['id', 'eventName', 'timestamp', 'eventData'];
    const rows = (activities || []).map((a: any) => [
      a.id,
      a.event_name,
      a.timestamp,
      JSON.stringify(a.event_data)
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }
};