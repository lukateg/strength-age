"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { ThemeProvider } from "@/providers/theme-provider";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

import { Toaster } from "@/components/ui/toaster";

import Sidebar from "@/components/sidebar";

// TODO:
// - Remove theme provider and maybe toaster

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTestRoute =
    /^\/app\/tests\/[^/]+$/.test(pathname) &&
    pathname !== "/app/tests/generate-test";

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ConvexQueryCacheProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">
            <div className="hidden md:flex">
              {isTestRoute ? null : <Sidebar />}
            </div>

            <div className="flex-1 pt-16 flex flex-col">
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </ConvexQueryCacheProvider>
    </ConvexProviderWithClerk>
  );
}
