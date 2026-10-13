import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import { services } from '../content/services'
import { site } from '../content/site'

const OTHER = 'Otro / combinado'

function buildMessage(f: { service: string; volume: string; place: string; who: string }) {
  return [
    'Hola, quisiera una cotización.',
    `Servicio: ${f.service}`,
    f.volume && `Volumen o alcance: ${f.volume}`,
    f.place && `Ubicación: ${f.place}`,
    f.who && `Contacto: ${f.who}`,
  ]
    .filter(Boolean)
    .join('\n')
}

const field =
  'w-full border-b border-line bg-transparent py-3 text-lg text-ink placeholder:text-ink-muted/70 focus:outline-none'
const label = 'label text-ink-muted'

// Focus is shown by an accent rule drawing in under the control and the label taking the accent.
function Field({ id, text, children, after }: { id: string; text: string; children: ReactNode; after?: ReactNode }) {
  return (
    <div className="group">
      <label htmlFor={id} className={`${label} transition-colors duration-300 group-focus-within:text-brand-soft`}>{text}</label>
      <div className="relative">
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brand-soft transition-transform duration-500 ease-out-expo group-focus-within:scale-x-100"
        />
      </div>
      {after}
    </div>
  )
}

export default function Quote() {
  const id = useId()
  const [form, setForm] = useState({ service: '', volume: '', place: '', who: '' })
  const [error, setError] = useState('')
  // After submit the form gives way to a status panel; 'blocked' means the popup never opened.
  const [sent, setSent] = useState<null | 'opened' | 'blocked'>(null)
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (k === 'service') setError('')
  }

  // Links elsewhere on the page (e.g. the chip spec) can preselect a service via data-service.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const slug = (e.target as HTMLElement).closest<HTMLElement>('[data-service]')?.dataset.service
      const s = services.find((x) => x.slug === slug)
      if (s) setForm((f) => ({ ...f, service: s.title }))
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const waUrl = `${site.whatsapp}?text=${encodeURIComponent(buildMessage(form))}`

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.service) {
      setError('Elija un servicio para que podamos preparar la cotización.')
      return
    }
    // No 'noopener' feature: with it window.open always returns null and a blocked popup can't be told apart.
    const w = window.open(waUrl, '_blank')
    if (w) w.opener = null
    setSent(w ? 'opened' : 'blocked')
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent('Pedido de cotización')}&body=${encodeURIComponent(
    buildMessage({ ...form, service: form.service || 'A definir' }),
  )}`

  return (
    <section id="cotizar" data-chapter="Contacto" aria-labelledby={`${id}-t`} className="scroll-mt-24 px-6 py-28 md:px-12 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id={`${id}-t`} data-anim="lines" className="text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.015em] text-balance">
            Hablemos de su próxima <span className="text-brand-soft">operación</span>.
          </h2>
          <p data-anim="fade" className="mt-8 max-w-sm text-lg leading-snug text-ink-muted">
            Cuéntenos qué necesita y le respondemos con una propuesta concreta. Atención comercial de lunes a viernes, de 8 a 18 h.
          </p>
          <ul data-anim="stagger" className="mt-12 space-y-4">
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="group flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className={label}>Teléfono</span>
                <span className="text-xl tabular-nums transition-colors duration-300 group-hover:text-brand-soft">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="group flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className={label}>Email</span>
                {/* Allowed to wrap only after the @, never mid-word. */}
                <span className="text-xl transition-colors duration-300 group-hover:text-brand-soft sm:text-right">
                  {site.email.split('@')[0]}@<wbr />{site.email.split('@')[1]}
                </span>
              </a>
            </li>
          </ul>
        </div>

        {sent ? (
          <div role="status" className="border-t border-brand-soft pt-8 lg:col-span-6 lg:col-start-7">
            <p className="label text-brand-soft">{sent === 'opened' ? 'Mensaje listo' : 'Falta un paso'}</p>
            <p className="mt-6 max-w-lg text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.01em] font-stretch-semi-condensed">
              {sent === 'opened'
                ? 'Abrimos WhatsApp con su consulta armada. Solo falta enviarla.'
                : 'Su navegador bloqueó la ventana de WhatsApp. Ábrala desde acá: el mensaje ya está escrito.'}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              {sent === 'blocked' ? (
                <a href={waUrl} target="_blank" rel="noreferrer" className="btn-primary">Abrir WhatsApp</a>
              ) : (
                <a href={waUrl} target="_blank" rel="noreferrer" className="link text-ink">¿No se abrió? Abrir de nuevo</a>
              )}
              <button type="button" onClick={() => setSent(null)} className="link text-ink-muted">Editar la consulta</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate data-anim="stagger" className="grid content-start gap-10 lg:col-span-6 lg:col-start-7">
            <Field
              id={`${id}-s`}
              text="Servicio *"
              after={<p id={`${id}-e`} role="alert" className="mt-2 min-h-5 text-sm text-warning">{error}</p>}
            >
              <select
                id={`${id}-s`}
                value={form.service}
                onChange={set('service')}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-e` : undefined}
                className={`${field} cursor-pointer appearance-none pr-8 ${form.service ? '' : 'text-ink-muted/70'}`}
              >
                <option value="" disabled>Elija un servicio</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.title} className="bg-surface-raised text-ink">{s.title}</option>
                ))}
                <option value={OTHER} className="bg-surface-raised text-ink">{OTHER}</option>
              </select>
              <svg aria-hidden width="12" height="8" viewBox="0 0 12 8" className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-ink-muted">
                <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Field>
            <Field id={`${id}-v`} text="Volumen o alcance">
              <input id={`${id}-v`} value={form.volume} onChange={set('volume')} placeholder="Ej.: abastecimiento mensual de chip" className={field} />
            </Field>
            <Field id={`${id}-p`} text="Ubicación">
              <input id={`${id}-p`} value={form.place} onChange={set('place')} placeholder="Ej.: planta en Hohenau, Itapúa" autoComplete="address-level2" className={field} />
            </Field>
            <Field id={`${id}-w`} text="Nombre y empresa">
              <input id={`${id}-w`} value={form.who} onChange={set('who')} placeholder="Ej.: Ana Benítez, Aserradero San José" autoComplete="organization" className={field} />
            </Field>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
              <button type="submit" className="btn-primary">Enviar por WhatsApp</button>
              <a href={mailto} className="link text-ink">
                Prefiero email
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
