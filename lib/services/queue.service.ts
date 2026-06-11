import { db } from '@/lib/db/supabase';

export interface QueueItem {
  id: string;
  userId: string;
  type: 'generation' | 'export' | 'training' | 'automation' | 'report';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payload: Record<string, any>;
  priority: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export const QueueService = {
  async enqueue(userId: string, type: QueueItem['type'], payload: Record<string, any>, priority: number = 5): Promise<QueueItem> {
    const item: QueueItem = {
      id: Math.random().toString(36).substring(7),
      userId,
      type,
      status: 'pending',
      payload,
      priority,
      createdAt: new Date()
    };

    await db.from('queue_items').insert(item);
    return item;
  },

  async dequeue(type?: QueueItem['type'], limit: number = 10): Promise<QueueItem[]> {
    let query = db.from('queue_items').select('*').eq('status', 'pending').order('priority', { ascending: false }).limit(limit);

    if (type) {
      query = query.eq('type', type);
    }

    const { data } = await query;
    return data || [];
  },

  async markProcessing(itemId: string): Promise<void> {
    await db.from('queue_items').update({ status: 'processing', startedAt: new Date() }).eq('id', itemId);
  },

  async markCompleted(itemId: string, result?: any): Promise<void> {
    await db.from('queue_items').update({ status: 'completed', completedAt: new Date() }).eq('id', itemId);
  },

  async markFailed(itemId: string, error: string): Promise<void> {
    await db.from('queue_items').update({ status: 'failed', completedAt: new Date(), error }).eq('id', itemId);
  },

  async getQueueStats(): Promise<Record<string, number>> {
    const { data } = await db.from('queue_items').select('status, type, count()');

    const stats: Record<string, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    };

    (data || []).forEach((item: any) => {
      stats[item.status] = item.count || 0;
    });

    return stats;
  }
};
