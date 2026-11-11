/*
  One file per landing in this folder. A new landing = a new file here + one line in `variants` below:
  its page (/<id>), the sitemap entry and the form's "variante" follow from it. Components never ask which landing they render.
  Copy source: "Landing Elaniin — Textos finales (Software y Cloud)", Nov 9 2026. Do not edit copy without the doc.
*/
import { software } from "./software";
import { cloud } from "./cloud";

export type Variant = {
  /** URL slug and the "variante" label on each lead. Lowercase letters, digits and hyphens. */
  id: string;
  /** Browser tab and share title. Without it the page uses the site's default title. */
  title?: string;
  hero: {
    h1: string;
    accent: string;
    subtitle: string;
    button: string;
    /** Partner badges above the H1 (files in public/certifications). */
    partners?: { label: string; badges: { file: string; alt: string; w: number; h: number }[] };
  };
  problem: string;
  /** Parallel sub-services. `piezas` are the terms each text names, drawn as chips. */
  capabilities: { title: string; items: { nombre: string; texto: string; piezas: string[] }[] };
  /** heroTags: the tag on each hero card, by case id. A case without one shows only its industry. */
  cases: { title: string; ids: string[]; heroTags?: Record<string, string> };
};

export const variants: Record<string, Variant> = { software, cloud };

/** The landing served at the site root. */
export const HOME_ID = software.id;
export const pathOf = (id: string) => (id === HOME_ID ? "/" : `/${id}`);
