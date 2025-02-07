import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/sidebar";

import { ConvexClientProvider } from "@/providers/convex-client-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex h-screen ">
          <Sidebar />

          <div className="flex-1 pt-16 flex flex-col">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    </ConvexClientProvider>
  );
}
