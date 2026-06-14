'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

/**
 * LENIS SMOOTH SCROLL — Global Setup
 * Smooth scroll premium sin afectar performance
 *
 * Uso: Envolver app en <LenisProvider>
 */

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical' as const,
      gestureDirection: 'vertical' as const,
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useLenis()
  return <>{children}</>
}
