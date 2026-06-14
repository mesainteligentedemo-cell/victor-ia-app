'use client'

import { ReactNode } from 'react'
import { ScrollReveal } from '@/components/scroll/ScrollReveal'

interface DashboardSectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * DashboardSection — Wrapper reutilizable para secciones del dashboard
 * Incluye ScrollReveal automático + tipografía consistente
 */
export function DashboardSection({
  title,
  subtitle,
  children,
  className = '',
  delay = 0,
}: DashboardSectionProps) {
  return (
    <ScrollReveal direction="up" delay={delay}>
      <div className={`space-y-4 ${className}`}>
        <div>
          <p className="text-xs uppercase tracking-wider text-text-dim mb-2">
            {title}
          </p>
          {subtitle && (
            <h2 className="text-lg font-body font-600 text-text-primary">
              {subtitle}
            </h2>
          )}
        </div>
        {children}
      </div>
    </ScrollReveal>
  )
}
