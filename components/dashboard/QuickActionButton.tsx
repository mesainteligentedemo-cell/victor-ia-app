'use client'

import { Icon } from '@/components/Icon'

interface QuickActionButtonProps {
  icon: keyof typeof Icons
  label: string
  onClick?: () => void
}

/**
 * QuickActionButton — Botón de acción rápida con Icon animado
 * Sin emojis, usando sistema monochrome
 */
export function QuickActionButton({ icon, label, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="card hover:bg-white hover:bg-opacity-5 flex flex-col items-center gap-3 p-6 transition-all duration-300"
    >
      <Icon
        name={icon}
        size={40}
        animated
        animation="scalePop"
        className="text-white"
      />
      <span className="text-xs font-body font-600 text-text-secondary">
        {label}
      </span>
    </button>
  )
}

import * as Icons from '@/lib/icons/system'
