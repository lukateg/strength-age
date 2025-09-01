"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Mail, Shield, Database, Users, Globe, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy - StrengthAge"
        description="Learn how StrengthAge protects your privacy and handles your data. We respect your privacy and never sell your personal information."
        keywords="privacy policy, data protection, GDPR, CCPA, personal information"
        canonicalUrl="/privacy"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header currentPage="privacy" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We respect your privacy and are committed to protecting your
              personal information. Here&apos;s how we handle your data with
              transparency and care.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Our Promise */}
            <Card className="border-l-4 border-l-blue-600 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Our Privacy Promise
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      <strong>
                        We respect your privacy and do not sell your data.
                      </strong>{" "}
                      Your personal information is used only to provide you with
                      your fitness assessment results and occasional helpful
                      content. That&apos;s it.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Database className="w-6 h-6 mr-3 text-green-600" />
                  What Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Personal Information You Provide:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>
                      <strong>Email address</strong> - To send your test results
                      and reports
                    </li>
                    <li>
                      <strong>Test inputs</strong> - Age, sex, height, waist
                      measurement, chair stand repetitions, balance test
                      duration, resting heart rate, and activity frequency
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Automatically Collected Information:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>
                      <strong>Analytics data</strong> - Anonymized usage
                      patterns, page views, and interaction data through PostHog
                    </li>
                    <li>
                      <strong>Cookies</strong> - Small files that help us
                      understand how you use our site and remember your
                      preferences
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Users className="w-6 h-6 mr-3 text-purple-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <strong>Send your test results</strong> - We email you a
                      personalized fitness assessment report immediately after
                      completing the test
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <strong>Provide occasional updates</strong> - We may send
                      helpful fitness tips, new features, or special discounts
                      (you can unsubscribe anytime)
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">
                      <strong>Improve our service</strong> - Anonymous analytics
                      help us understand how to make the tool more helpful
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Globe className="w-6 h-6 mr-3 text-orange-600" />
                  Who We Share Your Data With
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">
                    🚫 We NEVER sell your personal information to third parties.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Limited Sharing for Service Delivery:
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Email provider (Resend)</strong> - To deliver
                        your test results and updates
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Database className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Analytics provider (PostHog)</strong> - For
                        anonymized usage analytics only
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Trash2 className="w-6 h-6 mr-3 text-red-600" />
                  Your Data Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  You have complete control over your personal information.
                  Here&apos;s what you can do:
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Request Data Deletion
                    </h3>
                    <p className="text-sm text-gray-600">
                      We can permanently delete all your personal information
                      from our systems.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Unsubscribe Anytime
                    </h3>
                    <p className="text-sm text-gray-600">
                      Every email includes an unsubscribe link to stop future
                      communications.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Data Access
                    </h3>
                    <p className="text-sm text-gray-600">
                      Request a copy of all personal data we have about you.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Data Correction
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ask us to correct any inaccurate personal information.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Contact us for any data requests:</strong>{" "}
                    support@strengthage.com
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    We&apos;ll respond to all requests within 30 days.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Legal Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Legal Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    GDPR Compliance (European Users)
                  </h3>
                  <p className="text-gray-700">
                    If you&apos;re in the EU, you have additional rights under
                    the General Data Protection Regulation, including the right
                    to data portability and the right to object to processing.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    CCPA Compliance (California Users)
                  </h3>
                  <p className="text-gray-700">
                    California residents have the right to know what personal
                    information we collect, the right to delete personal
                    information, and the right to opt-out of the sale of
                    personal information.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Questions About Your Privacy?
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We&apos;re here to help. If you have any questions about
                    this privacy policy or how we handle your data, please reach
                    out.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 inline-block">
                    <p className="text-lg">
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:support@strengthage.com"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        support@strengthage.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
