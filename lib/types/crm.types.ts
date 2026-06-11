// CRM: Prospect management and pipeline

export type PipelineStage = 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Prospect {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  stage: PipelineStage;
  value: number;
  probability?: number;
  nextAction?: string;
  nextActionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  convertedAt?: Date;
}

export interface ProspectNote {
  id: string;
  prospectId: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
}

export interface ProspectActivity {
  id: string;
  prospectId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'stage_change';
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface CRMMetrics {
  totalProspects: number;
  prospectsPerStage: Record<PipelineStage, number>;
  avgValuePerProspect: number;
  conversionRate: number;
  avgTimeInPipeline: number;
  topPerformers: Array<{ userId: string; conversions: number }>;
}