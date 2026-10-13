import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../lib/smooth'

// Portrait phones get a squarer grid; 8x5 there turned into thin barcode strips.
// shortcut: picked once at load, so rotating a phone keeps the first grid until reload.
const NARROW = window.matchMedia('(max-width: 767px)').matches
const COLS = NARROW ? 4 : 8
const ROWS = NARROW ? 6 : 5
// The montage assembles into the forwarder working inside the plantation: forest and machinery in one frame.
const MAIN = '/img/slider2.webp'
const ALTS = [
  '/img/servicios/chipeado.webp',
  '/img/slider1.webp',
  '/img/servicios/transporte_forestal.webp',
  '/img/servicios/flete_maquinas.webp',
  '/img/servicios/caminos_forestales.webp',
  '/img/servicios/descarga_madera.webp',
]

// Seeded PRNG so the scattered layout is identical on every render (and in prerender).
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

const rand = seeded(11)
const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({
  i,
  r: Math.floor(i / COLS),
  c: i % COLS,
  // 2x2 blocks share one photo so each operation reads as a recognisable patch, not confetti.
  alt: rand() < 0.75 ? ALTS[(Math.floor((i % COLS) / 2) + Math.floor(Math.floor(i / COLS) / 2) * (COLS / 2)) % ALTS.length] : null,
  hidden: rand() < 0.2,
  front: rand() < 0.28, // drawn above the wordmark for depth
  dx: (rand() - 0.5) * 1.6,
  dy: (rand() - 0.5) * 1.6,
  s: 0.72 + rand() * 0.3,
}))

// Each tile shows its slice of a stage-sized, object-cover image, so photos never distort on portrait screens.
const slice = (src: string, r: number, c: number) => ({
  width: `${COLS * 100}%`,
  height: `${ROWS * 100}%`,
  left: `-${c * 100}%`,
  top: `-${r * 100}%`,
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

function Stage({ front }: { front: boolean }) {
  return (
    <div
      data-stage
      aria-hidden
      className={`absolute inset-0 grid origin-center ${front ? 'z-20 pointer-events-none' : 'z-0'}`}
      style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)` }}
    >
      {tiles.map((t) =>
        t.front === front ? (
          <div key={t.i} data-tile data-i={t.i} className="relative will-change-transform" style={{ margin: '-1px' }}>
            <div data-tile-inner className="absolute inset-0 overflow-hidden">
              <div className="absolute" style={slice(MAIN, t.r, t.c)} />
              {t.alt && <div data-alt className="absolute opacity-0" style={slice(t.alt, t.r, t.c)} />}
            </div>
          </div>
        ) : (
          <div key={t.i} />
        ),
      )}
    </div>
  )
}

export default function HeroMosaic() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context((self) => {
      const outer = self.selector!('[data-tile]') as HTMLElement[]

      // Scattered starting state (DOM default is the assembled end state, used for reduced motion).
      gsap.set('[data-stage]', { scale: 0.7 })
      gsap.set('[data-overlay]', { opacity: 0 })
      gsap.set('[data-reveal]', { yPercent: 60, opacity: 0 })
      gsap.set('[data-wordmark], [data-alt], [data-intro]', { opacity: 1 })
      outer.forEach((el) => {
        const t = tiles[Number(el.dataset.i)]
        gsap.set(el, { xPercent: t.dx * 120, yPercent: t.dy * 120, scale: t.s, opacity: t.hidden ? 0 : 1 })
      })

      // Load-in: tiles pop in, wordmark rises, captions type in.
      gsap.from('[data-tile-inner]', {
        opacity: 0, scale: 0.4, duration: 1.1, ease: 'expo.out',
        stagger: { each: 0.018, from: 'random' }, delay: 0.15,
      })
      gsap.from('[data-wordmark] span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.07, delay: 0.5 })
      gsap.from('[data-intro] > *', { opacity: 0, y: 12, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 1.1 })

      // Scroll: mosaic assembles into one full-bleed image, then the headline lands.
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
        .to('[data-wordmark]', { opacity: 0, scale: 1.08, duration: 0.45 }, 0)
        .to('[data-intro]', { opacity: 0, duration: 0.2 }, 0)
        .to(outer, { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, duration: 0.8, stagger: { each: 0.004, from: 'random' } }, 0)
        .to('[data-alt]', { opacity: 0, duration: 0.5 }, 0.35)
        .to('[data-stage]', { scale: 1, duration: 1 }, 0)
        .to('[data-overlay]', { opacity: 1, duration: 0.35 }, 0.85)
        .to('[data-reveal]', { yPercent: 0, opacity: 1, duration: 0.35, stagger: 0.06 }, 0.95)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="inicio" className="relative h-[220svh]" aria-label="Presentación">
      <div className="sticky top-0 h-svh overflow-hidden">
        <Stage front={false} />

        <p
          data-wordmark
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden font-display text-[27vw] font-medium leading-none tracking-[-0.06em] text-ink opacity-0"
        >
          {'FGPY'.split('').map((ch, i) => (
            <span key={i} className="inline-block">{ch}</span>
          ))}
        </p>

        <Stage front />

        <div
          data-intro
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 grid items-end gap-5 bg-gradient-to-t from-surface via-surface/80 to-transparent px-6 pt-32 pb-10 opacity-0 md:grid-cols-3 md:px-12"
        >
          <span className="max-w-xs text-lg leading-snug text-ink">Chips de biomasa y servicios forestales para la industria.</span>
          <span className="hidden text-center label text-ink md:block">Scroll</span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted md:text-right">Encarnación, Itapúa · 27°19′S 55°52′W</span>
        </div>

        <div data-overlay className="absolute inset-0 z-30 bg-gradient-to-t from-surface via-surface/55 to-surface/10" />

        <div className="absolute inset-x-0 bottom-0 z-40 grid gap-10 px-6 pb-10 md:grid-cols-12 md:px-12 md:pb-14">
          <div className="md:col-span-8">
            <h1 data-reveal className="font-display text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.92] tracking-[-0.015em] text-balance">
              Del monte<br />al chip.
            </h1>
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-4">
            <p data-reveal className="max-w-sm text-lg leading-snug text-ink-muted">
              Servicios forestales integrales y generación de chips de biomasa para la industria. Maquinaria propia, operación continua.
            </p>
            <div data-reveal className="flex flex-wrap items-center gap-6">
              <a href="#cotizar" className="btn-primary">Pedir cotización</a>
              <a href="#servicios" className="link text-ink">
                Ver servicios
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
