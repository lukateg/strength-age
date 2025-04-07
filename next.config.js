/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse", "google-generativeai"],
  serverRuntimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
};

module.exports = nextConfig;
