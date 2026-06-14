'use client'

import { Hero3D } from '@/components/hero/Hero3D'
import { ScrollReveal, ScrollRevealGroup, ParallaxSection } from '@/components/scroll/ScrollReveal'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { Icon } from '@/components/Icon'

/**
 * HOME PAGE — TURNO 2 DEMO
 * Integra todo: Hero 3D + Scroll animations + Counters + Icons
 * URL: /home-turno2
 */

export default function HomeTurno2() {
  return (
    <div className="w-full overflow-x-hidden bg-black text-white">
      {/* ─────────────────────────────────────────────────────
          HERO 3D
          ───────────────────────────────────────────────────── */}
      <Hero3D />

      {/* ─────────────────────────────────────────────────────
          STATS SECTION
          ───────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-black border-t border-border-secondary">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="text-display font-display italic font-bold mb-6 text-center">
              Números que hablan
            </h2>
            <p className="text-center text-text-secondary mb-20 max-w-2xl mx-auto text-lg">
              Victor IA ha procesado millones de solicitudes y creado miles de campañas de marketing con IA
            </p>
          </ScrollReveal>

          {/* Stats grid con counters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard
              label="Usuarios Activos"
              target={45200}
              prefix=""
              suffix="+"
              icon="Home"
            />
            <StatCard
              label="Campañas Creadas"
              target={12847}
              prefix=""
              suffix="+"
              icon="Zap"
            />
            <StatCard
              label="Videos Generados"
              target={89340}
              prefix=""
              suffix="+"
              icon="FileText"
            />
            <StatCard
              label="Tiempo Ahorrado"
              target={5420000}
              prefix=""
              suffix=" hrs"
              icon="Download"
              decimals={0}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          FEATURES SECTION
          ───────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-black via-black to-black/40">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.3}>
            <h2 className="text-display font-display italic font-bold mb-6 text-center">
              Capacidades
            </h2>
            <p className="text-center text-text-secondary mb-20 max-w-2xl mx-auto text-lg">
              Todo lo que necesitas para automatizar tu marketing en un solo lugar
            </p>
          </ScrollReveal>

          {/* Features grid con scroll reveal stagger */}
          <ScrollRevealGroup staggerDelay={0.15}>
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────
          PARALLAX SECTION
          ───────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-black overflow-hidden">
        <ParallaxSection speed={0.3} className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-border-secondary p-16 text-center">
            <ScrollReveal direction="in">
              <Icon
                name="Zap"
                size={64}
                animation="scalePop"
                className="mx-auto mb-8 text-white"
              />
              <h3 className="text-3xl font-display italic font-bold mb-4">
                Automatización Inteligente
              </h3>
              <p className="text-text-secondary max-w-2xl mx-auto mb-8">
                Nuestro motor de IA aprende de tus patrones y optimiza campañas automáticamente.
                Sin intervención manual. Sin guesswork. Puro data-driven intelligence.
              </p>
              <button className="btn btn-primary">
                Explorar Automatización
              </button>
            </ScrollReveal>
          </div>
        </ParallaxSection>
      </section>

      {/* ─────────────────────────────────────────────────────
          CTA FINAL
          ───────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-black border-t border-border-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="text-display font-display italic font-bold mb-8">
              Comienza hoy
            </h2>
            <p className="text-text-secondary text-lg mb-16 leading-relaxed">
              Tu primera campaña estará lista en minutos. Sin tarjeta de crédito. Sin compromisos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary">
                Acceso Gratuito
              </button>
              <button className="btn btn-secondary">
                Agendar Demo
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-border-secondary text-center text-text-muted text-sm">
        <p>&copy; 2026 Victor IA. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

/**
 * Componente — Stat Card con Icon + Counter animado
 */
function StatCard({
  label,
  target,
  prefix = '',
  suffix = '',
  icon,
  decimals = 0,
}: {
  label: string
  target: number
  prefix?: string
  suffix?: string
  icon: keyof typeof Icons
  decimals?: number
}) {
  return (
    <ScrollReveal className="h-full">
      <div className="card h-full flex flex-col items-center text-center">
        <Icon name={icon} size={40} animation="scalePop" className="mb-4" />
        <div className="text-3xl font-display italic font-bold mb-2">
          <AnimatedCounter
            target={target}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            duration={1.8}
          />
        </div>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </ScrollReveal>
  )
}

/**
 * Componente — Feature Card
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Icons
  title: string
  description: string
}) {
  return (
    <div className="card">
      <Icon name={icon} size={40} animation="scalePop" className="mb-4" />
      <h3 className="text-lg font-body font-600 mb-2">{title}</h3>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  )
}

const features = [
  {
    icon: 'Palette' as const,
    title: 'Generador Visual',
    description: 'Crea imágenes y videos con IA en segundos. Sin Photoshop. Sin expertise.',
  },
  {
    icon: 'Send' as const,
    title: 'Email Automático',
    description: 'Campañas de email optimizadas que se envían en el momento perfecto.',
  },
  {
    icon: 'Chat' as const,
    title: 'Chat Agente',
    description: 'Tu asistente IA disponible 24/7. Responde preguntas de clientes.',
  },
  {
    icon: 'Zap' as const,
    title: 'Automatización',
    description: 'Conecta tu stack: Zapier, Make, n8n. Sin código. Sin límites.',
  },
  {
    icon: 'Analytics' as const,
    title: 'Analytics Real-Time',
    description: 'Dashboard con métricas que importan. ROI por campaña en vivo.',
  },
  {
    icon: 'Lock' as const,
    title: 'Enterprise Security',
    description: 'Datos encriptados. GDPR compliant. Auditoría completa.',
  },
]

// Import para type-safe icons
import * as Icons from '@/lib/icons/system'
