"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { LoadingProvider } from "@/providers/loading-context";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import { Toaster } from "@/components/ui/sonner";

import Sidebar from "@/components/sidebar";
import ErrorBoundary from "@/components/error-boundary";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActiveTestRoute = /^\/app\/tests\/[^/]+\/active$/.test(pathname);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider>
        <LoadingProvider>
          <ErrorBoundary>
            <ProgressProvider
              height="4px"
              color="#CF9FFF"
              options={{ showSpinner: false }}
              shallowRouting
            >
              <div className="flex h-screen">
                <div className="hidden md:flex">
                  {isActiveTestRoute ? null : <Sidebar />}
                </div>

                <div className="flex-1 pt-16 flex flex-col">
                  <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
              </div>
            </ProgressProvider>
          </ErrorBoundary>
          <Toaster expand={true} visibleToasts={4} />
        </LoadingProvider>
      </ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  );
}
