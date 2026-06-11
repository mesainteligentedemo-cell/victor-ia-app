import { create } from 'zustand';
import { Prospect, PipelineStage, CRMMetrics } from '@/lib/types';

interface CRMState {
  prospects: Prospect[];
  metrics: CRMMetrics | null;
  selectedProspect: Prospect | null;
  filterStage: PipelineStage | null;
  isLoading: boolean;
  setProspects: (prospects: Prospect[]) => void;
  addProspect: (prospect: Prospect) => void;
  updateProspect: (prospect: Prospect) => void;
  removeProspect: (id: string) => void;
  selectProspect: (prospect: Prospect | null) => void;
  setMetrics: (metrics: CRMMetrics) => void;
  setFilterStage: (stage: PipelineStage | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useCRMStore = create<CRMState>((set) => ({
  prospects: [],
  metrics: null,
  selectedProspect: null,
  filterStage: null,
  isLoading: false,
  setProspects: (prospects) => set({ prospects }),
  addProspect: (prospect) => set((state) => ({ prospects: [prospect, ...state.prospects] })),
  updateProspect: (prospect) => set((state) => ({ prospects: state.prospects.map((p) => (p.id === prospect.id ? prospect : p)) })),
  removeProspect: (id) => set((state) => ({ prospects: state.prospects.filter((p) => p.id !== id) })),
  selectProspect: (prospect) => set({ selectedProspect: prospect }),
  setMetrics: (metrics) => set({ metrics }),
  setFilterStage: (stage) => set({ filterStage: stage }),
  setLoading: (loading) => set({ isLoading: loading })
}));
