"use client";


import { Eye } from "lucide-react";
import { AiIcon } from "./icons/elaniin-icons";
import { Glow, themes } from "./cases";
import { QualityStack } from "./iso/quality-stack";

const theme = themes.excellence;

const report = [
  ["seguridad", "0 critical/high · 0 secretos"],
  ["fiabilidad", "0 bugs · reliability A"],
  ["mantenibilidad", "rating A · máx. 500 LOC por clase"],
  ["cobertura", "≥ 80% en pruebas automáticas"],
  ["arquitectura", "0 ciclos · ≤ 5 god nodes"],
  ["madurez", "0 críticos abiertos"],
] as const;

const cards = [
  {
    Icon: AiIcon,
    title: "IA que potencia nuestra ingeniería",
    text: "Nuestros ingenieros integran IA en su flujo de trabajo para ampliar sus capacidades y desarrollar soluciones con mayor eficiencia.",
  },
  {
    Icon: Eye,
    title: "Visibilidad sobre tu proyecto",
    text: "Trabajas con un equipo asignado, conoces quién desarrolla tu solución y revisas los avances al cierre de cada sprint.",
  },
] as const;

export function Method() {
  return (
    <section id="metodo" className="section-y">
      <div className="container-site">
        <h2 className="reveal max-w-[30ch] break-words font-display text-h2 font-medium text-text-primary md:max-w-[36ch]">
          De la estrategia a producción, <span className="text-elevate-blue">con inteligencia en cada etapa.</span>
        </h2>

        <div className="grid-page mt-12">
          <article
            className={`reveal relative isolate col-span-12 flex min-w-0 flex-col gap-8 overflow-hidden rounded-card pad-card lg:col-span-7 ${theme.card}`}
            style={{ ["--i" as string]: 0 }}
          >
            <Glow {...theme.glow} />
            <div>
              <h3 className="font-display text-h3 font-medium text-white">Software Nivel A</h3>
              <p className="mt-3 max-w-[48ch] text-body text-text-on-dark-secondary">
                Cada solución pasa por siete dimensiones de evaluación con umbrales objetivos antes de llegar a producción.
              </p>
            </div>

            <div className="relative mx-auto flex w-full max-w-[600px] flex-col gap-4">
              <div className="w-full max-w-[400px] self-start">
                <QualityStack />
              </div>

              <figure className="min-w-0 rounded-card border border-border-on-dark-strong bg-elaniin-black/95 p-4 shadow-product md:absolute md:right-0 md:top-0 md:w-48 md:p-3">
                <figcaption className="sr-only">Reporte de calidad Nivel A</figcaption>
                <div className="font-mono text-[10px] leading-4 md:text-[10px]">
                  <p className="mb-2">
                    <span className="text-text-on-dark-accent">nivel-a</span> <span className="text-text-on-dark-secondary">--report</span>
                  </p>
                  <dl className="space-y-1.5">
                    {report.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-text-on-dark-muted">{k}</dt>
                        <dd className="min-w-0 break-words text-white">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </figure>
            </div>
          </article>

          <div className="col-span-12 grid min-w-0 gap-grid lg:col-span-5 lg:grid-rows-2">
            {cards.map(({ Icon, title, text }, i) => (
              <article
                key={title}
                className="reveal flex min-w-0 flex-col justify-between gap-6 rounded-card border border-border-default bg-surface-card pad-card"
                style={{ ["--i" as string]: i + 1 }}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-default bg-white text-elevate-blue">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-h4 font-medium text-text-primary">{title}</h3>
                  <p className="mt-3 text-body text-text-secondary">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
