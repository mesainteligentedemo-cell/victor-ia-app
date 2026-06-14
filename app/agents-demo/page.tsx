'use client';

import { useState } from 'react';
import { Zap, X } from 'lucide-react';

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
  // ──────────── MAESTRÍA & DIRECCIÓN ────────────
  {
    id: 'agente_maestro',
    name: 'Agente Maestro',
    role: 'Dirección General · Orquestación',
    specialty: 'Planificación estratégica, delegación inteligente, síntesis de resultados',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 28,
    uptime: '100%',
  },
  {
    id: 'gerente_ia',
    name: 'Gerente IA',
    role: 'Dirección Ejecutiva · Supervisión',
    specialty: 'Control de calidad, auditoría de tareas, reportes ejecutivos',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 32,
    uptime: '99.9%',
  },
  {
    id: 'director_deep_learning',
    name: 'Director de Deep Learning',
    role: 'Mejora Continua · Aprendizaje',
    specialty: 'Análisis de bitácoras, síntesis de patrones, recomendaciones de evolución',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 16,
    uptime: '99.95%',
  },

  // ──────────── VENTAS & NEGOCIO ────────────
  {
    id: 'calificador_leads',
    name: 'Calificador de Leads',
    role: 'Ventas · Lead Scoring',
    specialty: 'Evaluación de prospectos, priorización, scoring automático',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 42,
    uptime: '99.9%',
  },
  {
    id: 'generador_propuestas',
    name: 'Generador de Propuestas',
    role: 'Ventas · Pitch & Copy',
    specialty: 'Redacción de cotizaciones, argumentación de venta, CTAs persuasivos',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 38,
    uptime: '99.8%',
  },
  {
    id: 'cierre_automatico',
    name: 'Cierre Automático',
    role: 'Ventas · Negociación',
    specialty: 'Objeción handling, estrategia de cierre, follow-up inteligente',
    model: '⭐ Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'prospector_clientes',
    name: 'Prospector de Clientes',
    role: 'Ventas · Prospecting',
    specialty: 'Identificación de nichos, búsqueda de empresas, lead sourcing',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 18,
    uptime: '99.8%',
  },
  {
    id: 'analista_competencia',
    name: 'Analista de Competencia',
    role: 'Ventas · Inteligencia',
    specialty: 'Análisis de rivales, benchmarking, ventajas diferenciables',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 12,
    uptime: '99.9%',
  },

  // ──────────── CONTENIDO & MARKETING ────────────
  {
    id: 'estratega_contenido',
    name: 'Estratega de Contenido',
    role: 'Marketing · Estrategia',
    specialty: 'Planificación de contenido, calendarios editoriales, narrativa de marca',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 45,
    uptime: '100%',
  },
  {
    id: 'redactor_blog',
    name: 'Redactor de Blog',
    role: 'Marketing · Copywriting',
    specialty: 'Artículos optimizados, storytelling, engagement narrativo',
    model: 'Sonnet 4.6',
    status: 'thinking',
    tasks: 23,
    uptime: '99.7%',
  },
  {
    id: 'especialista_seo',
    name: 'Especialista SEO',
    role: 'Marketing · Posicionamiento',
    specialty: 'Technical SEO, keywords, meta tags, estructura JSON-LD',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 35,
    uptime: '100%',
  },
  {
    id: 'auditor_seo_tecnico',
    name: 'Auditor SEO Técnico',
    role: 'Marketing · Auditoría',
    specialty: 'Análisis de velocidad, crawlability, mobile-first, Core Web Vitals',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.8%',
  },
  {
    id: 'gestor_redes_sociales',
    name: 'Gestor de Redes Sociales',
    role: 'Marketing · Social',
    specialty: 'Calendarios, copywriting, engagement strategy, community management',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 28,
    uptime: '99.9%',
  },
  {
    id: 'diseñador_campañas',
    name: 'Diseñador de Campañas',
    role: 'Marketing · Campaigns',
    specialty: 'Diseño de estrategias, creatividad, brief visual, estructuración de anuncios',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 19,
    uptime: '99.8%',
  },
  {
    id: 'copywriter_premium',
    name: 'Copywriter Premium',
    role: 'Marketing · Voz',
    specialty: 'Copy luxury, argumentación de alto nivel, persuasión refinada',
    model: '⭐ Sonnet 4.6',
    status: 'active',
    tasks: 16,
    uptime: '99.9%',
  },
  {
    id: 'especialista_email',
    name: 'Especialista Email Marketing',
    role: 'Marketing · Automatización',
    specialty: 'Secuencias de email, subject lines, funnels de conversión',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 14,
    uptime: '99.8%',
  },

  // ──────────── DISEÑO & CREATIVIDAD ────────────
  {
    id: 'director_arte',
    name: 'Director de Arte',
    role: 'Diseño · Dirección',
    specialty: 'Conceptos visuales, tipografía, paletas, composición, marca',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 26,
    uptime: '99.9%',
  },
  {
    id: 'diseñador_ui_ux',
    name: 'Diseñador UI/UX',
    role: 'Diseño · Interfaces',
    specialty: 'Wireframes, prototipado, accesibilidad, user flows, responsive design',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 31,
    uptime: '99.8%',
  },
  {
    id: 'ilustrador_ia',
    name: 'Ilustrador IA',
    role: 'Diseño · Visual',
    specialty: 'Ilustraciones custom, estilos artísticos, generación de assets visuales',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 24,
    uptime: '99.9%',
  },
  {
    id: 'animador_motion',
    name: 'Animador Motion Design',
    role: 'Diseño · Motion',
    specialty: 'Animaciones GSAP, scroll cinematográfico, transiciones premium, 3D web',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 18,
    uptime: '99.8%',
  },
  {
    id: 'especialista_3d',
    name: 'Especialista 3D Web',
    role: 'Diseño · WebGL',
    specialty: 'Three.js, React Three Fiber, shaders GLSL, efectos 3D interactivos',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.7%',
  },
  {
    id: 'curador_design',
    name: 'Curador de Diseño',
    role: 'Diseño · Auditoría',
    specialty: 'Análisis de experiencia, benchmarks visuales, recomendaciones de polish',
    model: 'Opus 4.8',
    status: 'active',
    tasks: 14,
    uptime: '99.95%',
  },

  // ──────────── DESARROLLO ────────────
  {
    id: 'arquitecto_sistemas',
    name: 'Arquitecto de Sistemas',
    role: 'Desarrollo · Arquitectura',
    specialty: 'Diseño de infraestructura, escalabilidad, patrones, database design',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 22,
    uptime: '99.95%',
  },
  {
    id: 'desarrollador_frontend',
    name: 'Desarrollador Frontend',
    role: 'Desarrollo · React',
    specialty: 'React, Next.js, TypeScript, componentes reutilizables, performance',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 39,
    uptime: '99.8%',
  },
  {
    id: 'desarrollador_backend',
    name: 'Desarrollador Backend',
    role: 'Desarrollo · API',
    specialty: 'APIs REST, bases de datos, autenticación, seguridad, escalabilidad',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 35,
    uptime: '99.9%',
  },
  {
    id: 'especialista_devops',
    name: 'Especialista DevOps',
    role: 'Desarrollo · Cloud',
    specialty: 'CI/CD, Docker, Kubernetes, deployment, monitoreo, infraestructura',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 17,
    uptime: '99.95%',
  },
  {
    id: 'revisor_codigo',
    name: 'Revisor de Código',
    role: 'Desarrollo · QA',
    specialty: 'Auditoría de código, best practices, seguridad, performance, refactoring',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 28,
    uptime: '99.9%',
  },

  // ──────────── ANÁLISIS & DATOS ────────────
  {
    id: 'analista_datos',
    name: 'Analista de Datos',
    role: 'Análisis · Analytics',
    specialty: 'Análisis de métricas, dashboards, insights, reportes, visualizaciones',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 18,
    uptime: '99.95%',
  },
  {
    id: 'especialista_ml',
    name: 'Especialista Machine Learning',
    role: 'Análisis · ML',
    specialty: 'Modelos ML, TensorFlow, PyTorch, training, inference, MLOps',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 17,
    uptime: '99.9%',
  },

  // ──────────── SOPORTE ────────────
  {
    id: 'gestor_tickets',
    name: 'Gestor de Tickets',
    role: 'Soporte · Clasificación',
    specialty: 'Triaje de incidentes, clasificación automática, routing, priorización',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 52,
    uptime: '99.95%',
  },
  {
    id: 'especialista_soporte',
    name: 'Especialista Soporte',
    role: 'Soporte · Service',
    specialty: 'Resolución de problemas, FAQ, troubleshooting, customer happiness',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 38,
    uptime: '99.8%',
  },
];

