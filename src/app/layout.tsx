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
    "An intelligent platform for creating and managing educational content with AI-generated tests, quizzes, and personalized learning experiences.",
  icons: {
    icon: "/icon-without-background.png",
    shortcut: "/icon-without-background.png",
    apple: "/icon-without-background.png",
  },
  keywords: [
    "AI learning",
    "educational platform",
    "online education",
    "AI-powered tests",
    "study platform",
    "learning management",
    "AI education",
    "smart learning",
  ],
  authors: [{ name: "Teach-me Team" }],
  creator: "Teach-me",
  publisher: "Teach-me",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Teach-me - AI-Powered Learning Platform",
    description:
      "An intelligent platform for creating and managing educational content with AI-generated tests, quizzes, and personalized learning experiences.",
    siteName: "Teach-me",
    images: [
      {
        url: "/teach-me-logo.png",
        width: 1200,
        height: 630,
        alt: "Teach-me - AI-Powered Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teach-me - AI-Powered Learning Platform",
    description:
      "An intelligent platform for creating and managing educational content with AI-generated tests, quizzes, and personalized learning experiences.",
    images: ["/teach-me-logo.png"],
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
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
