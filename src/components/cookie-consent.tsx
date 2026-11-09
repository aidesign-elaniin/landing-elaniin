"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { PolicyContent } from "./privacy-policy";
import { OPEN_PRIVACY_EVENT } from "./privacy-link";

/*
  Cookie notice + privacy policy modal. The choice is kept in localStorage (the notice never blocks the page).
  The server render and the first client render show nothing ("unknown"), so there is no flash for returning visitors.
*/
const KEY = "elaniin-cookie-consent";
const CHANGE = "cookie-consent-change";
type Choice = "accepted" | "rejected" | null | "unknown";

/** Fired on window whenever the visitor accepts or rejects. */
export const CONSENT_CHANGE_EVENT = CHANGE;
export const cookiesAccepted = () => read() === "accepted";

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}
function save(v: "accepted" | "rejected") {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* private mode: the choice lasts for this visit only */
  }
  window.dispatchEvent(new Event(CHANGE));
}
function subscribe(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
}

const primary =
  "inline-flex h-11 items-center justify-center rounded-button bg-elevate-blue px-5 font-display text-button font-medium text-white transition-colors duration-base hover:bg-blue-600 active:bg-blue-700 focus-ring";
const secondary =
  "inline-flex h-11 items-center justify-center rounded-button border border-border-default bg-white px-5 font-display text-button font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring";

export function CookieConsent() {
  const stored = useSyncExternalStore(subscribe, read, () => "unknown" as Choice);
  const [dismissed, setDismissed] = useState(false); // covers private mode, where nothing can be stored
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_PRIVACY_EVENT, show);
    return () => window.removeEventListener(OPEN_PRIVACY_EVENT, show);
  }, []);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !open) return;
    if (!el.open) el.showModal();
    document.documentElement.classList.add("overflow-hidden");
  }, [open]);

  const close = () => {
    dialog.current?.close();
    document.documentElement.classList.remove("overflow-hidden");
  };
  const choose = (v: "accepted" | "rejected") => {
    save(v);
    setDismissed(true);
    close();
  };

  const showBanner = stored === null && !dismissed;

  return (
    <>
      {showBanner && (
        <section
          aria-label="Aviso de cookies"
          className="rise fixed inset-x-0 bottom-0 z-50 border-t border-border-default bg-white shadow-menu"
        >
          <div className="container-site flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <p className="min-w-0 text-body-sm text-text-secondary lg:max-w-[72ch]">
              Usamos cookies propias y de terceros para mejorar tu experiencia en el sitio y analizar su uso. Al hacer clic en «Aceptar» consientes su uso. Conoce más en nuestra política de
              privacidad.
            </p>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className="nav-link inline-flex h-11 items-center justify-center font-display text-button font-medium text-text-link focus-ring">
                Política de privacidad
              </button>
              <button type="button" onClick={() => choose("rejected")} className={secondary}>
                Rechazar
              </button>
              <button type="button" onClick={() => choose("accepted")} className={primary}>
                Aceptar
              </button>
            </div>
          </div>
        </section>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="privacy-title"
        onClose={() => {
          setOpen(false);
          document.documentElement.classList.remove("overflow-hidden");
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(760px,calc(100vw-1.5rem))] max-w-none overflow-hidden rounded-modal border-0 bg-white p-0 text-text-primary shadow-product backdrop:bg-excellence-blue/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        {open && (
          <>
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border-default px-6 py-4 md:px-10">
              <h2 id="privacy-title" className="font-display text-h3 font-medium text-text-primary">
                Política de privacidad
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-button border border-border-default bg-white text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring"
              >
                <X size={20} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-10">
              <PolicyContent />
            </div>

            <footer className="flex shrink-0 flex-col gap-3 border-t border-border-default bg-surface-subtle px-6 py-4 sm:flex-row sm:justify-end md:px-10">
              <button type="button" onClick={() => choose("rejected")} className={secondary}>
                Rechazar cookies
              </button>
              <button type="button" onClick={() => choose("accepted")} className={primary}>
                Aceptar
              </button>
            </footer>
          </>
        )}
      </dialog>
    </>
  );
}
