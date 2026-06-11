import { db } from '@/lib/db/supabase';

export const CreditsService = {
  async getBalance(userId: string): Promise<number> {
    const { data } = await db
      .from('users')
      .select('credits_balance')
      .eq('id', userId)
      .single();
    return data?.credits_balance || 0;
  },

  async deductCredits(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    if (balance < amount) return false;

    await db
      .from('users')
      .update({ credits_balance: balance - amount })
      .eq('id', userId);

    return true;
  },

  async addCredits(userId: string, amount: number): Promise<void> {
    const balance = await this.getBalance(userId);
    await db
      .from('users')
      .update({ credits_balance: balance + amount })
      .eq('id', userId);
  }
};
