"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ArrowIcon } from "./ui";
import { PrivacyLink } from "./privacy-link";
import { EMAIL, UTM_KEYS, isCorporate, parseLead } from "@/lib/lead";
import { emitLead } from "@/analytics/lead-signal";

// n8n webhook: a CI variable when publishing, .env.local when running locally.
const WEBHOOK = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<"nombre" | "correo" | "sector" | "consentimiento", string>>;
type Attribution = { utm: Record<string, string>; referrer: string };

const ATTRIBUTION_KEY = "elaniin-attribution";

// UTMs of the current URL + the external site that sent the visitor. Reading them stores nothing.
function fromPage(): Attribution {
  const params = new URLSearchParams(location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  const external = document.referrer && !document.referrer.startsWith(location.origin);
  return { utm, referrer: external ? document.referrer : "" };
}

// First touch of the visit, kept in sessionStorage so it survives a trip to /privacidad and back.
function attribution(): Attribution {
  try {
    const saved = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (saved) return JSON.parse(saved) as Attribution;
    const current = fromPage();
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
    return current;
  } catch {
    return fromPage(); // storage blocked (private mode)
  }
}

const fields = [
  { name: "nombre", label: "Nombre", type: "text", autoComplete: "name" },
  { name: "correo", label: "Correo corporativo", type: "email", autoComplete: "email" },
] as const;

// Values are the contract's (lib/lead.ts → perfil.sector); n8n writes them to the "sector" column.
const SECTORS = [
  { value: "privado", label: "Privado" },
  { value: "publico", label: "Público" },
] as const;

export function LeadForm({ variante }: { variante: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    attribution(); // remember where the visit came from before any in-page navigation
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    const next: Errors = {};
    for (const f of fields) {
      if (!data[f.name]?.trim()) next[f.name] = "Este campo es obligatorio.";
    }
    const correo = data.correo?.trim() ?? "";
    if (!next.correo && !EMAIL.test(correo)) next.correo = "Escribe un correo válido.";
    else if (!next.correo && !isCorporate(correo)) next.correo = "Necesito tu correo corporativo para que el especialista te contacte.";
    if (!SECTORS.some((o) => o.value === data.sector)) next.sector = "Selecciona tu sector.";
    if (data.consentimiento !== "on") next.consentimiento = "Acepta la política de privacidad para enviar tus datos.";
    setErrors(next);
    const firstInvalid = (["nombre", "correo", "sector", "consentimiento"] as const).find((k) => next[k]);
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const { utm, referrer } = attribution();
      const eventId = crypto.randomUUID();
      // JSON contract in lib/lead.ts; the form sends it with an empty profile.
      const body = {
        modo: "formulario",
        variante,
        nombre: data.nombre,
        correo,
        consentimiento: true,
        consentimiento_fecha: new Date().toISOString(),
        website: data.website,
        utm,
        referrer,
        page: location.pathname,
        perfil: { sector: data.sector },
        event_id: eventId,
      };
      // ponytail: honeypot and whitelist run in the browser; a bot that posts to the webhook directly skips them. Repeat them in n8n if spam shows up.
      if (!data.website?.trim()) {
        const parsed = parseLead(body);
        if (!parsed.ok || !WEBHOOK) throw new Error("lead");
        const res = await fetch(WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.lead) });
        const reply = await res.json().catch(() => ({}));
        if (!res.ok || reply.ok === false) throw new Error(String(res.status));
        emitLead({ variante, sector: data.sector, eventId }); // only after n8n accepted it; never for the honeypot
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col gap-3 py-6">
        <CheckCircle2 size={28} strokeWidth={1.5} className="text-success-dot" aria-hidden="true" />
        <p className="font-display text-h4 font-semibold text-text-primary">Recibimos tus datos.</p>
        <p className="text-body text-text-secondary">Un especialista revisará tu proyecto y te contactará para una conversación técnica inicial, sin compromiso.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="@container">
      {/* Fields sit side by side when the card is wide enough. */}
      <fieldset disabled={status === "loading"} className="min-w-0">
        <legend className="sr-only">Tus datos</legend>
        <div className="grid gap-x-4 gap-y-4 @lg:grid-cols-2">
          {fields.map((f) => {
            const err = errors[f.name];
            return (
              <div key={f.name} className="min-w-0">
                <label htmlFor={`f-${f.name}`} className="mb-2 block font-display text-body-sm font-medium text-text-secondary">
                  {f.label}
                </label>
                <input
                  id={`f-${f.name}`}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  required
                  aria-invalid={err ? true : undefined}
                  aria-describedby={err ? `e-${f.name}` : undefined}
                  className="field"
                />
                {err && (
                  <p id={`e-${f.name}`} className="mt-1 text-caption text-error-text">
                    {err}
                  </p>
                )}
              </div>
            );
          })}
          {/* ponytail: native select, no custom dropdown */}
          <div className="min-w-0 @lg:col-span-2">
            <label htmlFor="f-sector" className="mb-2 block font-display text-body-sm font-medium text-text-secondary">
              Sector
            </label>
            <select
              id="f-sector"
              name="sector"
              required
              defaultValue=""
              aria-invalid={errors.sector ? true : undefined}
              aria-describedby={errors.sector ? "e-sector" : undefined}
              className="field"
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {SECTORS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.sector && (
              <p id="e-sector" className="mt-1 text-caption text-error-text">
                {errors.sector}
              </p>
            )}
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-body-sm text-text-secondary">
          <input
            id="f-consentimiento"
            name="consentimiento"
            type="checkbox"
            required
            aria-invalid={errors.consentimiento ? true : undefined}
            aria-describedby={errors.consentimiento ? "e-consentimiento" : undefined}
            className="mt-0.5 size-4 shrink-0 rounded-tag accent-inspire-blue focus-ring"
          />
          <span>
            Acepto la <PrivacyLink className="font-medium text-inspire-blue underline underline-offset-2 focus-ring">política de privacidad</PrivacyLink> y el tratamiento de mis datos.
          </span>
        </label>
        {errors.consentimiento && (
          <p id="e-consentimiento" className="mt-1 text-caption text-error-text">
            {errors.consentimiento}
          </p>
        )}
      </fieldset>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          No llenar este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-button border border-error-border bg-error-bg px-3 py-2 text-body-sm text-error-text">
          No pudimos enviar tus datos. Inténtalo de nuevo en unos minutos.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-arrow mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-button bg-elevate-blue px-6 font-display text-button-lg font-medium text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-disabled"
      >
        {status === "loading" ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Enviando
          </>
        ) : (
          <>
            Conversemos sobre tu proyecto
            <ArrowIcon />
          </>
        )}
      </button>
    </form>
  );
}
