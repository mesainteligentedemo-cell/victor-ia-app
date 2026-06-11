import { create } from 'zustand';
import { Integration, SyncLog } from '@/lib/types';

interface IntegrationsState {
  integrations: Integration[];
  syncLogs: SyncLog[];
  isLoading: boolean;
  setIntegrations: (integrations: Integration[]) => void;
  setSyncLogs: (logs: SyncLog[]) => void;
  addIntegration: (integration: Integration) => void;
  setLoading: (loading: boolean) => void;
}

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  integrations: [],
  syncLogs: [],
  isLoading: false,
  setIntegrations: (integrations) => set({ integrations }),
  setSyncLogs: (logs) => set({ syncLogs: logs }),
  addIntegration: (integration) => set((state) => ({ integrations: [integration, ...state.integrations] })),
  setLoading: (loading) => set({ isLoading: loading })
}));
