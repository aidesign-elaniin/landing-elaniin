"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Check, Layers, Menu, MessageCircle, X, FileBadge } from "lucide-react";
import { Logo } from "./logo";

// icons only show in the mobile menu (lucide set, picked via Iconifika, Nov 11 2026)
const links = [
  { href: "#casos", label: "Casos", icon: BriefcaseBusiness },
  { href: "#capacidades", label: "Capacidades", icon: Layers },
  { href: "#respaldo", label: "Respaldo", icon: FileBadge },
];
const iconBox = "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]";

const FOCUSABLE = 'a[href], button:not([disabled])';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore) btn.current?.focus();
  }, []);

  // section in view, marked in the mobile menu like the current page in Bootstrap's menu
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const onScroll = () => {
      let hit: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) hit = id;
      }
      setCurrent(hit);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menu.current?.contains(t) && !btn.current?.contains(t)) close(false);
    };
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Node;
      if (!menu.current?.contains(t) && !btn.current?.contains(t)) close(false);
    };
    const mq = matchMedia("(min-width: 48rem)");
    const onMq = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("focusin", onFocus);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
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
                aria-label={open ? "Cerrar menú" : "Abrir menú"}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-default transition-colors duration-base hover:bg-surface-subtle focus-ring md:hidden"
              >
                {open ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu as a dropdown card under the button (team ref: Bootstrap's site menu), not a drawer. */}
        <div
          ref={menu}
          id="menu-movil"
          hidden={!open}
          className="absolute right-4 top-[calc(100%+0.5rem)] w-[min(19rem,calc(100vw-2rem))] rounded-[14px] border border-border-default bg-white p-1.5 shadow-menu md:hidden"
        >
          <nav aria-label="Menú móvil" className="flex flex-col">
            {links.map((l) => {
              const on = current === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={on ? "location" : undefined}
                  onClick={() => close(false)}
                  className={`flex h-12 items-center justify-between rounded-[10px] px-2.5 font-display text-body font-medium transition-colors duration-base focus-ring ${on ? "bg-elevate-blue text-white" : "text-text-primary hover:bg-surface-subtle"}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`${iconBox} ${on ? "bg-white/15" : "bg-surface-subtle text-elevate-blue"}`}>
                      <l.icon size={17} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {l.label}
                  </span>
                  {on && <Check size={18} strokeWidth={1.75} aria-hidden="true" />}
                </a>
              );
            })}
            <hr className="mx-2 my-1.5 border-border-default" />
            <a
              href="#contacto"
              onClick={() => close(false)}
              className="flex h-12 items-center justify-between gap-2 whitespace-nowrap rounded-[10px] px-2.5 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring"
            >
              <span className="flex items-center gap-3">
                <span className={`${iconBox} bg-elevate-blue text-white`}>
                  <MessageCircle size={17} strokeWidth={1.75} aria-hidden="true" />
                </span>
                Hablar con un especialista
              </span>
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

    </>
  );
}
