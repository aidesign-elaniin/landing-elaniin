import type { Metadata } from "next";
import localFont from "next/font/local";
import { CookieConsent } from "@/components/cookie-consent";
import { Living } from "@/components/living";
import { Providers } from "@/components/providers";
import { INDEXABLE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

// Fonts are served from the project (@fontsource files), not fetched from Google Fonts at build time:
// a failed or odd response from Google broke the dev server and would break a deploy the same way.
const dm = localFont({
  variable: "--font-dm",
  display: "swap",
  src: [
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
});
const mono = localFont({
  variable: "--font-azeret",
  display: "swap",
  src: [
    { path: "../../node_modules/@fontsource/azeret-mono/files/azeret-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/azeret-mono/files/azeret-mono-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

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
    <html lang="es" className={`${dm.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
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
