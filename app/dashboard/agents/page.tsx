'use client';

import { useState } from 'react';
import { Plus, Zap } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  model: string;
  status: 'active' | 'idle' | 'thinking';
  tasks: number;
  uptime: string;
}

const SAMPLE_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Generador de Código',
    role: 'Especialista en Desarrollo',
    specialty: 'React, Node.js, TypeScript',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 5,
    uptime: '99.9%',
  },
  {
    id: '2',
    name: 'Diseñador UI/UX',
    role: 'Diseño y Maquetación',
    specialty: 'Figma, CSS, Accesibilidad',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 3,
    uptime: '99.8%',
  },
  {
    id: '3',
    name: 'Copywriter',
    role: 'Contenido y Marketing',
    specialty: 'SEO, Copywriting, Social',
    model: 'Haiku 4.5',
    status: 'idle',
    tasks: 0,
    uptime: '100%',
  },
  {
    id: '4',
    name: 'Video Editor',
    role: 'Producción Audiovisual',
    specialty: 'After Effects, Premiere, DaVinci',
    model: '⭐ Sonnet 4.6',
    status: 'thinking',
    tasks: 2,
    uptime: '99.7%',
  },
  {
    id: '5',
    name: 'Data Analyst',
    role: 'Analytics e Insights',
    specialty: 'SQL, Python, Power BI',
    model: 'Opus 4.8',
    status: 'active',
    tasks: 4,
    uptime: '99.9%',
  },
  {
    id: '6',
    name: 'Especialista en IA',
    role: 'Machine Learning',
    specialty: 'LLMs, Fine-tuning, RAG',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 7,
    uptime: '99.95%',
  },
];

export default function AgentsPage() {
  const [agents] = useState(SAMPLE_AGENTS);
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

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
      default:
        return '⚪ Inactivo';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Agentes IA
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '4px' }}>
            {agents.length} especialistas · {agents.filter((a) => a.status === 'active').length} activos
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'var(--blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          <Plus size={16} />
          Crear
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        <button
          onClick={() => setFilterSpecialty(null)}
          style={{
            padding: '8px 12px',
            background: !filterSpecialty ? 'var(--blue)' : 'var(--bg2)',
            color: !filterSpecialty ? '#FFFFFF' : 'var(--t2)',
            border: '1px solid var(--b)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Todos
        </button>
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setFilterSpecialty(spec)}
            style={{
              padding: '8px 12px',
              background: filterSpecialty === spec ? 'var(--blue)' : 'var(--bg2)',
              color: filterSpecialty === spec ? '#FFFFFF' : 'var(--t2)',
              border: '1px solid var(--b)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {spec.split(',')[0]}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {filtered.map((agent) => (
          <div
            key={agent.id}
            onClick={() =>
              setSelectedAgents((prev) =>
                prev.includes(agent.id) ? prev.filter((id) => id !== agent.id) : [...prev, agent.id]
              )
            }
            style={{
              padding: '16px',
              background: 'var(--bg2)',
              border: selectedAgents.includes(agent.id) ? '2px solid var(--blue)' : '1px solid var(--b)',
              borderRadius: 'var(--r)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{agent.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--t3)' }}>{agent.role}</p>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '4px' }}>{agent.specialty}</p>
              <p style={{ fontSize: '11px', color: 'var(--t3)' }}>{agent.model}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--bg3)', borderRadius: '6px' }}>
                <p style={{ fontSize: '10px', color: 'var(--t3)' }}>Tareas</p>
                <p style={{ fontSize: '14px', fontWeight: 700 }}>{agent.tasks}</p>
              </div>
              <div style={{ padding: '8px', background: 'var(--bg3)', borderRadius: '6px' }}>
                <p style={{ fontSize: '10px', color: 'var(--t3)' }}>Uptime</p>
                <p style={{ fontSize: '14px', fontWeight: 700 }}>{agent.uptime}</p>
              </div>
            </div>

            <div
              style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '12px', color: getStatusColor(agent.status), fontWeight: 600 }}>
                {getStatusLabel(agent.status)}
              </span>
              <button
                style={{
                  padding: '4px 8px',
                  background: 'transparent',
                  border: '1px solid var(--b)',
                  borderRadius: '6px',
                  color: 'var(--t2)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                Ejecutar
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAgents.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            background: 'var(--blue)',
            color: '#FFFFFF',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 50,
          }}
        >
          <Zap size={18} />
          <span>{selectedAgents.length} agentes seleccionados</span>
          <button
            style={{
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '6px',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            Ejecutar
          </button>
        </div>
      )}

      {showCreateModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              background: 'var(--bg2)',
              borderRadius: '20px 20px 0 0',
              padding: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Crear Agente</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Nombre</label>
                <input type="text" placeholder="Ej: Especialista en SEO" style={{ width: '100%', marginTop: '6px', padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--b)', borderRadius: '8px', color: 'var(--t1)', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t3)' }}>Modelo</label>
                <select style={{ width: '100%', marginTop: '6px', padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--b)', borderRadius: '8px', color: 'var(--t1)', fontSize: '13px' }}>
                  <option>⭐ Sonnet 4.6</option>
                  <option>Opus 4.8</option>
                  <option>Haiku 4.5</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '8px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '8px', color: 'var(--t2)', cursor: 'pointer', fontWeight: 600 }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: '8px', background: 'var(--blue)', border: 'none', borderRadius: '8px', color: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}>
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}