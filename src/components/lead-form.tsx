"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ArrowIcon } from "./ui";
import { CONSENT_CHANGE_EVENT, cookiesAccepted } from "./cookie-consent";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<"nombre" | "correo" | "empresa" | "cargo", string>>;
type Attribution = { utm: Record<string, string>; referrer: string };

const ATTRIBUTION_KEY = "elaniin-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

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
function attribution(): Attribution {
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
  { name: "empresa", label: "Empresa o institución", type: "text", autoComplete: "organization" },
  { name: "cargo", label: "Cargo (opcional)", type: "text", autoComplete: "organization-title", optional: true },
] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LeadForm() {
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
      if (!("optional" in f) && !data[f.name]?.trim()) next[f.name] = "Este campo es obligatorio.";
    }
    if (!next.correo && !EMAIL.test(data.correo.trim())) next.correo = "Escribe un correo válido.";
    setErrors(next);
    const firstInvalid = fields.find((f) => next[f.name]);
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid.name}`)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const { utm, referrer } = attribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, utm, referrer, page: location.pathname }),
      });
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
        <p className="font-display text-h4 font-medium text-text-primary">Recibimos tus datos.</p>
        <p className="text-body text-text-secondary">Nuestro equipo te escribirá pronto para conversar sobre tu proyecto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-2 gap-x-4 gap-y-5">
      {fields.map((f) => {
        const err = errors[f.name];
        return (
          <div key={f.name} className={`min-w-0 ${f.name === "empresa" || f.name === "cargo" ? "col-span-2 sm:col-span-1" : "col-span-2"}`}>
            <label htmlFor={`f-${f.name}`} className="mb-2 block font-display text-body-sm font-medium text-text-primary">
              {f.label}
            </label>
            <input
              id={`f-${f.name}`}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required={!("optional" in f)}
              disabled={status === "loading"}
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
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          No llenar este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === "error" && (
        <p role="alert" className="col-span-2 rounded-button border border-error-border bg-error-bg px-3 py-2 text-body-sm text-error-text">
          No pudimos enviar tus datos. Inténtalo de nuevo en unos minutos.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-arrow col-span-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-button bg-elevate-blue px-6 font-display text-button-lg font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-disabled"
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
