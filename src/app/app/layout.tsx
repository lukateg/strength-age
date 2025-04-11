import { Toaster } from "@/components/ui/toaster";

import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import Sidebar from "@/components/sidebar";

// TODO:
// - Remove theme provider and maybe toaster

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex h-screen">
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          <div className="flex-1 pt-16 flex flex-col">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    </ConvexClientProvider>
  );
}
