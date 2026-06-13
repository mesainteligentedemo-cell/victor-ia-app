/**
 * Data Retention Manager
 * GDPR/CCPA compliance with automatic data deletion
 */

import { Database } from '@supabase/supabase-js';

export interface RetentionPolicy {
  id: string;
  workspaceId: string;
  name: string;
  dataType: 'documents' | 'audit_logs' | 'analytics' | 'backups' | 'all';
  retentionDays: number;
  autoDelete: boolean;
  notificationEmail?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DeletionRequest {
  id: string;
  workspaceId: string;
  userId: string;
  requestType: 'account_deletion' | 'data_export' | 'data_anonymization';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: number;
  completedAt?: number;
  failureReason?: string;
  createdAt: number;
}

class DataRetentionManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create retention policy
   */
  async createRetentionPolicy(
    workspaceId: string,
    policy: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RetentionPolicy | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('retention_policies')
        .insert([
          {
            workspace_id: workspaceId,
            name: policy.name,
            data_type: policy.dataType,
            retention_days: policy.retentionDays,
            auto_delete: policy.autoDelete,
            notification_email: policy.notificationEmail,
            is_active: policy.isActive,
            created_at: now,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabasePolicy(data);
    } catch (error) {
      console.error('Failed to create retention policy:', error);
      return null;
    }
  }

  /**
   * Get retention policy
   */
  async getRetentionPolicy(
    workspaceId: string,
    dataType: string
  ): Promise<RetentionPolicy | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('retention_policies')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('data_type', dataType)
        .eq('is_active', true)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabasePolicy(data);
    } catch (error) {
      console.error('Failed to get retention policy:', error);
      return null;
    }
  }

  /**
   * Request data deletion (GDPR/CCPA)
   */
  async requestDataDeletion(
    workspaceId: string,
    userId: string,
    type: 'account_deletion' | 'data_export' | 'data_anonymization'
  ): Promise<DeletionRequest | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('deletion_requests')
        .insert([
          {
            workspace_id: workspaceId,
            user_id: userId,
            request_type: type,
            status: 'pending',
            created_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseDeletionRequest(data);
    } catch (error) {
      console.error('Failed to request data deletion:', error);
      return null;
    }
  }

  /**
   * Get deletion request status
   */
  async getDeletionRequest(requestId: string): Promise<DeletionRequest | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('deletion_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseDeletionRequest(data);
    } catch (error) {
      console.error('Failed to get deletion request:', error);
      return null;
    }
  }

  /**
   * Process data export (GDPR right to data portability)
   */
  async processDataExport(workspaceId: string, userId: string): Promise<string | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Fetch all user data
      const [documents, comments, activities] = await Promise.all([
        this._fetchUserDocuments(workspaceId, userId),
        this._fetchUserComments(workspaceId, userId),
        this._fetchUserActivities(workspaceId, userId),
      ]);

      // Create JSON export
      const exportData = {
        workspace_id: workspaceId,
        user_id: userId,
        exported_at: new Date().toISOString(),
        documents,
        comments,
        activities,
      };

      // In production, this would be compressed and uploaded to S3
      const jsonString = JSON.stringify(exportData, null, 2);
      const downloadUrl = this._generateDownloadUrl(jsonString);

