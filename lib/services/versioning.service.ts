import { db } from '@/lib/db/supabase';

export interface Version {
  id: string;
  projectId: string;
  userId: string;
  versionNumber: number;
  name: string;
  description: string;
  content: Record<string, any>;
  createdAt: Date;
}

export const VersioningService = {
  async createVersion(projectId: string, userId: string, name: string, description: string, content: Record<string, any>): Promise<Version> {
    const { data: lastVersion } = await db.from('versions').select('version_number').eq('project_id', projectId).order('version_number', { ascending: false }).limit(1);

    const versionNumber = (lastVersion?.[0]?.version_number || 0) + 1;

    const version: Version = {
      id: Math.random().toString(36).substring(7),
      projectId,
      userId,
      versionNumber,
      name,
      description,
      content,
      createdAt: new Date()
    };

    await db.from('versions').insert(version);
    return version;
  },

  async getVersions(projectId: string): Promise<Version[]> {
    const { data } = await db.from('versions').select('*').eq('project_id', projectId).order('version_number', { ascending: false });
    return data || [];
  },

  async restoreVersion(versionId: string): Promise<Version | null> {
    const { data } = await db.from('versions').select('*').eq('id', versionId).single();
    return data || null;
  },

  async compareVersions(versionId1: string, versionId2: string): Promise<any> {
    const { data: v1 } = await db.from('versions').select('*').eq('id', versionId1).single();
    const { data: v2 } = await db.from('versions').select('*').eq('id', versionId2).single();

    return {
      version1: v1,
      version2: v2,
      differences: []
    };
  }
};
