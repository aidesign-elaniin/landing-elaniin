import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Elaniin",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: SITE_DESCRIPTION,
      foundingDate: "2014",
      address: { "@type": "PostalAddress", addressCountry: "SV" },
      email: "hello@elaniin.com",
      sameAs: ["https://www.linkedin.com/company/elaniin", "https://clutch.co/profile/elaniin"],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Desarrollo de software", provider: { "@id": `${SITE_URL}/#organization` } } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Cloud: migración, APIs con Apigee y operación en la nube", provider: { "@id": `${SITE_URL}/#organization` } } },
      ],
    },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Elaniin", inLanguage: "es", publisher: { "@id": `${SITE_URL}/#organization` } },
  ],
};

export function JsonLd() {
  // "<" escaped so the payload can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
