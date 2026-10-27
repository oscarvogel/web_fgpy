import { nav, site } from '../content/site'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer id="contacto" className="px-6 pb-28 md:px-12 md:pb-10">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 label text-ink-muted lg:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="mb-4 text-ink">Sede</p>
          <address className="not-italic normal-case leading-relaxed tracking-normal">{site.address}</address>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="mb-4 text-ink">Directo</p>
          <ul className="space-y-1 normal-case tracking-normal">
            <li><a className="inline-block py-2 transition-colors duration-300 hover:text-brand-soft" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a className="inline-block py-2 transition-colors duration-300 hover:text-brand-soft" href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-ink">Sitio</p>
          <ul className="space-y-1">
            {nav.map((n) => (
              <li key={n.href}><a className="inline-block py-2 transition-colors duration-300 hover:text-brand-soft" href={n.href}>{n.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 text-ink">Redes</p>
          <ul className="space-y-1">
            <li><a className="inline-block py-2 transition-colors duration-300 hover:text-brand-soft" href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li><a className="inline-block py-2 transition-colors duration-300 hover:text-brand-soft" href={site.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>

      {/* Bookends the hero: the page opens and closes on the same wordmark, sized to fit the measure down to phone width (glyphs ≈ 2.48× the font-size in vw). */}
      <p aria-hidden data-anim="lines" className="mt-24 select-none text-center text-[35vw] font-medium leading-[0.85] tracking-[-0.06em] text-ink">
        FGPY
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 label text-ink-muted">
        <p>© {year} Forestal Paraguay</p>
        <p className="font-mono normal-case tracking-normal">27°19′S 55°52′W</p>
        <a href="https://github.com/romanvsc" target="_blank" rel="noreferrer" className="py-2 transition-colors duration-300 hover:text-brand-soft">Sitio por Román Vogel Corach</a>
        <a href="#contenido" className="py-2 transition-colors duration-300 hover:text-brand-soft">Volver arriba ↑</a>
      </div>
    </footer>
  )
}
