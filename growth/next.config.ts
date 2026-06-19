import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Common mistaken paths (e.g. locale prefix) → YouthMentor home.
   */
  async redirects() {
    return [
      { source: "/zh", destination: "/youthmentor", permanent: false },
      { source: "/zh/:path*", destination: "/youthmentor/:path*", permanent: false },
      { source: "/en", destination: "/youthmentor", permanent: false },
      { source: "/en/:path*", destination: "/youthmentor/:path*", permanent: false },
    ];
  },
};

export default nextConfig;
