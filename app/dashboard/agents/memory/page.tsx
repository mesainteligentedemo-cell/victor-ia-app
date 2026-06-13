'use client';

import { useState } from 'react';
import { Trash2, Copy, BarChart3, Brain, TrendingUp } from 'lucide-react';

const AGENTS = [
  {
    id: 'copywriter',
    name: 'Copywriter Pro',
    avatar: '✍️',
    specialty: 'Copywriting',
    memory: [
      { type: 'preference', key: 'tone', value: 'Casual, conversacional, con emojis', confidence: 0.95 },
      { type: 'preference', key: 'length', value: 'Párrafos cortos (máx 3 líneas)', confidence: 0.88 },
      { type: 'style', key: 'cta', value: 'Siempre include CTA al final', confidence: 0.92 },
      { type: 'instruction', key: 'audience', value: 'Emprendedores tech 25-35 años', confidence: 0.85 },
      { type: 'feedback', key: 'improvement', value: 'Datos reales mejoran ROI 34%', confidence: 0.78 },
    ],
    learningScore: 0.88,
    outputs: 234,
    avgRating: 4.7,
    successRate: 94,
  },
  {
    id: 'designer',
    name: 'Designer Master',
    avatar: '🎨',
    specialty: 'Diseño Visual',
    memory: [
      { type: 'preference', key: 'colors', value: 'Blanco, negro, azul tech', confidence: 0.92 },
      { type: 'preference', key: 'style', value: 'Minimalista, luxury, moderno', confidence: 0.89 },
      { type: 'style', key: 'typography', value: 'Sans-serif, 16px min (accesibilidad)', confidence: 0.91 },
      { type: 'instruction', key: 'spacing', value: '8pt grid alignment', confidence: 0.87 },
    ],
    learningScore: 0.90,
    outputs: 156,
    avgRating: 4.8,
    successRate: 96,
  },
  {
    id: 'videographer',
    name: 'Videographer AI',
    avatar: '🎬',
    specialty: 'Producción de Video',
    memory: [
      { type: 'preference', key: 'duration', value: '30-60 segundos (short form)', confidence: 0.93 },
      { type: 'preference', key: 'music', value: 'Música original + SFX dinámicos', confidence: 0.85 },
      { type: 'style', key: 'pacing', value: 'Fast cuts (0.5-1.5s per scene)', confidence: 0.89 },
    ],
    learningScore: 0.86,
    outputs: 89,
    avgRating: 4.6,
    successRate: 91,
  },
];

export default function AgentMemoryPage() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [showNewMemory, setShowNewMemory] = useState(false);
  const [memories, setMemories] = useState(selectedAgent.memory);

  const handleRemoveMemory = (index: number) => {
    const updated = memories.filter((_, i) => i !== index);
    setMemories(updated);
  };

  const getMemoryColor = (confidence: number) => {
    if (confidence >= 0.9) return '#10b981'; // green
    if (confidence >= 0.75) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', color: 'var(--p)', minHeight: '100vh' }}>
      <style>{`
        .agent-card {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .agent-card.active {
          border-color: #000;
          background: var(--bg3);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .memory-item {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        .memory-item:hover {
          border-color: #000;
        }
        .confidence-bar {
          width: 100px;
          height: 6px;
          background: var(--b);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 4px;
        }
        .btn {
          background: var(--bg3);
          border: 1px solid var(--b);
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          color: var(--p);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn:hover {
          border-color: #000;
        }
        .btn.danger {
          color: #ef4444;
        }
        .stat {
          background: var(--bg2);
          border: 1px solid var(--b);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }
      `}</style>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>Memoria de Agentes</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--t2)' }}>Ves qué han aprendido tus especialistas sobre ti</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }}>
        {/* Agent List */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--t2)' }}>Especialistas</h3>
          {AGENTS.map((agent) => (
            <div
              key={agent.id}
              className={`agent-card ${selectedAgent.id === agent.id ? 'active' : ''}`}
              onClick={() => { setSelectedAgent(agent); setMemories(agent.memory); }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{agent.avatar}</div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600 }}>{agent.name}</h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--t3)' }}>{agent.specialty}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--t3)' }}>Learning Score</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: 600 }}>{(agent.learningScore * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--t3)' }}>Éxito: {agent.successRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Memory Details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
              Memoria de {selectedAgent.name}
            </h2>
            <button className="btn" style={{ background: '#000', color: 'white', border: 'none' }} onClick={() => setShowNewMemory(!showNewMemory)}>
              + Agregar Manual
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div className="stat">
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Outputs Generados</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 700 }}>{selectedAgent.outputs}</p>
            </div>
            <div className="stat">
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Rating Promedio</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 700 }}>{selectedAgent.avgRating} ⭐</p>
            </div>
            <div className="stat">
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--t2)' }}>Tasa Éxito</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 700 }}>{selectedAgent.successRate}%</p>
            </div>
          </div>

          {/* Memory Items */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Lo que ha aprendido ({memories.length} items)</h3>

            {memories.map((memory, i) => (
              <div key={i} className="memory-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: 'white',
                      background: memory.type === 'preference' ? '#0ea5e9' : memory.type === 'style' ? '#8b5cf6' : memory.type === 'instruction' ? '#f59e0b' : '#10b981',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      {memory.type}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{memory.key}</span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--t2)' }}>{memory.value}</p>
                  <div className="confidence-bar">
                    <div style={{
                      height: '100%',
                      width: `${memory.confidence * 100}%`,
                      background: getMemoryColor(memory.confidence),
                      borderRadius: '3px',
                    }} />
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--t3)' }}>
                    Confianza: {(memory.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <button className="btn danger" onClick={() => handleRemoveMemory(i)}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Learning Progress */}
          <div style={{ marginTop: '32px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Brain size={20} />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Progreso de Aprendizaje</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--t2)', fontWeight: 600 }}>Próximo Nivel</p>
                <div style={{ width: '100%', height: '8px', background: 'var(--b)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: '#10b981' }} />
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--t3)' }}>65 XP / 100 XP requeridos</p>
              </div>
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--t2)', fontWeight: 600 }}>Especialización</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Experto 🎓</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--t3)' }}>Próximo: Master (3 XP más)</p>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>💡 {selectedAgent.name} ahora genera outputs 94% más afines a tu estilo</p>
            </div>
          </div>

          {/* Custom Instructions */}
          <div style={{ marginTop: '24px', background: 'var(--bg2)', border: '1px solid var(--b)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Instrucciones Personalizadas</h3>
            <div style={{ background: 'var(--bg)', border: '1px dashed var(--b)', borderRadius: '8px', padding: '16px', minHeight: '100px' }}>
              <textarea
                placeholder="Escribe instrucciones específicas que quieras que recuerde este especialista..."
                style={{
                  width: '100%',
                  height: '100px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--p)',
                  fontSize: '13px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <button className="btn" style={{ marginTop: '12px', background: '#000', color: 'white', border: 'none' }}>
              Guardar Instrucciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}