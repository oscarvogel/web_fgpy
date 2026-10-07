# Forestal Paraguay

Sitio web institucional de Forestal Paraguay, generado como sitio estático con [Eleventy](https://www.11ty.dev/), Nunjucks y Tailwind CSS. Presenta los servicios forestales de la empresa, información institucional y canales de contacto.

## Requisitos

- Node.js y npm. Se recomienda una versión LTS compatible con Eleventy 3.

## Puesta en marcha

```bash
npm install
npx @11ty/eleventy --serve
```

El servidor de desarrollo observa los cambios y sirve el sitio localmente. Eleventy informa en la terminal la dirección disponible, normalmente `http://localhost:8080`.

Para generar el sitio sin iniciar el servidor:

```bash
npx @11ty/eleventy
```

Los archivos generados quedan en `_site/`. Esa carpeta se puede publicar en un hosting para sitios estáticos.

## Estructura

```text
src/
├── _data/          Datos globales en JSON
├── _includes/      Layouts y parciales Nunjucks
├── assets/         CSS, JavaScript, imágenes y videos
├── componentes/    Secciones y páginas del sitio
├── index.njk       Página de inicio
├── robots.txt      Directivas para rastreadores
└── sitemap.njk     Plantilla del sitemap XML
docs/               Documentación del proyecto
_site/              Salida generada por Eleventy
```

La configuración de Eleventy está en `.eleventy.js`. Más detalles sobre la arquitectura, la edición de contenidos y la publicación están en [`docs/`](docs/README.md).

## Tecnologías

- Eleventy 3 para generar HTML estático.
- Nunjucks para layouts y plantillas.
- Tailwind CSS y PostCSS para los estilos.
- Swiper para carruseles.

## SEO

La configuración de metadatos, datos estructurados, `robots.txt` y sitemap se describe en [`SEO-OPTIMIZATION-GUIDE.md`](SEO-OPTIMIZATION-GUIDE.md). Antes de publicar, confirma que la URL y los datos de contacto en `src/_data/site.json` sean los definitivos.

## Repositorio

El repositorio de origen es [`oscarvogel/web_fgpy`](https://github.com/oscarvogel/web_fgpy).