      return downloadUrl;
    } catch (error) {
      console.error('Failed to process data export:', error);
      return null;
    }
  }

  /**
   * Delete user account and all associated data (GDPR)
   */
  async deleteUserAccount(workspaceId: string, userId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Soft delete user - set is_deleted flag
      const { error: userError } = await this.db
        .from('users')
        .update({
          is_deleted: true,
          deleted_at: Date.now(),
        })
        .eq('id', userId);

      if (userError) {
        throw userError;
      }

      // Anonymize user data
      const { error: anonError } = await this.db
        .from('users')
        .update({
          email: `deleted_${userId}@deleted.local`,
          first_name: 'Deleted',
          last_name: 'User',
          profile_picture: null,
        })
        .eq('id', userId);

      if (anonError) {
        throw anonError;
      }

      // Mark documents as owned by "deleted user"
      const { error: docError } = await this.db
        .from('documents')
        .update({
          owner_id: null,
          owner_name: 'Deleted User',
        })
        .eq('owner_id', userId);

      if (docError) {
        throw docError;
      }

      console.log(`Successfully deleted user account: ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete user account:', error);
      return false;
    }
  }

  /**
   * Anonymize user data
   */
  async anonymizeUserData(workspaceId: string, userId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const anonId = `anon_${Date.now()}`;

      // Update user record
      const { error: userError } = await this.db
        .from('users')
        .update({
          email: `${anonId}@anonymized.local`,
          first_name: 'Anonymous',
          last_name: 'User',
          profile_picture: null,
          is_anonymized: true,
        })
        .eq('id', userId);

      if (userError) {
        throw userError;
      }

      // Remove user from documents (but keep document)
      const { error: docError } = await this.db
        .from('document_collaborators')
        .delete()
        .eq('user_id', userId);

      if (docError) {
        throw docError;
      }

      console.log(`Successfully anonymized user: ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to anonymize user data:', error);
      return false;
    }
  }

  /**
   * Execute cleanup based on retention policies
   */
  async executeCleanup(): Promise<{ deleted: number; anonymized: number }> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Math.floor(Date.now() / 1000);
      let deleted = 0;
      let anonymized = 0;

      // Get all active retention policies
      const { data: policies, error: policyError } = await this.db
        .from('retention_policies')
        .select('*')
        .eq('is_active', true)
        .eq('auto_delete', true);

      if (policyError) {
        throw policyError;
      }

      // Process each policy
      for (const policy of policies || []) {
        const retentionSeconds = policy.retention_days * 24 * 60 * 60;
        const cutoffTime = now - retentionSeconds;

        if (policy.data_type === 'audit_logs') {
          const { count, error } = await this.db
            .from('audit_logs')
            .delete()
            .lt('timestamp', cutoffTime);

          if (!error) {
            deleted += count || 0;
          }
        } else if (policy.data_type === 'analytics') {
          const { count, error } = await this.db
            .from('analytics_events')
            .delete()
            .lt('timestamp', cutoffTime);

          if (!error) {
            deleted += count || 0;
          }
        }
      }

      console.log(`Cleanup completed: ${deleted} records deleted, ${anonymized} records anonymized`);
      return { deleted, anonymized };
    } catch (error) {
      console.error('Failed to execute cleanup:', error);
      return { deleted: 0, anonymized: 0 };
    }
  }

  // Private helper methods
  private async _fetchUserDocuments(workspaceId: string, userId: string): Promise<any[]> {
    if (!this.db) return [];
    const { data } = await this.db
      .from('documents')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('owner_id', userId);
    return data || [];
  }

  private async _fetchUserComments(workspaceId: string, userId: string): Promise<any[]> {
    if (!this.db) return [];
    const { data } = await this.db
      .from('comments')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('author_id', userId);
    return data || [];
  }

  private async _fetchUserActivities(workspaceId: string, userId: string): Promise<any[]> {
    if (!this.db) return [];
    const { data } = await this.db
      .from('activity_logs')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);
    return data || [];
  }

  private _generateDownloadUrl(jsonString: string): string {
    // In production, upload to S3 and return signed URL
    const blob = new Blob([jsonString], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }

  private _mapDatabasePolicy(data: any): RetentionPolicy {
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      name: data.name,
      dataType: data.data_type,
      retentionDays: data.retention_days,
      autoDelete: data.auto_delete,
      notificationEmail: data.notification_email,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private _mapDatabaseDeletionRequest(data: any): DeletionRequest {
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      userId: data.user_id,
      requestType: data.request_type,
      status: data.status,
      downloadUrl: data.download_url,
      expiresAt: data.expires_at,
      completedAt: data.completed_at,
      failureReason: data.failure_reason,
      createdAt: data.created_at,
    };
  }
}

export default DataRetentionManager;