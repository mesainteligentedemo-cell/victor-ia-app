/**
 * GSAP Global Setup — Web 4.0
 * Registrar plugins, configurar defaults, setup scroll triggers
 *
 * IMPORTAR en: app/layout.tsx → useEffect(() => { initGSAP() }, [])
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'

export const initGSAP = () => {
  // Registrar plugins
  gsap.registerPlugin(ScrollTrigger, Draggable)

  // Defaults globales
  gsap.defaults({
    duration: 0.3,
    ease: 'power2.out',
  })

  // ScrollTrigger config
  ScrollTrigger.config({
    autoRefreshEvents: 'orientationchange,touchmove',
  })

  // Limpiar ScrollTriggers en hot reload (HMR)
  if (process.env.NODE_ENV === 'development') {
    // En dev, limpiar triggers cuando se hotreload
    window.addEventListener('beforeunload', () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    })
  }
}

/**
 * Timeline helpers — para animaciones narrativas de scroll
 */
export const createScrollRevealTimeline = (
  selector: string,
  options: {
    stagger?: number
    duration?: number
    ease?: string
    yStart?: number
  } = {}
) => {
  const {
    stagger = 0.1,
    duration = 0.6,
    ease = 'power3.out',
    yStart = 24,
  } = options

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: selector,
      start: 'top 80%',
      end: 'top 20%',
      markers: process.env.NODE_ENV === 'development',
    },
  })

  timeline.from(`${selector} > *`, {
    opacity: 0,
    y: yStart,
    duration,
    ease,
    stagger,
  })

  return timeline
}

/**
 * DrawSVG timeline — para revelar logos, líneas, etc.
 */
export const createDrawSVGTimeline = (
  svgSelector: string,
  options: {
    duration?: number
    ease?: string
    onComplete?: () => void
  } = {}
) => {
  const { duration = 1.6, ease = 'power3.out', onComplete } = options

  return gsap.to(`${svgSelector} path`, {
    strokeDashoffset: 0,
    duration,
    ease,
    stagger: 0.08,
    onComplete,
  })
}

/**
 * Parallax helper — para hero sections
 */
export const createParallaxEffect = (
  triggerSelector: string,
  targetSelector: string,
  speed = 0.5
) => {
  gsap.to(targetSelector, {
    y: (index, target) => {
      return gsap.getProperty(target, 'offsetHeight') * speed
    },
    scrollTrigger: {
      trigger: triggerSelector,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      markers: process.env.NODE_ENV === 'development',
    },
  })
}

/**
 * Pin timeline — para sticky sections con animación
 */
export const createPinnedTimeline = (
  triggerSelector: string,
  duration = 3
) => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: triggerSelector,
      start: 'top top',
      end: `+=${window.innerHeight * duration}`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      markers: process.env.NODE_ENV === 'development',
    },
  })

  return timeline
}

/**
 * Counter animation — para stats/KPIs
 */
export const animateCounter = (
  el: HTMLElement | null,
  target: number,
  options: {
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
  } = {}
) => {
  if (!el) return

  const {
    duration = 1.2,
    prefix = '',
    suffix = '',
    decimals = 0,
  } = options

  const obj = { value: 0 }

  gsap.to(obj, {
    value: target,
    duration,
    ease: 'power3.out',
    onUpdate: () => {
      const formatted = obj.value.toFixed(decimals).replace(/\.0+$/, '')
      el.textContent = `${prefix}${formatted}${suffix}`
    },
  })
}

/**
 * Magnetic button — sigue al cursor
 */
export const createMagneticButton = (el: HTMLElement | null) => {
  if (!el) return

  const onMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = el.getBoundingClientRect()
    const cx = left + width / 2
    const cy = top + height / 2

    const dx = (clientX - cx) * 0.35
    const dy = (clientY - cy) * 0.35

    gsap.to(el, {
      x: dx,
      y: dy,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const onMouseLeave = () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  el.addEventListener('mousemove', onMouseMove)
  el.addEventListener('mouseleave', onMouseLeave)

  return () => {
    el.removeEventListener('mousemove', onMouseMove)
    el.removeEventListener('mouseleave', onMouseLeave)
  }
}

/**
 * Confetti burst — para success states
 */
export const confettiBurst = (x = window.innerWidth / 2, y = window.innerHeight / 2) => {
  const confettiCount = 50
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.pointerEvents = 'none'
  container.style.width = '100%'
  container.style.height = '100%'
  document.body.appendChild(container)

  for (let i = 0; i < confettiCount; i++) {
    const particle = document.createElement('div')
    particle.style.position = 'absolute'
    particle.style.width = '8px'
    particle.style.height = '8px'
    particle.style.background = Math.random() > 0.5 ? 'white' : '#f0f0f0'
    particle.style.borderRadius = '50%'
    particle.style.left = x + 'px'
    particle.style.top = y + 'px'

    container.appendChild(particle)

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 400,
      y: Math.random() * 300 + 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      onComplete: () => particle.remove(),
    })
  }

  setTimeout(() => container.remove(), 1600)
}
