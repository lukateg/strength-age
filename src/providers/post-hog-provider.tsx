// app/providers.tsx
"use client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useAuth, useUser } from "@clerk/nextjs";

// Component to handle page event tracking
function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 👉 Add the hooks into the component
  // const { isSignedIn, userId } = useAuth();
  // const { user } = useUser();

  useEffect(() => {
    if (pathname) {
      // Capture page view as a custom event
      posthog.capture("page_viewed", {
        path: pathname,
        search: searchParams.toString(),
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
      });

      // Also capture pageview for PostHog's built-in analytics
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        $pathname: pathname,
        $search: searchParams.toString(),
        $title: document.title,
        $referrer: document.referrer,
      });
    }
  }, [pathname, searchParams]);

  // Add page leave tracking
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Capture page leave event when user is about to leave the page
      posthog.capture("$pageleave", {
        $current_url: window.location.href,
        $pathname: pathname,
        $search: searchParams.toString(),
        $title: document.title,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Capture page leave when tab becomes hidden (user switches tabs or minimizes)
        posthog.capture("$pageleave", {
          $current_url: window.location.href,
          $pathname: pathname,
          $search: searchParams.toString(),
          $title: document.title,
        });
      }
    };

    // Listen for page unload events
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Listen for visibility changes (tab switching, minimizing)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, searchParams]);

  // useEffect(() => {
  //   // 👉 Check the sign in status and user info,
  //   //    and identify the user if they aren't already
  //   if (isSignedIn && userId && user && !posthog._isIdentified()) {
  //     // 👉 Identify the user
  //     posthog.identify(userId, {
  //       email: user.primaryEmailAddress?.emailAddress,
  //       username: user.username,
  //     });
  //   }

  //   // 👉 Reset the user if they sign out
  //   if (!isSignedIn && posthog._isIdentified()) {
  //     posthog.reset();
  //   }
  // }, [user, isSignedIn, userId]);
  return null;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageTracker />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
