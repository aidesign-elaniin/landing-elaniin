import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { software } from "./software/content";
import { cloud } from "./cloud/content";

export const dynamic = "force-static"; // static export: built once at build time

// One line per landing folder.
const landings = [software, cloud];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...landings.map((v) => ({ url: `${SITE_URL}/${v.id}`, changeFrequency: "monthly" as const, priority: 1 })),
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
