'use client'

import { useRef, useEffect, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  direction?: 'up' | 'down' | 'left' | 'right' | 'in'
  duration?: number
  once?: boolean
  threshold?: number
}

/**
 * ScrollReveal — Componente que anima elementos cuando entran en viewport
 * Utiliza GSAP ScrollTrigger para máximo control
 *
 * Props:
 * - direction: 'up' (default), 'down', 'left', 'right', 'in' (fade + scale)
 * - stagger: anima children uno a uno (si hay múltiples)
 * - delay: delay inicial en segundos
 * - duration: duración de la animación
 * - once: si true, anima solo una vez. Si false, repite en cada scroll
 * - threshold: qué tan adentro del viewport debe estar para activar (0-1, default 0.2)
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  stagger = false,
  direction = 'up',
  duration = 0.8,
  once = true,
  threshold = 0.2,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const el = containerRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Sin animación si el usuario lo prefiere
      gsap.set(el, { opacity: 1 })
      return
    }

    // Estado inicial basado en dirección
    const fromVars = {
      opacity: 0,
      ...(direction === 'up' && { y: 40 }),
      ...(direction === 'down' && { y: -40 }),
      ...(direction === 'left' && { x: 40 }),
      ...(direction === 'right' && { x: -40 }),
      ...(direction === 'in' && { scale: 0.92 }),
    }

    // Si hay stagger, animar children
    if (stagger) {
      gsap.from(el.children, {
        ...fromVars,
        duration,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: `top ${100 - threshold * 100}%`,
          end: `top ${80 - threshold * 100}%`,
          scrub: false,
          markers: process.env.NODE_ENV === 'development',
          once,
        },
        delay,
      })
    } else {
      // Animar el contenedor
      gsap.from(el, {
        ...fromVars,
        duration,
        ease: direction === 'in' ? 'back.out(1.2)' : 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: `top ${100 - threshold * 100}%`,
          end: `top ${80 - threshold * 100}%`,
          scrub: false,
          markers: process.env.NODE_ENV === 'development',
          once,
        },
        delay,
      })
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.trigger === el || t.trigger?.contains(el))
        .forEach(t => t.kill())
    }
  }, [delay, stagger, direction, duration, once, threshold])

  return <div ref={containerRef} className={className}>{children}</div>
}

/**
 * Variante — ScrollRevealGroup
 * Anima múltiples elementos con stagger automático
 */
interface ScrollRevealGroupProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
}

export function ScrollRevealGroup({
  children,
  className = '',
  staggerDelay = 0.1,
}: ScrollRevealGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const items = containerRef.current.querySelectorAll('[data-reveal-item]')
    if (items.length === 0) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1 })
      return
    }

    gsap.from(items, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
        once: true,
      },
    })

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.trigger === containerRef.current)
        .forEach(t => t.kill())
    }
  }, [staggerDelay])

  return (
    <div ref={containerRef} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} data-reveal-item>
              {child}
            </div>
          ))
        : children}
    </div>
  )
}

/**
 * Variante — ParallaxSection
 * Efecto parallax en imágenes/fondos con scroll
 */
interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.to(contentRef.current, {
      y: (index, target) => {
        return window.innerHeight * speed * 0.5
      },
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: process.env.NODE_ENV === 'development',
      },
    })

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.trigger === containerRef.current)
        .forEach(t => t.kill())
    }
  }, [speed])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
