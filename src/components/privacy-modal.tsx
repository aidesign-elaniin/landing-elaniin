"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PolicyContent } from "./privacy-policy";
import { OPEN_PRIVACY_EVENT } from "./privacy-link";

/* Privacy policy modal, opened from any <PrivacyLink />. */
const primary =
  "inline-flex h-11 items-center justify-center rounded-button bg-elevate-blue px-5 font-display text-button font-medium text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring";

export function PrivacyModal() {
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
  return (
    <>
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
              <button type="button" onClick={close} className={primary}>
                Entendido
              </button>
            </footer>
          </>
        )}
      </dialog>
    </>
  );
}
