# Deploy de fgpy-site a producción

Sitio: <https://forestalparaguay.com/> · Hosting: **Hostmar** (Apache, IP `200.58.111.122`).
Vía de acceso: **FTP** en el puerto 21 (el SSH está cerrado y los puertos de cPanel no están abiertos).

## Requisitos

- Python 3.10+ (usa `ftplib` de la stdlib, no hay que instalar nada).
- Las credenciales FTP en `.deploy-ftp.txt` en la raíz del repo (está en `.gitignore`).

## Procedimiento

Todos los comandos se corren desde `fgpy-site/`. El archivo de credenciales vive en la
**raíz del repo** (`.deploy-ftp.txt`, está en `.gitignore`):

```sh
# 1. Verificar que las credenciales funcionan y a qué carpeta apunta ROOT
python tools/deploy.py check    --config ../../.deploy-ftp.txt

# 2. Backup del sitio que está vivo ahora (obligatorio antes de tocar nada)
python tools/deploy.py backup   --config ../../.deploy-ftp.txt
#    -> deja backups/<AAAAMMDD-HHMMSS>-pre-deploy-fgpy/ con el sitio anterior
#       y un _MANIFEST.txt con la lista de archivos

# 3. Build
npm run build

# 4. Subir (archivos primero, .htaccess al final)
python tools/deploy.py upload   --config ../../.deploy-ftp.txt \
                                --dist dist --htaccess deploy/.htaccess

# 5. Verificar contra el dominio real
python tools/deploy.py verify   --config ../../.deploy-ftp.txt
```

> Si corrés el script desde un worktree en vez del checkout normal, el `../../` no apunta a
> la raíz del repo: pasá la ruta absoluta, por ejemplo
> `--config 'C:/Programacion/eleventy/fgpy/.deploy-ftp.txt'`.

## Qué hace cada paso

- **check** — abre la sesión FTP, lista `ROOT` y muestra el tamaño de cada archivo.
- **backup** — descarga **todo** el contenido de `ROOT` a una carpeta fechada en `backups/`.
  Es lo que permite volver atrás: si el sitio nuevo falla, se sube de vuelta el backup.
- **upload** — sube primero los archivos del build y **después** borra del hosting los que
  quedaron del sitio anterior y no existen en el build (deja `.htaccess`, que se maneja aparte).
  El `.htaccess` se sube **al final**, porque es lo que activa el rewrite del SPA.
- **verify** — chequea contra `https://forestalparaguay.com/`: que la home dé 200, que
  `sitemap.xml` y `robots.txt` existan, que las URLs viejas den 301 y que una ruta
  inexistente devuelva el index del SPA (o sea, el rewrite funciona).

## El `.htaccess`

`deploy/.htaccess` es el que se sube. Hace tres cosas:

1. **Redirecciones 301** de las URLs del sitio viejo de Eleventy a las anclas del sitio nuevo:
   `/componentes/servicios/` → `/#servicios`, `/componentes/vision_y_mision/` → `/#nosotros`,
   `/componentes/contacto/` → `/#cotizar`.
2. **Rewrite del SPA**: toda ruta que no sea un archivo real devuelve `index.html`, así la 404
   la muestra el sitio y no Apache.
3. **Cache y compresión**: los assets con hash en el nombre se cachean un año; `index.html` no.

> Si el hosting ya tenía reglas que no queremos perder (cabeceras de seguridad, CSP, etc.),
> hay que **mergear** este archivo con el `.htaccess` que esté en producción en vez de pisarlo.
> El backup del paso 2 deja el original a mano para comparar.

## Volver atrás

```sh
# subir de vuelta el sitio anterior
python tools/deploy.py upload --config ../../.deploy-ftp.txt --dist backups/<timestamp>-pre-deploy-fgpy
```

Para restaurar el `.htaccess` viejo hay que subir el que estaba en el backup (no lo pisa
`upload`, porque `.htaccess` está en `KEEP_REMOTE`).
