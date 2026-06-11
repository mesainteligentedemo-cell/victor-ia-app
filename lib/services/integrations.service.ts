import { db } from '@/lib/db/supabase';

export const IntegrationsService = {
  async connectMCP(userId: string, type: string, credentials: any): Promise<string> {
    const integrationId = Math.random().toString(36).substring(7);

    await db.from('integrations').insert({
      id: integrationId,
      user_id: userId,
      type,
      credentials,
      active: true
    });

    return integrationId;
  },

  async disconnectMCP(integrationId: string): Promise<void> {
    await db.from('integrations').delete().eq('id', integrationId);
  },

  async syncMCPData(integrationId: string): Promise<void> {
    const { data: integration } = await db
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    // Sync based on type (figma, after_effects, etc)
    console.log(`Syncing ${integration.type}...`);

    await db
      .from('integrations')
      .update({ last_synced_at: new Date() })
      .eq('id', integrationId);
  },

  async listIntegrations(userId: string): Promise<any[]> {
    const { data } = await db
      .from('integrations')
      .select('*')
      .eq('user_id', userId);
    return data || [];
  }
};
