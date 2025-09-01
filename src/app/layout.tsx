import "./globals.css";

import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { PHProvider } from "@/providers/post-hog-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "StrengthAge - Free Strength Age Test for Seniors 55+",
  description:
    "Discover your strength age with our free, evidence-based fitness assessment for seniors. Test chair stands, balance, heart rate and more. No equipment required.",
  metadataBase: new URL("https://strengthage.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#2563eb" },
    ],
  },
  manifest: "/site.webmanifest",
  keywords: [
    "strength age test",
    "fitness age test",
    "senior strength test",
    "chair stand test seniors",
    "balance test for seniors",
    "at home strength test seniors",
    "senior fitness assessment",
    "validated senior fitness tests",
    "functional fitness seniors",
    "fall prevention test",
  ],
  authors: [{ name: "StrengthAge Team", url: "https://strengthage.com" }],
  creator: "StrengthAge",
  publisher: "StrengthAge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    url: "https://strengthage.com",
    title: "StrengthAge - Free Strength Age Test for Seniors 55+",
    description:
      "Discover your strength age with our free, evidence-based fitness assessment for seniors. Test chair stands, balance, heart rate and more. No equipment required.",
    siteName: "StrengthAge",
    images: [
      {
        url: "/strength-age-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StrengthAge - Free Strength Age Test for Seniors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StrengthAge - Free Strength Age Test for Seniors 55+",
    description:
      "Discover your strength age with our free, evidence-based fitness assessment for seniors. Test chair stands, balance, heart rate and more. No equipment required.",
    images: ["/strength-age-og-image.jpg"],
    creator: "@strengthage",
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  other: {
    "theme-color": "#2563eb",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  },
};

// const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider>
    <PHProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Critical Resource Hints */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//api.posthog.com" />

          {/* Optimized Font Loading - Your Original Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700;800;900&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />

          {/* Critical CSS - Prevent Layout Shift */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                html { font-family: 'Montserrat', system-ui, -apple-system, sans-serif; }
                body { 
                  margin: 0; 
                  line-height: 1.6; 
                  font-family: "Montserrat", sans-serif;
                  font-optical-sizing: auto;
                  font-weight: 400;
                  font-style: normal;
                }
                .gradient-bg { background: linear-gradient(135deg, rgb(239 246 255) 0%, rgb(255 255 255) 50%, rgb(240 253 244) 100%); }
              `,
            }}
          />
        </head>
        <body className={`gradient-bg`}>
          <div className="flex h-screen flex-col mx-auto">
            <div className="flex-1 flex flex-col">
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </body>
      </html>
    </PHProvider>
    // </ClerkProvider>
  );
}
