# Pendientes de la landing

Estado al 23 de octubre de 2026. La página está publicada y ya es indexable (sin `noindex`) en Vercel (equipo `roger-elaniin`).

## Al desplegar al dominio final

- [ ] Conectar el dominio definitivo en Vercel. La URL de la imagen OG y de los metadatos se toma de `VERCEL_PROJECT_PRODUCTION_URL`, así que se actualiza sola.
- [ ] En Vercel definir `SITE_URL` (dominio final, con https): sitemap, canonical, `og:url` y JSON-LD lo usan (hoy toman el dominio de producción de Vercel). El `noindex` ya se quitó; `SITE_INDEXABLE=false` lo devuelve (`src/lib/site.ts`).
- [ ] Volver a correr la auditoría SEO/GEO contra el dominio final y validar en Search Console (enviar el sitemap).
- [ ] Favicon definitivo (hoy es el provisional, sin símbolo: `src/app/icon.svg`).
- [ ] Vercel: pasar de plan Hobby (uso no comercial) a Pro o equipo de Elaniin. Quien haga push debe pertenecer al equipo de Vercel, o el despliegue sale "Blocked".
- [ ] Revisar de nuevo Lighthouse con el dominio final (SEO baja a 63 solo por el `noindex`).

## Contenido y funcionalidad

- [ ] **Política de privacidad** (`/privacidad`, hoy provisional). Hace falta: razón social, correo de contacto, jurisdicción aplicable y tiempo de conservación de los datos.
- [ ] **Aviso de cookies y políticas** en la parte inferior de la landing, cuando las políticas existan. Incluir el enlace o casilla de consentimiento junto al formulario.
- [x] **Recepción de leads con n8n**: `src/app/api/lead/route.ts` valida y reenvía al webhook de n8n (`N8N_LEAD_WEBHOOK_URL` en Vercel). n8n guarda el lead en Google Sheets y envía el aviso al equipo y la confirmación al lead.
- [ ] **Cloudflare de automations.elaniin.com**: permitir `/webhook/*` desde servidores (hoy responde 403 a clientes que no son navegador).
- [ ] **Diseño del correo** (plantilla con logo, datos del lead y UTM de la campaña).
- [ ] **Medición**: herramienta (GA4, Meta Pixel o Vercel Analytics) y evento de envío del formulario. Los UTM ya se capturan en el formulario.
- [ ] Antispam adicional (límite de envíos o captcha) y, si se quiere, exigir correo corporativo. Hoy solo hay un campo trampa.
- [ ] Confirmar el enlace de LinkedIn del footer (`linkedin.com/company/elaniin`, es un supuesto).

## Revisión del 23 de octubre

- Anchos revisados: 375, 768, 1024, 1280 y 1440 px, sin desbordes ni imágenes rotas.
- Funcionalidad probada: enlaces del nav, menú móvil, formulario (validación, error, envío), interruptor de sectores, los tres modales de casos, diagrama de flujo y carrusel de logos.
- Lighthouse sobre el build de producción: accesibilidad 100, buenas prácticas 100, SEO 63 (solo por el `noindex`), rendimiento 100 en escritorio.
- Pendiente de revisar a ojo: tablet (768 px) y móvil real en los bloques animados.
