import { useEffect, useRef, useState } from 'react'
import StaggeredMenu from './reactbits/StaggeredMenu'
import { nav, site } from '../content/site'

const items = [{ label: 'Inicio', href: '#contenido' }, ...nav].map((n) => ({
  label: n.label,
  ariaLabel: `Ir a ${n.label}`,
  link: n.href,
}))

const socials = [
  { label: 'WhatsApp', link: site.whatsapp },
  { label: 'Instagram', link: site.instagram },
  { label: 'Email', link: `mailto:${site.email}` },
]

// Colors mirror the @theme tokens in index.css (the component takes raw values).
export default function Nav() {
  const [open, setOpen] = useState(false)
  // CTAs step aside while the quote form itself is on screen; the mobile bar also waits out the hero,
  // which carries its own "Pedir cotización" button.
  const [atQuote, setAtQuote] = useState(false)
  const [atHero, setAtHero] = useState(true)
  useEffect(() => {
    const quote = document.getElementById('cotizar')
    const hero = document.getElementById('inicio')
    const ios = [
      quote && new IntersectionObserver(([e]) => setAtQuote(e.isIntersecting), { threshold: 0.15 }),
      hero && new IntersectionObserver(([e]) => setAtHero(e.isIntersecting)),
    ]
    ios[0]?.observe(quote!)
    ios[1]?.observe(hero!)
    return () => ios.forEach((io) => io?.disconnect())
  }, [])
  const hide = open || atQuote

  // Chapter indicator: which [data-chapter] section crosses the viewport's midline; the bar is overall page progress.
  // Light mode: a [data-theme="light"] section sits under the nav row.
  const [chapter, setChapter] = useState<{ n: string; name: string } | null>(null)
  const [light, setLight] = useState(false)
  const fill = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const chapters = [...document.querySelectorAll<HTMLElement>('[data-chapter]')]
    const lights = [...document.querySelectorAll('[data-theme="light"]')]
    const track = (els: Element[], margin: string, onChange: (i: number) => void) => {
      const inView = new Set<Element>()
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)))
          onChange(els.findIndex((el) => inView.has(el)))
        },
        { rootMargin: margin },
      )
      els.forEach((el) => io.observe(el))
      return io
    }
    const ios = [
      track(chapters, '-50% 0px -50% 0px', (i) =>
        setChapter(i < 0 ? null : { n: String(i + 1).padStart(2, '0'), name: chapters[i].dataset.chapter! }),
      ),
      track(lights, '0px 0px -94% 0px', (i) => setLight(i >= 0)),
    ]
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      fill.current!.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      ios.forEach((io) => io.disconnect())
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      {/* Keeps logo and menu legible over any section without a hard bar. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-surface/85 via-surface/40 to-transparent transition-opacity duration-500 ${light ? 'opacity-0' : ''}`}
      />

      <div
        aria-hidden
        className={`pointer-events-none fixed top-[1.55rem] left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 transition-[opacity,color] duration-500 md:flex ${chapter && !open ? '' : 'opacity-0'} ${light ? 'text-ink-inverse' : 'text-ink'}`}
      >
        <span className="font-mono text-xs tabular-nums">{chapter?.n}</span>
        <span className="relative h-px w-16 overflow-hidden bg-current/25">
          <span ref={fill} className="absolute inset-0 origin-left bg-current" />
        </span>
        <span className="label">{chapter?.name}</span>
      </div>

      <a
        href="#cotizar"
        className={`fixed top-[1.55rem] right-36 z-30 hidden link transition-[opacity,color] duration-500 md:block ${light ? 'text-ink-inverse' : 'text-ink'} ${hide ? 'pointer-events-none opacity-0' : ''}`}
      >
        Pedir cotización
      </a>

      <a
        href="#cotizar"
        className={`btn-primary fixed inset-x-4 bottom-4 z-30 justify-center transition-opacity md:hidden ${hide || atHero ? 'pointer-events-none opacity-0' : ''}`}
      >
        Pedir cotización
      </a>

      <div data-nav-theme={light ? 'light' : 'dark'}>
        <StaggeredMenu
          isFixed
          position="right"
          logoUrl="/img/fgpy.png"
          items={items}
          socialItems={socials}
          colors={['#00702a', '#151815']}
          accentColor="#5aaf76"
          menuButtonColor="#f2f2ee"
          openMenuButtonColor="#f2f2ee"
          onMenuOpen={() => setOpen(true)}
          onMenuClose={() => setOpen(false)}
        />
      </div>
    </>
  )
}
