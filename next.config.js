/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance and SEO optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: ["strengthage.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@/components/ui"],
  },

  serverExternalPackages: [
    "pdf-parse",
    "@ai-sdk/google",
    "@ai-sdk/openai",
    "@ai-sdk/anthropic",
  ],
  serverRuntimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },

  // Security headers for SEO and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
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
