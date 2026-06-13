'use client';

import { useState } from 'react';
import { Search, ChevronDown, Book, MessageCircle, Zap, Library, BarChart3, Users, TrendingUp, Headphones, Settings, Scale } from 'lucide-react';

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  articles: {
    title: string;
    content: string;
  }[];
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'chat',
    title: 'Chat Inteligente',
    icon: MessageCircle,
    description: 'Conversa con agentes IA en tiempo real',
    articles: [
      {
        title: '¿Cómo inicio una conversación?',
        content: 'Haz click en "Chat" desde el sidebar. Escribe tu pregunta o tarea. El agente responderá en tiempo real con análisis detallada.',
      },
      {
        title: '¿Puedo tener múltiples chats?',
        content: 'Sí. Cada conversación es independiente. El historial se guarda automáticamente.',
      },
      {
        title: '¿Qué información entiende el agente?',
        content: 'Entiende contexto completo: tu historial, preferencias, datos de la empresa. Aprende de cada interacción.',
      },
    ],
  },
  {
    id: 'agents',
    title: 'Agentes Especializados',
    icon: Zap,
    description: '8 agentes expertos para diferentes tareas',
    articles: [
      {
        title: '¿Cuáles son los 8 agentes?',
        content: '1. Lead Qualifier (ventas)\n2. Pitch Generator (propuestas)\n3. Content Strategist (contenido)\n4. SEO Expert (posicionamiento)\n5. Ticket Triager (soporte)\n6. Analytics Interpreter (datos)\n7. Blog Writer (redacción)\n8. Code Reviewer (programación)',
      },
      {
        title: '¿Cómo ejecuto un agente?',
        content: 'Ve a "Agentes", selecciona el que necesitas, haz click en "Ejecutar". Describe tu tarea. El agente trabaja y muestra resultados en un modal.',
      },
      {
        title: '¿Puedo crear mis propios agentes?',
        content: 'Sí. Haz click en "Crear Agente" (botón +) en la página de Agentes. Define nombre, rol, especialidad y modelo.',
      },
    ],
  },
  {
    id: 'library',
    title: 'Biblioteca de Assets',
    icon: Library,
    description: '45,000+ recursos para descargar y usar',
    articles: [
      {
        title: '¿Qué hay en la Biblioteca?',
        content: '45,000+ assets: 16,572 imágenes, 4,254 videos, audios, documentos, componentes web. Todos optimizados.',
      },
      {
        title: '¿Puedo buscar por tipo?',
        content: 'Sí. Usa los tabs: Imágenes, Videos, Audio, Documentos, Web. También hay búsqueda por palabra clave.',
      },
      {
        title: '¿Puedo descargar o compartir?',
        content: 'Sí. Descarga en múltiples formatos. Comparte con tu equipo directamente desde la plataforma.',
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Dashboard Analytics',
    icon: BarChart3,
    description: 'Métricas en tiempo real con gráficas interactivas',
    articles: [
      {
        title: '¿Qué métricas puedo ver?',
        content: 'Usuarios activos, chats totales, generaciones, ingresos. Gráficas de actividad semanal, distribución por tipo, uso por agente.',
      },
      {
        title: '¿Los datos se actualizan en tiempo real?',
        content: 'Sí. Las métricas se actualizan cada minuto. Puedes ver tendencias (+% semanal) y comparaciones históricas.',
      },
      {
        title: '¿Puedo exportar datos?',
        content: 'Sí. Cada gráfica tiene botón de descarga. Exporta en PNG, SVG o CSV.',
      },
    ],
  },
  {
    id: 'sales',
    title: 'Pipeline de Ventas',
    icon: TrendingUp,
    description: 'Gestión de oportunidades en 4 etapas',
    articles: [
      {
        title: '¿Cuáles son las 4 etapas?',
        content: '1. Prospect: leads nuevos\n2. Proposal: propuestas enviadas\n3. Authorized: clientes confirmados\n4. Completed: proyectos terminados',
      },
      {
        title: '¿Cómo agrego una oportunidad?',
        content: 'Ve a "Ventas", haz click en "+", completa nombre, empresa, valor estimado. Se crea en "Prospect".',
      },
      {
        title: '¿Puedo ver el valor total del pipeline?',
        content: 'Sí. En el panel de stats ves el total por etapa y el value total. Aussi voir tendencias.',
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing Avanzado',
    icon: TrendingUp,
    description: '4 campañas activas con tracking',
    articles: [
      {
        title: '¿Qué campañas hay activas?',
        content: 'Ves 4 campañas con reach (usuarios alcanzados), engagement (interacciones), ROI. Puedes crear nuevas.',
      },
      {
        title: '¿Cómo automatizo flujos?',
        content: 'Ve a "Automatización" (en el menú). Define triggers (qué inicia), acciones (qué pasa). Integración con email, SMS, webhooks.',
      },
      {
        title: '¿Puedo integrar Slack?',
        content: 'Sí. Ve a "Integraciones", conecta tu workspace de Slack. Recibe notificaciones de resultados.',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finanzas & Legal',
    icon: Scale,
    description: 'Dashboard financiero completo',
    articles: [
      {
        title: '¿Dónde veo mis ingresos?',
        content: 'En "Finanzas". Ves ingresos ($52k), gastos ($31k), utilidad neta ($21k). Gráficas de cashflow mensual.',
      },
      {
        title: '¿Puedo ver transacciones detalladas?',
        content: 'Sí. Tabla de 8 transacciones recientes: descripción, monto (+/-), fecha. Filtra por tipo.',
      },
      {
        title: '¿Puedo descargar reportes?',
        content: 'Sí. Cada gráfica tiene botón de descarga. Exporta reportes mensuales o anuales en PDF.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Servicio al Cliente',
    icon: Headphones,
    description: 'Sistema de tickets con priorización',
    articles: [
      {
        title: '¿Cómo creo un ticket?',
        content: 'Ve a "Soporte", haz click en "Nuevo Ticket". Escribe el asunto. Se asigna automáticamente a un agente.',
      },
      {
        title: '¿Qué es la priorización?',
        content: 'Alta (crítico, < 2h), Media (importante, < 8h), Baja (menor, < 1 día). El sistema reasigna según urgencia.',
      },
      {
        title: '¿Puedo ver el tiempo de resolución?',
        content: 'Sí. Para cada ticket ves "Tiempo abierto" en horas. Promedio general en el panel de stats.',
      },
    ],
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: Settings,
    description: '5 tabs para personalizar tu cuenta',
    articles: [
      {
        title: '¿Qué hay en Perfil?',
        content: 'Nombre, email, empresa, foto. Cambios se guardan al instante.',
      },
      {
        title: '¿Cómo activo 2FA (doble autenticación)?',
        content: 'Ve a "Seguridad", activa "Two-Factor Authentication". Usa Google Authenticator o SMS.',
      },
      {
        title: '¿Dónde cambio mi plan?',
        content: 'Ve a "Billing". Ves tu plan actual, opciones de upgrade, historial de facturas. Cancela cuando quieras.',
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredCategories = HELP_CATEGORIES.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.articles.length > 0 || cat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Book size={32} />
          Centro de Ayuda
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--t3)' }}>
          Documentación completa de todas las características y módulos de Victor IA.
        </p>
      </div>

      {/* Search Box */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          position: 'relative',
          maxWidth: '500px',
        }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--t3)',
            }}
          />
          <input
            type="text"
            placeholder="Busca en la documentación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              background: 'var(--bg2)',
              border: '1px solid var(--b)',
              borderRadius: '8px',
              color: 'var(--fg)',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.id;

          return (
            <div
              key={category.id}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--b)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: isExpanded ? '1px solid var(--b)' : 'none',
                }}
              >
                <Icon size={20} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                    {category.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--t3)' }}>
                    {category.description}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    color: 'var(--t3)',
                  }}
                />
              </button>

              {/* Articles */}
              {isExpanded && (
                <div style={{ padding: '16px' }}>
                  {category.articles.map((article, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: i < category.articles.length - 1 ? '16px' : 0,
                        paddingBottom: i < category.articles.length - 1 ? '16px' : 0,
                        borderBottom: i < category.articles.length - 1 ? '1px solid var(--b)' : 'none',
                      }}
                    >
                      <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--blue)' }}>
                        {article.title}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {article.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '16px', color: 'var(--t3)' }}>
            No encontramos resultados para "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: 'var(--blue)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  );
}
