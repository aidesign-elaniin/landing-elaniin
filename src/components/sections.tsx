import Image from "next/image";
import type { Variant } from "@/data/variants";
import { LeadForm } from "./lead-form";
import { CapTiles, Cases, HeroStack, QualityGate } from "./cases";
import { Nav } from "./nav";
import { Logo } from "./logo";
import { ButtonLink } from "./ui";
import { PrivacyLink } from "./privacy-link";
import { asset } from "@/lib/site";

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
      </main>
      <Footer />
    </>
  );
}

/* seal that floats on the hero asset, one per landing */
const HERO_SEAL = { software: "badge-clutch-top-software-developers", cloud: "gcp-services-select" } as const;

function Hero({ v }: { v: Variant }) {
  const h = v.hero;
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-12 md:pb-28 md:pt-16 lg:pb-32 lg:pt-20">
      <div className="container-site relative grid-page gap-y-0">
        <div className="col-span-12 min-w-0 lg:col-span-7">
          <h1 className="rise break-words font-display text-display-lg font-semibold text-text-primary">
            {h.h1} <span className="text-inspire-blue">{h.accent}</span>
          </h1>
          <p className="rise measure-lead mt-6 text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
            {h.subtitle}
          </p>
          {/* main action: the contact form further down; the cases are the second path */}
          <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ ["--i" as string]: 2 }}>
            <ButtonLink href="#contacto" size="lg" className="max-[479px]:w-full">
              {h.button}
            </ButtonLink>
            <a href="#casos" className="inline-flex h-12 items-center justify-center rounded-button border border-border-strong px-6 font-display text-button-lg font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring max-[479px]:w-full">
              Ver casos
            </a>
          </div>
          <p className="rise mt-10 flex max-w-[52ch] items-start gap-3 border-t border-border-default pt-5 font-display text-body font-medium text-text-primary" style={{ ["--i" as string]: 3 }}>
            <span className="mt-2 size-2 shrink-0 rounded-module bg-inspire-blue" aria-hidden="true" />
            {h.proof}
        </p>
        </div>
        {/* proof next to the promise: the first two cases of this landing, stacked in space */}
        <HeroStack ids={v.cases.ids} sello={HERO_SEAL[v.id]} />
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
      src={asset(`/clients/${file}.svg`)}
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

/* Problem title as the bridge sentence, then the four capability names (each with its description and chips). */
function Capabilities({ v }: { v: Variant }) {
  return (
    <section id="capacidades" className="section-y">
      <div className="container-site">
        <p className="reveal max-w-[26ch] break-words font-display text-h1 font-semibold text-text-primary">{v.problem}</p>
        {/* The four capabilities are parallel sub-services, not steps: a mosaic of peers (see CapTiles). */}
        <h2 className="reveal mt-16 max-w-[28ch] font-display text-h3 font-semibold text-text-primary md:mt-20">{v.capabilities.title}</h2>
        <CapTiles grupo={v.id} />
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

/* Thresholds and wording from the team (Georgina, Nov 10 2026). Do not reword without the team. */
const THRESHOLDS = [
  { value: "0", label: "vulnerabilidades críticas conocidas" },
  { value: "0", label: "credenciales expuestas" },
  { value: "80\u00a0%", label: "mínimo de cobertura en pruebas automáticas" },
  { value: "100\u00a0%", label: "de entregas revisadas por un ingeniero" },
];

function Quality() {
  return (
    <section id="calidad" className="section-y">
      <div className="container-site">
        <div className="grid-page items-end">
          <h2 className="reveal col-span-12 min-w-0 max-w-[20ch] break-words font-display text-h1 font-semibold text-text-primary lg:col-span-7">
            Software crítico exige <span className="text-inspire-blue">un estándar que no se negocia.</span>
          </h2>
          <p className="reveal col-span-12 min-w-0 text-lead text-text-secondary lg:col-span-4 lg:col-start-9" style={{ ["--i" as string]: 1 }}>
            Lo aplicamos en cada solución, sin importar su tamaño.
          </p>
        </div>

        <QualityGate title="Nada llega a producción sin cumplirlo." thresholds={THRESHOLDS} />
      </div>
    </section>
  );
}

// Exported from the brand file "Badges elaniin 2.0.ai" (Nov 10 2026), one SVG per badge, untouched.
const gcpBadges = [
  { file: "gcp-services-select", alt: "Google Cloud Select, Services Partner", w: 546, h: 373 },
  { file: "gcp-cosell-select", alt: "Google Cloud Select, Co-sell Partner", w: 552, h: 377 },
  { file: "gws-cosell-services-select", alt: "Google Workspace Select, Co-sell & Services Partner", w: 553, h: 377 },
];

const badges = [
  { file: "badge-clutch-aws", alt: "AWS Partner, Premier Tier Services", w: 377, h: 377 },
  { file: "badge-clutch-top-software-developers", alt: "Clutch Top Software Developers, El Salvador 2024", w: 388, h: 431 },
  { file: "badge-clutch-top-staff", alt: "Clutch Top Staff Augmentation Company, El Salvador 2024", w: 388, h: 430 },
];

function Backing() {
  const item = "reveal flex h-20 items-center md:h-24";
  return (
    <section id="respaldo" className="section-y-compact border-t border-border-default">
      <div className="container-site grid-page items-center">
        <h2 className="reveal col-span-12 min-w-0 font-display text-h3 font-semibold text-text-primary">Respaldo verificable.</h2>
        {/* six badges: one full-width row under the title, so they stay on a single line on desktop */}
        <ul className="col-span-12 flex min-w-0 flex-wrap items-center gap-x-6 gap-y-6 xl:gap-x-10">
          {gcpBadges.map((b, i) => (
            <li key={b.file} className={item} style={{ ["--i" as string]: i }}>
              <Image src={asset(`/certifications/${b.file}.svg`)} alt={b.alt} width={b.w} height={b.h} unoptimized className="h-full w-auto" />
            </li>
          ))}
          {badges.map((b, i) => (
            <li key={b.file} className={item} style={{ ["--i" as string]: i + gcpBadges.length }}>
              <Image src={asset(`/certifications/${b.file}.svg`)} alt={b.alt} width={Math.round((96 * b.w) / b.h)} height={96} unoptimized className="h-full w-auto" />
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
                        style={{ width: (s.w / s.h) * 16, maskImage: `url(${asset(s.logo)})`, WebkitMaskImage: `url(${asset(s.logo)})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
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
