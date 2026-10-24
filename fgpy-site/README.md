# Forestal Paraguay — sitio web

Sitio de una sola página (Vite + React). Requiere Node 20 o superior.

## Desarrollo

```sh
npm ci
npm run dev      # http://localhost:5173
```

## Publicar

```sh
npm ci
npm run build    # genera la carpeta dist/
```

Subir **el contenido de `dist/`** a la raíz pública del hosting (`public_html` o equivalente).

### Configuración del servidor

Cualquier URL que no exista debe devolver `index.html`, así se muestra la página 404 del sitio en lugar del error del servidor.

Apache (`.htaccess` en la raíz pública):

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ /index.html [L]
```

Nginx:

```nginx
location / { try_files $uri /index.html; }
```

## Datos del negocio

Teléfono, email, dirección y redes están en `src/content/site.ts`. Si cambian, actualizar también el bloque `application/ld+json` de `index.html` (datos para Google).
