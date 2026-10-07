# Edición de contenidos

## Datos generales y navegación

- `src/_data/site.json`: nombre, descripción, URL, correo, teléfono, ubicación y enlaces sociales usados por el sitio y sus metadatos. Verifica los valores antes de publicar.
- `src/_data/navigation.json`: rótulos y rutas de los enlaces principales.
- `src/_data/hero.json`: textos y configuración de la portada.
- `src/_data/valores.json`: valores institucionales.

Los archivos de datos deben seguir siendo JSON válido: usa comillas dobles en nombres y cadenas, y no agregues comas después del último elemento.

## Servicios y galería

- `src/_data/servicios.json` y `src/_data/todos_los_servicios.json`: información de servicios utilizada por las secciones del sitio.
- `src/_data/galeria.json`: imágenes de la galería. Cada elemento incluye una ruta `src` y un texto alternativo `alt`.
- Las páginas y secciones que presentan estos datos están en `src/componentes/` y `src/_includes/partials/`.

Al agregar una imagen, guárdala dentro de `src/assets/images/` y usa en los datos su ruta pública desde la raíz, por ejemplo `/assets/images/galeria/nueva-imagen.jpg`. Escribe un `alt` que describa la imagen; si es decorativa, sigue el tratamiento que ya utilice la plantilla correspondiente.

## Plantillas y estilos

Las plantillas usan Nunjucks (`.njk`). El layout general se encuentra en `src/_includes/layouts/base.njk`; los elementos reutilizables están en `src/_includes/partials/`. Los estilos principales están en `src/assets/css/style.css`.

Antes de publicar cambios, genera el sitio localmente siguiendo [Desarrollo y publicación](desarrollo-y-publicacion.md) y revisa las páginas afectadas.
