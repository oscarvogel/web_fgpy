#!/usr/bin/env python3
"""Deploy de fgpy-site (Vite + React) al hosting estático de forestalparaguay.com vía FTP.

El hosting es Hostmar (Apache), sin SSH: la única vía es FTP en el puerto 21.

Flujo recomendado (el orden importa: siempre backup antes de tocar):

    python tools/deploy.py check     --config ../../.deploy-ftp.txt
    python tools/deploy.py backup    --config ../../.deploy-ftp.txt
    python tools/deploy.py upload    --config ../../.deploy-ftp.txt --dist ../dist
    python tools/deploy.py verify    --config ../../.deploy-ftp.txt

El `.htaccess` que se sube es el que se genera aparte (`deploy/.htaccess`), porque hay
que mezclarlo con el que ya está en producción y no pisar reglas que no conocemos.
"""

from __future__ import annotations

import argparse
import ftplib
import os
import posixpath
import shutil
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path, PurePosixPath

# Nombres que nunca se borran del hosting durante la limpieza.
KEEP_REMOTE = {".htaccess"}

# Carpetas estándar del servidor que se dejan aunque queden vacías.
KEEP_DIRS = {"cgi-bin"}


# --------------------------------------------------------------------------- config


@dataclass
class Config:
    host: str
    user: str
    password: str
    root: str
    tls: bool = False
    port: int = 21

    @classmethod
    def load(cls, path: Path) -> "Config":
        if not path.exists():
            raise SystemExit(f"No existe el archivo de credenciales: {path}")
        values = cls._read(path)

        missing = [k for k in ("HOST", "USER", "PASS") if not values.get(k)]
        if missing:
            raise SystemExit(
                f"Faltan {', '.join(missing)} en {path}. Completá el archivo y volvé a intentar."
            )
        return cls(
            host=values["HOST"],
            user=values["USER"],
            password=values["PASS"],
            root=values.get("ROOT", "/public_html"),
            tls=values.get("TLS", "0").strip().lower() in {"1", "true", "yes", "si", "sí"},
            port=int(values.get("PORT", "21")),
        )

    @classmethod
    def load_for_verify(cls, path: Path) -> "Config":
        """Para `verify` no hacen falta credenciales: alcanza con la URL pública."""
        values = cls._read(path) if path.exists() else {}
        base = values.get("BASE_URL", "https://forestalparaguay.com")
        return cls(
            host=values.get("HOST", ""),
            user=values.get("USER", ""),
            password=values.get("PASS", ""),
            root=base,
        )

    @staticmethod
    def _read(path: Path) -> dict[str, str]:
        values: dict[str, str] = {}
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            values[key.strip().upper()] = value.strip()
        return values


# ----------------------------------------------------------------------- conexión


def connect(cfg: Config) -> ftplib.FTP:
    """Conecta en modo pasivo. Prueba FTP plano y, si falla, FTPS explícito."""
    attempts = []
    if cfg.tls:
        attempts.append(("FTPS", ftplib.FTP_TLS))
    attempts.append(("FTP", ftplib.FTP))

    last_error: Exception | None = None
    for label, factory in attempts:
        try:
            ftp = factory(timeout=60)
            ftp.connect(cfg.host, cfg.port)
            ftp.login(cfg.user, cfg.password)
            ftp.prot_p()  # pasivo: el server abre el canal de datos
            print(f"[ok] conectado por {label} a {cfg.host}:{cfg.port}")
            return ftp
        except Exception as exc:  # noqa: BLE001 - queremos reintentar con el otro modo
            last_error = exc
            print(f"[!] {label} falló: {exc}")

    raise SystemExit(f"No se pudo conectar por FTP: {last_error}")


def ensure_dir(ftp: ftplib.FTP, remote_dir: str) -> None:
    """Crea la carpeta remota si falta (recursivo)."""
    parts = [p for p in remote_dir.split("/") if p]
    current = ""
    for part in parts:
        current = f"{current}/{part}"
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
            except ftplib.error_perm:
                pass
            ftp.cwd(current)


# ---------------------------------------------------------------------- listados


def list_dir(ftp: ftplib.FTP, remote_dir: str) -> list[tuple[str, str, int]]:
    """Devuelve (nombre, tipo, tamaño) de un directorio remoto."""
    entries: list[tuple[str, str, int]] = []
    try:
        items = list(ftp.mlsd(remote_dir))
    except (ftplib.error_perm, AttributeError):
        items = []
        for name in ftp.nlst(remote_dir):
            base = posixpath.basename(name.rstrip("/"))
            if base in {".", ".."}:
                continue
            try:
                ftp.cwd(name)
                is_dir = True
                ftp.cwd(remote_dir)
            except ftplib.error_perm:
                is_dir = False
            size = 0 if is_dir else (ftp.size(name) or 0)
            entries.append((base, "dir" if is_dir else "file", size))
        return entries

    for name, facts in items:
        if name in {".", ".."}:
            continue
        kind = facts.get("type", "file")
        size = int(facts.get("size", 0) or 0)
        entries.append((name, "dir" if kind == "dir" else "file", size))
    return entries


