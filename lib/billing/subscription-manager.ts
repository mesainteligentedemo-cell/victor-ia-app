/**
 * Subscription Manager
 * User subscription lifecycle management
 */

import { Database } from '@supabase/supabase-js';

export interface UserSubscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  planId: string; // 'free' | 'pro' | 'business'
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  billingCycle: 'monthly' | 'annual';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  canceledAt?: number;
  createdAt: number;
  updatedAt: number;
}

class SubscriptionManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create subscription record
   */
  async createSubscription(
    userId: string,
    stripeCustomerId: string,
    stripeSubscriptionId: string,
    planId: string,
    billingCycle: 'monthly' | 'annual'
  ): Promise<UserSubscription | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('user_subscriptions')
        .insert([
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            plan_id: planId,
            status: 'active',
            billing_cycle: billingCycle,
            current_period_start: Math.floor(now / 1000),
            current_period_end: Math.floor(
              (now + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000) / 1000
            ),
            created_at: now,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseSubscription(data);
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return null;
    }
  }

  /**
   * Get user subscription
   */
  async getSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseSubscription(data);
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(
    stripeSubscriptionId: string,
    status: 'active' | 'past_due' | 'canceled' | 'unpaid'
  ): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('user_subscriptions')
        .update({
          status,
          updated_at: Date.now(),
        })
        .eq('stripe_subscription_id', stripeSubscriptionId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update subscription status:', error);
      return false;
    }
  }

  /**
   * Update subscription plan
   */
  async upgradeSubscription(
    userId: string,
    newPlanId: string
  ): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('user_subscriptions')
        .update({
          plan_id: newPlanId,
          updated_at: Date.now(),
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      return false;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('user_subscriptions')
        .update({
          status: 'canceled',
          plan_id: 'free',
          canceled_at: Date.now(),
          updated_at: Date.now(),
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  /**
   * Get subscription by Stripe customer ID
   */
  async getSubscriptionByCustomerId(
    customerId: string
  ): Promise<UserSubscription | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('user_subscriptions')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseSubscription(data);
    } catch (error) {
      console.error('Failed to get subscription by customer ID:', error);
      return null;
    }
  }

  /**
   * Check if user has feature access
   */
  async hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);

      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      // Feature access matrix
      const featureMatrix: Record<string, string[]> = {
        free: ['basic_editing', 'collaboration_basic'],
        pro: [
          'basic_editing',
          'collaboration_basic',
          'advanced_editing',
          'ai_features_basic',
          'analytics',
        ],
        business: [
          'basic_editing',
          'collaboration_basic',
          'advanced_editing',
          'ai_features_basic',
          'analytics',
          'sso_saml',
          'api_access',
          'advanced_analytics',
          'ai_features_unlimited',
          'custom_branding',
        ],
      };

      const allowedFeatures = featureMatrix[subscription.planId] || [];
      return allowedFeatures.includes(feature);
    } catch (error) {
      console.error('Failed to check feature access:', error);
      return false;
    }
  }

  /**
   * Get remaining trial days
   */
  async getTrialDaysRemaining(userId: string): Promise<number> {
    try {
      const subscription = await this.getSubscription(userId);

      if (!subscription) {
        return 0;
      }

      const trialEndTime = subscription.currentPeriodStart * 1000;
      const now = Date.now();
      const daysRemaining = Math.ceil(
        (trialEndTime - now) / (24 * 60 * 60 * 1000)
      );

      return Math.max(0, daysRemaining);
    } catch (error) {
      console.error('Failed to get trial days remaining:', error);
      return 0;
    }
  }

  /**
   * Map database subscription to interface
   */
  private _mapDatabaseSubscription(data: any): UserSubscription {
    return {
      id: data.id,
      userId: data.user_id,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      planId: data.plan_id,
      status: data.status,
      billingCycle: data.billing_cycle,
      currentPeriodStart: data.current_period_start,
      currentPeriodEnd: data.current_period_end,
      canceledAt: data.canceled_at,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export default SubscriptionManager;