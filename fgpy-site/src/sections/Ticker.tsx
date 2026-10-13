import LogoLoop from '../components/reactbits/LogoLoop'
import { clients } from '../content/operacion'

// Social proof only: renders once content/operacion.ts lists client logos (a services ticker just repeated the catalog).
export default function Ticker() {
  if (!clients.length) return null
  return (
    <section aria-label="Clientes" className="border-y border-line py-7">
      <LogoLoop
        logos={clients.map((c) => ({ src: c.logo, alt: c.name, title: c.name }))}
        speed={60}
        gap={40}
        logoHeight={32}
        fadeOut
        fadeOutColor="#0d0f0d"
        pauseOnHover
        ariaLabel="Clientes"
      />
    </section>
  )
}
