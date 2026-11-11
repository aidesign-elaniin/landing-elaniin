import type { Metadata } from "next";

/*
  One landing = one folder in src/app named after its slug (src/app/cloud → /cloud), holding
  content.ts (this shape) and page.tsx. Copy approved in "Landing Elaniin — Textos finales", Nov 9 2026.
*/
export type Variant = {
  /** The folder name: URL slug and the "variante" label on each lead. Lowercase letters, digits and hyphens. */
  id: string;
  /** Browser tab and share title. Without it, the hero headline. */
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

/** Tab and share title, description and canonical URL of a landing. */
export function landingMetadata(v: Variant): Metadata {
  const title = v.title ?? `${v.hero.h1} ${v.hero.accent}`;
  const url = `/${v.id}`;
  return { title, description: v.hero.subtitle, alternates: { canonical: url }, openGraph: { title, description: v.hero.subtitle, url } };
}
