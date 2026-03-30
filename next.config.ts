import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // SuperSplat viewer (iframe on superspl.at) fetches /splat-settings.json from your origin.
  async headers() {
    return [
      {
        source: "/splat-settings.json",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
