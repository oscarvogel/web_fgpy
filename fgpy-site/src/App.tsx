import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './sections/Footer'
import { useSmoothScroll } from './lib/smooth'
import { useReveals } from './lib/reveal'

export default function App() {
  useSmoothScroll()
  useReveals()
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:bg-surface-raised focus:px-4 focus:py-3 focus:label">
        Saltar al contenido
      </a>
      <Nav />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
