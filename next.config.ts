import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactCompiler: true,
   allowedDevOrigins: ["192.168.8.103"],

   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
