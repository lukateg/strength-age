"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Link from "next/link";
import { Mail, MessageCircle, Clock, HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContactPage() {
  return (
    <>
      <SEOHead
        title="Contact Us - StrengthAge"
        description="Get in touch with the StrengthAge team. We're here to help with questions about your fitness assessment, technical support, or privacy concerns."
        keywords="contact, support, help, customer service, technical support"
        canonicalUrl="/contact"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header currentPage="contact" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re here to help! Whether you have questions about your
              fitness assessment, need technical support, or want to share
              feedback, we&apos;d love to hear from you.
            </p>
          </div>

          <div className="space-y-8">
            {/* Primary Contact */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Mail className="w-6 h-6 mr-3 text-blue-600" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  For all inquiries, support requests, and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Email Us
                  </h3>
                  <a
                    href="mailto:support@strengthage.com"
                    className="text-2xl text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    support@strengthage.com
                  </a>
                  <p className="text-gray-600 mt-2">
                    We typically respond within 24 hours during business days
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Common Questions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <HelpCircle className="w-5 h-5 mr-2 text-green-600" />
                    Assessment Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• How accurate are my results?</p>
                  <p>• Can I retake the assessment?</p>
                  <p>• What do my scores mean?</p>
                  <p>• How to improve my strength age?</p>
                  <p>• Safety concerns or modifications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="w-5 h-5 mr-2 text-purple-600" />
                    Privacy & Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Request data deletion</p>
                  <p>• Update email preferences</p>
                  <p>• Privacy policy questions</p>
                  <p>• Unsubscribe from emails</p>
                  <p>• GDPR/CCPA requests</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageCircle className="w-5 h-5 mr-2 text-orange-600" />
                    Technical Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Website not loading properly</p>
                  <p>• Assessment not working</p>
                  <p>• Didn&apos;t receive results email</p>
                  <p>• Mobile device issues</p>
                  <p>• Browser compatibility</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    General Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Suggestions for improvement</p>
                  <p>• Feature requests</p>
                  <p>• Partnership inquiries</p>
                  <p>• Media and press inquiries</p>
                  <p>• General compliments or concerns</p>
                </CardContent>
              </Card>
            </div>

            {/* Response Time */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Response Times
                    </h3>
                    <div className="space-y-1 text-gray-700">
                      <p>
                        <strong>General inquiries:</strong> Within 24 hours
                      </p>
                      <p>
                        <strong>Technical support:</strong> Within 12 hours
                      </p>
                      <p>
                        <strong>Privacy requests:</strong> Within 30 days (as
                        required by law)
                      </p>
                      <p>
                        <strong>Urgent issues:</strong> We prioritize safety and
                        security concerns
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Redirect */}
            <Card>
              <CardContent className="text-center pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Looking for Quick Answers?
                </h3>
                <p className="text-gray-600 mb-6">
                  Many common questions are answered in our blog and assessment
                  guides.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="/methods"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View Research & Methods
                  </a>
                  <Link
                    href="/blog"
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Browse Articles
                  </Link>
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
