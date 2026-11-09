import { existsSync } from "node:fs";
import path from "node:path";
import { SectorCards } from "./sector-cards";

/*
  Logos por sector. Cada cliente tiene un `slug`: para mostrar su logo basta con guardar el archivo en
  public/sectors/<slug>.svg (o .png / .webp). Sin archivo se muestra el nombre como marcador.
  Los SVG vienen calibrados (viewBox 185 × 43): se muestran a su tamaño, sin escalas extra.
*/
type Client = { name: string; slug: string };

const sectors: { key: "privado" | "publico"; label: string; text: string; clients: Client[] }[] = [
  {
    key: "privado",
    label: "Sector privado",
    text: "Modernizamos sistemas críticos sin detener tu operación. Experiencia en banca, finanzas reguladas, seguros, retail y e-commerce.",
    clients: [
      { name: "Procesar", slug: "procesar" },
      { name: "Invercap Afore", slug: "invercap-afore" },
      { name: "Banco Azul", slug: "banco-azul" },
      { name: "Credicomer", slug: "credicomer" },
      { name: "Diimo", slug: "diimo" },
      { name: "Abaco", slug: "abaco" },
      { name: "Donkeys", slug: "donkeys" },
      { name: "Jostens", slug: "jostens" },
      { name: "Robot Sea Monster", slug: "robot-sea-monster" },
    ],
  },
  {
    key: "publico",
    label: "Sector público",
    text: "Soluciones con documentación, seguridad y trazabilidad, para instituciones que necesitan resultados verificables y un aliado en la contratación pública.",
    clients: [
      { name: "MTPS", slug: "mtps" },
      { name: "TSE", slug: "tse" },
      { name: "IFES", slug: "ifes" },
      { name: "OIM", slug: "oim" },
      { name: "DGME", slug: "dgme" },
    ],
  },
];

function logoFor(slug: string) {
  for (const ext of ["svg", "png", "webp"]) {
    if (existsSync(path.join(process.cwd(), "public", "sectors", `${slug}.${ext}`))) return `/sectors/${slug}.${ext}`;
  }
  return null;
}

export function Sectors() {
  const items = sectors.map((s) => ({ ...s, clients: s.clients.map((c) => ({ name: c.name, src: logoFor(c.slug) })) }));
  return (
    <section className="bg-elaniin-black section-y text-white">
      <div className="container-site">
        <h2 className="reveal max-w-[30ch] break-words font-display text-h2 font-medium text-white md:max-w-[36ch]">Cada industria tiene sus propios desafíos. Nosotros sabemos cómo resolverlos.</h2>
        <p className="reveal measure-lead mt-6 text-lead text-text-on-dark-secondary" style={{ ["--i" as string]: 1 }}>
          Desde modernizar sistemas bancarios hasta digitalizar trámites públicos, entendemos las exigencias de cada sector y desarrollamos soluciones alineadas con sus necesidades.
        </p>
        <SectorCards items={items} />
      </div>
    </section>
  );
}
