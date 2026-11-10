import type { NextConfig } from "next";
import path from "node:path";

// GitHub Pages only serves static files. GITHUB_PAGES=true (set by .github/workflows/pages.yml) builds a static copy
// under a sub-path. That copy has no server: /api/chat and /api/lead do not exist there.
const pages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(pages ? { output: "export" as const, basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined, trailingSlash: true } : {}),
  // Indexable by default. SITE_INDEXABLE=false (e.g. for a staging project) adds noindex again.
  async headers() {
    if (pages || process.env.SITE_INDEXABLE !== "false") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // Product screenshots carry fine UI text: allow a higher quality than the default (75) so it stays crisp.
  images: { qualities: [75, 90], unoptimized: pages },
  cacheComponents: !pages, // partial prerendering needs a server
  partialPrefetching: !pages,
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
