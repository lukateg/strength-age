/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pdf-parse", "@ai-sdk/google", "@ai-sdk/openai"],
  serverRuntimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
};

module.exports = nextConfig;
