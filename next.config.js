/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "pdf-parse",
    "@ai-sdk/google",
    "@ai-sdk/openai",
    "@ai-sdk/anthropic",
  ],
  serverRuntimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/retrack0_data/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/retrack0_data/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/retrack0_data/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