def walk_remote(ftp: ftplib.FTP, remote_dir: str, prefix: str = "") -> list[str]:
    """Lista recursivamente todos los archivos remotos (rutas relativas)."""
    files: list[str] = []
    for name, kind, _ in list_dir(ftp, remote_dir):
        if name in {".", ".."}:
            continue
        remote_path = posixpath.join(remote_dir, name)
        rel = posixpath.join(prefix, name) if prefix else name
        if kind == "dir":
            files.extend(walk_remote(ftp, remote_path, rel))
        else:
            files.append(rel)
    return files


def local_manifest(root: Path) -> list[str]:
    """Rutas relativas de todos los archivos de un directorio local."""
    out: list[str] = []
    for path in root.rglob("*"):
        if path.is_file():
            out.append(path.relative_to(root).as_posix())
    return sorted(out)


# -------------------------------------------------------------------------- backup


def explore(ftp: ftplib.FTP, start: str, depth: int) -> None:
    """Mapea el servidor para encontrar la carpeta pública del dominio."""
    print(f"[explore] raíz: {start}  (profundidad {depth})")
    try:
        entries = list_dir(ftp, start)
    except (ftplib.error_perm, ftplib.error_temp) as exc:
        print(f"[!] no se pudo leer {start}: {exc}")
        return

    dirs = [e for e in entries if e[1] == "dir"]
    files = [e for e in entries if e[1] == "file"]
    for name, kind, size in files:
        print(f"       file {size:>10}  {name}")
    for name, kind, size in dirs:
        print(f"       DIR          {name}/")
        if depth > 1:
            explore(ftp, posixpath.join(start, name), depth - 1)


def do_backup(ftp: ftplib.FTP, cfg: Config, dest_root: Path) -> None:
    stamp = time.strftime("%Y%m%d-%H%M%S")
    dest = dest_root / f"{stamp}-pre-deploy-fgpy"
    dest.mkdir(parents=True, exist_ok=True)

    print(f"[backup] destino: {dest}")
    remote_files = walk_remote(ftp, cfg.root)
    print(f"[backup] {len(remote_files)} archivos remotos en {cfg.root}")

    total = 0
    for rel in remote_files:
        local_path = dest / rel
        local_path.parent.mkdir(parents=True, exist_ok=True)
        remote_path = posixpath.join(cfg.root, rel)
        with local_path.open("wb") as handle:
            ftp.retrbinary(f"RETR {remote_path}", handle.write, 64 * 1024)
        total += local_path.stat().st_size

    (dest / "_MANIFEST.txt").write_text(
        "\n".join(sorted(remote_files)) + "\n", encoding="utf-8"
    )
    print(f"[backup] descargados {len(remote_files)} archivos ({total / 1024 / 1024:.2f} MB)")
    print(f"[backup] manifest: {dest / '_MANIFEST.txt'}")


# ------------------------------------------------------------------------- upload


def prune_empty_dirs(ftp: ftplib.FTP, remote_dir: str, prefix: str = "") -> int:
    """Borra las carpetas que quedaron vacías (de abajo hacia arriba)."""
    removed = 0
    try:
        entries = list_dir(ftp, remote_dir)
    except (ftplib.error_perm, ftplib.error_temp):
        return 0
    for name, kind, _ in entries:
        if kind != "dir" or name in KEEP_DIRS:
            continue
        remote_path = posixpath.join(remote_dir, name)
        removed += prune_empty_dirs(ftp, remote_path, posixpath.join(prefix, name))
        try:
            if not list_dir(ftp, remote_path):
                ftp.rmd(remote_path)
                print(f"[upload] carpeta vacía eliminada: {posixpath.join(prefix, name)}/")
                removed += 1
        except (ftplib.error_perm, ftplib.error_temp):
            pass
    return removed


