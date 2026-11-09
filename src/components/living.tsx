"use client";

import { useEffect } from "react";

const fmt = (n: number, dec: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

/* Page-wide liveliness: pointer spotlight, card glow, scroll reveal and count-up. */
export function Living() {
  useEffect(() => {
    // Wait for hydration to finish before touching server-rendered classes (avoids a mismatch warning).
    let cleanup = () => {};
    const start = setTimeout(() => {
      cleanup = init();
    }, 300);
    return () => {
      clearTimeout(start);
      cleanup();
    };
  }, []);

  return <div className="spotlight" aria-hidden="true" />;
}

function init() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  const rio = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          rio.unobserve(en.target);
        }
      }),
    { threshold: 0.15 },
  );
  const watch = () => document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => rio.observe(el));
  watch();
  const mo = new MutationObserver(watch);
  mo.observe(document.body, { childList: true, subtree: true });

  const countUp = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.count ?? "0");
    const dec = parseInt(el.dataset.decimals ?? "0", 10);
    const pre = el.dataset.prefix ?? "";
    const suf = el.dataset.suffix ?? "";
    if (reduce) return;
    let t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = pre + fmt(target * (1 - Math.pow(1 - p, 3)), dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          countUp(en.target as HTMLElement);
          cio.unobserve(en.target);
        }
      }),
    { threshold: 0.5 },
  );
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  let onMove: ((e: PointerEvent) => void) | undefined;
  if (!reduce) {
    onMove = (e) => {
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
      const card = (e.target as Element).closest<HTMLElement>(".card-glow");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--cx", `${e.clientX - r.left}px`);
        card.style.setProperty("--cy", `${e.clientY - r.top}px`);
      }
    };
    addEventListener("pointermove", onMove, { passive: true });
  }
  return () => {
    rio.disconnect();
    cio.disconnect();
    mo.disconnect();
    if (onMove) removeEventListener("pointermove", onMove);
  };
}
