import "./globals.css";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/header";

import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PHProvider } from "@/providers/post-hog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teach-me - AI-Powered Learning Platform",
  description:
    "An intelligent platform for creating and managing educational content",
};

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <PHProvider>
        <TooltipProvider>
          <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} gradient-bg`}>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <div className="flex h-screen flex-col container mx-auto">
                  <Header />

                  <div className="flex-1 flex flex-col">
                    <main className="flex-1 overflow-y-auto">{children}</main>
                  </div>
                </div>
              </ThemeProvider>
            </body>
          </html>
        </TooltipProvider>
      </PHProvider>
    </ClerkProvider>
  );
}