def do_upload(ftp: ftplib.FTP, cfg: Config, dist: Path, htaccess: Path | None) -> None:
    if not (dist / "index.html").exists():
        raise SystemExit(f"{dist} no parece un build de Vite: falta index.html")

    manifest = local_manifest(dist)
    print(f"[upload] {len(manifest)} archivos desde {dist}")

    # 1. Subir los archivos nuevos primero: el sitio viejo sigue sirviendo mientras tanto.
    for rel in manifest:
        remote_path = posixpath.join(cfg.root, rel)
        remote_dir = posixpath.dirname(remote_path)
        if remote_dir:
            ensure_dir(ftp, remote_dir)
        with (dist / rel).open("rb") as handle:
            ftp.storbinary(f"STOR {remote_path}", handle, 64 * 1024)
    print(f"[upload] subidos {len(manifest)} archivos")

    # 2. Borrar lo que quedó del sitio anterior y ya no existe en el build.
    remote_files = set(walk_remote(ftp, cfg.root))
    stale = sorted(remote_files - set(manifest) - KEEP_REMOTE)
    for rel in stale:
        remote_path = posixpath.join(cfg.root, rel)
        try:
            ftp.delete(remote_path)
        except ftplib.error_perm as exc:
            print(f"[!] no se pudo borrar {rel}: {exc}")
    print(f"[upload] borrados {len(stale)} archivos obsoletos")

    # 2b. Las carpetas del sitio viejo que quedaron vacías.
    pruned = prune_empty_dirs(ftp, cfg.root)
    print(f"[upload] eliminadas {pruned} carpetas vacías")

    # 3. El .htaccess va último: es lo que activa el rewrite del SPA.
    if htaccess:
        if not htaccess.exists():
            raise SystemExit(f"No existe el .htaccess a subir: {htaccess}")
        with htaccess.open("rb") as handle:
            ftp.storbinary(f"STOR {posixpath.join(cfg.root, '.htaccess')}", handle)
        print(f"[upload] .htaccess actualizado desde {htaccess}")


# ------------------------------------------------------------------------- verify


def do_verify(cfg: Config) -> int:
    base = cfg.root if cfg.root.startswith("http") else "https://forestalparaguay.com"
    checks = [
        ("/", 200, "página principal"),
        ("/sitemap.xml", 200, "sitemap"),
        ("/robots.txt", 200, "robots"),
        ("/componentes/servicios/", 301, "redirect de URL vieja"),
        ("/ruta-que-no-existe", 200, "404 del SPA (rewrite)"),
    ]

    failures = 0
    for path, expected, label in checks:
        url = base.rstrip("/") + path
        request = urllib.request.Request(url, method="GET")
        opener = urllib.request.build_opener(NoRedirect)
        try:
            with opener.open(request, timeout=30) as response:
                status = response.status
                body = response.read()
        except urllib.error.HTTPError as exc:
            status = exc.code
            body = exc.read()
        except Exception as exc:  # noqa: BLE001
            print(f"[!] {path} -> error: {exc}")
            failures += 1
            continue

        ok = status == expected
        failures += 0 if ok else 1
        mark = "ok" if ok else "!!"
        extra = ""
        if path == "/ruta-que-no-existe":
            extra = " (SPA)" if b"<div id=\"root\"" in body or b"id=\"root\"" in body else " (no parece el SPA)"
        print(f"[{mark}] {path} -> {status} (esperado {expected}) - {label}{extra}")
    return failures


class NoRedirect(urllib.request.HTTPRedirectHandler):
    """No sigue redirecciones: queremos ver el 301, no el destino."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: D102
        return None


# ---------------------------------------------------------------------------- main


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "accion", choices=["check", "explore", "backup", "upload", "verify"]
    )
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--dist", type=Path, default=None, help="carpeta dist/ de fgpy-site")
    parser.add_argument("--htaccess", type=Path, default=None, help="archivo .htaccess a subir")
    parser.add_argument("--dest", type=Path, default=None, help="carpeta destino del backup")
    parser.add_argument("--path", default="/", help="ruta remota para explore")
    parser.add_argument("--depth", type=int, default=2, help="profundidad de explore")
    args = parser.parse_args()

    if args.accion == "verify":
        cfg = Config.load_for_verify(args.config)
        failures = do_verify(cfg)
        return 1 if failures else 0

    cfg = Config.load(args.config)
    ftp = connect(cfg)
    try:
        if args.accion == "check":
            print(f"[info] root remoto: {cfg.root}")
            for name, kind, size in list_dir(ftp, cfg.root):
                print(f"       {kind:4} {size:>10}  {name}")
        elif args.accion == "explore":
            explore(ftp, args.path, args.depth)
        elif args.accion == "backup":
            dest = args.dest or Path(__file__).resolve().parents[2] / "backups"
            do_backup(ftp, cfg, dest)
        elif args.accion == "upload":
            if not args.dist:
                raise SystemExit("Falta --dist para la acción upload")
            do_upload(ftp, cfg, args.dist, args.htaccess)
    finally:
        try:
            ftp.quit()
        except Exception:  # noqa: BLE001
            ftp.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
