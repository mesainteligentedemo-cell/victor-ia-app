import { create } from 'zustand';
import { Agent, AgentExecution } from '@/lib/types';

interface AgentsState {
  agents: Agent[];
  executions: AgentExecution[];
  isLoading: boolean;
  selectedAgent: Agent | null;
  setAgents: (agents: Agent[]) => void;
  addExecution: (execution: AgentExecution) => void;
  selectAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAgentsStore = create<AgentsState>((set) => ({
  agents: [],
  executions: [],
  isLoading: false,
  selectedAgent: null,
  setAgents: (agents) => set({ agents }),
  addExecution: (execution) => set((state) => ({ executions: [execution, ...state.executions] })),
  selectAgent: (agent) => set({ selectedAgent: agent }),
  setLoading: (loading) => set({ isLoading: loading })
}));
