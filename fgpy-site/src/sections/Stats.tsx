import { capacity, chipSpec } from '../content/operacion'

export default function Stats() {
  return (
    <section id="capacidad" data-chapter="Capacidad" aria-labelledby="capacidad-titulo" className="px-6 py-28 md:px-12 md:py-40">
      <h2 id="capacidad-titulo" data-anim="lines" className="max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.01em]">
        Capacidad para abastecer una planta, no un pedido.
      </h2>

      {/* Oversized figures are the section's statement; labels stay quiet so the numbers carry it. */}
      <dl className="mt-20 grid border-t border-line md:mt-28 md:grid-cols-3">
        {capacity.map((f, i) => (
          <div key={f.label} className={`border-b border-line py-8 md:border-b-0 md:py-10 ${i ? 'md:border-l md:pl-8' : 'md:pr-8'}`}>
            <dt className="label text-ink-muted">{f.label}</dt>
            <dd
              data-anim="lines"
              className="mt-6 text-[clamp(6.5rem,12vw,11.5rem)] font-medium leading-[0.85] tracking-[-0.02em] tabular-nums font-stretch-semi-condensed"
            >
              {f.value}
              <span className="text-brand-soft">{f.suffix}</span>
            </dd>
            <dd data-anim="fade" className="mt-5 text-lg text-ink-muted">{f.unit}</dd>
          </div>
        ))}
      </dl>

      <div data-anim="fade" className="mt-28 grid gap-12 border border-line p-8 md:p-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h3 className="text-3xl font-medium tracking-[-0.005em]">Chip de biomasa</h3>
          <p className="mt-4 max-w-sm leading-relaxed text-ink-muted">
            La ficha técnica completa se entrega junto con la cotización, según el uso de su planta.
          </p>
          <a href="#cotizar" data-service="biomasa" className="mt-8 inline-block link text-ink">
            Pedir ficha y cotización
          </a>
        </div>
        <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {chipSpec.map((r) => (
            <div key={r.k} className="border-t border-line py-5">
              <dt className="mb-2 label text-ink-muted">{r.k}</dt>
              <dd className="text-lg leading-snug">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
