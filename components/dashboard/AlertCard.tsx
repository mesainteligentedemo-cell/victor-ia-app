'use client'

import { Icon } from '@/components/Icon'

interface AlertCardProps {
  title: string
  description: string
  urgent?: boolean
}

/**
 * AlertCard — Tarjeta de alerta/urgencia con icon
 */
export function AlertCard({ title, description, urgent = false }: AlertCardProps) {
  return (
    <div
      className={`card flex items-start gap-4 ${
        urgent
          ? 'border border-white border-opacity-15 bg-white bg-opacity-5'
          : ''
      }`}
    >
      <Icon
        name={urgent ? 'AlertCircle' : 'Bell'}
        size={20}
        animated
        animation="scalePop"
        className={urgent ? 'text-white flex-shrink-0 mt-1' : 'text-text-dim flex-shrink-0 mt-1'}
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-body font-600 text-white mb-1">
          {title}
        </h4>
        <p className="text-xs text-text-muted">
          {description}
        </p>
      </div>
    </div>
  )
}

import * as Icons from '@/lib/icons/system'
