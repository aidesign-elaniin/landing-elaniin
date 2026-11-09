const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Honeypot: bots fill it, people never see it. Reply ok so they do not retry.
  if (clean(body.website)) return Response.json({ ok: true });

  // Only the 5 UTM fields travel on, trimmed; anything else in the object is dropped.
  const utmIn = (typeof body.utm === "object" && body.utm ? body.utm : {}) as Record<string, unknown>;
  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, clean(utmIn[k], 100)]).filter(([, v]) => v));

  const lead = {
    nombre: clean(body.nombre),
    correo: clean(body.correo),
    empresa: clean(body.empresa),
    cargo: clean(body.cargo),
    utm,
    referrer: clean(body.referrer, 300),
    page: clean(body.page) || "/",
  };
  if (!lead.nombre || !lead.empresa || !EMAIL.test(lead.correo)) {
    return Response.json({ ok: false }, { status: 422 });
  }

  // n8n stores the lead in Google Sheets and sends the team + confirmation emails.
  const url = process.env.N8N_LEAD_WEBHOOK_URL;
  const res = url
    ? await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(10_000),
      }).catch(() => null)
    : null;

  if (!res?.ok) {
    // Keep the lead in the server log so it can be recovered by hand.
    console.error("[lead] n8n failed:", url ? (res?.status ?? "no response") : "N8N_LEAD_WEBHOOK_URL not set", JSON.stringify(lead));
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
