import Link from "next/link";
import { Activity } from "lucide-react";
import { getPopularArticles } from "@/data/blogArticles";

export default function Footer() {
  const popularArticles = getPopularArticles(5);

  return (
    <footer className="bg-gray-900 text-white py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <Activity className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                StrengthAge
              </span>
            </Link>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Free, evidence-based{" "}
              <strong>strength age test for seniors</strong> 55+. Discover your
              functional fitness with validated assessments you can do at home.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/test"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Take Free Test
              </Link>
              <Link
                href="/methods"
                className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                View Research
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Assessment
            </h3>
            <nav className="space-y-3">
              <Link
                href="/test"
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Take Strength Age Test
              </Link>
              <Link
                href="/methods"
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Research & Methods
              </Link>
              <Link
                href="/about"
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                About This Tool
              </Link>
              <Link
                href="/blog"
                className="block text-gray-300 hover:text-blue-400 transition-colors"
              >
                Senior Fitness Blog
              </Link>
            </nav>
          </div>

          {/* Popular Guides */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Popular Guides
            </h3>
            <nav className="space-y-3">
              {popularArticles.length > 0 ? (
                popularArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="block text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {article.title.length > 40
                      ? `${article.title.substring(0, 40)}...`
                      : article.title}
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Articles coming soon...</p>
              )}
              {popularArticles.length > 0 && (
                <Link
                  href="/blog"
                  className="block text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  View All Articles →
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Keywords & SEO Text */}
            <div className="text-xs text-gray-400 max-w-2xl">
              <p className="mb-2">
                <strong>Keywords:</strong> strength age test, fitness age test,
                senior strength test, chair stand test seniors, balance test for
                seniors, at home strength test seniors, senior fitness
                assessment, validated senior fitness tests
              </p>
              <p>
                This tool uses validated senior fitness assessments and
                population references. It is not medical advice. Results should
                not replace professional healthcare consultations.
              </p>
            </div>

            {/* Legal & Copyright */}
            <div className="text-right space-y-2">
              <div className="flex space-x-6 text-sm text-gray-400">
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </div>
              <p className="text-xs text-gray-500">
                © 2025 StrengthAge. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
