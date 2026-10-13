import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../lib/smooth'

// The page's one light surface: an editorial pause before the closing call to action.
// data-theme="light" tells the fixed nav to switch to dark ink while this is under it.
export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  // Enters page-dark (no visible edge) and switches to cream in one short, timed move once 40% in view;
  // scrubbing it left a muddy grey block on screen. Done long before it reaches the nav row.
  // Classes hold the final state for reduced motion.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const css = getComputedStyle(document.documentElement)
    const token = (name: string) => css.getPropertyValue(name).trim()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current,
        { backgroundColor: token('--color-surface'), color: token('--color-ink') },
        {
          backgroundColor: token('--color-surface-inverse'),
          color: token('--color-ink-inverse'),
          duration: 0.9,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 60%', toggleActions: 'play none none reverse' },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="nosotros"
      data-chapter="Nosotros"
      data-theme="light"
      aria-labelledby="nosotros-t"
      className="bg-surface-inverse px-6 py-32 text-ink-inverse md:px-12 md:py-48"
    >
      <div className="mb-16 flex flex-wrap justify-between gap-4 label opacity-60 md:mb-24">
        <h2 id="nosotros-t">Nosotros</h2>
        <span>Encarnación, Itapúa</span>
      </div>
      <p data-anim="lines" className="max-w-6xl text-[clamp(2rem,4.6vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.015em]">
        Trabajamos donde empieza la cadena: <span className="text-brand">en el monte.</span> Con maquinaria propia y un equipo
        que conoce cada camino de Itapúa, convertimos plantaciones en abastecimiento confiable, energía renovable y
        resultados medibles para la industria.
      </p>
    </section>
  )
}
