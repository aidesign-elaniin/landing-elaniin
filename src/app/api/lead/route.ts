import { parseLead } from "@/lib/lead";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Honeypot: bots fill it, people never see it. Reply ok so they do not retry.
  if (typeof body.website === "string" && body.website.trim()) return Response.json({ ok: true });

  const parsed = parseLead(body);
  if (!parsed.ok) return Response.json({ ok: false, error: parsed.error }, { status: 422 });
  const { lead } = parsed;

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

  // The flow answers 200 with { ok, error, detalle }: `ok` is true only once the row is stored.
  // ponytail: a 2xx with no JSON body (a flow that does not report) counts as delivered.
  const text = res ? await res.text().catch(() => "") : "";
  let reply: { ok?: unknown; error?: unknown; detalle?: unknown } = {};
  try {
    reply = JSON.parse(text);
  } catch {
    // not JSON: judged by the status alone
  }
  if (!res?.ok || reply.ok === false) {
    // Keep the lead in the server log so it can be recovered by hand.
    console.error("[lead] n8n failed:", url ? (res?.status ?? "no response") : "N8N_LEAD_WEBHOOK_URL not set", "|", String(reply.error ?? ""), "|", String(reply.detalle ?? text).slice(0, 300), "|", JSON.stringify(lead));
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
