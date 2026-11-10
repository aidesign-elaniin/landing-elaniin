"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ArrowIcon } from "./ui";
import { CONSENT_CHANGE_EVENT, cookiesAccepted } from "./cookie-consent";
import { PrivacyLink } from "./privacy-link";
import { EMAIL, UTM_KEYS, isCorporate, parseLead } from "@/lib/lead";
import type { VariantId } from "@/data/variants";

// Set only in the static GitHub Pages build (.github/workflows/pages.yml). Empty everywhere else: the form uses /api/lead.
const DIRECT_WEBHOOK = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<"nombre" | "correo" | "consentimiento", string>>;
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

// First touch of the visit. Only with cookies accepted it is kept in sessionStorage, so it survives
// a trip to /privacidad and back; nothing persists across visits. Without consent: current page only.
// ponytail: captured when the form mounts (home) or on accept; a first landing on /privacidad is not covered.
export function attribution(): Attribution {
  if (!cookiesAccepted()) return fromPage();
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

function syncAttribution() {
  if (cookiesAccepted()) {
    attribution();
    return;
  }
  try {
    sessionStorage.removeItem(ATTRIBUTION_KEY); // rejected after accepting: forget it
  } catch {
    // storage blocked: nothing was saved
  }
}

const fields = [
  { name: "nombre", label: "Nombre", type: "text", autoComplete: "name" },
  { name: "correo", label: "Correo corporativo", type: "email", autoComplete: "email" },
] as const;

export function LeadForm({ variante }: { variante: VariantId }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    syncAttribution();
    window.addEventListener(CONSENT_CHANGE_EVENT, syncAttribution);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, syncAttribution);
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
    if (data.consentimiento !== "on") next.consentimiento = "Acepta la política de privacidad para enviar tus datos.";
    setErrors(next);
    const firstInvalid = (["nombre", "correo", "consentimiento"] as const).find((k) => next[k]);
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const { utm, referrer } = attribution();
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
      };
      const post = (url: string, payload: unknown) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (DIRECT_WEBHOOK) {
        // Static copy (GitHub Pages): no /api/lead there, so the browser does what the route does and posts to n8n itself.
        // ponytail: honeypot and whitelist run in the browser here; a bot that posts to the webhook directly skips them. Repeat them in n8n if spam shows up.
        if (!data.website?.trim()) {
          const parsed = parseLead(body);
          if (!parsed.ok) throw new Error(parsed.error);
          const res = await post(DIRECT_WEBHOOK, parsed.lead);
          const reply = await res.json().catch(() => ({}));
          if (!res.ok || reply.ok === false) throw new Error(String(res.status));
        }
        setStatus("success");
        return;
      }
      const res = await post("/api/lead", body);
      if (!res.ok) throw new Error(String(res.status));
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
