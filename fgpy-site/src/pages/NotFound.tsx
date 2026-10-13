// Router errorElement: replaces React Router's developer screen for unknown URLs.
export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col justify-end gap-10 px-6 pb-16 md:px-12">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">Error 404</p>
      <h1 className="max-w-3xl text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.92] tracking-[-0.015em] text-balance">
        Este camino no lleva a ningún lado.
      </h1>
      <a href="/" className="btn-primary self-start">Volver al inicio</a>
    </main>
  )
}
