'use client'

import { useState } from 'react'
import { DashboardSection } from '@/components/dashboard/DashboardSection'
import { QuickActionButton } from '@/components/dashboard/QuickActionButton'
import { ScrollReveal } from '@/components/scroll/ScrollReveal'
import { Icon } from '@/components/Icon'

/**
 * GENERATORS PAGE — TURNO 5 REFACTORED
 * Herramientas de generación IA: imágenes, videos, texto, voz
 */

const GENERATORS = [
  {
    category: 'Visual',
    icon: 'Palette' as const,
    tools: [
      { icon: 'Palette' as const, name: 'Image Generator', desc: 'Crea imágenes con IA' },
      { icon: 'Code' as const, name: 'Logo Designer', desc: 'Logos únicos para marcas' },
      { icon: 'Upload' as const, name: 'Image Upscaler', desc: 'Mejora resolución 4x' },
    ],
  },
  {
    category: 'Video',
    icon: 'FileText' as const,
    tools: [
      { icon: 'FileText' as const, name: 'Video Generator', desc: 'Videos de 30s a 2min' },
      { icon: 'Home' as const, name: 'Motion Designer', desc: 'Animaciones suaves' },
      { icon: 'Zap' as const, name: 'Video Editor', desc: 'Corta y edita fácil' },
    ],
  },
  {
    category: 'Audio',
    icon: 'Send' as const,
    tools: [
      { icon: 'Send' as const, name: 'Voice Generator', desc: '15 voces en español' },
      { icon: 'Bell' as const, name: 'Music Generator', desc: 'Música única por mood' },
      { icon: 'Reload' as const, name: 'Audio Enhancer', desc: 'Limpia y mejora audio' },
    ],
  },
  {
    category: 'Text',
    icon: 'Chat' as const,
    tools: [
      { icon: 'Chat' as const, name: 'Copy Writer', desc: 'Textos de ventas' },
      { icon: 'Search' as const, name: 'SEO Optimizer', desc: 'Optimiza para Google' },
      { icon: 'FileText' as const, name: 'Blog Writer', desc: 'Artículos 500-2000 palabras' },
    ],
  },
]

const RECENT_GENERATIONS = [
  { id: 1, name: 'Logo Victor IA v3', type: 'Logo', date: 'Hace 2 horas', icon: 'Palette' as const },
  { id: 2, name: 'Video de testimonios', type: 'Video', date: 'Hace 5 horas', icon: 'FileText' as const },
  { id: 3, name: 'Voz para email', type: 'Voice', date: 'Ayer', icon: 'Send' as const },
  { id: 4, name: 'Artículo SEO Costa Negra', type: 'Blog', date: 'Ayer', icon: 'FileText' as const },
]

export default function GeneratorsPageTurno5() {
  const [activeCategory, setActiveCategory] = useState('Visual')

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* HEADER */}
        <ScrollReveal direction="up" delay={0}>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
              Herramientas
            </p>
            <div className="flex items-center gap-4">
              <Icon name="Palette" size={48} animated animation="scalePop" />
              <h1 className="text-hero font-display italic font-bold">
                Generadores IA
              </h1>
            </div>
            <p className="text-text-secondary mt-4 max-w-2xl">
              Crea imágenes, videos, audio y textos con IA. Desde logos hasta campañas completas.
            </p>
          </div>
        </ScrollReveal>

        {/* CATEGORY TABS */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Visual', 'Video', 'Audio', 'Text'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-lg font-body font-600 text-sm transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-white text-black'
                    : 'card hover:bg-elevated'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* GENERATORS GRID */}
        <div className="space-y-12">
          {GENERATORS.map((category) => (
            <ScrollReveal key={category.category} direction="up" delay={0.15}>
              <DashboardSection
                title={category.category}
                subtitle={`${category.tools.length} herramientas disponibles`}
                delay={0.2}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="card hover:bg-elevated group cursor-pointer"
                    >
                      <div className="space-y-3">
                        <Icon
                          name={tool.icon}
                          size={40}
                          animated
                          animation="scalePop"
                          className="group-hover:scale-110 transition-transform"
                        />
                        <div>
                          <h4 className="text-sm font-body font-600 text-white">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-text-muted mt-1">
                            {tool.desc}
                          </p>
                        </div>
                        <button className="btn btn-ghost w-full justify-center">
                          Usar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSection>
            </ScrollReveal>
          ))}
        </div>

        {/* RECENT GENERATIONS */}
        <ScrollReveal direction="up" delay={0.3}>
          <DashboardSection title="Generaciones Recientes" delay={0.35}>
            <div className="space-y-3">
              {RECENT_GENERATIONS.map((gen) => (
                <div key={gen.id} className="card flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Icon name={gen.icon} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-600 text-white">
                        {gen.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {gen.type} • {gen.date}
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="Download"
                    size={20}
                    className="text-text-dim hover:text-text-secondary cursor-pointer transition-colors"
                  />
                </div>
              ))}
            </div>
          </DashboardSection>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="card text-center py-12">
            <Icon
              name="Zap"
              size={48}
              animation="scalePop"
              className="mx-auto mb-4"
            />
            <h3 className="text-2xl font-display italic font-bold mb-2">
              Modo Premium
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Acceso ilimitado a todos los generadores + prioridad en procesamiento
            </p>
            <button className="btn btn-primary">
              Actualizar Plan
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
