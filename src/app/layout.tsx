import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Instrument_Sans } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { Living } from "@/components/living";
import { Providers } from "@/components/providers";
import { INDEXABLE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const dm = DM_Sans({ variable: "--font-dm", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | Elaniin" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, type: "website", locale: "es_SV", siteName: "Elaniin", url: "/" },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${instrument.variable} ${dm.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Providers>
          <Living />
          <div className="relative z-10">{children}</div>
          <CookieConsent />
          <JsonLd />
        </Providers>
      </body>
    </html>
  );
}
