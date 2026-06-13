import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { BarChart3, MessageCircle, Users, BookOpen, TrendingUp, Headphones, Settings, Scale, Zap, Library } from 'lucide-react';

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Chat Inteligente",
    description: "Conversa con agentes IA en tiempo real. Soporte inmediato 24/7 con comprensión del contexto.",
  },
  {
    icon: Zap,
    title: "Agentes Especializados",
    description: "8 agentes expertos: Lead Qualifier, Pitch Generator, Content Strategist, SEO Expert, y más.",
  },
  {
    icon: Library,
    title: "Biblioteca de Assets",
    description: "Acceso a 45,000+ recursos: imágenes, videos, audios, documentos y componentes web.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description: "Métricas en tiempo real con gráficas interactivas. Monitorea usuarios, chats, generaciones e ingresos.",
  },
  {
    icon: Users,
    title: "Recursos Humanos",
    description: "Gestión de equipo. Monitorea utilización, rendimiento y disponibilidad de especialistas.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Avanzado",
    description: "4 campañas activas con tracking de reach, engagement y ROI. Automatización de flujos.",
  },
  {
    icon: TrendingUp,
    title: "Pipeline de Ventas",
    description: "Gestión de oportunidades en 4 etapas: Prospect → Proposal → Authorized → Completed.",
  },
  {
    icon: Headphones,
    title: "Servicio al Cliente",
    description: "Sistema de tickets con priorización. 6 tickets activos con SLA tracking y resolución automática.",
  },
  {
    icon: BookOpen,
    title: "Capacitaciones",
    description: "6 cursos con progreso individual. Certificaciones y evaluaciones de competencias.",
  },
  {
    icon: Scale,
    title: "Finanzas & Legal",
    description: "Dashboard financiero completo: $52k ingresos, $31k gastos, 8 transacciones detalladas.",
  },
  {
    icon: Settings,
    title: "Configuración",
    description: "5 tabs: Perfil, Preferencias, Billing, Seguridad, Integraciones. Control total de tu cuenta.",
  },
  {
    icon: BarChart3,
    title: "Inteligencia de Datos",
    description: "Insights automáticos. Tendencias, anomalías y recomendaciones basadas en datos reales.",
  },
];

