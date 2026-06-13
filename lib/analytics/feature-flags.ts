/**
 * Feature Flags & A/B Testing
 * Progressive rollout and experimentation framework
 */

import { Database } from '@supabase/supabase-js';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  targetSegments: string[]; // segment IDs
  isExperiment: boolean;
  variants?: {
    control: { percentage: number; name: string };
    treatment: { percentage: number; name: string };
  };
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface ExperimentMetrics {
  flagId: string;
  variant: 'control' | 'treatment';
  sampleSize: number;
  conversionRate: number;
  avgSessionDuration: number;
  avgDocumentsCreated: number;
  confidence: number; // 0-100 (statistical significance)
  winner?: 'control' | 'treatment' | 'inconclusive';
}

class FeatureFlagsManager {
  private db: Database | null = null;
  private cache: Map<string, FeatureFlag> = new Map();

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create feature flag
   */
  async createFlag(
    name: string,
    description: string,
    options: {
      enabled?: boolean;
      rolloutPercentage?: number;
      targetSegments?: string[];
      isExperiment?: boolean;
      variants?: any;
      createdBy: string;
    }
  ): Promise<FeatureFlag | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('feature_flags')
        .insert([
          {
            name,
            description,
            enabled: options.enabled ?? false,
            rollout_percentage: options.rolloutPercentage ?? 0,
            target_segments: options.targetSegments || [],
            is_experiment: options.isExperiment ?? false,
            variants: options.variants,
            created_at: now,
            updated_at: now,
            created_by: options.createdBy,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const flag = this._mapDatabaseFlag(data);
      this.cache.set(flag.id, flag);
      return flag;
    } catch (error) {
      console.error('Failed to create feature flag:', error);
      return null;
    }
  }

  /**
   * Check if flag is enabled for user
   */
  async isFlagEnabled(userId: string, flagName: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Try cache first
      const cached = Array.from(this.cache.values()).find(f => f.name === flagName);
      const flag = cached || (await this.getFlag(flagName));

      if (!flag || !flag.enabled) {
        return false;
      }

      // Check rollout percentage using consistent hashing
      const hash = this.hashUserId(userId, flagName);
      if (hash > flag.rolloutPercentage) {
        return false;
      }

      // Check segment targeting
      if (flag.targetSegments.length > 0) {
        // User must be in one of the target segments
        // (simplified - would check segment membership in real app)
        return true;
      }

      return true;
    } catch (error) {
      console.error('Failed to check flag:', error);
      return false;
    }
  }

  /**
   * Get user's experiment variant
   */
  async getVariant(
    userId: string,
    flagName: string
  ): Promise<'control' | 'treatment' | null> {
    try {
      const flag = await this.getFlag(flagName);

      if (!flag || !flag.isExperiment || !flag.variants) {
        return null;
      }

      const hash = this.hashUserId(userId, flagName);

      if (hash < flag.variants.control.percentage) {
        return 'control';
      } else if (hash < flag.variants.control.percentage + flag.variants.treatment.percentage) {
        return 'treatment';
      }

      return null;
    } catch (error) {
      console.error('Failed to get variant:', error);
      return null;
    }
  }

  /**
   * Update flag rollout
   */
  async updateRollout(flagId: string, percentage: number): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      if (percentage < 0 || percentage > 100) {
        throw new Error('Rollout percentage must be 0-100');
      }

      const { error } = await this.db
        .from('feature_flags')
        .update({
          rollout_percentage: percentage,
          updated_at: Date.now(),
        })
        .eq('id', flagId);

      if (error) {
        throw error;
      }

      // Invalidate cache
      this.cache.delete(flagId);
      return true;
    } catch (error) {
      console.error('Failed to update rollout:', error);
      return false;
    }
  }

  /**
   * Get experiment metrics
   */
  async getExperimentMetrics(flagId: string): Promise<ExperimentMetrics[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('experiment_metrics')
        .select('*')
        .eq('flag_id', flagId);

      if (error) {
        throw error;
      }

      // Calculate winner based on statistical significance
      const metrics = (data || []).map((m: any) => ({
        flagId: m.flag_id,
        variant: m.variant,
        sampleSize: m.sample_size,
        conversionRate: m.conversion_rate,
        avgSessionDuration: m.avg_session_duration,
        avgDocumentsCreated: m.avg_documents_created,
        confidence: m.confidence,
        winner: this._determineWinner(data),
      }));

      return metrics;
    } catch (error) {
      console.error('Failed to get experiment metrics:', error);
      return [];
    }
  }

  /**
   * Record experiment event
   */
  async recordExperimentEvent(
    userId: string,
    flagId: string,
    variant: 'control' | 'treatment',
    eventType: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      await this.db.from('experiment_events').insert([
        {
          user_id: userId,
          flag_id: flagId,
          variant,
          event_type: eventType,
          event_data: data,
          timestamp: Math.floor(Date.now() / 1000),
        },
      ]);
    } catch (error) {
      console.error('Failed to record experiment event:', error);
    }
  }

  /**
   * Get flag by name
   */
  async getFlag(flagName: string): Promise<FeatureFlag | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('feature_flags')
        .select('*')
        .eq('name', flagName)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseFlag(data);
    } catch (error) {
      console.error('Failed to get flag:', error);
      return null;
    }
  }

  /**
   * List all flags
   */
  async listFlags(): Promise<FeatureFlag[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(f => this._mapDatabaseFlag(f));
    } catch (error) {
      console.error('Failed to list flags:', error);
      return [];
    }
  }

  // Private helpers

  /**
   * Consistent hash for user/flag combination
   */
  private hashUserId(userId: string, flagName: string): number {
    const combined = `${userId}:${flagName}`;
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash) % 100;
  }

  private _determineWinner(metrics: any[]): 'control' | 'treatment' | 'inconclusive' {
    if (metrics.length < 2) {
      return 'inconclusive';
    }

    const control = metrics.find((m: any) => m.variant === 'control');
    const treatment = metrics.find((m: any) => m.variant === 'treatment');

    if (!control || !treatment) {
      return 'inconclusive';
    }

    // Need >95% confidence to declare winner
    if (treatment.confidence < 95) {
      return 'inconclusive';
    }

    return treatment.conversion_rate > control.conversion_rate ? 'treatment' : 'control';
  }

  private _mapDatabaseFlag(data: any): FeatureFlag {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      enabled: data.enabled,
      rolloutPercentage: data.rollout_percentage,
      targetSegments: data.target_segments || [],
      isExperiment: data.is_experiment,
      variants: data.variants,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
    };
  }
}

export default FeatureFlagsManager;