import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignore noisy OpenTelemetry warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /@opentelemetry/ },
      { module: /require-in-the-middle/ },
    ];

    // Ensure externals array exists
    config.externals = config.externals || [];

    // Prevent Webpack from bundling node-only telemetry modules
    config.externals.push({
      "@opentelemetry/api": "commonjs @opentelemetry/api",
      "@opentelemetry/instrumentation": "commonjs @opentelemetry/instrumentation",
      "@opentelemetry/auto-instrumentations-node":
        "commonjs @opentelemetry/auto-instrumentations-node",
    });

    return config;
  },
};

// Disable Inngest telemetry
process.env.INNGEST_DISABLE_TELEMETRY = "1";

export default nextConfig;
