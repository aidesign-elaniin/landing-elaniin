"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "./logo";

const links = [
  { href: "#capacidades", label: "Capacidades" },
  { href: "#casos", label: "Casos" },
  { href: "#respaldo", label: "Respaldo" },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

export function Nav() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore) btn.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    if (!open) return;
    drawer.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !drawer.current) return;
      const items = drawer.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = matchMedia("(min-width: 48rem)");
    const onMq = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-button focus:border focus:border-border-default focus:bg-white focus:px-4 focus:py-2 focus:shadow-menu"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-40 border-b border-border-default bg-white/90 backdrop-blur">
        <div className="container-site flex h-16 items-center justify-between gap-6">
          <a href="#main" aria-label="Elaniin, ir al inicio" className="inline-flex h-11 shrink-0 items-center rounded-button focus-ring">
            <Logo />
          </a>
          <div className="flex items-center">
            <nav aria-label="Principal" className="hidden items-center gap-8 md:mr-6 md:flex">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="nav-link relative rounded-button text-body-sm text-text-secondary transition-colors duration-base hover:text-text-primary before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] focus-ring">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <a
                href="#contacto"
                className="btn-arrow inline-flex h-11 items-center gap-2 rounded-button bg-elevate-blue px-4 font-display text-button font-medium text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring md:h-10"
              >
                <span className="max-[479px]:hidden">Hablar con un especialista</span>
                <span className="min-[480px]:hidden">Hablar</span>
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
              <button
                ref={btn}
                type="button"
                aria-controls="menu-movil"
                aria-expanded={open}
                aria-label="Abrir menú"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-default transition-colors duration-base hover:bg-surface-subtle focus-ring md:hidden"
              >
                <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="scrim md:hidden" data-open={open} aria-hidden="true" onClick={() => close()} />
      <aside ref={drawer} id="menu-movil" aria-label="Menú" className="drawer bg-white md:hidden" data-open={open}>
        <div className="flex h-16 items-center justify-between border-b border-border-default px-5">
          <Logo />
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => close()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-button text-text-secondary transition-colors duration-base hover:bg-surface-subtle focus-ring"
          >
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Menú móvil" className="flex flex-col gap-1 p-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => close(false)}
              className="flex h-11 items-center rounded-button px-3 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => close(false)}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-button bg-elevate-blue font-display text-body font-medium text-white transition-colors duration-base hover:bg-blue-700 active:bg-blue-800 focus-ring"
          >
            Hablar con un especialista
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </a>
        </nav>
      </aside>
    </>
  );
}
