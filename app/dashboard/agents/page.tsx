'use client';

import { useState } from 'react';
import { Plus, Zap, X } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  model: string;
  status: 'active' | 'idle' | 'thinking' | 'running';
  tasks: number;
  uptime: string;
}

const SAMPLE_AGENTS: Agent[] = [
  {
    id: 'lead_qualifier',
    name: 'Lead Qualifier',
    role: 'Calificación de Prospectos',
    specialty: 'Sales, Lead Scoring, CRM',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.9%',
  },
  {
    id: 'pitch_generator',
    name: 'Pitch Generator',
    role: 'Generador de Propuestas',
    specialty: 'Copy, Ventas, Persuasión',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 8,
    uptime: '99.8%',
  },
  {
    id: 'content_strategist',
    name: 'Content Strategist',
    role: 'Estrategia de Contenido',
    specialty: 'SEO, Marketing, Blogs',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 15,
    uptime: '100%',
  },
  {
    id: 'seo_expert',
    name: 'SEO Expert',
    role: 'Optimización SEO',
    specialty: 'Technical SEO, Keywords, Ranking',
    model: 'Haiku 4.5',
    status: 'idle',
    tasks: 0,
    uptime: '100%',
  },
  {
    id: 'ticket_triager',
    name: 'Ticket Triager',
    role: 'Gestor de Tickets',
    specialty: 'Support, Classification, Routing',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 24,
    uptime: '99.95%',
  },
  {
    id: 'analytics_interpreter',
    name: 'Analytics Interpreter',
    role: 'Analista de Datos',
    specialty: 'Data, Insights, Reporting',
    model: 'Opus 4.8',
    status: 'active',
    tasks: 6,
    uptime: '99.9%',
  },
  {
    id: 'blog_writer',
    name: 'Blog Writer',
    role: 'Redactor de Contenido',
    specialty: 'Writing, Storytelling, Engagement',
    model: 'Sonnet 4.6',
    status: 'thinking',
    tasks: 3,
    uptime: '99.7%',
  },
  {
    id: 'code_reviewer',
    name: 'Code Reviewer',
    role: 'Revisor de Código',
    specialty: 'TypeScript, React, Best Practices',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 9,
    uptime: '99.9%',
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(SAMPLE_AGENTS);
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [executingAgentId, setExecutingAgentId] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<{ visible: boolean; agentId?: string; result?: string; loading?: boolean }>({ visible: false });

  const specialties = Array.from(new Set(agents.map((a) => a.specialty)));
  const filtered = filterSpecialty
    ? agents.filter((a) => a.specialty.includes(filterSpecialty))
    : agents;

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'var(--green)';
      case 'thinking':
        return 'var(--orange)';
      case 'running':
        return 'var(--blue)';
      default:
        return 'var(--t3)';
    }
  };

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '🟢 Activo';
      case 'thinking':
        return '🟡 Pensando';
      case 'running':
        return '🔵 Ejecutando';
      default:
        return '⚪ Inactivo';
    }
  };

  const handleExecuteAgent = async (agentId: string) => {
    setExecutingAgentId(agentId);
    setAgents(agents.map((a) => (a.id === agentId ? { ...a, status: 'running' as const } : a)));
    setResultModal({ visible: true, agentId, loading: true });

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          userId: 'demo-user',
          params: { prompt: `Execute agent: ${agentId}` },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultModal({
          visible: true,
          agentId,
          result: data.result || 'Agent executed successfully',
          loading: false,
        });
        setAgents(agents.map((a) => (a.id === agentId ? { ...a, status: 'active' as const } : a)));
      } else {
        setResultModal({
          visible: true,
          agentId,
          result: `Error: ${data.error || 'Unknown error'}`,
          loading: false,
        });
      }
    } catch (error) {
      setResultModal({
        visible: true,
        agentId,
        result: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loading: false,
      });
    } finally {
      setExecutingAgentId(null);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>🤖 Agentes IA</h1>
          <p style={{ fontSize: '12px', color: 'var(--t3)' }}>
            {agents.length} especialistas · {agents.filter((a) => a.status === 'active' || a.status === 'running').length} activos
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          <Plus size={16} />
          Crear Agente
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
        <button
          onClick={() => setFilterSpecialty(null)}
          style={{
            padding: '8px 14px',
            background: !filterSpecialty ? 'var(--blue)' : 'var(--bg2)',
            color: !filterSpecialty ? 'white' : 'var(--t2)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Todos
        </button>
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => setFilterSpecialty(specialty)}
            style={{
              padding: '8px 14px',
              background: filterSpecialty === specialty ? 'var(--blue)' : 'var(--bg2)',
              color: filterSpecialty === specialty ? 'white' : 'var(--t2)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {specialty.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
        {filtered.map((agent) => (
          <div
            key={agent.id}
            style={{
              padding: '20px',
              background: 'var(--bg2)',
              borderRadius: '12px',
              border: '1px solid var(--b)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{agent.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{agent.role}</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: getStatusColor(agent.status),
                    fontWeight: 600,
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(agent.status) }} />
                  {getStatusLabel(agent.status)}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--t2)' }}>{agent.specialty}</p>
            </div>

            {/* Model & Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>MODELO</p>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{agent.model}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>TAREAS</p>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{agent.tasks}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>UPTIME</p>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{agent.uptime}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleExecuteAgent(agent.id)}
                disabled={executingAgentId === agent.id || agent.status === 'running'}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: agent.status === 'running' ? 'var(--t3)' : 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: executingAgentId === agent.id || agent.status === 'running' ? 'wait' : 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {agent.status === 'running' ? (
                  <>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⚙️</span>
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Ejecutar
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Result Modal */}
      {resultModal.visible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: 'var(--bg)',
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '600px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                Resultado de {agents.find((a) => a.id === resultModal.agentId)?.name}
              </h2>
              <button
                onClick={() => setResultModal({ visible: false })}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--t3)',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {resultModal.loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '14px', color: 'var(--t2)', marginBottom: '16px' }}>Ejecutando agente...</p>
                <div style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }}>⚙️</div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: 'var(--bg2)',
                    padding: '16px',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {resultModal.result}
                </div>

                <button
                  onClick={() => setResultModal({ visible: false })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cerrar
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
