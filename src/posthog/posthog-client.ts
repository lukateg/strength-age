import { PostHog } from "posthog-node";

export const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: "https://teach-me-app.netlify.app",
  // host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});

// await posthogClient.shutdown();
