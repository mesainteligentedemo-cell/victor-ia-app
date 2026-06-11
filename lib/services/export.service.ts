import { db } from '@/lib/db/supabase';

export interface ExportJob {
  id: string;
  userId: string;
  type: 'csv' | 'json' | 'pdf' | 'excel';
  dataType: 'prospects' | 'activities' | 'generations' | 'agents' | 'full';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

export const ExportService = {
  async createExport(userId: string, type: ExportJob['type'], dataType: ExportJob['dataType']): Promise<ExportJob> {
    const job: ExportJob = {
      id: Math.random().toString(36).substring(7),
      userId,
      type,
      dataType,
      status: 'pending',
      createdAt: new Date()
    };

    await db.from('export_jobs').insert(job);
    return job;
  },

  async getExportStatus(jobId: string): Promise<ExportJob | null> {
    const { data } = await db.from('export_jobs').select('*').eq('id', jobId).single();
    return data || null;
  },

  async updateExportStatus(jobId: string, status: ExportJob['status'], downloadUrl?: string): Promise<void> {
    await db.from('export_jobs').update({ status, downloadUrl, completedAt: status === 'completed' ? new Date() : undefined }).eq('id', jobId);
  },

  async listExports(userId: string, limit: number = 20): Promise<ExportJob[]> {
    const { data } = await db.from('export_jobs').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
    return data || [];
  }
};
