// Agents: 23 specialized AI agents

export type AgentCategory = 'sales' | 'marketing' | 'support' | 'data' | 'content' | 'dev';
export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  skills: string[];
  icon?: string;
  costPerExecution: number;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
}

export interface AgentInput {
  agentId: string;
  userId: string;
  params: Record<string, unknown>;
  context?: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  userId: string;
  status: AgentStatus;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  creditsUsed: number;
  executionTime: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface AgentResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata: {
    agentId: string;
    executionId: string;
    creditsUsed: number;
    executionTime: number;
  };
}