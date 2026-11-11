import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { HOME_ID, pathOf, variants } from "@/data/variants";

export const dynamic = "force-static"; // static export: built once at build time

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...Object.keys(variants).map((id) => ({
      url: id === HOME_ID ? SITE_URL : `${SITE_URL}${pathOf(id)}`,
      changeFrequency: "monthly" as const,
      priority: id === HOME_ID ? 1 : 0.9,
    })),
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
