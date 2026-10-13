import { services } from '../content/services'

const featured = services.filter((s) => ['biomasa', 'transporte', 'caminos'].includes(s.slug))

export default function Featured() {
  return (
    <section id="servicios" data-chapter="Servicios" className="px-6 py-28 md:px-12 md:py-40">
      <header className="mb-20 flex flex-wrap items-end justify-between gap-6">
        <h2 data-anim="lines" className="max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.01em]">
          Operación forestal de punta a punta.
        </h2>
        <a href="#todos-los-servicios" className="link">
          Ver todos los servicios
        </a>
      </header>

      <div className="flex flex-col gap-28 md:gap-40">
        {featured.map((s, i) => (
          <article key={s.slug} className={`group grid items-end gap-8 md:grid-cols-12 ${i % 2 ? 'md:[&>figure]:order-2' : ''}`}>
            <figure data-anim="media" className="overflow-hidden md:col-span-8">
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                width={1600}
                height={1000}
                className="aspect-[4/5] w-full object-cover md:aspect-[16/10] transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
              />
            </figure>
            <div data-anim="stagger" className="md:col-span-4">
              <ul className="mb-6 flex flex-wrap gap-2 label text-ink-muted">
                {s.tags.map((t) => (
                  <li key={t} className="border border-line px-2.5 py-1">{t}</li>
                ))}
              </ul>
              <h3 className="mb-4 text-4xl font-medium tracking-[-0.005em]">{s.title}</h3>
              <p className="mb-8 max-w-sm leading-relaxed text-ink-muted">{s.short}</p>
              <a href="#cotizar" data-service={s.slug} className="link">
                Cotizar este servicio
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
