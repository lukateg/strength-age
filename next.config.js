/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverActions: true,
    serverComponentsExternalPackages: ["pdf-parse", "google-generativeai"],
  },
  serverRuntimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
};

module.exports = nextConfig;
