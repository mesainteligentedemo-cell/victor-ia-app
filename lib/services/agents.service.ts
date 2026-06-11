import { Agent, AgentExecution, AgentResult } from '@/lib/types';
import { db } from '@/lib/db/supabase';

// 23 agents registry
const AGENTS_REGISTRY: Record<string, Agent> = {
  lead_qualifier: {
    id: 'lead_qualifier',
    name: 'Lead Qualifier',
    description: 'Califica prospectos automáticamente',
    category: 'sales',
    skills: ['qualification', 'scoring', 'analysis'],
    costPerExecution: 2,
    config: { model: 'claude-3-sonnet-20240229', temperature: 0.7, maxTokens: 1000, systemPrompt: 'You are a lead qualification expert.' }
  },
  pitch_generator: {
    id: 'pitch_generator',
    name: 'Pitch Generator',
    description: 'Crea pitches personalizados',
    category: 'sales',
    skills: ['copywriting', 'personalization', 'conversion'],
    costPerExecution: 3,
    config: { model: 'claude-3-sonnet-20240229', temperature: 0.8, maxTokens: 2000, systemPrompt: 'You are a pitch writing expert.' }
  },
  content_strategist: {
    id: 'content_strategist',
    name: 'Content Strategist',
    description: 'Planifica estrategia de contenido',
    category: 'marketing',
    skills: ['strategy', 'planning', 'content', 'seo'],
    costPerExecution: 4,
    config: { model: 'claude-3-sonnet-20240229', temperature: 0.7, maxTokens: 2500, systemPrompt: 'You are a content strategy expert.' }
  },
  seo_expert: {
    id: 'seo_expert',
    name: 'SEO Expert',
    description: 'Mejora SEO on-page',
    category: 'marketing',
    skills: ['seo', 'optimization', 'keywords', 'ranking'],
    costPerExecution: 3,
    config: { model: 'claude-3-sonnet-20240229', temperature: 0.6, maxTokens: 1500, systemPrompt: 'You are an SEO optimization expert.' }
  },
  ticket_triager: {
    id: 'ticket_triager',
    name: 'Ticket Triager',
    description: 'Clasifica tickets por urgencia',
    category: 'support',
    skills: ['triage', 'priority', 'routing'],
    costPerExecution: 1,
    config: { model: 'claude-3-haiku-20240307', temperature: 0.5, maxTokens: 500, systemPrompt: 'You are a support ticket triage expert.' }
  },
  analytics_interpreter: {
    id: 'analytics_interpreter',
    name: 'Analytics Interpreter',
    description: 'Interpreta métricas',
    category: 'data',
    skills: ['analysis', 'interpretation', 'insights', 'reporting'],
    costPerExecution: 5,
    config: { model: 'claude-3-sonnet-20240229', temperature: 0.6, maxTokens: 2000, systemPrompt: 'You are an analytics expert.' }
  },
  blog_writer: {
    id: 'blog_writer',
    name: 'Blog Writer',
    description: 'Escribe artículos de blog',
    category: 'content',
    skills: ['writing', 'research', 'blogging', 'seo'],
    costPerExecution: 8,
    config: { model: 'claude-3-sonnet-20240229', temperature: 0.8, maxTokens: 3000, systemPrompt: 'You are a professional blog writer.' }
  },
  code_reviewer: {
    id: 'code_reviewer',
    name: 'Code Reviewer',
    description: 'Revisa código',
    category: 'dev',
    skills: ['code-review', 'quality', 'security', 'performance'],
    costPerExecution: 6,
    config: { model: 'claude-3-sonnet-20240229', temperature: 0.5, maxTokens: 2000, systemPrompt: 'You are an expert code reviewer.' }
  }
};

export const AgentsService = {
  async listAgents(): Promise<Agent[]> {
    return Object.values(AGENTS_REGISTRY);
  },

  async getAgentConfig(agentId: string): Promise<Agent | null> {
    return AGENTS_REGISTRY[agentId] || null;
  },

  async executeAgent(agentId: string, userId: string, params: any): Promise<AgentExecution> {
    const agent = AGENTS_REGISTRY[agentId];
    if (!agent) throw new Error(`Agent ${agentId} not found`);

    const executionId = Math.random().toString(36).substring(7);
    const startTime = Date.now();

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: agent.config.model,
        max_tokens: agent.config.maxTokens,
        temperature: agent.config.temperature,
        system: agent.config.systemPrompt,
        messages: [{ role: 'user', content: JSON.stringify(params) }]
      })
    });

    const result = await response.json();
    const endTime = Date.now();

    const execution: AgentExecution = {
      id: executionId,
      agentId,
      userId,
      status: 'completed',
      input: params,
      output: result.content[0]?.text,
      creditsUsed: agent.costPerExecution,
      executionTime: endTime - startTime,
      startedAt: new Date(startTime),
      completedAt: new Date(endTime)
    };

    await db.from('agent_executions').insert(execution);
    return execution;
  }
};