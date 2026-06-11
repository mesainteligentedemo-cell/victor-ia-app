import { db } from '@/lib/db/supabase';

export interface Trend {
  id: string;
  category: 'agents' | 'generators' | 'prompts' | 'templates';
  itemId: string;
  score: number;
  views: number;
  uses: number;
  lastUpdated: Date;
}

export const TrendingService = {
  async recordInteraction(category: Trend['category'], itemId: string, type: 'view' | 'use'): Promise<void> {
    const { data: existing } = await db.from('trends').select('*').eq('category', category).eq('item_id', itemId).single();

    if (existing) {
      const updateData = type === 'view' ? { views: existing.views + 1 } : { uses: existing.uses + 1 };
      await db.from('trends').update(updateData).eq('id', existing.id);
    } else {
      const trend: Trend = {
        id: Math.random().toString(36).substring(7),
        category,
        itemId,
        score: type === 'use' ? 10 : 1,
        views: type === 'view' ? 1 : 0,
        uses: type === 'use' ? 1 : 0,
        lastUpdated: new Date()
      };
      await db.from('trends').insert(trend);
    }
  },

  async getTrendingItems(category: Trend['category'], limit: number = 10): Promise<Trend[]> {
    const { data } = await db.from('trends').select('*').eq('category', category).order('score', { ascending: false }).limit(limit);
    return data || [];
  },

  async calculateTrendScores(): Promise<void> {
    const { data: trends } = await db.from('trends').select('*');

    for (const trend of trends || []) {
      const score = (trend.views * 0.3) + (trend.uses * 0.7);
      await db.from('trends').update({ score }).eq('id', trend.id);
    }
  }
};
