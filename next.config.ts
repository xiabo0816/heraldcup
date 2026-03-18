import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com"
      },
      {
        protocol: "https",
        hostname: "api.opendota.com"
      }
    ]
  }
};

export default nextConfig;
