import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**",
      },
      new URL(`${process.env.LYRION_URL}/music/*/cover`),
    ],
  },
  /* config options here */
};

export default nextConfig;
