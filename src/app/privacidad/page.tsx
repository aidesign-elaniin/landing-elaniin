import type { Metadata } from "next";
import Link from "next/link";
import { PolicyContent } from "@/components/privacy-policy";

export const metadata: Metadata = { title: "Política de privacidad", description: "Cómo Elaniin recopila, usa y protege tus datos personales al contactarnos o visitar este sitio.", alternates: { canonical: "/privacidad" } };

export default function Privacidad() {
  return (
    <main id="main" className="container-site section-y">
      <h1 className="measure-head font-display text-h1 font-medium text-text-primary">Política de privacidad</h1>
      <div className="measure-body mt-10">
        <PolicyContent headingLevel={2} />
      </div>
      <Link href="/" className="nav-link mt-12 inline-block font-display text-body font-medium text-text-link focus-ring">
        Volver al inicio
      </Link>
    </main>
  );
}
