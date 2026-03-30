import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Lock this app as the Turbopack root so a parent-folder lockfile does not steal the workspace. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  /** Hides the floating route/dev indicator in development (not part of your app UI). */
  devIndicators: false,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
