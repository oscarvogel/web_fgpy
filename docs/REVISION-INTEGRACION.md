# Revisión e integración de los PRs de Roman

Fecha: 2026-10-24
Rama integrada: `integracion/pr1-pr2` → `main`

## Qué hay en GitHub

Dos PRs abiertos de `romanvsc` sobre `oscarvogel/web_fgpy`:

| PR | Rama | Commits | Estado |
|---|---|---|---|
| #1 «Add fgpy-site (Vite + React)» | `romanvsc:main` | `14c1a84` | OPEN, MERGEABLE |
| #2 «Mejoras produccion» | `romanvsc:mejoras-produccion` | `14c1a84` → `2091f52` → `b82a856` | OPEN, MERGEABLE |

**El PR #2 contiene al PR #1**: `14c1a84` es ancestro directo de `b82a856`, así que el
PR #2 es el PR #1 más dos commits. Por eso el diff que muestra GitHub para el PR #2
(66 archivos, 4.856 líneas) parece enorme: `main` todavía no tiene el sitio, así que el
diff incluye todo. **El delta real entre el PR #1 y el PR #2 son 11 archivos.**

```
6715e9b  origin/main — "Initial project setup and documentation"
    │
    └─ 14c1a84  Add fgpy-site (Vite + React)                      ← PR #1
         │
         └─ 2091f52  fgpy-site: SEO, mejoras de UX y build...      ← PR #2
              │
              └─ b82a856  Proceso: reemplazar video de FG Argentina
                          por foto de chipeado                    ← PR #2 (pushed después)
```

El tercer commit llegó **pusheado a la rama del PR #2**, no como PR nuevo. Corrige un
error de contenido: el video de la sección Proceso era de FG Argentina, no de FGPY.

### El delta real (11 archivos)

| Archivo | Qué cambió |
|---|---|
| `fgpy-site/index.html` | canonical, Open Graph, Twitter card, JSON-LD LocalBusiness |
| `fgpy-site/public/robots.txt` | 18 líneas → 3 (User-agent, Allow, Sitemap) |
| `fgpy-site/public/sitemap.xml` | nuevo |
| `fgpy-site/public/video/video_fg.mp4` | 7,7 MB → 5,8 MB (luego eliminado, ver limpieza) |
| `fgpy-site/src/components/Nav.tsx` | nav realineado (`top-12` + `-translate-y-1/2`); el CTA también se oculta en el hero |
| `fgpy-site/src/content/site.ts` | "Contacto" pasa a apuntar a `#cotizar` (el formulario) |
| `fgpy-site/src/sections/Footer.tsx` | año en constante de módulo |
| `fgpy-site/src/sections/HeroMosaic.tsx` | hero 220svh → 160svh + "Forestal Paraguay" sobre el texto |
| `fgpy-site/src/sections/Process.tsx` | el video de Proceso pasa a foto (`chipeado.webp`) |
| `fgpy-site/vite.config.ts` | `css: { postcss: {} }` |
| `fgpy-site/README.md` | instrucciones de build y deploy |

## Cómo se levantó el servidor local

El working tree principal (`main`) tiene cambios sin commitear, así que el PR se desplegó en un
**git worktree aislado** dentro del repo:

```sh
git worktree add .worktrees/pr2 pr-2-roman
cd .worktrees/pr2/fgpy-site
npm ci
npm run dev -- --host --port 5173 --strictPort
```

`.worktrees/` quedó en `.git/info/exclude`, así que no ensucia el `git status` del repo principal.

> Ojo: `--strictPort` hace que Vite **aborte** si el puerto está tomado, en vez de buscar el
> siguiente libre. Con dos instancias vivas da "Port 5173 is already in use".

## Verificaciones hechas

| Qué | Resultado |
|---|---|
| `npm ci` con el lock del PR | OK, 52 paquetes, 0 vulnerabilidades |
| `npm run build` (producción) | OK, 51 módulos, `dist/` generado |
| Dev server + carga de la página | 200 OK en `/`, `/sitemap.xml`, `/robots.txt`, `/img/og.jpg` |
| Consola del navegador (errores + warnings) | **0 entradas** |
| Anclas de navegación | `#inicio`, `#servicios`, `#nosotros`, `#cotizar`, `#contenido`, `#contacto` existen |
| Sección Proceso con la foto | la expansión al scrollear funciona igual que con el video |
| Build **sin** el parche local `postcss.config.js` | OK — ver abajo |

