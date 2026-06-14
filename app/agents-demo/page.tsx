'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

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
    role: 'Negocio · Inteligencia Competitiva',
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
    role: 'Contenido · Copywriting',
    specialty: 'Artículos optimizados, storytelling, engagement narrativo',
    model: 'Sonnet 4.6',
    status: 'thinking',
    tasks: 23,
    uptime: '99.7%',
  },
  {
    id: 'especialista_seo',
    name: 'Especialista SEO',
    role: 'SEO · Posicionamiento',
    specialty: 'Technical SEO, keywords, meta tags, estructura JSON-LD',
    model: 'Haiku 4.5',
    status: 'active',
    tasks: 35,
    uptime: '100%',
  },
  {
    id: 'auditor_seo_tecnico',
    name: 'Auditor SEO Técnico',
    role: 'SEO · Auditoría',
    specialty: 'Análisis de velocidad, crawlability, mobile-first, Core Web Vitals',
    model: 'Sonnet 4.6',
    status: 'idle',
    tasks: 0,
    uptime: '99.8%',
  },
  {
    id: 'gestor_redes_sociales',
    name: 'Gestor de Redes Sociales',
    role: 'Marketing · Social Media',
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
    role: 'Copywriting · Voz de Marca',
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
    role: 'Diseño · Dirección Visual',
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
    role: 'Creatividad · Generación Visual',
    specialty: 'Ilustraciones custom, estilos artísticos, generación de assets visuales',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 24,
    uptime: '99.9%',
  },
  {
    id: 'animador_motion',
    name: 'Animador Motion Design',
    role: 'Motion · Cinematografía',
    specialty: 'Animaciones GSAP, scroll cinematográfico, transiciones premium, 3D web',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 18,
    uptime: '99.8%',
  },
  {
    id: 'especialista_3d',
    name: 'Especialista 3D Web',
    role: 'Creatividad · WebGL',
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

  // ──────────── DESARROLLO & CÓDIGO ────────────
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
    role: 'Operaciones · Cloud',
    specialty: 'CI/CD, Docker, Kubernetes, deployment, monitoreo, infraestructura',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 17,
    uptime: '99.95%',
  },
  {
    id: 'revisor_codigo',
    name: 'Revisor de Código',
    role: 'QA · Code Review',
    specialty: 'Auditoría de código, best practices, seguridad, performance, refactoring',
    model: '⭐ Opus 4.8',
    status: 'active',
    tasks: 28,
    uptime: '99.9%',
  },
  {
    id: 'ingeniero_qa',
    name: 'Ingeniero QA',
    role: 'Testing · Calidad',
    specialty: 'Test planning, unit tests, E2E, performance, debugging, reportes',
    model: 'Sonnet 4.6',
    status: 'active',
    tasks: 26,
    uptime: '99.8%',
  },
];

function extractCategory(role: string): string {
  return role.split('·')[0].trim();
}

function getStatusColor(status: Agent['status']): { bg: string; text: string } {
  switch (status) {
    case 'active':
      return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
    case 'thinking':
      return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
    case 'running':
      return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' };
    default:
      return { bg: 'rgba(255, 255, 255, 0.05)', text: 'rgba(255, 255, 255, 0.4)' };
  }
}

