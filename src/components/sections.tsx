import Image from "next/image";
import { LeadForm } from "./lead-form";
import { ModuleField } from "./module-field";
import { ProjectShowcase } from "./project-showcase";
import { Cases } from "./cases";
import { ButtonLink } from "./ui";
import { Logo } from "./logo";
import { PrivacyLink } from "./privacy-link";

export function Hero() {
  return (
    <section id="contacto" className="hero-fill relative isolate overflow-hidden section-y" style={{ ["--section-y" as string]: "96px" }}>
      <ModuleField />
      <div className="container-site relative grid-page items-center">
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <h1 className="rise break-words font-display text-display-lg font-medium text-text-primary">
            Ejecutemos tu próximo <span className="text-elevate-blue">proyecto tecnológico.</span>
          </h1>
          <p className="rise measure-lead mt-6 text-lead text-text-secondary" style={{ ["--i" as string]: 1 }}>
            Desarrollo de software, innovación y proyectos de Google Cloud para empresas e instituciones que necesitan convertir sus objetivos en soluciones concretas.
          </p>
        </div>
        <div className="rise col-span-12 min-w-0 lg:col-span-5 lg:col-start-8" style={{ ["--i" as string]: 2 }}>
          <div className="relative rounded-card border border-border-default bg-surface-card pad-card shadow-product">
            <h2 className="font-display text-h3 font-medium text-text-primary">Hablemos de tu proyecto</h2>
            <p className="mb-6 mt-2 text-body text-text-secondary">Completa tus datos y cuéntanos qué necesita tu organización.</p>
            <LeadForm />
          </div>
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
      height={40}
      unoptimized
      className="h-8 w-auto max-w-none opacity-70 brightness-0 invert transition-opacity duration-base hover:opacity-100"
    />
  );
}

/* Wide screens (1280px and up): static and centered. Smaller screens: a slow horizontal marquee, so the section does not grow taller. */
export function Clients() {
  return (
    <section className="bg-elaniin-black py-10 md:py-12">
      <div className="container-site reveal">
        <p id="clients-label" className="mono-label text-center text-micro font-medium text-text-on-dark-secondary">
          Clientes que confían en nosotros
        </p>

        <ul aria-labelledby="clients-label" className="mx-auto mt-8 hidden items-center justify-center gap-x-14 xl:flex">
          {clients.map((c) => (
            <li key={c.file} className="flex h-10 items-center">
              <ClientLogoImage file={c.file} name={c.name} />
            </li>
          ))}
        </ul>

        <div className="mask-fade-x mt-8 overflow-hidden xl:hidden">
          <div className="marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 ? true : undefined} aria-labelledby={copy === 0 ? "clients-label" : undefined} className="flex shrink-0 items-center gap-x-12 pr-12">
                {clients.map((c) => (
                  <li key={c.file} className="flex h-10 items-center">
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

export function Services() {
  return (
    <section id="servicios" className="section-y">
      <div className="container-site">
        <h2 className="reveal max-w-[30ch] break-words font-display text-h2 lg:max-w-none lg:whitespace-nowrap font-medium text-text-primary">Tu proyecto avanza cuando tienes el equipo correcto</h2>
        <div className="grid-page mt-12">
          <ProjectShowcase />
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experiencia" className="section-y">
      <div className="container-site">
        <h2 className="reveal max-w-[30ch] break-words font-display text-h2 font-medium lg:max-w-none lg:whitespace-nowrap text-text-primary">Experiencia que respalda la ejecución</h2>

        <h3 className="reveal mt-12 font-display text-h3 font-medium text-text-primary">Casos destacados</h3>
        <Cases />
      </div>
    </section>
  );
}

const badges = [
  { file: "badge-clutch-aws", alt: "AWS Partner, Premier Tier Services", w: 94.1, h: 94.1 },
  { file: "badge-clutch-global", alt: "Clutch Global, primavera 2024", w: 118.37, h: 103.6 },
  { file: "badge-clutch-top-software-developers", alt: "Clutch Top Software Developers, El Salvador 2024", w: 98.41, h: 109.62 },
  { file: "badge-clutch-top-staff", alt: "Clutch Top Staff Augmentation Company, El Salvador 2024", w: 98.41, h: 109.62 },
];

const gcpBadges = [
  { file: "gcp-cosell-select", alt: "Google Cloud Select, Co-sell Partner", w: 1833, h: 1287 },
  { file: "gcp-services-select", alt: "Google Cloud Select, Services Partner", w: 1833, h: 1241 },
  { file: "gws-cosell-services-select", alt: "Google Workspace Select, Co-sell & Services Partner", w: 1833, h: 1287 },
];

export function Certifications() {
  return (
    <section className="section-y-compact bg-elaniin-black">
      <div className="container-site">
        <h2 className="mono-label reveal text-center text-micro font-medium text-text-on-dark-secondary">Certificaciones y reconocimientos</h2>
        <ul className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-6 md:gap-x-6 xl:gap-x-8">
          {gcpBadges.map((b, i) => (
            <li key={b.file} className="reveal flex h-16 items-center md:h-20 xl:h-24" style={{ ["--i" as string]: i }}>
              <Image
                src={`/certifications/${b.file}.svg`}
                alt={b.alt}
                width={b.w}
                height={b.h}
                unoptimized
                className="h-full w-auto opacity-90 grayscale contrast-200 transition duration-base ease-[cubic-bezier(0.55,0,1,0.45)] hover:scale-110 hover:opacity-100 hover:grayscale-0 hover:contrast-100"
              />
            </li>
          ))}
          {badges.map((b, i) => (
            <li key={b.file} className="reveal flex h-16 items-center md:h-20 xl:h-24" style={{ ["--i" as string]: i + gcpBadges.length }}>
              <Image
                src={`/certifications/${b.file}.svg`}
                alt={b.alt}
                width={Math.round((96 * b.w) / b.h)}
                height={96}
                unoptimized
                className="h-full w-auto brightness-0 invert opacity-80 transition duration-base ease-[cubic-bezier(0.55,0,1,0.45)] hover:scale-110 hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden section-y-statement bg-excellence-blue text-white">
      <ModuleField tone="dark" />
      <div className="container-site relative text-center">
        <h2 className="reveal mx-auto max-w-[24ch] break-words font-display text-h1 font-medium text-white lg:max-w-none lg:whitespace-nowrap">Hagamos avanzar tu próximo proyecto.</h2>
        <ButtonLink href="#contacto" size="lg" className="reveal mt-10 max-sm:w-full">
          Conversemos sobre tu proyecto
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

export function Footer() {
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