### El PR se autocontiene: el parche local quedó obsoleto

Había un `fgpy-site/postcss.config.js` sin trackear en el working tree principal, puesto para que
Vite no heredara el `postcss.config.js` del sitio Eleventy raíz (plugin `tailwindcss` v3, incompatible
con el CSS de Tailwind v4 de `fgpy-site`).

**El PR #2 ya resuelve eso correctamente** con `css: { postcss: {} }` en `vite.config.ts`.
Se comprobó sacando el archivo: el build termina igual y el CSS compila con `tailwindcss v4.3.3`,
sin restos de `@tailwind` de la v3.

→ Ese `fgpy-site/postcss.config.js` local se eliminó del working tree.

## Hallazgos

### 1. El nav fijo se superpone con el contenido (visual, con impacto real)

El `<nav>` es `fixed` y transparente, no reserva espacio ni cambia de fondo al entrar en secciones
claras. Se reproduce en dos lugares:

- Sección "Nosotros" (fondo claro): el logo verde "F" queda encima de la "T" de
  *«Trabajamos donde empieza la cadena: en el monte»*.
- Footer: el logo pisa el inicio de la dirección (*«**Ed**ificio La Soñada…»*) y el link
  *«Pedir cotización»* pisa la etiqueta *«WHATSAPP»*.

En las secciones oscuras no se nota porque el texto claro de fondo ya separa bien.

### 2. La misma foto en tres lugares

`/img/servicios/chipeado.webp` quedó usada en:

1. `HeroMosaic.tsx` — mosaico del hero
2. `content/services.ts` — card «Chips de biomasa» de la sección Servicios
3. `Process.tsx` — sección Proceso a pantalla completa (nuevo en `b82a856`)

En la práctica la misma foto aparece **tres veces en la misma página**. Se le pidió a Roman que
elija una imagen distinta para Proceso.

### 3. Bundle JS por encima del umbral de Vite

`dist/assets/index-*.js` = **510,73 kB** (gzip 168,91 kB). Vite avisa por encima de 500 kB.
Es un único chunk: no hay code splitting, y el sitio carga GSAP + Lenis + React + react-router
en un solo bundle.

### 4. Ancla `#contacto` huérfana (menor)

`site.ts` mueve el link de navegación "Contacto" a `#cotizar` (el formulario, `Quote.tsx`), pero
`Footer.tsx` conserva `id="contacto"`. No rompe nada; simplemente ya nadie apunta a ese id.

## Limpieza aplicada antes de integrar

Commit propio en la rama de integración, sobre `b82a856`:

- **`fgpy-site/public/video/video_fg.mp4` (5,5 MB) eliminado.** Tras `b82a856` quedó sin ninguna
  referencia (`git grep video_fg` → vacío), pero como está en `public/`, Vite lo copiaba a `dist/`
  y se iba a subir al hosting: 5,5 MB que nadie pide.
- **`fgpy-site/_sin-uso/` eliminado (15,3 MB, 18 archivos).** Originales y videos viejos
  versionados en el repo que nunca se servían.
- **Comentario obsoleto corregido** en `Process.tsx`: seguía hablando de «expanding the video».

Total que sale del repo y del deploy: **~20,8 MB**.

## Pendientes

- [ ] Corregir el solapamiento del nav en secciones claras y en el footer.
- [ ] Roman: elegir otra foto para la sección Proceso (hoy repite `chipeado.webp`).
- [ ] Definir el bundle: code splitting real o subir `chunkSizeWarningLimit` a propósito.
- [ ] **Definir el destino del sitio**: hoy conviven el sitio Eleventy de la raíz y `fgpy-site`
      (Vite + React). Hay que decidir cuál se publica y qué pasa con el otro.
- [ ] Publicación real: el README del PR describe bien `dist/` → `public_html`, el rewrite de
      todas las rutas a `index.html` (Apache y Nginx) y dónde están los datos de contacto, pero
      falta la prueba contra el hosting definitivo.
- [ ] Verificar en móvil (en esta revisión no se pudo cambiar el viewport del navegador).
- [ ] Decidir qué pasa con los PRs #1 y #2 en GitHub: al mergear sus commits, GitHub los marca
      como merged automáticamente.
