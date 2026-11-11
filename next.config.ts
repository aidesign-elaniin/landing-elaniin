import type { NextConfig } from "next";
import path from "node:path";

// Static site: `next build` writes plain files to out/ (GitHub Pages today, GitLab later). There is no server,
// so the contact form posts straight to the n8n webhook (NEXT_PUBLIC_LEAD_WEBHOOK_URL).
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined, // "/landing-elaniin" on GitHub Pages, empty on its own domain
  trailingSlash: true,
  images: { unoptimized: true },
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