function getStatusLabel(status: Agent['status']): string {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'thinking':
      return 'Pensando';
    case 'running':
      return 'Ejecutando';
    default:
      return 'Inactivo';
  }
}

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(SAMPLE_AGENTS.map((a) => extractCategory(a.role)))).sort();

  const filteredAgents = useMemo(() => {
    return SAMPLE_AGENTS.filter((agent) => {
      const matchesCategory = !selectedCategory || extractCategory(agent.role) === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const agentsByCategory = filteredAgents.reduce(
    (acc, agent) => {
      const cat = extractCategory(agent.role);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(agent);
      return acc;
    },
    {} as Record<string, Agent[]>
  );

  const visibleCategories = Object.keys(agentsByCategory).sort();

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff' }}>
      {/* Hero Section */}
      <div style={{ padding: 'clamp(48px, 8vw, 80px) clamp(24px, 5vw, 64px)' }}>
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            marginBottom: '12px',
            fontFamily: "'Fraunces', serif",
            fontStyle: 'italic',
          }}
        >
          Sistema de Agentes IA
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: 1.5,
            marginBottom: '32px',
            fontWeight: 400,
          }}
        >
          <strong style={{ color: '#ffffff', fontWeight: 600 }}>{filteredAgents.length} agentes</strong> en{' '}
          <strong style={{ color: '#ffffff', fontWeight: 600 }}>{visibleCategories.length} categorías</strong>
        </p>

        {/* Search Bar */}
        <div
          style={{
            position: 'relative',
            marginBottom: '32px',
            maxWidth: '500px',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad o rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: '0px',
              outline: 'none',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '48px',
          }}
        >
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '10px 16px',
              backgroundColor: selectedCategory === null ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === null ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              border: '1px solid ' + (selectedCategory === null ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: selectedCategory === null ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== null) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== null) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            Todos
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              style={{
                padding: '10px 16px',
                backgroundColor: selectedCategory === cat ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                border: '1px solid ' + (selectedCategory === cat ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'),
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: selectedCategory === cat ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agentes Grid */}
      <div style={{ padding: '0 clamp(24px, 5vw, 64px) clamp(48px, 8vw, 80px)' }}>
        {visibleCategories.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.5 }}>
              No se encontraron agentes que coincidan con tu búsqueda
            </p>
          </div>
        ) : (
          visibleCategories.map((category) => (
            <div key={category} style={{ marginBottom: '56px' }}>
              {/* Category Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginBottom: '24px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(18px, 4vw, 28px)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    color: '#ffffff',
                  }}
                >
                  {category}
                </h2>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.5)',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {agentsByCategory[category].length} agentes
                </span>
              </div>

              {/* Agents Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                {agentsByCategory[category].map((agent) => {
                  const statusColors = getStatusColor(agent.status);
                  return (
                    <div
                      key={agent.id}
                      style={{
                        padding: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: '14px',
                              fontWeight: 700,
                              lineHeight: 1.3,
                              margin: '0 0 4px 0',
                              letterSpacing: '-0.01em',
                              color: '#ffffff',
                            }}
                          >
                            {agent.name}
                          </h3>
                          <p
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.45)',
                              margin: 0,
                              fontWeight: 500,
                              letterSpacing: '0px',
                              lineHeight: 1.4,
                            }}
                          >
                            {agent.role}
                          </p>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 8px',
                            backgroundColor: statusColors.bg,
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: statusColors.text,
                            }}
                          />
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              color: statusColors.text,
                              letterSpacing: '0px',
                            }}
                          >
                            {getStatusLabel(agent.status)}
                          </span>
                        </div>
                      </div>

                      {/* Specialty */}
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.55)',
                          margin: 0,
                          fontWeight: 400,
                          lineHeight: 1.5,
                          letterSpacing: '0px',
                        }}
                      >
                        {agent.specialty}
                      </p>

                      {/* Stats */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '12px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255, 255, 255, 0.35)',
                              margin: '0 0 4px 0',
                              fontWeight: 600,
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Modelo
                          </p>
                          <p
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              margin: 0,
                              color: '#ffffff',
                              letterSpacing: '0px',
                            }}
                          >
                            {agent.model}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255, 255, 255, 0.35)',
                              margin: '0 0 4px 0',
                              fontWeight: 600,
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Tareas
                          </p>
                          <p
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              margin: 0,
                              color: '#ffffff',
                              letterSpacing: '0px',
                            }}
                          >
                            {agent.tasks}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255, 255, 255, 0.35)',
                              margin: '0 0 4px 0',
                              fontWeight: 600,
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase',
                            }}
                          >
                            Uptime
                          </p>
                          <p
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              margin: 0,
                              color: '#ffffff',
                              letterSpacing: '0px',
                            }}
                          >
                            {agent.uptime}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
