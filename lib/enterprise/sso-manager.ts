/**
 * SSO Manager
 * Single Sign-On / SAML integration for enterprise customers
 */

import { Database } from '@supabase/supabase-js';

export interface SSOConfig {
  id: string;
  workspaceId: string;
  provider: 'google' | 'microsoft' | 'okta' | 'saml';
  isEnabled: boolean;
  clientId: string;
  clientSecret: string;
  tenantId?: string; // For Microsoft/Okta
  metadataUrl?: string; // For SAML
  acsUrl: string; // Assertion Consumer Service URL
  entityId: string; // Service Provider Entity ID
  createdAt: number;
  updatedAt: number;
}

export interface SSOUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  providerId: string; // External provider user ID
  provider: string;
}

class SSOManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create or update SSO configuration
   */
  async createSSOConfig(
    workspaceId: string,
    provider: 'google' | 'microsoft' | 'okta' | 'saml',
    config: Partial<SSOConfig>
  ): Promise<SSOConfig | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('sso_configs')
        .upsert([
          {
            workspace_id: workspaceId,
            provider,
            is_enabled: config.isEnabled ?? false,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            tenant_id: config.tenantId,
            metadata_url: config.metadataUrl,
            acs_url: config.acsUrl,
            entity_id: config.entityId,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseConfig(data);
    } catch (error) {
      console.error('Failed to create SSO config:', error);
      return null;
    }
  }

  /**
   * Get SSO configuration
   */
  async getSSOConfig(workspaceId: string): Promise<SSOConfig | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('sso_configs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseConfig(data);
    } catch (error) {
      console.error('Failed to get SSO config:', error);
      return null;
    }
  }

  /**
   * Enable SSO for workspace
   */
  async enableSSO(workspaceId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('sso_configs')
        .update({
          is_enabled: true,
          updated_at: Date.now(),
        })
        .eq('workspace_id', workspaceId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to enable SSO:', error);
      return false;
    }
  }

  /**
   * Disable SSO for workspace
   */
  async disableSSO(workspaceId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('sso_configs')
        .update({
          is_enabled: false,
          updated_at: Date.now(),
        })
        .eq('workspace_id', workspaceId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to disable SSO:', error);
      return false;
    }
  }

  /**
   * Create or sync SSO user
   */
  async syncSSOUser(
    workspaceId: string,
    ssoUser: SSOUser
  ): Promise<string | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // First, try to find existing user
      const { data: existingUser } = await this.db
        .from('sso_users')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('provider_id', ssoUser.providerId)
        .single();

      if (existingUser) {
        // Update existing user
        const { error } = await this.db
          .from('sso_users')
          .update({
            email: ssoUser.email,
            first_name: ssoUser.firstName,
            last_name: ssoUser.lastName,
            picture: ssoUser.picture,
            updated_at: Date.now(),
          })
          .eq('id', existingUser.id);

        if (error) {
          throw error;
        }

        return existingUser.id;
      }

      // Create new SSO user
      const { data, error } = await this.db
        .from('sso_users')
        .insert([
          {
            workspace_id: workspaceId,
            email: ssoUser.email,
            first_name: ssoUser.firstName,
            last_name: ssoUser.lastName,
            picture: ssoUser.picture,
            role: ssoUser.role,
            provider_id: ssoUser.providerId,
            provider: ssoUser.provider,
            created_at: Date.now(),
            updated_at: Date.now(),
          },
        ])
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      return data.id;
    } catch (error) {
      console.error('Failed to sync SSO user:', error);
      return null;
    }
  }

  /**
   * Get SSO user by provider ID
   */
  async getSSOUserByProviderId(
    workspaceId: string,
    providerId: string
  ): Promise<SSOUser | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('sso_users')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('provider_id', providerId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseUser(data);
    } catch (error) {
      console.error('Failed to get SSO user:', error);
      return null;
    }
  }

  /**
   * List all SSO users in workspace
   */
  async listSSOUsers(workspaceId: string): Promise<SSOUser[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('sso_users')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(user => this._mapDatabaseUser(user));
    } catch (error) {
      console.error('Failed to list SSO users:', error);
      return [];
    }
  }

  /**
   * Deactivate SSO user
   */
  async deactivateSSOUser(workspaceId: string, userId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('sso_users')
        .update({
          is_active: false,
          updated_at: Date.now(),
        })
        .eq('workspace_id', workspaceId)
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to deactivate SSO user:', error);
      return false;
    }
  }

  /**
   * Map database config to interface
   */
  private _mapDatabaseConfig(data: any): SSOConfig {
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      provider: data.provider,
      isEnabled: data.is_enabled,
      clientId: data.client_id,
      clientSecret: data.client_secret,
      tenantId: data.tenant_id,
      metadataUrl: data.metadata_url,
      acsUrl: data.acs_url,
      entityId: data.entity_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Map database user to interface
   */
  private _mapDatabaseUser(data: any): SSOUser {
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      picture: data.picture,
      role: data.role,
      providerId: data.provider_id,
      provider: data.provider,
    };
  }
}

export default SSOManager;