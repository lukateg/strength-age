"use client";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function FooterSection() {
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="py-12 border-t border-border/40 bg-card/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Teach.me</span>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered learning platform for the modern educational
              experience.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  onClick={(e) => handleAnchorClick(e, "features")}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => handleAnchorClick(e, "pricing")}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  onClick={(e) => handleAnchorClick(e, "roadmap")}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          {/* <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#docs"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2025 Teach.me, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
