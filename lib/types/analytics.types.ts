// Analytics: Metrics and activity tracking

export type EventType = 'generation' | 'agent_execution' | 'crm_action' | 'training' | 'finance' | 'system';
export type MetricType = 'count' | 'duration' | 'cost' | 'performance';

export interface ActivityLog {
  id: string;
  userId: string;
  eventType: EventType;
  action: string;
  module: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface TimeTracking {
  id: string;
  userId: string;
  taskId: string;
  taskName: string;
  duration: number; // seconds
  startTime: Date;
  endTime: Date;
}

export interface Metric {
  id: string;
  userId: string;
  metricName: string;
  metricType: MetricType;
  value: number;
  unit?: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
}

export interface AnalyticsDashboard {
  totalGenerations: number;
  totalAgentExecutions: number;
  averageGenerationTime: number;
  successRate: number;
  creditsUsed: number;
  creditsRemaining: number;
  topGenerators: Array<{ type: string; count: number }>;
  topAgents: Array<{ agentId: string; executions: number }>;
}

export interface ExportData {
  format: 'csv' | 'json' | 'pdf';
  startDate: Date;
  endDate: Date;
  includeMetrics: string[];
  filename: string;
}