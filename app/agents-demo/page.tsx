'use client';

import { useState, useMemo } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';

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
  { id: 'agente_maestro', name: 'Agente Maestro', role: 'Dirección General · Orquestación', specialty: 'Planificación estratégica, delegación inteligente, síntesis de resultados', model: '⭐ Opus 4.8', status: 'active', tasks: 28, uptime: '100%' },
  { id: 'gerente_ia', name: 'Gerente IA', role: 'Dirección Ejecutiva · Supervisión', specialty: 'Control de calidad, auditoría de tareas, reportes ejecutivos', model: '⭐ Opus 4.8', status: 'active', tasks: 32, uptime: '99.9%' },
  { id: 'director_deep_learning', name: 'Director de Deep Learning', role: 'Mejora Continua · Aprendizaje', specialty: 'Análisis de bitácoras, síntesis de patrones, recomendaciones de evolución', model: '⭐ Opus 4.8', status: 'active', tasks: 16, uptime: '99.95%' },
  { id: 'calificador_leads', name: 'Calificador de Leads', role: 'Ventas · Lead Scoring', specialty: 'Evaluación de prospectos, priorización, scoring automático', model: '⭐ Sonnet 4.6', status: 'active', tasks: 42, uptime: '99.9%' },
  { id: 'generador_propuestas', name: 'Generador de Propuestas', role: 'Ventas · Pitch & Copy', specialty: 'Redacción de cotizaciones, argumentación de venta, CTAs persuasivos', model: '⭐ Sonnet 4.6', status: 'active', tasks: 38, uptime: '99.8%' },
  { id: 'cierre_automatico', name: 'Cierre Automático', role: 'Ventas · Negociación', specialty: 'Objeción handling, estrategia de cierre, follow-up inteligente', model: '⭐ Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'prospector_clientes', name: 'Prospector de Clientes', role: 'Ventas · Prospecting', specialty: 'Identificación de nichos, búsqueda de empresas, lead sourcing', model: 'Sonnet 4.6', status: 'active', tasks: 18, uptime: '99.8%' },
  { id: 'analista_competencia', name: 'Analista de Competencia', role: 'Negocio · Inteligencia Competitiva', specialty: 'Análisis de rivales, benchmarking, ventajas diferenciables', model: 'Sonnet 4.6', status: 'active', tasks: 12, uptime: '99.9%' },
  { id: 'estratega_contenido', name: 'Estratega de Contenido', role: 'Marketing · Estrategia', specialty: 'Planificación de contenido, calendarios editoriales, narrativa de marca', model: '⭐ Sonnet 4.6', status: 'active', tasks: 45, uptime: '100%' },
  { id: 'redactor_blog', name: 'Redactor de Blog', role: 'Contenido · Copywriting', specialty: 'Artículos optimizados, storytelling, engagement narrativo', model: 'Sonnet 4.6', status: 'thinking', tasks: 23, uptime: '99.7%' },
  { id: 'especialista_seo', name: 'Especialista SEO', role: 'SEO · Posicionamiento', specialty: 'Technical SEO, keywords, meta tags, estructura JSON-LD', model: 'Haiku 4.5', status: 'active', tasks: 35, uptime: '100%' },
  { id: 'auditor_seo_tecnico', name: 'Auditor SEO Técnico', role: 'SEO · Auditoría', specialty: 'Análisis de velocidad, crawlability, mobile-first, Core Web Vitals', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.8%' },
  { id: 'gestor_redes_sociales', name: 'Gestor de Redes Sociales', role: 'Marketing · Social Media', specialty: 'Calendarios, copywriting, engagement strategy, community management', model: 'Sonnet 4.6', status: 'active', tasks: 28, uptime: '99.9%' },
  { id: 'diseñador_campañas', name: 'Diseñador de Campañas', role: 'Marketing · Campaigns', specialty: 'Diseño de estrategias, creatividad, brief visual, estructuración de anuncios', model: 'Sonnet 4.6', status: 'active', tasks: 19, uptime: '99.8%' },
  { id: 'copywriter_premium', name: 'Copywriter Premium', role: 'Copywriting · Voz de Marca', specialty: 'Copy luxury, argumentación de alto nivel, persuasión refinada', model: '⭐ Sonnet 4.6', status: 'active', tasks: 16, uptime: '99.9%' },
  { id: 'especialista_email', name: 'Especialista Email Marketing', role: 'Marketing · Automatización', specialty: 'Secuencias de email, subject lines, funnels de conversión', model: 'Sonnet 4.6', status: 'active', tasks: 14, uptime: '99.8%' },
  { id: 'director_arte', name: 'Director de Arte', role: 'Diseño · Dirección Visual', specialty: 'Conceptos visuales, tipografía, paletas, composición, marca', model: '⭐ Opus 4.8', status: 'active', tasks: 26, uptime: '99.9%' },
  { id: 'diseñador_ui_ux', name: 'Diseñador UI/UX', role: 'Diseño · Interfaces', specialty: 'Wireframes, prototipado, accesibilidad, user flows, responsive design', model: 'Sonnet 4.6', status: 'active', tasks: 31, uptime: '99.8%' },
  { id: 'ilustrador_ia', name: 'Ilustrador IA', role: 'Creatividad · Generación Visual', specialty: 'Ilustraciones custom, estilos artísticos, generación de assets visuales', model: 'Sonnet 4.6', status: 'active', tasks: 24, uptime: '99.9%' },
  { id: 'animador_motion', name: 'Animador Motion Design', role: 'Motion · Cinematografía', specialty: 'Animaciones GSAP, scroll cinematográfico, transiciones premium, 3D web', model: 'Sonnet 4.6', status: 'active', tasks: 18, uptime: '99.8%' },
  { id: 'especialista_3d', name: 'Especialista 3D Web', role: 'Creatividad · WebGL', specialty: 'Three.js, React Three Fiber, shaders GLSL, efectos 3D interactivos', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'curador_design', name: 'Curador de Diseño', role: 'Diseño · Auditoría', specialty: 'Análisis de experiencia, benchmarks visuales, recomendaciones de polish', model: 'Opus 4.8', status: 'active', tasks: 14, uptime: '99.95%' },
  { id: 'arquitecto_sistemas', name: 'Arquitecto de Sistemas', role: 'Desarrollo · Arquitectura', specialty: 'Diseño de infraestructura, escalabilidad, patrones, database design', model: '⭐ Opus 4.8', status: 'active', tasks: 22, uptime: '99.95%' },
  { id: 'desarrollador_frontend', name: 'Desarrollador Frontend', role: 'Desarrollo · React', specialty: 'React, Next.js, TypeScript, componentes reutilizables, performance', model: 'Sonnet 4.6', status: 'active', tasks: 39, uptime: '99.8%' },
  { id: 'desarrollador_backend', name: 'Desarrollador Backend', role: 'Desarrollo · API', specialty: 'APIs REST, bases de datos, autenticación, seguridad, escalabilidad', model: 'Sonnet 4.6', status: 'active', tasks: 35, uptime: '99.9%' },
  { id: 'especialista_devops', name: 'Especialista DevOps', role: 'Operaciones · Cloud', specialty: 'CI/CD, Docker, Kubernetes, deployment, monitoreo, infraestructura', model: 'Sonnet 4.6', status: 'active', tasks: 17, uptime: '99.95%' },
  { id: 'revisor_codigo', name: 'Revisor de Código', role: 'QA · Code Review', specialty: 'Auditoría de código, best practices, seguridad, performance, refactoring', model: '⭐ Opus 4.8', status: 'active', tasks: 28, uptime: '99.9%' },
  { id: 'ingeniero_qa', name: 'Ingeniero QA', role: 'Testing · Calidad', specialty: 'Test planning, unit tests, E2E, performance, debugging, reportes', model: 'Sonnet 4.6', status: 'active', tasks: 26, uptime: '99.8%' },
  { id: 'especialista_seguridad', name: 'Especialista Seguridad', role: 'Seguridad · Compliance', specialty: 'Vulnerabilidades, OWASP, encryption, autenticación, compliance regulatorio', model: '⭐ Opus 4.8', status: 'active', tasks: 12, uptime: '99.95%' },
  { id: 'optimizador_performance', name: 'Optimizador de Performance', role: 'Desarrollo · Optimización', specialty: 'Core Web Vitals, bundle size, caching, lazy loading, LCP/FID/CLS', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.8%' },
  { id: 'ingeniero_ia', name: 'Ingeniero IA', role: 'IA · Integración', specialty: 'LLMs, embeddings, RAG, fine-tuning, prompting, agentes autónomos', model: '⭐ Opus 4.8', status: 'active', tasks: 19, uptime: '99.9%' },
  { id: 'orquestador_n8n', name: 'Orquestador n8n', role: 'Automatización · Workflows', specialty: 'Flujos de n8n, webhooks, sincronización de datos, automatización end-to-end', model: 'Sonnet 4.6', status: 'active', tasks: 31, uptime: '99.9%' },
  { id: 'integrador_api', name: 'Integrador API', role: 'Integraciones · Conectores', specialty: 'APIs REST, webhooks, OAuth, Zapier, Make, sincronización de servicios', model: 'Sonnet 4.6', status: 'active', tasks: 24, uptime: '99.8%' },
  { id: 'especialista_scraping', name: 'Especialista Web Scraping', role: 'Datos · Extracción', specialty: 'Web scraping, parsing HTML, APIs públicas, data pipeline, ETL', model: 'Sonnet 4.6', status: 'active', tasks: 16, uptime: '99.7%' },
  { id: 'analista_datos', name: 'Analista de Datos', role: 'Analytics · Reporting', specialty: 'Análisis de métricas, dashboards, insights, reportes, visualizaciones', model: '⭐ Opus 4.8', status: 'active', tasks: 18, uptime: '99.95%' },
  { id: 'gestor_tickets', name: 'Gestor de Tickets', role: 'Soporte · Clasificación', specialty: 'Triaje de incidentes, clasificación automática, routing, priorización', model: 'Haiku 4.5', status: 'active', tasks: 52, uptime: '99.95%' },
  { id: 'especialista_soporte', name: 'Especialista Soporte', role: 'Soporte · Customer Service', specialty: 'Resolución de problemas, FAQ, troubleshooting, customer happiness', model: 'Sonnet 4.6', status: 'active', tasks: 38, uptime: '99.8%' },
  { id: 'especialista_compliance', name: 'Especialista Compliance', role: 'Legal · Regulatorio', specialty: 'GDPR, CCPA, contratos, términos y condiciones, políticas, auditoría', model: 'Opus 4.8', status: 'active', tasks: 9, uptime: '99.95%' },
  { id: 'productor_video', name: 'Productor de Video', role: 'Video · Producción', specialty: 'Guiones, storyboards, edición, efectos visuales, post-producción', model: 'Sonnet 4.6', status: 'active', tasks: 21, uptime: '99.8%' },
  { id: 'especialista_voz', name: 'Especialista Voice Over', role: 'Audio · Voz IA', specialty: 'Text-to-speech, ElevenLabs, síntesis de voz, locutores multiidioma', model: 'Sonnet 4.6', status: 'active', tasks: 14, uptime: '99.9%' },
  { id: 'compositor_musica', name: 'Compositor Música', role: 'Audio · Música', specialty: 'Composición, generación de soundtracks, licencias, efectos de sonido', model: 'Sonnet 4.6', status: 'idle', tasks: 0, uptime: '99.7%' },
  { id: 'entrenador_ia', name: 'Entrenador IA', role: 'Educación · Training', specialty: 'Diseño de cursos, módulos de aprendizaje, evaluaciones, mentoría', model: 'Sonnet 4.6', status: 'active', tasks: 25, uptime: '99.8%' },
  { id: 'tutor_tecnico', name: 'Tutor Técnico', role: 'Educación · Consultoría', specialty: 'Enseñanza de desarrollo, best practices, architectural guidance', model: '⭐ Opus 4.8', status: 'active', tasks: 13, uptime: '99.9%' },
  { id: 'analista_presupuesto', name: 'Analista de Presupuesto', role: 'Finanzas · Budgeting', specialty: 'Forecasting, asignación presupuestaria, ROI analysis, cost optimization', model: 'Sonnet 4.6', status: 'active', tasks: 11, uptime: '99.9%' },
  { id: 'especialista_facturacion', name: 'Especialista Facturación', role: 'Finanzas · Billing', specialty: 'Invoicing, subscriptions, payment processing, reconciliación', model: 'Haiku 4.5', status: 'active', tasks: 32, uptime: '99.95%' },
];

function extractCategory(role: string): string {
  return role.split('·')[0].trim();
}

function getStatusColor(status: Agent['status']): { bg: string; dot: string } {
  switch (status) {
    case 'active':
      return { bg: 'rgba(34, 197, 94, 0.08)', dot: '#22c55e' };
    case 'thinking':
      return { bg: 'rgba(251, 146, 60, 0.08)', dot: '#fb923c' };
    case 'running':
      return { bg: 'rgba(59, 130, 246, 0.08)', dot: '#3b82f6' };
    default:
      return { bg: 'rgba(107, 114, 128, 0.08)', dot: '#6b7280' };
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
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const categories = Array.from(new Set(SAMPLE_AGENTS.map((a) => extractCategory(a.role)))).sort();

  const filteredAgents = useMemo(() => {
    return SAMPLE_AGENTS.filter((agent) => {
      const matchesCategory = !selectedCategory || extractCategory(agent.role) === selectedCategory;
      const matchesSearch = searchQuery === '' || agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || agent.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || agent.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const agentsByCategory = filteredAgents.reduce((acc, agent) => {
    const cat = extractCategory(agent.role);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  const visibleCategories = Object.keys(agentsByCategory).sort();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000' }}>
      {/* Hero Section */}
      <div style={{ padding: 'clamp(48px, 8vw, 80px) clamp(24px, 5vw, 64px)' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.08, marginBottom: '12px', fontFamily: 'system-ui, -apple-system', color: '#000000' }}>
          Sistema de Agentes IA
        </h1>
        <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.5, marginBottom: '40px', fontWeight: 400 }}>
          <strong style={{ color: '#000000', fontWeight: 600 }}>{filteredAgents.length} agentes</strong> en <strong style={{ color: '#000000', fontWeight: 600 }}>{visibleCategories.length} categorías</strong>
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '520px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Buscar agente, especialidad o rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#000000',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.5,
              outline: 'none',
              transition: 'all 200ms ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
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
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '8px 14px',
              backgroundColor: selectedCategory === null ? '#000000' : '#f3f4f6',
              color: selectedCategory === null ? '#ffffff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: selectedCategory === null ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 150ms ease',
              boxShadow: selectedCategory === null ? '0 2px 8px rgba(0, 0, 0, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              if (selectedCategory === null) {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              } else {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory === null) {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
              } else {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
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
                padding: '8px 14px',
                backgroundColor: selectedCategory === cat ? '#000000' : '#f3f4f6',
                color: selectedCategory === cat ? '#ffffff' : '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: selectedCategory === cat ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: selectedCategory === cat ? '0 2px 8px rgba(0, 0, 0, 0.12)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
              onMouseEnter={(e) => {
                if (selectedCategory === cat) {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                } else {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory === cat) {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
                } else {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div style={{ padding: '0 clamp(24px, 5vw, 64px) clamp(48px, 8vw, 80px)' }}>
        {visibleCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9ca3af' }}>
            <p style={{ fontSize: '15px', fontWeight: 400, lineHeight: 1.5 }}>No se encontraron agentes</p>
          </div>
        ) : (
          visibleCategories.map((category) => (
            <div key={category} style={{ marginBottom: '56px' }}>
              {/* Category Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em', margin: 0, color: '#000000' }}>
                  {category}
                </h2>
                <span style={{ display: 'inline-block', backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#6b7280', letterSpacing: '0px' }}>
                  {agentsByCategory[category].length}
                </span>
              </div>

              {/* Agents Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {agentsByCategory[category].map((agent) => {
                  const statusColors = getStatusColor(agent.status);
                  return (
                    <div
                      key={agent.id}
                      style={{
                        padding: '20px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        transition: 'all 200ms ease',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.3, margin: '0 0 4px 0', letterSpacing: '-0.015em', color: '#000000' }}>
                            {agent.name}
                          </h3>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, fontWeight: 500 }}>
                            {agent.role}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 8px', backgroundColor: statusColors.bg, borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColors.dot }} />
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>
                            {getStatusLabel(agent.status)}
                          </span>
                        </div>
                      </div>

                      {/* Specialty */}
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, fontWeight: 400, lineHeight: 1.5 }}>
                        {agent.specialty}
                      </p>

                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                        <div>
                          <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase' }}>Modelo</p>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: '#000000' }}>{agent.model}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase' }}>Tareas</p>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: '#000000' }}>{agent.tasks}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '10px', color: '#9ca3af', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase' }}>Uptime</p>
                          <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: '#000000' }}>{agent.uptime}</p>
                        </div>
                      </div>

                      {/* Ver más button */}
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#f3f4f6',
                          color: '#000000',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 150ms ease',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        Ver más <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedAgent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelectedAgent(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '40px',
              width: '100%',
              maxWidth: '600px',
              border: '1px solid #e5e7eb',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: '#000000' }}>
                  {selectedAgent.name}
                </h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: 500 }}>
                  {selectedAgent.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase' }}>Modelo</p>
                <p style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: '#000000' }}>{selectedAgent.model}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase' }}>Estado</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(selectedAgent.status).dot }} />
                  <p style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: '#000000' }}>
                    {getStatusLabel(selectedAgent.status)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 10px 0', fontWeight: 600, textTransform: 'uppercase' }}>Especialidad</p>
              <p style={{ fontSize: '13px', fontWeight: 400, margin: 0, color: '#374151', lineHeight: 1.6 }}>
                {selectedAgent.specialty}
              </p>
            </div>

            <div style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 10px 0', fontWeight: 600, textTransform: 'uppercase' }}>¿Qué hace?</p>
              <p style={{ fontSize: '13px', fontWeight: 400, margin: 0, color: '#374151', lineHeight: 1.8 }}>
                Este agente se especializa en {selectedAgent.specialty.toLowerCase()}. Es capaz de ejecutar tareas complejas relacionadas con su área de experticia, proporcionando análisis profundos, recomendaciones estratégicas y soluciones prácticas. Trabaja de forma autónoma pero también en colaboración con otros agentes del sistema para alcanzar objetivos empresariales de alto valor.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase' }}>Tareas activas</p>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#000000' }}>
                  {selectedAgent.tasks}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase' }}>Uptime</p>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#22c55e' }}>
                  {selectedAgent.uptime}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