export default function Home() {
  return (
    <main style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)', color: 'var(--fg)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: '1px solid var(--b)',
        position: 'sticky',
        top: 0,
        background: 'rgba(var(--bg-rgb), 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              V
            </div>
            Victor IA
          </h1>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/pricing" style={{ fontSize: '14px', textDecoration: 'none', color: 'var(--t2)', cursor: 'pointer' }}>
              Precios
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: '14px', background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer' }}
            >
              Características
            </button>
            <Link href="/dashboard" style={{
              padding: '10px 20px',
              background: 'var(--blue)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
            }}>
              Ingresar
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.15em', color: 'var(--t3)', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 600 }}>
          155 especialistas · 45,000+ assets · Infinitas posibilidades
        </p>
        <h2 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.1 }}>
          Agencia IA que trabaja 24/7
        </h2>
        <p style={{ fontSize: '18px', color: 'var(--t2)', marginBottom: '32px', maxWidth: '700px', margin: '0 auto 32px' }}>
          Tu equipo creativo completo sin salarios, sin cansancio, sin errores. Resultados en horas, no en meses.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sign-in" style={{
            padding: '14px 32px',
            background: 'var(--blue)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
          }}>
            Comenzar gratis
          </Link>
          <a href="mailto:info@victor-ia.com.mx" style={{
            padding: '14px 32px',
            border: '1px solid var(--b)',
            color: 'var(--fg)',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            background: 'var(--bg2)',
          }}>
            Hablar con especialista
          </a>
        </div>
      </section>

      {/* ============ OVERVIEW ============ */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        borderTop: '1px solid var(--b)',
        borderBottom: '1px solid var(--b)',
      }}>
        <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>
          ¿Qué es Victor IA?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { label: 'Sin', items: ['Salarios mensuales', 'Cansancio', 'Rotación de personal'], style: { background: 'var(--bg2)' } },
            { label: 'Con', items: ['8 Agentes IA', '24/7 disponible', 'Escalable infinitamente'], style: { background: 'var(--blue)', color: 'white' } },
          ].map((group, i) => (
            <div key={i} style={{
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--b)',
              ...group.style,
            }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 600, opacity: 0.7 }}>
                {group.label}
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {group.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                    <span style={{ fontSize: '18px' }}>{i === 0 ? '✕' : '✓'}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURES GRID ============ */}
      <section id="features" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
          Todas tus herramientas en un solo lugar
        </h3>
        <p style={{ fontSize: '16px', color: 'var(--t2)', marginBottom: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto 40px' }}>
          12 módulos integrados + 8 agentes especializados + API completamente abierta para extensiones.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                style={{
                  padding: '24px',
                  background: 'var(--bg2)',
                  borderRadius: '12px',
                  border: '1px solid var(--b)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--blue)';
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--b)';
                  e.currentTarget.style.background = 'var(--bg2)';
                }}
              >
                <Icon size={28} style={{ marginBottom: '12px', color: 'var(--blue)' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--t3)', lineHeight: 1.5 }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
        borderTop: '1px solid var(--b)',
      }}>
        <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '40px', textAlign: 'center' }}>
          Cómo funciona
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            {
              step: '1',
              title: 'Inicia sesión',
              description: 'Accede con tu cuenta. Verás el dashboard con todos los módulos listos.',
            },
            {
              step: '2',
              title: 'Elige un agente',
              description: 'Selecciona el especialista que necesitas: Ventas, Marketing, Contenido, etc.',
            },
            {
              step: '3',
              title: 'Define tu tarea',
              description: 'Describe qué necesitas. Sé específico: "propuesta para cliente X" o "análisis de trending".',
            },
            {
              step: '4',
              title: 'Revisa resultados',
              description: 'En minutos obtienes resultados, analytics detallada y opciones para iterar.',
            },
            {
              step: '5',
              title: 'Usa el output',
              description: 'Descarga, integra, modifica o publica directamente desde la plataforma.',
            },
            {
              step: '6',
              title: 'Escala infinitamente',
              description: 'Sin nuevos costos. Los agentes siguen trabajando mientras duermes.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '24px',
              background: 'var(--bg2)',
              borderRadius: '12px',
              border: '1px solid var(--b)',
              position: 'relative',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--blue)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                marginBottom: '12px',
              }}>
                {item.step}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--t3)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '60px 20px',
        textAlign: 'center',
        borderTop: '1px solid var(--b)',
      }}>
        <h3 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px' }}>
          ¿Listo para tu agencia IA?
        </h3>
        <p style={{ fontSize: '16px', color: 'var(--t2)', marginBottom: '32px' }}>
          Comienza gratis. Sin tarjeta de crédito. Cancela cuando quieras.
        </p>
        <Link href="/sign-in" style={{
          display: 'inline-block',
          padding: '14px 40px',
          background: 'var(--blue)',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '16px',
        }}>
          Acceder a la app
        </Link>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{
        borderTop: '1px solid var(--b)',
        padding: '40px 20px',
        color: 'var(--t3)',
        fontSize: '14px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          paddingBottom: '32px',
          borderBottom: '1px solid var(--b)',
          marginBottom: '32px',
        }}>
          {[
            { title: 'Producto', links: ['Características', 'Precios', 'Documentación'] },
            { title: 'Legal', links: ['Términos', 'Privacidad', 'Cookies'] },
            { title: 'Contacto', links: ['Email', 'Twitter', 'LinkedIn'] },
          ].map((col, i) => (
            <div key={i}>
              <p style={{ fontWeight: 600, marginBottom: '12px', color: 'var(--fg)' }}>{col.title}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {col.links.map((link, j) => (
                  <li key={j} style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ color: 'var(--t3)', textDecoration: 'none' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center' }}>
          © 2026 Victor IA. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}
