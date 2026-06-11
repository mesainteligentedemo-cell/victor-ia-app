import { create } from 'zustand';
import { N8nWorkflow, N8nWebhook } from '@/lib/types';

interface AutomationState {
  workflows: N8nWorkflow[];
  webhooks: N8nWebhook[];
  isLoading: boolean;
  selectedWorkflow: N8nWorkflow | null;
  setWorkflows: (workflows: N8nWorkflow[]) => void;
  setWebhooks: (webhooks: N8nWebhook[]) => void;
  addWorkflow: (workflow: N8nWorkflow) => void;
  selectWorkflow: (workflow: N8nWorkflow | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAutomationStore = create<AutomationState>((set) => ({
  workflows: [],
  webhooks: [],
  isLoading: false,
  selectedWorkflow: null,
  setWorkflows: (workflows) => set({ workflows }),
  setWebhooks: (webhooks) => set({ webhooks }),
  addWorkflow: (workflow) => set((state) => ({ workflows: [workflow, ...state.workflows] })),
  selectWorkflow: (workflow) => set({ selectedWorkflow: workflow }),
  setLoading: (loading) => set({ isLoading: loading })
}));
