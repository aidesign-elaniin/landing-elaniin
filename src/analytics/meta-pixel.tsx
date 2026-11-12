import { SITE_URL } from "@/lib/site";

// Pixel "Elaniin Sales" (Georgina, Nov 12 2026). The ID is public by design: every site that uses the pixel shows it in its HTML.
const PIXEL_ID = "430445425499417";

// ponytail: only the build for the final domain carries the pixel, so the demo and local runs never send visits or test leads to Meta.
const LIVE = SITE_URL.includes("growth.elaniin.com");

const BASE = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`;

export function MetaPixel() {
  if (!LIVE) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BASE }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
