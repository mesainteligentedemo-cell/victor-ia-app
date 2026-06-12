import { GenerationResult, GeneratorType, GenerationParams } from '@/lib/types';
import { db } from '@/lib/db/supabase';

export const GeneratorsService = {
  async generateImage(userId: string, params: any): Promise<GenerationResult> {
    const credits = await this.calculateCost('image', params.quality);
    // Call Higgsfield API
    const result = await fetch('/api/generate/image', {
      method: 'POST',
      body: JSON.stringify({ userId, ...params })
    });
    const data = await result.json();

    // Save to DB
    await db.from('generations').insert({
      user_id: userId,
      type: 'image',
      prompt: params.prompt,
      result_url: data.url,
      credits_used: credits,
      status: 'completed'
    });

    return { id: data.id, userId, type: 'image', status: 'completed', prompt: params.prompt, result: { url: data.url }, creditsUsed: credits, createdAt: new Date(), completedAt: new Date() };
  },

  async generateVideo(userId: string, params: any): Promise<GenerationResult> {
    const credits = await this.calculateCost('video', params.quality);
    const result = await fetch('/api/generate/video', {
      method: 'POST',
      body: JSON.stringify({ userId, ...params })
    });
    const data = await result.json();

    await db.from('generations').insert({
      user_id: userId,
      type: 'video',
      prompt: params.prompt,
      result_url: data.url,
      credits_used: credits,
      status: 'completed'
    });

    return { id: data.id, userId, type: 'video', status: 'completed', prompt: params.prompt, result: { url: data.url }, creditsUsed: credits, createdAt: new Date(), completedAt: new Date() };
  },

  async generatePresentation(userId: string, params: any): Promise<GenerationResult> {
    const credits = 15;
    return this.generateAndSave(userId, 'presentation', params, credits);
  },

  async generateEmail(userId: string, params: any): Promise<GenerationResult> {
    const credits = 5;
    return this.generateAndSave(userId, 'email', params, credits);
  },

  async generateLandingPage(userId: string, params: any): Promise<GenerationResult> {
    const credits = 20;
    return this.generateAndSave(userId, 'landing-page', params, credits);
  },

  async generateSocialPost(userId: string, params: any): Promise<GenerationResult> {
    const credits = 3;
    return this.generateAndSave(userId, 'social-post', params, credits);
  },

  async generateAudio(userId: string, params: any): Promise<GenerationResult> {
    const credits = 10;
    return this.generateAndSave(userId, 'audio', params, credits);
  },

  async generatePDF(userId: string, params: any): Promise<GenerationResult> {
    const credits = 8;
    return this.generateAndSave(userId, 'pdf', params, credits);
  },

  async generateAndSave(userId: string, type: GeneratorType, params: any, credits: number): Promise<GenerationResult> {
    const id = Math.random().toString(36).substring(7);
    const now = new Date();

    await db.from('generations').insert({
      id,
      user_id: userId,
      type,
      prompt: params.prompt,
      status: 'pending',
      credits_used: credits
    });

    return { id, userId, type, status: 'pending', prompt: params.prompt, creditsUsed: credits, createdAt: now };
  },

  async calculateCost(type: string, quality?: string): Promise<number> {
    const costs: Record<string, Record<string, number>> = {
      image: { standard: 2, premium: 5, ultra: 8 },
      video: { standard: 10, premium: 25, ultra: 50 }
    };
    return costs[type]?.[quality || 'standard'] || 1;
  },

  async getHistory(userId: string, limit: number = 50) {
    const { data } = await db
      .from('generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }
};