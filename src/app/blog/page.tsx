"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight, Activity } from "lucide-react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  getAllPublishedArticles,
  getFeaturedArticles,
} from "@/data/blogArticles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const allArticles = getAllPublishedArticles();
  const featuredArticles = getFeaturedArticles();
  const regularArticles = allArticles.filter((article) => !article.featured);

  return (
    <>
      <SEOHead
        title="Senior Fitness Blog - Evidence-Based Health & Exercise Guides"
        description="Expert guides on senior fitness, strength tests, balance assessments, and healthy aging. Evidence-based articles for adults 55+ to maintain independence."
        keywords="senior fitness blog, senior health articles, strength test guides, balance exercises seniors, fitness assessment seniors"
        canonicalUrl="/blog"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header currentPage="blog" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Senior Fitness <span className="text-blue-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Evidence-based guides on strength testing, balance assessments,
              and healthy aging. Expert articles to help seniors maintain
              independence and improve functional fitness.
            </p>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Featured Articles
              </h2>
              <div className="grid gap-8">
                {featuredArticles.map((article) => (
                  <Card
                    key={article.slug}
                    className="hover:shadow-xl transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {article.category}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-2xl hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg text-gray-600 mb-4 leading-relaxed">
                        {article.excerpt}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.keywords.slice(0, 3).map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="outline"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {featuredArticles.length > 0 ? "More Articles" : "All Articles"}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => (
                  <Card
                    key={article.slug}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {article.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Read more →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* No Articles Fallback */}
          {allArticles.length === 0 && (
            <section className="text-center py-16">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Articles Coming Soon
              </h2>
              <p className="text-gray-500 mb-8">
                We're working on comprehensive guides for senior fitness and
                health. Check back soon for expert articles on strength testing,
                balance assessments, and more.
              </p>
              <Link href="/test">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Take the Strength Age Test
                </Button>
              </Link>
            </section>
          )}

          {/* Newsletter CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Get Weekly Senior Fitness Tips
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of seniors receiving evidence-based fitness
                guidance straight to their inbox every week.
              </p>
              <Link href="/test">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Start with Free Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    </>
  );
}
