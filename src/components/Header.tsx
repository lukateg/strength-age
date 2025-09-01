"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  return (
    <header className="m-4">
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 rounded-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="text-2xl text-gray-900 flex items-center gap-2"
            >
              <Activity className="w-8 h-8 text-blue-600" />
              StrengthAge
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link
                href="/test"
                className={`font-medium text-sm transition-colors ${
                  currentPage === "test"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Take Test
              </Link>
              <Link
                href="/methods"
                className={`font-medium text-sm transition-colors ${
                  currentPage === "methods"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Methods
              </Link>
              <Link
                href="/about"
                className={`font-medium text-sm transition-colors ${
                  currentPage === "about"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                About
              </Link>
              <Link
                href="/blog"
                className={`font-medium text-sm transition-colors ${
                  currentPage === "blog"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
