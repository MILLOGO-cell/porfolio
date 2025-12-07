import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**", // Autorise tous les chemins sous ce domaine
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**", // Autorise tous les chemins sous ce domaine
      },
    ],
  },
};

export default nextConfig;
