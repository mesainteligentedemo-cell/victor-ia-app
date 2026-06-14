'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import * as Icons from '@/lib/icons/system'

interface IconProps {
  name: keyof typeof Icons
  size?: number
  animated?: boolean
  animation?: 'fadeIn' | 'slideUp' | 'scalePop' | 'bounce' | 'drawSVG' | 'spin'
  className?: string
  onClick?: () => void
  onHover?: boolean
}

/**
 * Componente Icon — Reemplaza emojis con SVGs monochrome animados
 * Acepta cualquier icono de lib/icons/system
 * Animaciones incluidas: GSAP-powered, prefers-reduced-motion respetado
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  animated = true,
  animation = 'fadeIn',
  className = '',
  onClick,
  onHover = false,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const iconRef = useRef<SVGSVGElement | null>(null)

  // Obtener el componente de icono dinámicamente
  const IconComponent = Icons[name] as React.FC<any> | undefined

  useEffect(() => {
    if (!animated || !ref.current) return

    const el = ref.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Sin animación si el usuario lo prefiere
      gsap.set(el, { opacity: 1 })
      return
    }

    // Animación de entrada
    switch (animation) {
      case 'fadeIn':
        gsap.from(el, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        break

      case 'slideUp':
        gsap.from(el, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          ease: 'power3.out',
        })
        break

      case 'scalePop':
        gsap.from(el, {
          opacity: 0,
          scale: 0.92,
          duration: 0.3,
          ease: 'back.out(1.5)',
        })
        break

      case 'bounce':
        gsap.from(el, {
          opacity: 0,
          scale: 0.3,
          y: 20,
          duration: 0.5,
          ease: 'back.out(1.7)',
        })
        break

      case 'drawSVG':
        if (iconRef.current) {
          const path = iconRef.current.querySelector('path')
          if (path) {
            const length = path.getTotalLength()
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            })
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: 'power3.out',
            })
          }
        }
        break

      case 'spin':
        gsap.from(el, {
          opacity: 0,
          rotation: -180,
          duration: 0.6,
          ease: 'back.out(1.2)',
        })
        break
    }

    // Hover animation si está habilitado
    if (onHover) {
      const handleMouseEnter = () => {
        gsap.to(el, {
          scale: 1.15,
          duration: 0.2,
          ease: 'power2.out',
        })
      }

      const handleMouseLeave = () => {
        gsap.to(el, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        })
      }

      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [animated, animation, onHover])

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lib/icons/system`)
    return null
  }

  return (
    <div
      ref={ref}
      className={`inline-flex items-center justify-center ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'inherit' }}
    >
      <IconComponent
        ref={iconRef}
        size={size}
        className="text-current"
      />
    </div>
  )
}

/**
 * Hook para animar múltiples iconos con stagger
 * Útil para listas, grids, etc.
 */
export const useIconStagger = (items: number, duration = 0.3, delay = 0.05) => {
  return Array.from({ length: items }, (_, i) => ({
    delay: i * delay,
    duration,
    easing: 'power2.out',
  }))
}

/**
 * Componente para iconos con estado (error, success, warning)
 */
interface StateIconProps extends Omit<IconProps, 'animation'> {
  state?: 'success' | 'error' | 'warning' | 'info'
}

export const StateIcon: React.FC<StateIconProps> = ({
  state = 'info',
  ...props
}) => {
  const animationMap = {
    success: 'scalePop' as const,
    error: 'bounce' as const,
    warning: 'slideUp' as const,
    info: 'fadeIn' as const,
  }

  return <Icon {...props} animation={animationMap[state]} />
}

/**
 * Spinner — para loading states
 */
export const IconSpinner: React.FC<Omit<IconProps, 'animation'>> = (props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.to(ref.current, {
      rotation: 360,
      duration: 1.2,
      repeat: -1,
      ease: 'none',
    })
  }, [])

  return (
    <div ref={ref} style={{ display: 'inline-flex' }}>
      <Icon {...props} name="Reload" animation="fadeIn" />
    </div>
  )
}
