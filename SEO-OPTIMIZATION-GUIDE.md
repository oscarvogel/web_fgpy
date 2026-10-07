# Guía de Optimización SEO - Forestal Paraguay

## ✅ Mejoras Implementadas

### 1. **Meta Tags y Structured Data**
- ✅ Open Graph completo para redes sociales
- ✅ Twitter Cards para mejor compartición
- ✅ JSON-LD Schema.org (Organization + LocalBusiness)
- ✅ Canonical URLs para evitar contenido duplicado
- ✅ Meta robots optimizado
- ✅ Geolocalización para búsquedas locales

### 2. **Archivos Técnicos SEO**
- ✅ `robots.txt` creado en `/src/robots.txt`
- ✅ `sitemap.njk` creado en `/src/sitemap.njk`
- ✅ Configuración Eleventy actualizada para copiar robots.txt

### 3. **Optimización de Contenido**
- ✅ Títulos únicos por página
- ✅ Descripciones optimizadas (150-160 caracteres)
- ✅ Keywords específicas por página
- ✅ Atributos alt en imágenes
- ✅ Estructura HTML semántica mejorada

### 4. **Performance Web**
- ✅ Preconnect a recursos externos
- ✅ DNS prefetch para CDNs
- ✅ Font Awesome con carga diferida
- ✅ Optimización del orden de carga de CSS/JS

### 5. **Accesibilidad (A11y)**
- ✅ Atributos ARIA añadidos
- ✅ Roles semánticos (banner, navigation, main)
- ✅ Labels descriptivos en navegación
- ✅ Atributos width/height en imágenes

---

## 📋 Pasos Siguientes Recomendados

### 1. **Validar URL del Sitio**
Actualizar en `src/_data/site.json`:
```json
{
  "url": "https://forestalparaguay.com"  // ⚠️ Verificar dominio real
}
```

### 2. **Generar y Optimizar Imágenes**
- Crear imagen OG específica (1200x630px): `/assets/images/og-image.jpg`
- Optimizar todas las imágenes con herramientas como:
  - **TinyPNG** / **ImageOptim**
  - Convertir a WebP cuando sea posible
  - Implementar responsive images

```html
<!-- Ejemplo de imagen responsive -->
<img 
  src="/assets/images/servicio.jpg"
  srcset="/assets/images/servicio-small.jpg 480w,
          /assets/images/servicio-medium.jpg 768w,
          /assets/images/servicio-large.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Descripción del servicio forestal"
  loading="lazy"
  width="1200"
  height="800"
>
```

### 3. **Google Search Console**
1. Verificar propiedad del sitio
2. Enviar sitemap: `https://forestalparaguay.com/sitemap.xml`
3. Solicitar indexación de páginas principales
4. Monitorear errores de rastreo

### 4. **Google My Business**
- Crear/optimizar perfil de empresa
- Añadir:
  - Dirección exacta
  - Horarios de atención
  - Fotos de proyectos
  - Categoría: "Servicio Forestal"
  - Reseñas de clientes

### 5. **Velocidad y Core Web Vitals**
Ejecutar auditorías con:
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage

# O usar PageSpeed Insights
# https://pagespeedinsights.google.com/
```

**Optimizaciones adicionales:**
- Implementar caché de navegador
- Comprimir recursos con Gzip/Brotli
- Lazy loading para imágenes fuera del viewport
- Minificar CSS/JS en producción

### 6. **Contenido y Link Building**
- ✍️ Crear blog con artículos sobre:
  - Buenas prácticas forestales
  - Casos de éxito
  - Tecnología en el sector
  - Sustentabilidad
  
- 🔗 Estrategia de backlinks:
  - Asociaciones del sector forestal
  - Directorios empresariales de Paraguay
  - Medios especializados

### 7. **Monitoreo y Analytics**
Ya implementado Google Analytics (G-ERT2VW5CWH), pero también considerar:

- **Google Tag Manager** para eventos personalizados
- **Hotjar** o **Microsoft Clarity** para heatmaps
- Objetivos y conversiones:
  - Clics en botones de contacto
  - Formularios enviados
  - Llamadas telefónicas
  - Clics en WhatsApp

### 8. **Schema Markup Adicional**
Considerar añadir para servicios específicos:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Apeo y Traslado de Pinos",
  "provider": {
    "@type": "Organization",
    "name": "Forestal Paraguay"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Paraguay"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### 9. **Configurar Caché y Headers HTTP**
En servidor web (Apache/Nginx):

```apache
# Apache .htaccess
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### 10. **Verificar Mobile-Friendly**
Probar con:
- https://search.google.com/test/mobile-friendly
- Responsive design en diferentes dispositivos
- Touch targets de mínimo 48x48px

---

## 🔍 Checklist de Validación

- [ ] URL canónica configurada en site.json
- [ ] Sitio verificado en Google Search Console
- [ ] Sitemap enviado a Google
- [ ] Perfil de Google My Business creado
- [ ] Imágenes optimizadas (WebP, comprimidas)
- [ ] Tests de velocidad con Lighthouse (>90 score)
- [ ] Prueba mobile-friendly pasada
- [ ] Meta descripciones únicas en todas las páginas
- [ ] Estructura de encabezados correcta (H1, H2, H3)
- [ ] Enlaces internos optimizados
- [ ] Certificado SSL activo (HTTPS)
- [ ] Redireccionamiento www → no-www (o viceversa)

---

## 📊 KPIs a Monitorear

1. **Posicionamiento Orgánico**
   - Posición en Google para keywords principales
   - Impresiones y clics en Search Console

2. **Tráfico Web**
   - Sesiones orgánicas mensuales
   - Tasa de rebote
   - Duración promedio de sesión

3. **Conversiones**
   - Formularios enviados
   - Llamadas telefónicas
   - Clics en WhatsApp

4. **Technical SEO**
   - Errores de rastreo
   - Páginas indexadas
   - Core Web Vitals scores

---

## 🎯 Keywords Principales a Optimizar

**Primarias:**
- Forestal Paraguay
- Servicios forestales Paraguay
- Apeo de pinos Paraguay
- Cosecha forestal mecanizada

**Secundarias:**
- Producción de chips forestales
- Preparación suelos forestales
- Plantaciones de pinos Encarnación
- Transporte forestal Paraguay
- Harvester y forwarder Paraguay

**Long-tail:**
- "Empresa forestal sustentable en Paraguay"
- "Servicios de apeo mecanizado Itapúa"
- "Cosecha forestal con trazabilidad Paraguay"

---

## 📞 Soporte
Para dudas o consultas sobre estas optimizaciones, revisar:
- [Documentación Eleventy](https://www.11ty.dev/docs/)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