function extractCategory(role: string): string {
  return role.split('·')[0].trim();
}

export default function AgentsPage() {
  const [agents] = useState<Agent[]>(SAMPLE_AGENTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [executingAgentId, setExecutingAgentId] = useState<string | null>(null);
  const [resultModal, setResultModal] = useState<{ visible: boolean; agentId?: string; result?: string; loading?: boolean }>({ visible: false });

  // Agrupar agentes por categoría
  const categories = Array.from(new Set(agents.map((a) => extractCategory(a.role)))).sort();
  const agentsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = agents.filter((a) => extractCategory(a.role) === cat);
    return acc;
  }, {} as Record<string, Agent[]>);

  const filteredAgents = selectedCategory ? agentsByCategory[selectedCategory] : agents;

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'thinking':
        return '#f59e0b';
      case 'running':
        return '#3b82f6';
      default:
        return 'rgba(255,255,255,0.4)';
    }
  };

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '● Activo';
      case 'thinking':
        return '● Pensando';
      case 'running':
        return '● Ejecutando';
      default:
        return '● Inactivo';
    }
  };

  const handleExecuteAgent = async (agentId: string) => {
    setExecutingAgentId(agentId);
    setResultModal({ visible: true, agentId, loading: true });

    try {
      await new Promise(r => setTimeout(r, 1500));
      setResultModal({
        visible: true,
        agentId,
        result: `Agent ${agentId} executed successfully`,
        loading: false,
      });
    } catch (error) {
      setResultModal({
        visible: true,
        agentId,
        result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loading: false,
      });
    } finally {
      setExecutingAgentId(null);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.03em' }}>
          🤖 Sistema de Agentes IA
        </h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
          <strong>{agents.length} especialistas</strong> distribuidos en <strong>{categories.length} categorías</strong> ·
          <strong style={{ marginLeft: '8px' }}>{agents.filter((a) => a.status === 'active' || a.status === 'running').length} activos</strong>
        </p>
      </div>

      {/* Category Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '40px',
        overflowX: 'auto',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: '12px 20px',
            background: !selectedCategory ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)',
            color: !selectedCategory ? '#000000' : 'rgba(255,255,255,0.7)',
            border: !selectedCategory ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            transition: 'all 250ms ease',
          }}
        >
          Todos ({agents.length})
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '12px 20px',
              background: selectedCategory === category ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)',
              color: selectedCategory === category ? '#000000' : 'rgba(255,255,255,0.7)',
              border: selectedCategory === category ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'all 250ms ease',
            }}
          >
            {category} ({agentsByCategory[category].length})
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 250ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            {/* Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{agent.name}</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{agent.role}</p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  fontSize: '10px',
                  color: getStatusColor(agent.status),
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(agent.status) }} />
                  {getStatusLabel(agent.status)}
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{agent.specialty}</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>MODELO</p>
                <p style={{ fontSize: '12px', fontWeight: 600 }}>{agent.model}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>TAREAS</p>
                <p style={{ fontSize: '12px', fontWeight: 600 }}>{agent.tasks}</p>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>UPTIME</p>
                <p style={{ fontSize: '12px', fontWeight: 600 }}>{agent.uptime}</p>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => handleExecuteAgent(agent.id)}
              disabled={executingAgentId === agent.id}
              style={{
                padding: '10px',
                background: executingAgentId === agent.id ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: executingAgentId === agent.id ? 'wait' : 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 250ms ease',
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
        ))}
      </div>

      {/* Result Modal */}
      {resultModal.visible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '600px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>
                Resultado: {agents.find((a) => a.id === resultModal.agentId)?.name}
              </h2>
              <button
                onClick={() => setResultModal({ visible: false })}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '24px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {resultModal.loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Ejecutando agente...</p>
                <div style={{ animation: 'spin 1s linear infinite', fontSize: '32px' }}>⚙️</div>
              </div>
            ) : (
              <>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '16px',
                  borderRadius: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  marginBottom: '20px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: 'rgba(255,255,255,0.7)',
                }}>
                  {resultModal.result}
                </div>

                <button
                  onClick={() => setResultModal({ visible: false })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.8)',
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
