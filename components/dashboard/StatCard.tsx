'use client'

import { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { AnimatedCounter } from '@/components/AnimatedCounter'

interface StatCardProps {
  label: string
  value: number | ReactNode
  subtitle?: string
  icon?: keyof typeof Icons
  prefix?: string
  suffix?: string
  animated?: boolean
}

/**
 * StatCard — Tarjeta de estadística con icon + contador animado
 */
export function StatCard({
  label,
  value,
  subtitle,
  icon,
  prefix = '',
  suffix = '',
  animated = true,
}: StatCardProps) {
  return (
    <div className="card">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <p className="text-xs uppercase tracking-wide text-text-dim">
            {label}
          </p>
          {icon && (
            <Icon name={icon} size={24} animated animation="scalePop" />
          )}
        </div>

        <div>
          {animated && typeof value === 'number' ? (
            <p className="text-3xl font-display italic font-bold text-white">
              {prefix}
              <AnimatedCounter
                target={value}
                prefix=""
                suffix={suffix}
                duration={1.5}
              />
            </p>
          ) : (
            <p className="text-3xl font-display italic font-bold text-white">
              {prefix}
              {value}
              {suffix}
            </p>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-text-muted">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

import * as Icons from '@/lib/icons/system'
