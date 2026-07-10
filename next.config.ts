import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  outputFileTracingIncludes: {
    "*": [
      "public/**/*",
      ".next/static/**/*"
    ]
  }
};

export default nextConfig;
