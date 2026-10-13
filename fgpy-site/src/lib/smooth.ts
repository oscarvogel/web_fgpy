import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -24 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
