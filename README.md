# Landings de Elaniin

Sitio estático (Next.js, `output: "export"`). No tiene servidor ni base de datos.

## Landings

Una carpeta por landing en `src/app/<slug>/`:

| Slug | Contenido |
|---|---|
| `/software` | `src/app/software/content.ts` |
| `/cloud` | `src/app/cloud/content.ts` |

La raíz `/` es una página de marca con el logo.

## Correr en local

```bash
npm ci
npm run dev
```

## Verificar

```bash
npm test
npm run lint
```

## Publicar

```bash
npm run build
```

El sitio queda en `out/` y se sirve como archivos estáticos.

Variables al compilar:

| Variable | Uso |
|---|---|
| `SITE_URL` | Dominio final con https. Lo usan sitemap, canonical, Open Graph y JSON-LD |
| `NEXT_PUBLIC_LEAD_WEBHOOK_URL` | Webhook de n8n que recibe el formulario |

La demo se publica en GitHub Pages con `.github/workflows/pages.yml`.
