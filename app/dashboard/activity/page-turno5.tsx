'use client'

import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { ScrollReveal, ScrollRevealGroup } from '@/components/scroll/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { Icon } from '@/components/Icon'

/**
 * ACTIVITY PAGE — TURNO 5 REFACTORED
 * Timeline de actividad: tokens usados, tiempo, integraciones
 */

const ACTIVITY_TIMELINE = [
  {
    id: 1,
    time: 'Hace 2 horas',
    action: 'Generaste imagen con Logo Designer',
    tokens: 450,
    icon: 'Palette' as const,
  },
  {
    id: 2,
    time: 'Hace 5 horas',
    action: 'Video generado (30s intro)',
    tokens: 1200,
    icon: 'FileText' as const,
  },
  {
    id: 3,
    time: 'Ayer',
    action: 'Voz generada (3 minutos)',
    tokens: 320,
    icon: 'Send' as const,
  },
  {
    id: 4,
    time: 'Ayer',
    action: 'Copy escrito (blog post 1500 palabras)',
    tokens: 890,
    icon: 'FileText' as const,
  },
  {
    id: 5,
    time: '2 días atrás',
    action: 'Imagen upscaleada (4x)',
    tokens: 280,
    icon: 'Upload' as const,
  },
]

const STATS = [
  { label: 'Tokens Usados Hoy', value: 2950, icon: 'Zap' as const },
  { label: 'Tokens Disponibles', value: 97050, icon: 'Download' as const },
  { label: 'Generaciones Este Mes', value: 47, icon: 'Home' as const },
]

export default function ActivityPageTurno5() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER */}
        <ScrollReveal direction="up" delay={0}>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
              Seguimiento
            </p>
            <div className="flex items-center gap-4">
              <Icon name="BarChart3" size={48} animated animation="scalePop" />
              <h1 className="text-hero font-display italic font-bold">
                Actividad
              </h1>
            </div>
            <p className="text-text-secondary mt-4">
              Tu historial de generaciones, tokens usados y uso de integraciones
            </p>
          </div>
        </ScrollReveal>

        {/* STATS CARDS */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="card">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <p className="text-xs uppercase tracking-wide text-text-dim">
                      {stat.label}
                    </p>
                    <Icon name={stat.icon} size={24} animated />
                  </div>
                  <p className="text-4xl font-display italic font-bold">
                    <AnimatedCounter target={stat.value} duration={1.5} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* TOKEN USAGE CHART */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="card">
            <h3 className="text-lg font-display italic font-bold mb-6">
              Uso de Tokens por Tipo
            </h3>
            <div className="space-y-4">
              {[
                { type: 'Imágenes', count: 2240, percentage: 42 },
                { type: 'Videos', count: 1200, percentage: 23 },
                { type: 'Textos', count: 890, percentage: 17 },
                { type: 'Audio', count: 320, percentage: 6 },
                { type: 'Otros', count: 250, percentage: 12 },
              ].map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-body font-600">{item.type}</p>
                    <p className="text-xs text-text-muted">
                      {item.count} tokens ({item.percentage}%)
                    </p>
                  </div>
                  <div className="h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ACTIVITY TIMELINE */}
        <DashboardSection title="Timeline" subtitle="Últimas Generaciones" delay={0.2}>
          <div className="space-y-3">
            <ScrollRevealGroup staggerDelay={0.1}>
              {ACTIVITY_TIMELINE.map((activity) => (
                <div key={activity.id} className="card flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Icon name={activity.icon} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-600 text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-text-muted">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-body font-600 text-white">
                      {activity.tokens}
                    </p>
                    <p className="text-xs text-text-muted">tokens</p>
                  </div>
                </div>
              ))}
            </ScrollRevealGroup>
          </div>
        </DashboardSection>

        {/* INTEGRATIONS */}
        <ScrollReveal direction="up" delay={0.35}>
          <div className="card">
            <h3 className="text-lg font-display italic font-bold mb-6">
              Integraciones Activas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: 'Zapier', icon: 'Zap' as const, status: 'activa' },
                { name: 'Make.com', icon: 'Settings' as const, status: 'activa' },
                { name: 'n8n', icon: 'Code' as const, status: 'activa' },
                { name: 'HubSpot', icon: 'Folder' as const, status: 'inactiva' },
              ].map((integration) => (
                <div
                  key={integration.name}
                  className="card text-center py-6"
                >
                  <Icon name={integration.icon} size={40} className="mx-auto mb-3" />
                  <p className="text-sm font-body font-600 mb-2">{integration.name}</p>
                  <p
                    className={`text-xs ${
                      integration.status === 'activa'
                        ? 'text-green-400'
                        : 'text-text-muted'
                    }`}
                  >
                    {integration.status === 'activa' ? '✓ Activa' : '○ Inactiva'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* EXPORT CTA */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="card text-center py-12">
            <Icon name="Download" size={48} className="mx-auto mb-4" />
            <h3 className="text-2xl font-display italic font-bold mb-2">
              Exportar Reporte
            </h3>
            <p className="text-text-secondary mb-6">
              Descarga tu historial de actividad en PDF o CSV
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary">Descargar PDF</button>
              <button className="btn btn-secondary">Descargar CSV</button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
