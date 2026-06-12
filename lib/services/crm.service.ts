import { Prospect, PipelineStage, CRMMetrics } from '@/lib/types';
import { db } from '@/lib/db/supabase';

export const CRMService = {
  async createProspect(userId: string, data: Partial<Prospect>): Promise<Prospect> {
    const prospect: Prospect = {
      name: '',
      email: '',
      ...data,
      id: Math.random().toString(36).substring(7),
      userId,
      stage: data.stage ?? ('lead' as PipelineStage),
      value: data.value ?? 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.from('prospects').insert(prospect);
    return prospect;
  },

  async updateProspect(prospectId: string, data: Partial<Prospect>): Promise<Prospect> {
    const updated = { ...data, updatedAt: new Date() };
    const { data: result } = await db
      .from('prospects')
      .update(updated)
      .eq('id', prospectId)
      .select()
      .single();
    return result;
  },

  async moveProspectInPipeline(prospectId: string, stage: PipelineStage): Promise<void> {
    await db.from('prospects').update({ stage, updatedAt: new Date() }).eq('id', prospectId);
  },

  async convertToClient(prospectId: string): Promise<void> {
    await db
      .from('prospects')
      .update({ stage: 'won', convertedAt: new Date() })
      .eq('id', prospectId);
  },

  async getProspectsByStage(userId: string, stage: PipelineStage): Promise<Prospect[]> {
    const { data } = await db
      .from('prospects')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', stage)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async addNote(prospectId: string, content: string, authorId: string): Promise<void> {
    await db.from('crm_notes').insert({
      prospect_id: prospectId,
      content,
      author_id: authorId,
      created_at: new Date()
    });
  },

  async getPipeline(userId: string): Promise<CRMMetrics> {
    const { data: prospects } = await db
      .from('prospects')
      .select('*')
      .eq('user_id', userId);

    const stages: Record<PipelineStage, number> = {
      lead: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      won: 0,
      lost: 0
    };

    prospects?.forEach((p: { stage: PipelineStage }) => {
      if (p.stage in stages) {
        stages[p.stage]++;
      }
    });

    const totalValue = prospects?.reduce((sum: number, p: any) => sum + (p.value || 0), 0) || 0;

    return {
      totalProspects: prospects?.length || 0,
      prospectsPerStage: stages,
      avgValuePerProspect: (prospects?.length || 0) > 0 ? totalValue / prospects!.length : 0,
      conversionRate: ((stages.won / ((prospects?.length || 0) - stages.lead)) * 100) || 0,
      avgTimeInPipeline: 0,
      topPerformers: []
    };
  }
};