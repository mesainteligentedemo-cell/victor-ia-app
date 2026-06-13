/**
 * Referral & Viral Growth Manager
 * Referral programs, rewards, viral coefficients
 */

import { Database } from '@supabase/supabase-js';

export interface ReferralLink {
  id: string;
  userId: string;
  code: string; // Unique referral code
  url: string; // Shareable referral URL
  clicks: number;
  signups: number;
  conversions: number; // Signups that upgraded to paid
  rewardStatus: 'pending' | 'earned' | 'claimed';
  rewardValue: number; // Amount in cents
  createdAt: number;
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  refereeId?: string;
  rewardType: 'credit' | 'discount' | 'free_month';
  rewardValue: number; // Amount or percentage
  status: 'pending' | 'claimed' | 'expired';
  expiresAt: number;
  createdAt: number;
}

export interface ViralMetrics {
  viralCoefficient: number; // K-factor (0-1 = subviral, 1+ = viral)
  conversionRate: number; // Referees that convert to paid
  avgRewardPerUser: number;
  totalReferralRevenue: number;
  activeReferrals: number;
}

class ReferralManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create referral link for user
   */
  async createReferralLink(userId: string): Promise<ReferralLink | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const code = this.generateReferralCode();
      const url = `https://app.victor-ia.com?ref=${code}`;
      const now = Date.now();

      const { data, error } = await this.db
        .from('referral_links')
        .insert([
          {
            user_id: userId,
            code,
            url,
            clicks: 0,
            signups: 0,
            conversions: 0,
            reward_status: 'pending',
            reward_value: 0,
            created_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseReferralLink(data);
    } catch (error) {
      console.error('Failed to create referral link:', error);
      return null;
    }
  }

  /**
   * Track referral click
   */
  async trackReferralClick(referralCode: string): Promise<void> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      await this.db
        .from('referral_links')
        .update({
          clicks: this.db.raw('clicks + 1'),
        })
        .eq('code', referralCode);
    } catch (error) {
      console.error('Failed to track referral click:', error);
    }
  }

  /**
   * Track referral signup
   */
  async trackReferralSignup(referralCode: string, refereeId: string): Promise<void> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Update referral link
      const { data: referral } = await this.db
        .from('referral_links')
        .select('user_id')
        .eq('code', referralCode)
        .single();

      if (!referral) {
        return;
      }

      // Increment signup count
      await this.db
        .from('referral_links')
        .update({
          signups: this.db.raw('signups + 1'),
        })
        .eq('code', referralCode);

      // Create reward record
      const rewardValue = 500; // $5 credit
      await this.db.from('referral_rewards').insert([
        {
          referrer_id: referral.user_id,
          referee_id: refereeId,
          reward_type: 'credit',
          reward_value: rewardValue,
          status: 'pending',
          expires_at: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000),
          created_at: Date.now(),
        },
      ]);
    } catch (error) {
      console.error('Failed to track referral signup:', error);
    }
  }

  /**
   * Track referral conversion (signup → paid upgrade)
   */
  async trackReferralConversion(refereeId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Find the referral reward
      const { data: reward } = await this.db
        .from('referral_rewards')
        .select('referral_links!inner(*)')
        .eq('referee_id', refereeId)
        .single();

      if (!reward || !reward.referral_links) {
        return false;
      }

      // Increment conversion count
      await this.db
        .from('referral_links')
        .update({
          conversions: this.db.raw('conversions + 1'),
        })
        .eq('id', reward.referral_links.id);

      // Update reward status
      await this.db
        .from('referral_rewards')
        .update({
          status: 'earned',
        })
        .eq('id', reward.id);

      return true;
    } catch (error) {
      console.error('Failed to track referral conversion:', error);
      return false;
    }
  }

  /**
   * Get referral link
   */
  async getReferralLink(userId: string): Promise<ReferralLink | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('referral_links')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseReferralLink(data);
    } catch (error) {
      console.error('Failed to get referral link:', error);
      return null;
    }
  }

  /**
   * Claim referral rewards
   */
  async claimReward(rewardId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('referral_rewards')
        .update({
          status: 'claimed',
        })
        .eq('id', rewardId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to claim reward:', error);
      return false;
    }
  }

  /**
   * Get user's rewards
   */
  async getUserRewards(userId: string): Promise<ReferralReward[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('referral_rewards')
        .select('*')
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(r => this._mapDatabaseReward(r));
    } catch (error) {
      console.error('Failed to get user rewards:', error);
      return [];
    }
  }

  /**
   * Calculate viral metrics
   */
  async getViralMetrics(): Promise<ViralMetrics> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Get all referral data
      const { data: referrals } = await this.db.from('referral_links').select('*');

      if (!referrals || referrals.length === 0) {
        return {
          viralCoefficient: 0,
          conversionRate: 0,
          avgRewardPerUser: 0,
          totalReferralRevenue: 0,
          activeReferrals: 0,
        };
      }

      // Calculate metrics
      const totalClicks = referrals.reduce((sum, r) => sum + r.clicks, 0);
      const totalSignups = referrals.reduce((sum, r) => sum + r.signups, 0);
      const totalConversions = referrals.reduce((sum, r) => sum + r.conversions, 0);

      // Viral coefficient: invites per user that result in signup
      const viralCoefficient = totalSignups > 0 ? totalSignups / referrals.length : 0;

      // Conversion rate: signups that upgrade to paid
      const conversionRate = totalSignups > 0 ? (totalConversions / totalSignups) * 100 : 0;

      // Average reward per user
      const avgRewardPerUser =
        referrals.length > 0
          ? referrals.reduce((sum, r) => sum + r.reward_value, 0) / referrals.length
          : 0;

      // Total referral revenue
      const { count: referralUsers } = await this.db
        .from('users')
        .select('*', { count: 'exact' })
        .eq('referred_by', true);

      const totalReferralRevenue = totalConversions * 99.99; // Assume $99.99 per upgrade

      return {
        viralCoefficient,
        conversionRate,
        avgRewardPerUser,
        totalReferralRevenue,
        activeReferrals: referrals.filter(r => r.conversions > 0).length,
      };
    } catch (error) {
      console.error('Failed to get viral metrics:', error);
      return {
        viralCoefficient: 0,
        conversionRate: 0,
        avgRewardPerUser: 0,
        totalReferralRevenue: 0,
        activeReferrals: 0,
      };
    }
  }

  // Private helpers

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private _mapDatabaseReferralLink(data: any): ReferralLink {
    return {
      id: data.id,
      userId: data.user_id,
      code: data.code,
      url: data.url,
      clicks: data.clicks,
      signups: data.signups,
      conversions: data.conversions,
      rewardStatus: data.reward_status,
      rewardValue: data.reward_value,
      createdAt: data.created_at,
    };
  }

  private _mapDatabaseReward(data: any): ReferralReward {
    return {
      id: data.id,
      referrerId: data.referrer_id,
      refereeId: data.referee_id,
      rewardType: data.reward_type,
      rewardValue: data.reward_value,
      status: data.status,
      expiresAt: data.expires_at * 1000,
      createdAt: data.created_at,
    };
  }
}

export default ReferralManager;