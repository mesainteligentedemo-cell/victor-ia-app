/**
 * NPS & Customer Feedback Manager
 * Net Promoter Score surveys and customer feedback tracking
 */

import { Database } from '@supabase/supabase-js';

export interface NPSSurvey {
  id: string;
  userId: string;
  score: number; // 0-10
  category: string; // Feature, Support, Performance, etc.
  feedback: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  respondedAt: number;
  followUp?: {
    needed: boolean;
    reason?: string;
    assignedTo?: string;
  };
}

export interface NPSMetrics {
  nps: number; // -100 to 100
  detractors: number; // 0-6
  passives: number; // 7-8
  promoters: number; // 9-10
  respondents: number;
  avgScore: number;
  categories: {
    [key: string]: number;
  };
}

export interface CustomerFeedback {
  id: string;
  userId: string;
  type: 'bug_report' | 'feature_request' | 'improvement' | 'testimonial';
  title: string;
  description: string;
  category: string;
  upvotes: number;
  status: 'open' | 'planned' | 'in_progress' | 'completed' | 'archived';
  createdAt: number;
  updatedAt: number;
}

class NPSManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create NPS survey response
   */
  async submitNPSSurvey(
    userId: string,
    score: number,
    feedback: string,
    category: string = 'general'
  ): Promise<NPSSurvey | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      if (score < 0 || score > 10) {
        throw new Error('Score must be between 0 and 10');
      }

      // Determine sentiment
      let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
      if (score >= 9) {
        sentiment = 'positive';
      } else if (score <= 6) {
        sentiment = 'negative';
      }

      // Determine if follow-up needed
      const needsFollowUp = sentiment === 'negative' || (sentiment === 'neutral' && feedback.length > 0);

      const now = Date.now();

      const { data, error } = await this.db
        .from('nps_surveys')
        .insert([
          {
            user_id: userId,
            score,
            category,
            feedback,
            sentiment,
            responded_at: Math.floor(now / 1000),
            follow_up: {
              needed: needsFollowUp,
              reason: sentiment === 'negative' ? 'detractor_feedback' : undefined,
            },
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseSurvey(data);
    } catch (error) {
      console.error('Failed to submit NPS survey:', error);
      return null;
    }
  }

  /**
   * Get NPS metrics
   */
  async getNPSMetrics(days: number = 30): Promise<NPSMetrics> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const cutoffTime = Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);

      const { data, error } = await this.db
        .from('nps_surveys')
        .select('*')
        .gte('responded_at', cutoffTime);

      if (error || !data) {
        return this._emptyNPSMetrics();
      }

      const detractors = data.filter(s => s.score <= 6).length;
      const passives = data.filter(s => s.score >= 7 && s.score <= 8).length;
      const promoters = data.filter(s => s.score >= 9).length;
      const total = data.length;

      const nps =
        total > 0
          ? Math.round(((promoters - detractors) / total) * 100)
          : 0;

      const avgScore = total > 0 ? Math.round((data.reduce((sum, s) => sum + s.score, 0) / total) * 10) / 10 : 0;

      // Category breakdown
      const categories: Record<string, number> = {};
      const categoryScores: Record<string, number[]> = {};

      for (const survey of data) {
        if (!categoryScores[survey.category]) {
          categoryScores[survey.category] = [];
        }
        categoryScores[survey.category].push(survey.score);
      }

      for (const [cat, scores] of Object.entries(categoryScores)) {
        categories[cat] = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
      }

      return {
        nps,
        detractors,
        passives,
        promoters,
        respondents: total,
        avgScore,
        categories,
      };
    } catch (error) {
      console.error('Failed to get NPS metrics:', error);
      return this._emptyNPSMetrics();
    }
  }

  /**
   * Submit feature request or bug report
   */
  async submitFeedback(
    userId: string,
    type: 'bug_report' | 'feature_request' | 'improvement' | 'testimonial',
    title: string,
    description: string,
    category: string
  ): Promise<CustomerFeedback | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('customer_feedback')
        .insert([
          {
            user_id: userId,
            type,
            title,
            description,
            category,
            upvotes: 0,
            status: 'open',
            created_at: Math.floor(now / 1000),
            updated_at: Math.floor(now / 1000),
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseFeedback(data);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      return null;
    }
  }

  /**
   * Upvote feedback
   */
  async upvoteFeedback(feedbackId: string): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('customer_feedback')
        .update({
          upvotes: this.db.raw('upvotes + 1'),
          updated_at: Math.floor(Date.now() / 1000),
        })
        .eq('id', feedbackId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to upvote feedback:', error);
      return false;
    }
  }

  /**
   * Get feedback by category
   */
  async getFeedbackByCategory(category: string, limit: number = 20): Promise<CustomerFeedback[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('customer_feedback')
        .select('*')
        .eq('category', category)
        .eq('status', 'open')
        .order('upvotes', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map(f => this._mapDatabaseFeedback(f));
    } catch (error) {
      console.error('Failed to get feedback by category:', error);
      return [];
    }
  }

  /**
   * Track feature request progress
   */
  async updateFeedbackStatus(
    feedbackId: string,
    newStatus: 'open' | 'planned' | 'in_progress' | 'completed' | 'archived'
  ): Promise<boolean> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { error } = await this.db
        .from('customer_feedback')
        .update({
          status: newStatus,
          updated_at: Math.floor(Date.now() / 1000),
        })
        .eq('id', feedbackId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update feedback status:', error);
      return false;
    }
  }

  /**
   * Get satisfaction trend (over time)
   */
  async getSatisfactionTrend(days: number = 90): Promise<{ date: string; nps: number }[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('nps_surveys')
        .select('responded_at, score')
        .gte('responded_at', Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000));

      if (error || !data) {
        return [];
      }

      // Group by day
      const groupedByDay: Record<string, number[]> = {};

      for (const survey of data) {
        const date = new Date(survey.responded_at * 1000).toISOString().split('T')[0];
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push(survey.score);
      }

      // Calculate daily NPS
      const trend = Object.entries(groupedByDay)
        .map(([date, scores]) => {
          const detractors = scores.filter(s => s <= 6).length;
          const promoters = scores.filter(s => s >= 9).length;
          const nps = Math.round(((promoters - detractors) / scores.length) * 100);
          return { date, nps };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      return trend;
    } catch (error) {
      console.error('Failed to get satisfaction trend:', error);
      return [];
    }
  }

  // Private helpers

  private _emptyNPSMetrics(): NPSMetrics {
    return {
      nps: 0,
      detractors: 0,
      passives: 0,
      promoters: 0,
      respondents: 0,
      avgScore: 0,
      categories: {},
    };
  }

  private _mapDatabaseSurvey(data: any): NPSSurvey {
    return {
      id: data.id,
      userId: data.user_id,
      score: data.score,
      category: data.category,
      feedback: data.feedback,
      sentiment: data.sentiment,
      respondedAt: data.responded_at * 1000,
      followUp: data.follow_up,
    };
  }

  private _mapDatabaseFeedback(data: any): CustomerFeedback {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      title: data.title,
      description: data.description,
      category: data.category,
      upvotes: data.upvotes,
      status: data.status,
      createdAt: data.created_at * 1000,
      updatedAt: data.updated_at * 1000,
    };
  }
}

export default NPSManager;