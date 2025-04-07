import "./globals.css";

import type { Metadata } from "next";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";

import { ClerkProvider } from "@clerk/nextjs";
import { LoadingProvider } from "@/providers/loading-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teach-me - AI-Powered Learning Platform",
  description:
    "An intelligent platform for creating and managing educational content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <LoadingProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex h-screen flex-col">
                <Header />

                <div className="flex-1 flex flex-col">
                  <main className="flex-1 overflow-y-auto">{children}</main>
                </div>
              </div>
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </LoadingProvider>
    </ClerkProvider>
  );
}
