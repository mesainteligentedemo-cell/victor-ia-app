'use client'

import { Icon } from '@/components/Icon'

interface ProjectCardProps {
  title: string
  description: string
  icon: keyof typeof Icons
  onClick?: () => void
}

/**
 * ProjectCard — Tarjeta de proyecto con icon monochrome
 */
export function ProjectCard({
  title,
  description,
  icon,
  onClick,
}: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="card hover:bg-elevated cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <Icon
          name={icon}
          size={32}
          animated
          animation="fadeIn"
          className="flex-shrink-0 text-white group-hover:scale-110 transition-transform"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-body font-600 text-white mb-1">
            {title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2">
            {description}
          </p>
        </div>
        <Icon
          name="ChevronRight"
          size={20}
          className="flex-shrink-0 text-text-dim group-hover:text-text-secondary transition-colors"
        />
      </div>
    </div>
  )
}

import * as Icons from '@/lib/icons/system'
