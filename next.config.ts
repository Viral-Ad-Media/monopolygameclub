import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Keep links from the old WordPress site working.
  async redirects() {
    return [
      { source: "/2021/05/25/chess-game-understanding-chess-pieces", destination: "/chess-game-understanding-chess-pieces", permanent: true },
      { source: "/monopoly-2", destination: "/monopoly", permanent: true },
      { source: "/category/:slug", destination: "/:slug", permanent: true },
      { source: "/feed", destination: "/blog", permanent: false },
      { source: "/wp-admin/:path*", destination: "/admin", permanent: false },
      { source: "/wp-login.php", destination: "/admin/login", permanent: false },
      { source: "/:slug/amp", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
