/*
  Landing ids for analytics, by folder slug (src/app/<slug>). Standard: POSTHOG_LANDING_PAGES.md, section 3.
  ponytail: only the lp_id for now; the full registry (name, offer, market, version...) comes with the PostHog setup.
*/
export const LP_IDS: Record<string, string> = {
  software: "LP-ENG-001",
  cloud: "LP-CLD-001",
};
