'use client'

import { Icon, StateIcon, IconSpinner, useIconStagger } from '@/components/Icon'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * EJEMPLO — Dashboard módulo con Icons animados (sin emojis)
 * Reemplaza emojis del dashboard con el sistema Icon monochrome + GSAP
 */

export function DashboardWithIcons() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardsRef.current) return

    // Revelar cards con stagger GSAP al montar
    gsap.from(cardsRef.current.querySelectorAll('.card'), {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    })
  }, [])

  const modules = [
    { name: 'Chat Agente', icon: 'Chat', color: 'text-white' },
    { name: 'Generadores', icon: 'Palette', color: 'text-white' },
    { name: 'CRM', icon: 'Folder', color: 'text-white' },
    { name: 'Analytics', icon: 'Zap', color: 'text-white' },
    { name: 'Finanzas', icon: 'FileText', color: 'text-white' },
    { name: 'Settings', icon: 'Settings', color: 'text-white' },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* HEADER */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Home" size={32} animation="fadeIn" />
          <h1 className="text-4xl font-display italic font-bold">Dashboard</h1>
        </div>
        <p className="text-text-muted">Accede a todos los módulos de Victor IA</p>
      </div>

      {/* STATS ROW — con iconos de estado */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <StatCard
          icon="CheckCircle"
          title="Tasks Completadas"
          value="24"
          state="success"
        />
        <StatCard
          icon="Bell"
          title="Notificaciones"
          value="3"
          state="info"
        />
        <StatCard
          icon="AlertCircle"
          title="Por revisar"
          value="2"
          state="warning"
        />
      </div>

      {/* MODULES GRID */}
      <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.name} {...module} />
        ))}
      </div>

      {/* FOOTER — con loading spinner */}
      <div className="mt-12 pt-8 border-t border-border-secondary text-center">
        <div className="inline-flex items-center gap-2 text-text-muted">
          <IconSpinner name="Reload" size={16} />
          <span>Sincronizando en tiempo real...</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente reutilizable — Tarjeta de módulo
 * Icon animado + hover GSAP + link
 */
function ModuleCard({
  name,
  icon,
  color,
}: {
  name: string
  icon: keyof typeof Icons
  color: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const card = cardRef.current
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 12px 40px rgba(255,255,255,0.1)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 4px 16px rgba(255,255,255,0.04)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="card group cursor-pointer transition-all"
    >
      <div className="flex flex-col items-center text-center">
        <Icon
          name={icon}
          size={48}
          animated
          animation="scalePop"
          className="mb-4 group-hover:scale-110 transition-transform"
        />
        <h3 className="text-sm font-body font-600">{name}</h3>
        <p className="text-xs text-text-dim mt-1">Acceder →</p>
      </div>
    </div>
  )
}

/**
 * Componente reutilizable — Tarjeta de stat
 * Icon de estado (success/error/warning/info) + animación
 */
function StatCard({
  icon,
  title,
  value,
  state = 'info',
}: {
  icon: keyof typeof Icons
  title: string
  value: string
  state?: 'success' | 'error' | 'warning' | 'info'
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Animar el número al montar
    const el = ref.current.querySelector('[data-counter]')
    if (el) {
      gsap.from(el, {
        innerText: '0',
        textContent: '0',
        duration: 0.8,
        ease: 'power3.out',
        snap: { textContent: 1 },
        onUpdate: function () {
          if (el) el.textContent = Math.round(parseInt(value))
        },
      })
    }
  }, [value])

  return (
    <div ref={ref} className="glass-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-text-muted text-xs mb-2 uppercase tracking-wide">{title}</p>
          <p data-counter className="text-2xl font-display italic font-bold">
            {value}
          </p>
        </div>
        <StateIcon name={icon} size={32} state={state} animated />
      </div>
    </div>
  )
}

// Import de iconos para type-safe
import * as Icons from '@/lib/icons/system'
