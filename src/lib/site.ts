/** Single source for the site's origin and indexing switch.
 *  The site is indexable. Set SITE_URL to the final domain in Vercel; SITE_INDEXABLE=false brings back noindex if ever needed. */
export const SITE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3111");

export const INDEXABLE = process.env.SITE_INDEXABLE !== "false";

export const SITE_TITLE = "Elaniin | Software, transformación digital y Google Cloud";
export const SITE_DESCRIPTION =
  "Desarrollo de software, innovación y proyectos de Google Cloud para empresas e instituciones. Desde 2014 desde El Salvador, para la región y EE. UU.";
