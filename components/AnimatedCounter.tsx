'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedCounterProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  onComplete?: () => void
  triggerOnce?: boolean
}

/**
 * AnimatedCounter — Cuenta desde 0 hasta target animado con GSAP
 * Se activa cuando entra en viewport via ScrollTrigger
 *
 * Props:
 * - target: número final (ej: 1842)
 * - duration: duración de la animación (default 1.5s)
 * - prefix/suffix: "$", "%", "K", etc.
 * - decimals: decimales a mostrar (default 0)
 * - triggerOnce: si true, anima solo una vez (default true)
 */
export function AnimatedCounter({
  target,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  onComplete,
  triggerOnce = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      ref.current.textContent = `${prefix}${target.toLocaleString()}${suffix}`
      return
    }

    const obj = { value: 0 }

    gsap.to(obj, {
      value: target,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        end: 'top 75%',
        once: triggerOnce,
      },
      snap: {
        value: 1,
      },
      onUpdate: () => {
        if (ref.current) {
          const formatted = Math.round(obj.value).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
          ref.current.textContent = `${prefix}${formatted}${suffix}`
        }
      },
      onComplete,
    })

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.trigger === ref.current)
        .forEach(t => t.kill())
    }
  }, [target, duration, prefix, suffix, decimals, onComplete, triggerOnce])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
