"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { UserProvider } from "@/providers/user-provider";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import { Toaster } from "@/components/ui/sonner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActiveTestRoute = /^\/app\/tests\/[^/]+\/active$/.test(pathname);

  // Add noindex meta tags for protected pages
  useEffect(() => {
    // Set noindex meta tag for all protected app pages
    const existingNoIndex = document.querySelector('meta[name="robots"]');
    if (existingNoIndex) {
      existingNoIndex.setAttribute("content", "noindex, nofollow");
    } else {
      const metaRobots = document.createElement("meta");
      metaRobots.name = "robots";
      metaRobots.content = "noindex, nofollow";
      document.head.appendChild(metaRobots);
    }

    // Also add X-Robots-Tag equivalent via meta tag
    const existingXRobots = document.querySelector('meta[name="googlebot"]');
    if (existingXRobots) {
      existingXRobots.setAttribute("content", "noindex, nofollow");
    } else {
      const metaGooglebot = document.createElement("meta");
      metaGooglebot.name = "googlebot";
      metaGooglebot.content = "noindex, nofollow";
      document.head.appendChild(metaGooglebot);
    }

    // Cleanup function to remove meta tags when leaving protected area
    return () => {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      const googlebotMeta = document.querySelector('meta[name="googlebot"]');
      if (robotsMeta) robotsMeta.remove();
      if (googlebotMeta) googlebotMeta.remove();
    };
  }, []);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider>
        {/* <ErrorBoundary> */}
        <UserProvider>
          <ProgressProvider
            height="4px"
            color="#CF9FFF"
            options={{ showSpinner: false }}
            shallowRouting
          >
            <div className="flex h-screen">
              <div className="hidden md:flex">
                {/* {isActiveTestRoute ? null : <Sidebar />} */}
              </div>

              <div className="flex-1 pt-16 flex flex-col">
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </div>
          </ProgressProvider>
        </UserProvider>
        {/* </ErrorBoundary> */}
        <Toaster expand={true} visibleToasts={4} />
      </ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  );
}
