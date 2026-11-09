import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="container-site section-y">
      <h1 className="measure-head font-display text-h1 font-medium text-text-primary">No encontramos esta página</h1>
      <p className="measure-body mt-6 text-lead text-text-secondary">El enlace puede estar roto o la página ya no existe.</p>
      <Link href="/" className="nav-link mt-10 inline-block font-display text-body font-medium text-text-link focus-ring">
        Volver al inicio
      </Link>
    </main>
  );
}
