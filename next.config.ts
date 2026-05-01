import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root so Turbopack stops inferring `./app` as the
    // project. Resolves "We couldn't find the Next.js package" errors.
    root: __dirname,
  },
};

export default nextConfig;
