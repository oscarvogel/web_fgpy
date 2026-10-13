import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollExpand from '../components/reactbits/ScrollExpand'
import { prefersReducedMotion } from '../lib/smooth'

const steps = [
  { t: 'Apeo y trozado', d: 'Garra trozadora en monte' },
  { t: 'Chipeado', d: 'Biomasa en origen' },
  { t: 'Carga y transporte', d: 'Flota propia' },
  { t: 'Entrega en planta', d: 'Descarga con garra' },
]

// In viewport heights: scroll spent expanding the video, then scroll spent walking the chain while it stays pinned.
const EXPAND = 1.2
const HOLD = 2

export default function Process() {
  const root = useRef<HTMLElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [step, setStep] = useState(() => (prefersReducedMotion() ? steps.length - 1 : 0))

  useEffect(() => {
    if (prefersReducedMotion()) return
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: ({ progress }) => {
        const hold = Math.min(1, Math.max(0, (progress * (EXPAND + HOLD) - EXPAND) / HOLD))
        bar.current!.style.transform = `scaleX(${hold})`
        setStep(Math.min(steps.length - 1, Math.floor(hold * steps.length)))
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section ref={root} data-chapter="Proceso" aria-label="Nuestro proceso">
      <ScrollExpand
        useWindowScroll
        mediaType="video"
        src="/video/video_fg.mp4"
        poster="/img/slider1.webp"
        title="Del monte a la planta."
        startRadius={2}
        overlayScrim={1}
        scrollDistance={EXPAND}
        holdDistance={HOLD}
        className="font-display [--se-title-size:clamp(2.5rem,7vw,6rem)]"
      >
        {/* The overlay centers its children; this wrapper takes the full frame and pins content to the bottom. */}
        <div className="flex h-full w-full flex-col justify-end pb-20 text-left md:pb-0">
          <div>
            <h3 className="mb-10 max-w-2xl text-[clamp(2rem,4.5vw,4rem)] font-medium leading-[0.95] tracking-[-0.01em]">
              Una sola cadena,<br />sin intermediarios.
            </h3>
            <ol className="relative grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink/25 pt-6 md:grid-cols-4">
              <span
                ref={bar}
                aria-hidden
                className="absolute -top-px left-0 h-px w-full origin-left bg-brand-soft"
                style={{ transform: `scaleX(${prefersReducedMotion() ? 1 : 0})` }}
              />
              {steps.map((s, i) => (
                <li
                  key={s.t}
                  aria-current={i === step ? 'step' : undefined}
                  className={`flex flex-col gap-2 transition-opacity duration-500 ease-out-expo ${i <= step ? 'opacity-100' : 'opacity-35'}`}
                >
                  <span className={`font-mono text-xs transition-colors duration-500 ${i === step ? 'text-brand-soft' : 'text-ink-muted'}`}>0{i + 1}</span>
                  <span className="text-lg font-medium leading-tight md:text-xl">{s.t}</span>
                  <span className="label text-ink-muted">{s.d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </ScrollExpand>
    </section>
  )
}
