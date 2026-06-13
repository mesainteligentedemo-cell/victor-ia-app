/**
 * Advanced Audit Logger
 * Compliance-grade audit trails for enterprise
 */

import { Database } from '@supabase/supabase-js';

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.created'
  | 'user.deleted'
  | 'user.role_changed'
  | 'document.created'
  | 'document.updated'
  | 'document.deleted'
  | 'document.shared'
  | 'document.access_revoked'
  | 'comment.created'
  | 'comment.deleted'
  | 'subscription.upgraded'
  | 'subscription.downgraded'
  | 'subscription.canceled'
  | 'billing.invoice_paid'
  | 'billing.invoice_failed'
  | 'settings.changed'
  | 'sso.enabled'
  | 'sso.disabled'
  | 'export.completed'
  | 'data_deletion.requested'
  | 'api.key_created'
  | 'api.key_deleted';

export interface AuditEntry {
  id: string;
  workspaceId: string;
  userId?: string;
  action: AuditAction;
  resourceType: string; // 'document', 'user', 'workspace', etc.
  resourceId?: string;
  resourceName?: string;
  ipAddress: string;
  userAgent: string;
  changes?: Record<string, { before: any; after: any }>;
  status: 'success' | 'failure';
  errorMessage?: string;
  timestamp: number;
  retentionExpiresAt: number;
}

export interface AuditFilter {
  workspaceId: string;
  userId?: string;
  action?: AuditAction;
  resourceType?: string;
  startDate?: number;
  endDate?: number;
  limit?: number;
  offset?: number;
}

class AuditLogger {
  private db: Database | null = null;
  private readonly DEFAULT_RETENTION_DAYS = 365; // 1 year

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Log audit entry
   */
  async log(
    workspaceId: string,
    action: AuditAction,
    resourceType: string,
    options: {
      userId?: string;
      resourceId?: string;
      resourceName?: string;
      ipAddress: string;
      userAgent: string;
      changes?: Record<string, { before: any; after: any }>;
      status?: 'success' | 'failure';
      errorMessage?: string;
      retentionDays?: number;
    }
  ): Promise<AuditEntry | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();
      const retentionDays = options.retentionDays || this.DEFAULT_RETENTION_DAYS;
      const retentionExpiresAt = now + retentionDays * 24 * 60 * 60 * 1000;

      const { data, error } = await this.db
        .from('audit_logs')
        .insert([
          {
            workspace_id: workspaceId,
            user_id: options.userId,
            action,
            resource_type: resourceType,
            resource_id: options.resourceId,
            resource_name: options.resourceName,
            ip_address: options.ipAddress,
            user_agent: options.userAgent,
            changes: options.changes,
            status: options.status || 'success',
            error_message: options.errorMessage,
            timestamp: Math.floor(now / 1000),
            retention_expires_at: Math.floor(retentionExpiresAt / 1000),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseEntry(data);
    } catch (error) {
      console.error('Failed to log audit entry:', error);
      return null;
    }
  }

  /**
   * Query audit logs
   */
  async query(filter: AuditFilter): Promise<AuditEntry[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      let query = this.db
        .from('audit_logs')
        .select('*')
        .eq('workspace_id', filter.workspaceId);

      if (filter.userId) {
        query = query.eq('user_id', filter.userId);
      }

      if (filter.action) {
        query = query.eq('action', filter.action);
      }

      if (filter.resourceType) {
        query = query.eq('resource_type', filter.resourceType);
      }

      if (filter.startDate) {
        query = query.gte('timestamp', Math.floor(filter.startDate / 1000));
      }

      if (filter.endDate) {
        query = query.lte('timestamp', Math.floor(filter.endDate / 1000));
      }

      const limit = filter.limit || 100;
      const offset = filter.offset || 0;

      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      return data.map(entry => this._mapDatabaseEntry(entry));
    } catch (error) {
      console.error('Failed to query audit logs:', error);
      return [];
    }
  }

  /**
   * Export audit logs to CSV
   */
  async exportAsCSV(filter: AuditFilter): Promise<string> {
    try {
      const logs = await this.query({ ...filter, limit: 10000 });

      const headers = [
        'Timestamp',
        'User ID',
        'Action',
        'Resource Type',
        'Resource ID',
        'IP Address',
        'Status',
        'Error Message',
      ];

      const rows = logs.map(log => [
        new Date(log.timestamp * 1000).toISOString(),
        log.userId || '',
        log.action,
        log.resourceType,
        log.resourceId || '',
        log.ipAddress,
        log.status,
        log.errorMessage || '',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row =>
          row
            .map(cell =>
              typeof cell === 'string' && cell.includes(',')
                ? `"${cell}"`
                : cell
            )
            .join(',')
        ),
      ].join('\n');

      return csv;
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      return '';
    }
  }

  /**
   * Get audit statistics
   */
  async getStatistics(
    workspaceId: string,
    startDate: number,
    endDate: number
  ): Promise<{
    totalEntries: number;
    successCount: number;
    failureCount: number;
    uniqueUsers: number;
    actionCounts: Record<AuditAction, number>;
  }> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('audit_logs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('timestamp', Math.floor(startDate / 1000))
        .lte('timestamp', Math.floor(endDate / 1000));

      if (error) {
        throw error;
      }

      const entries = data.map(entry => this._mapDatabaseEntry(entry));

      const actionCounts: Record<string, number> = {};
      const uniqueUsers = new Set<string>();

      let successCount = 0;
      let failureCount = 0;

      for (const entry of entries) {
        if (entry.status === 'success') {
          successCount++;
        } else {
          failureCount++;
        }

        if (entry.userId) {
          uniqueUsers.add(entry.userId);
        }

        actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
      }

      return {
        totalEntries: entries.length,
        successCount,
        failureCount,
        uniqueUsers: uniqueUsers.size,
        actionCounts: actionCounts as Record<AuditAction, number>,
      };
    } catch (error) {
      console.error('Failed to get audit statistics:', error);
      return {
        totalEntries: 0,
        successCount: 0,
        failureCount: 0,
        uniqueUsers: 0,
        actionCounts: {},
      };
    }
  }

  /**
   * Clean up expired audit logs
   */
  async cleanupExpiredLogs(): Promise<number> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Math.floor(Date.now() / 1000);

      const { error, count } = await this.db
        .from('audit_logs')
        .delete()
        .lt('retention_expires_at', now);

      if (error) {
        throw error;
      }

      console.log(`Cleaned up ${count} expired audit logs`);
      return count || 0;
    } catch (error) {
      console.error('Failed to cleanup expired logs:', error);
      return 0;
    }
  }

  /**
   * Map database entry to interface
   */
  private _mapDatabaseEntry(data: any): AuditEntry {
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      userId: data.user_id,
      action: data.action,
      resourceType: data.resource_type,
      resourceId: data.resource_id,
      resourceName: data.resource_name,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      changes: data.changes,
      status: data.status,
      errorMessage: data.error_message,
      timestamp: data.timestamp,
      retentionExpiresAt: data.retention_expires_at,
    };
  }
}

export default AuditLogger;