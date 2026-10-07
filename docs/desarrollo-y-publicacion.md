# Desarrollo y publicación

## Requisitos

Instala Node.js y npm en una versión compatible con Eleventy 3.

## Instalación y vista local

Desde la raíz del proyecto:

```bash
npm install
npx @11ty/eleventy --serve
```

Abre la dirección local que Eleventy muestra en la terminal (por defecto, `http://localhost:8080`). El servidor vuelve a generar el sitio al detectar cambios.

## Generar archivos

```bash
npx @11ty/eleventy
```

La salida se escribe en `_site/`. No edites manualmente esos archivos: se regeneran desde `src/`.

## Publicación

El proyecto genera un sitio estático. Publica el contenido de `_site/` en un servicio de hosting estático o en un servidor web configurado para servir esos archivos. El repositorio no contiene actualmente una configuración de CI/CD ni instrucciones específicas de un proveedor; los pasos de despliegue dependen del hosting elegido.

Antes de publicar, confirma los datos de `src/_data/site.json`, revisa las rutas del sitio y el sitemap, y consulta la [guía SEO](../SEO-OPTIMIZATION-GUIDE.md).
