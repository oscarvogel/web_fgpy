# Arquitectura del sitio

## Generación

Eleventy toma `src/` como entrada y genera HTML estático en `_site/`. La configuración de `.eleventy.js` define las carpetas, habilita Nunjucks para las plantillas y Markdown, copia los recursos de `src/assets/` y `src/robots.txt`, y observa los cambios de CSS.

La página principal está en `src/index.njk`. Usa el layout `src/_includes/layouts/base.njk` e incluye parciales de `src/_includes/partials/` para las secciones compartidas.

## Organización de contenidos

- `src/_data/`: datos globales JSON que las plantillas pueden leer por nombre de archivo. Incluye datos del sitio, navegación, servicios, galería y contenido del hero.
- `src/componentes/`: páginas de servicios, visión y misión, y contacto.
- `src/_includes/layouts/`: estructura de página compartida.
- `src/_includes/partials/`: fragmentos reutilizables de interfaz.
- `src/assets/`: estilos, scripts, imágenes y videos servidos como archivos estáticos.
- `src/sitemap.njk`: plantilla de sitemap.

## Configuración relevante

El objeto `dir` de `.eleventy.js` fija `src` como entrada y `_site` como salida. La configuración agrega filtros de fecha y activa la combinación profunda de datos. Los assets de `src/assets/` se copian a la raíz de la salida, por eso las plantillas los referencian con rutas como `/assets/images/...`.

Para saber dónde editar cada tipo de contenido, consulta [Edición de contenidos](contenidos.md).
