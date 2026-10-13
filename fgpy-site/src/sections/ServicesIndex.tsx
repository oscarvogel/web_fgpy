import { useState } from 'react'
import { services } from '../content/services'

const total = String(services.length).padStart(2, '0')

// Static editorial index: every row readable on touch; the photo panel only adds on desktop hover/focus.
export default function ServicesIndex() {
  const [active, setActive] = useState(0)
  const current = services[active]

  return (
    <section id="todos-los-servicios" data-chapter="Catálogo" aria-labelledby="siete" className="px-6 py-28 md:px-12 md:py-40">
      <h2 id="siete" data-anim="lines" className="mb-16 text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.01em] md:mb-24">
        Siete servicios,<br />una operación.
      </h2>

      <div className="grid gap-12 lg:grid-cols-12">
        <ol data-anim="stagger" className="border-t border-line lg:col-span-7">
          {services.map((s, i) => (
            <li key={s.slug} className="border-b border-line">
              <a
                href="#cotizar"
                data-service={s.slug}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 py-7 md:grid-cols-[4rem_1fr_auto] md:gap-x-6"
              >
                <span className="pt-2 font-mono text-xs text-ink-muted transition-colors group-hover:text-brand-soft">{s.n}</span>
                <span className="text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-none font-stretch-semi-condensed tracking-[-0.005em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 motion-reduce:transition-none">
                  {s.title}
                </span>
                <span className="hidden self-start pt-2 label text-ink-muted transition-colors group-hover:text-brand-soft md:block">
                  Cotizar <span className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1">→</span>
                </span>
                <span className="col-start-2 max-w-md leading-relaxed text-ink-muted">{s.short}</span>
              </a>
            </li>
          ))}
        </ol>

        <div aria-hidden className="hidden lg:col-span-5 lg:block">
          <figure data-anim="media" className="sticky top-28 aspect-[4/5] overflow-hidden bg-surface-raised">
            {services.map((s, i) => (
              <img
                key={s.slug}
                src={s.img}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ease-out-expo motion-reduce:transition-none ${i === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex justify-between p-5 font-mono text-xs uppercase tracking-wider text-ink">
              <span>{current.n} / {total}</span>
              <span>{current.tags.join(' · ')}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
