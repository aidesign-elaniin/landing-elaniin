/** Single source for the site's origin and indexing switch.
 *  The site is indexable. Set SITE_URL to the final domain in Vercel; SITE_INDEXABLE=false brings back noindex if ever needed. */
export const SITE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3111");

export const INDEXABLE = process.env.SITE_INDEXABLE !== "false";

// Title and description come from the Software hero (final texts, Nov 9 2026).
export const SITE_TITLE = "Elaniin | Ingeniería de primer nivel para proyectos críticos";
export const SITE_DESCRIPTION =
  "Desarrollo end-to-end de plataformas críticas para empresas e instituciones, con un estándar de calidad verificado antes de cada entrega.";
