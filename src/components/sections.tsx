import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Variant } from "@/data/variants";
import { LeadForm } from "./lead-form";
import { Cases } from "./cases";
import { Nav, VariantSwitch } from "./nav";
import { ButtonLink } from "./ui";
import { Logo } from "./logo";
import { Agent, AgentEntry } from "./agent";
import { PrivacyLink } from "./privacy-link";

/* Mode 1 (essential summary). Copy: data/variants.ts + the shared texts below, all from the final texts doc. */
export function Landing({ v }: { v: Variant }) {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero v={v} />
        <Clients />
        <Capabilities v={v} />
        <CasesSection v={v} />
        <Quality />
        <Backing />
        <Contact v={v} />
        <Closing v={v} />
      </main>
      <Footer />
      <Agent variante={v.id} />
    </>
  );
}

/* seal name in the copy -> official badge file */
const SEAL_BADGE: Record<string, string> = {
  "Google Cloud Partner": "gcp-cosell-select",
  "AWS Partner": "badge-clutch-aws",
};

function Hero({ v }: { v: Variant }) {
  const h = v.hero;
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-12 md:pb-28 md:pt-16 lg:pb-32 lg:pt-20">
      <div className="container-site relative grid-page">
        <div className="col-span-12 min-w-0 lg:col-span-9">
          <VariantSwitch current={v.id} className="rise mb-8" />
          <h1 className="rise break-words font-display text-display-lg font-semibold text-text-primary">
            {h.h1} <span className="text-inspire-blue">{h.accent}</span>
          </h1>
          <p className="rise measure-lead mt-6 text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
            {h.subtitle}
          </p>
          {/* main action: tell the agent what you need. The form is reached from the nav button and the closing section. */}
          <div className="rise mt-10" style={{ ["--i" as string]: 2 }}>
            <AgentEntry variante={v.id} />
          </div>
          {h.seals && (
            <div className="rise mt-6" style={{ ["--i" as string]: 3 }}>
              <ul className="flex flex-wrap items-center gap-4" aria-label="Alianzas">
                {h.seals.map((s) => (
                  <li key={s} className="flex h-16 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element -- ponytail: static SVG badge, nothing for next/image to optimize */}
                    <img src={`/certifications/${SEAL_BADGE[s]}.svg`} alt={s} className="h-full w-auto" />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="rise mt-12 flex max-w-[52ch] items-start gap-3 border-t border-border-default pt-5 font-display text-body font-medium text-text-primary" style={{ ["--i" as string]: 3 }}>
            <span className="mt-2 size-2 shrink-0 rounded-module bg-inspire-blue" aria-hidden="true" />
            {h.proof}
          </p>
        </div>
      </div>
    </section>
  );
}

const clients = [
  { file: "cinemark", name: "Cinemark" },
  { file: "papa-johns", name: "Papa Johns" },
  { file: "north-face", name: "The North Face" },
  { file: "iom", name: "IOM" },
  { file: "vital-strategies", name: "Vital Strategies" },
  { file: "infra-del-sur", name: "Infra del Sur" },
];

function ClientLogoImage({ file, name }: { file: string; name: string }) {
  return (
    <Image
      src={`/clients/${file}.svg`}
      alt={name}
      width={160}
      height={48}
      unoptimized
      className="h-10 w-auto max-w-none brightness-0 invert md:h-12"
    />
  );
}

/* A slow horizontal marquee on every screen size. Four copies of the list so the loop also fills very wide screens. */
function Clients() {
  return (
    <section className="bg-elaniin-black py-10 md:py-12">
      <div className="container-site reveal">
        <p id="clients-label" className="text-center font-display text-body-sm font-medium text-text-on-dark-secondary">
          Empresas e instituciones que ya operan con nuestra ingeniería.
        </p>

        <div className="mask-fade-x mt-8 overflow-hidden">
          <div className="marquee-track flex w-max" style={{ animationDuration: "56s" }}>{/* twice the copies, twice the time: same speed as before */}
            {[0, 1, 2, 3].map((copy) => (
              <ul key={copy} aria-hidden={copy > 0 ? true : undefined} aria-labelledby={copy === 0 ? "clients-label" : undefined} className="flex shrink-0 items-center gap-x-12 pr-12">
                {clients.map((c) => (
                  <li key={c.file} className="flex h-12 items-center">
                    <ClientLogoImage file={c.file} name={copy === 0 ? c.name : ""} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Problem title as the bridge sentence, then the four capability names (descriptions live in the chat). */
function Capabilities({ v }: { v: Variant }) {
  return (
    <section id="capacidades" className="section-y">
      <div className="container-site">
        <p className="reveal max-w-[26ch] break-words font-display text-h1 font-semibold text-text-primary">{v.problem}</p>
        {/* The four capabilities are one continuous process: a single line with four nodes that draws on scroll. */}
        <h2 className="reveal mt-16 max-w-[28ch] font-display text-h3 font-semibold text-text-primary md:mt-20">{v.capabilities.title}</h2>
        <ol className="process-line reveal mt-10 grid gap-y-10 lg:grid-cols-4 lg:gap-x-(--grid-gap)">
          {v.capabilities.names.map((name, i) => (
            <li key={name} className="flex min-w-0 gap-6 lg:flex-col lg:pr-4" style={{ ["--i" as string]: i }}>
              <i aria-hidden="true" className="shrink-0" />
              <div className="-mt-1.5 min-w-0 lg:mt-0">
                <span className="block font-mono text-code font-semibold text-inspire-blue" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-2 block font-display text-h4 font-medium text-text-primary">{name}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CasesSection({ v }: { v: Variant }) {
  return (
    <section id="casos" className="section-y bg-surface-subtle">
      <div className="container-site">
        <h2 className="reveal max-w-[24ch] break-words font-display text-h2 font-semibold text-text-primary">{v.cases.title}</h2>
        <Cases ids={v.cases.ids} />
      </div>
    </section>
  );
}

/* The four thresholds the final texts name ("Entre ellas: ..."). The other three dimensions are not in the doc, so they are not listed. */
const THRESHOLDS = [
  { value: "0", label: "vulnerabilidades críticas o altas" },
  { value: "0", label: "secretos expuestos" },
  { value: "80\u00a0%", label: "de cobertura mínima en pruebas automatizadas" },
  { value: "0", label: "dependencias circulares en la arquitectura" },
];

function Quality() {
  return (
    <section id="calidad" className="section-y">
      <div className="container-site">
        <div className="grid-page items-end">
          <h2 className="reveal col-span-12 min-w-0 max-w-[18ch] break-words font-display text-h1 font-semibold text-text-primary lg:col-span-6">
            Primer nivel no es una promesa. <span className="text-inspire-blue">Es un estándar.</span>
          </h2>
          <p className="reveal col-span-12 min-w-0 text-lead text-text-secondary lg:col-span-5 lg:col-start-8" style={{ ["--i" as string]: 1 }}>
            <strong className="font-display font-semibold text-text-primary">Software Nivel A:</strong> ninguna solución llega a producción sin superar siete dimensiones de evaluación con umbrales objetivos.
          </p>
        </div>

        {/* The gate, readable at a glance: seven checkpoints in a row, production only after the last one. */}
        <div className="mt-12 overflow-hidden rounded-card border border-border-default md:mt-16">
          <div className="flex flex-col gap-5 border-b border-border-default bg-surface-subtle pad-card md:flex-row md:items-center md:justify-between">
            <p className="mono-label text-micro text-text-secondary">Siete dimensiones de evaluación</p>
            <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2" aria-label="Siete dimensiones de evaluación antes de producción">
              {Array.from({ length: 7 }, (_, n) => (
                <li key={n} className="reveal grid size-8 place-items-center rounded-tag sm:size-9 bg-inspire-blue font-mono text-caption font-semibold text-white" style={{ ["--i" as string]: n + 1 }}>
                  {String(n + 1).padStart(2, "0")}
                </li>
              ))}
              <li className="reveal flex items-center gap-2 pl-1 font-display text-body-sm font-semibold text-text-primary" style={{ ["--i" as string]: 8 }}>
                <ArrowRight size={16} strokeWidth={2} className="text-inspire-blue" aria-hidden="true" />
                Producción
              </li>
            </ol>
          </div>
          <div className="pad-card">
            <p className="mono-label text-micro text-text-muted">Entre ellas</p>
            <ul className="mt-6 grid gap-x-(--grid-gap) gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {THRESHOLDS.map((t, n) => (
                <li key={t.label} className="reveal min-w-0 border-l-2 border-inspire-blue pl-4" style={{ ["--i" as string]: n }}>
                  <p className="font-display text-display-lg font-semibold tabular-nums text-text-primary">{t.value}</p>
                  <p className="mt-2 text-body-sm text-text-secondary">{t.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const gcpBadges = [
  { file: "gcp-cosell-select", alt: "Google Cloud Select, Co-sell Partner", w: 1833, h: 1287 },
  { file: "gcp-services-select", alt: "Google Cloud Select, Services Partner", w: 1833, h: 1241 },
];

const badges = [
  { file: "badge-clutch-aws", alt: "AWS Premier Tier Services", w: 94.1, h: 94.1 },
  { file: "badge-clutch-top-software-developers", alt: "Clutch Top Software Developers, El Salvador", w: 98.41, h: 109.62 },
  { file: "badge-clutch-top-staff", alt: "Clutch Top Staff Augmentation, El Salvador", w: 98.41, h: 109.62 },
];

function Backing() {
  const item = "reveal flex h-20 items-center md:h-24 xl:h-28";
  return (
    <section id="respaldo" className="section-y-compact border-t border-border-default">
      <div className="container-site grid-page items-center">
        <h2 className="reveal col-span-12 min-w-0 font-display text-h3 font-semibold text-text-primary lg:col-span-4">Respaldo verificable.</h2>
        <ul className="col-span-12 flex min-w-0 flex-wrap items-center gap-x-6 gap-y-6 lg:col-span-8 lg:justify-end xl:gap-x-8">
          {gcpBadges.map((b, i) => (
            <li key={b.file} className={item} style={{ ["--i" as string]: i }}>
              <Image src={`/certifications/${b.file}.svg`} alt={b.alt} width={b.w} height={b.h} unoptimized className="h-full w-auto" />
            </li>
          ))}
          {badges.map((b, i) => (
            <li key={b.file} className={item} style={{ ["--i" as string]: i + gcpBadges.length }}>
              <Image src={`/certifications/${b.file}.svg`} alt={b.alt} width={Math.round((96 * b.w) / b.h)} height={96} unoptimized className="h-full w-auto" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact({ v }: { v: Variant }) {
  return (
    <section id="contacto" className="section-y bg-surface-subtle">
      {/* The form takes the wider column so its fields and its two options sit side by side and the card stays short.
          The text column stretches to the card's height: title on top, the variant's proof anchored at the bottom. */}
      <div className="container-site grid-page items-stretch">
        <div className="col-span-12 flex min-w-0 flex-col justify-between gap-10 lg:col-span-5">
          <div>
            <h2 className="reveal max-w-[16ch] break-words font-display text-h1 font-semibold text-text-primary">Cuéntanos qué necesitas ejecutar.</h2>
            <p className="reveal measure-lead mt-5 text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
              Un especialista revisará tu proyecto y te contactará para una conversación técnica inicial, sin compromiso.
            </p>
          </div>
          <p className="reveal hidden items-start gap-3 border-t border-border-default pt-5 font-display text-body font-medium text-text-primary lg:flex" style={{ ["--i" as string]: 2 }}>
            <span className="mt-2 size-2 shrink-0 rounded-module bg-inspire-blue" aria-hidden="true" />
            {v.hero.proof}
          </p>
        </div>
        <div className="reveal col-span-12 min-w-0 lg:col-span-7" style={{ ["--i" as string]: 2 }}>
          <div className="rounded-card border border-border-default bg-surface-card pad-card shadow-card-rest">
            <LeadForm variante={v.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing({ v }: { v: Variant }) {
  return (
    <section className="relative isolate overflow-hidden section-y-statement bg-excellence-blue text-white">
      <div className="container-site relative text-center">
        <h2 className="reveal mx-auto max-w-[22ch] break-words font-display text-h1 font-semibold text-white">{v.closing.title}</h2>
        <ButtonLink href="#contacto" size="lg" className="reveal mt-10 max-[479px]:w-full">
          {v.closing.button}
        </ButtonLink>
      </div>
    </section>
  );
}

const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/elaniin", path: LINKEDIN_PATH },
  { label: "Clutch", href: "https://clutch.co/profile/elaniin", logo: "/certifications/clutch.svg", w: 88, h: 25 },
] as const;

function Footer() {
  const link = "nav-link relative rounded-button before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] text-body-sm text-text-on-dark-secondary transition-colors duration-base hover:text-white focus-ring-on-dark";
  return (
    <footer className="bg-elaniin-black text-white">
      <div className="container-site py-16">
        <div className="grid-page items-end border-b border-border-on-dark pb-12">
          <div className="col-span-12 min-w-0 md:col-span-6">
            <Logo tone="light" />
            <p className="mt-4 text-body-sm text-text-on-dark-secondary">Intelligent Software Company</p>
            <ul className="mt-6 flex gap-3" aria-label="Redes y reseñas">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 min-w-11 place-items-center rounded-button border border-border-on-dark text-text-on-dark-secondary transition-colors duration-base hover:bg-white/8 hover:text-white focus-ring-on-dark"
                  >
                    {"path" in s ? (
                      <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
                        <path d={s.path} />
                      </svg>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="mx-4 block h-4 bg-current"
                        style={{ width: (s.w / s.h) * 16, maskImage: `url(${s.logo})`, WebkitMaskImage: `url(${s.logo})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ul className="col-span-12 flex min-w-0 flex-wrap gap-x-8 gap-y-3 md:col-span-6 md:justify-end">
            <li>
              <a href="mailto:hello@elaniin.com" className={link}>hello@elaniin.com</a>
            </li>
            <li>
              <PrivacyLink className={link}>Política de privacidad</PrivacyLink>
            </li>
          </ul>
        </div>
        <p className="mono-label mt-8 text-caption text-text-on-dark-muted">© 2026 Elaniin</p>
      </div>
    </footer>
  );
}
