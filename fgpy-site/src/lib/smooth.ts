import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Instancia de Lenis activa, para poder dirigir el scroll desde la app. */
let lenis: Lenis | null = null

/** Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ lerp: 0.09, anchors: { offset: -24 } })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => instance.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])
}

/**
 * Salta a la sección del ancla cuando la página se abre con #seccion.
 *
 * El navegador no lo puede hacer solo: cuando carga con un hash, el elemento
 * de destino todavía no existe (lo dibuja React después del primer render), así
 * que el salto nativo se pierde y la página queda arriba. Esto afecta a las
 * redirecciones 301 que traen a las URLs del sitio anterior.
 */
export function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
    if (!id) return

    let cancelled = false
    const jump = () => {
      if (cancelled) return
      const target = document.getElementById(id)
      if (!target) return
      if (lenis) lenis.scrollTo(target, { offset: -24, immediate: true })
      else target.scrollIntoView({ block: 'start' })
    }

    // Se espera a que carguen las imágenes: arriba están y cambian la altura
    // de la página, así que un salto temprano deja el destino descuadrado.
    const onLoad = () => window.setTimeout(jump, 50)
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    const fallback = window.setTimeout(jump, 1500)

    return () => {
      cancelled = true
      window.clearTimeout(fallback)
      window.removeEventListener('load', onLoad)
    }
  }, [])
}
