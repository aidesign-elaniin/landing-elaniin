import { LP_IDS } from "./lp-registry";

/*
  Connection point for the Meta pixel (Georgina, Nov 12 2026): when n8n accepts a lead, the page pushes `lp_lead`
  to window.dataLayer. No name or email here. `event_id` is the same one sent to n8n, so the pixel and the
  server-side send to Meta can be deduplicated. The same moment fires the pixel's Lead event (meta-pixel.tsx), when the pixel is loaded.
*/
// Everything reported goes in English (Adrián, Nov 12 2026); the form's own values stay in Spanish for n8n.
const SECTOR: Record<string, string> = { privado: "private", publico: "public" };

export function emitLead({ variante, sector, eventId }: { variante: string; sector: string; eventId: string }) {
  const w = window as Window & { dataLayer?: Record<string, unknown>[]; fbq?: (...args: unknown[]) => void };
  const lp_id = LP_IDS[variante];
  const sectorEn = SECTOR[sector] ?? sector;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "lp_lead", lp_id, form_id: "contact_form", sector: sectorEn, event_id: eventId });
  w.fbq?.("track", "Lead", { content_name: lp_id, content_category: sectorEn }, { eventID: eventId });
}
