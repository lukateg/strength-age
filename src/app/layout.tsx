import "./globals.css";

import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { PHProvider } from "@/providers/post-hog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Starter Kit - Your Project Name",
  description:
    "A starter kit for building your next project with customizable features and components.",
  icons: {
    icon: "/default-icon.png",
    shortcut: "/default-icon.png",
    apple: "/default-icon.png",
  },
  keywords: [
    "starter kit",
    "project template",
    "web development",
    "customizable components",
    "modern web app",
  ],
  authors: [{ name: "Your Team Name" }],
  creator: "Your Company",
  publisher: "Your Company",
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
    title: "Starter Kit - Your Project Name",
    description:
      "A starter kit for building your next project with customizable features and components.",
    siteName: "Your Project Name",
    images: [
      {
        url: "/default-og-image.png",
        width: 1200,
        height: 630,
        alt: "Starter Kit - Your Project Name",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Starter Kit - Your Project Name",
    description:
      "A starter kit for building your next project with customizable features and components.",
    images: ["/default-og-image.png"],
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
        <html lang="en" suppressHydrationWarning>
          <body className={`${inter.className} gradient-bg`}>
            <div className="flex h-screen flex-col container mx-auto">
              <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
            </div>
          </body>
        </html>
      </PHProvider>
    </ClerkProvider>
  );
}
