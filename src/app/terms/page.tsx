"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  FileText,
  AlertTriangle,
  Scale,
  Copyright,
  Shield,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <>
      <SEOHead
        title="Terms of Service - StrengthAge"
        description="Read StrengthAge's terms of service. Learn about disclaimers, user obligations, and legal information for our fitness assessment tool."
        keywords="terms of service, terms and conditions, disclaimer, legal, fitness assessment"
        canonicalUrl="/terms"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header currentPage="terms" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using the StrengthAge
              fitness assessment tool. By using our service, you agree to these
              terms.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Important Disclaimer */}
            <Card className="border-l-4 border-l-red-600 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Important Medical Disclaimer
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      <strong>
                        This tool is not medical advice. It is for educational
                        purposes only.
                      </strong>{" "}
                      The StrengthAge assessment provides general fitness
                      information and should not be used as a substitute for
                      professional medical advice, diagnosis, or treatment.
                      Always consult with a healthcare provider before starting
                      any exercise program or making health-related decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using the StrengthAge website and fitness
                  assessment tool, you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to abide
                  by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            {/* Liability and Risk */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Shield className="w-6 h-6 mr-3 text-orange-600" />
                  Liability and Risk Assumption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Use at Your Own Risk
                  </h3>
                  <p className="text-gray-700">
                    You acknowledge that you use the StrengthAge assessment and
                    any resulting recommendations at your own risk. We are not
                    responsible for any injuries, health issues, or other
                    consequences that may result from participating in the
                    fitness tests or following any suggestions provided.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Limitation of Liability
                  </h3>
                  <p className="text-gray-700">
                    To the fullest extent permitted by law, StrengthAge shall
                    not be liable for any direct, indirect, incidental, special,
                    consequential, or punitive damages resulting from your use
                    of this service, including but not limited to personal
                    injury, loss of data, or business interruption.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Before taking any fitness test:</strong> Ensure you
                    are physically capable of performing the exercises safely.
                    Stop immediately if you experience pain, dizziness, or
                    discomfort.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Obligations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Users className="w-6 h-6 mr-3 text-green-600" />
                  Your Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Accurate Information
                  </h3>
                  <p className="text-gray-700">
                    You agree to provide accurate, current, and complete
                    information when using the assessment tool. Inaccurate
                    information may lead to misleading results and reduce the
                    effectiveness of the assessment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Personal Use Only
                  </h3>
                  <p className="text-gray-700">
                    You may use the StrengthAge tool only for personal,
                    non-commercial purposes. You may not:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                    <li>Redistribute, sell, or commercialize the assessment</li>
                    <li>
                      Use the tool to provide professional fitness or medical
                      services
                    </li>
                    <li>
                      Attempt to reverse engineer or copy our assessment
                      methodology
                    </li>
                    <li>Use automated systems or bots to access the service</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Prohibited Activities
                  </h3>
                  <p className="text-gray-700">
                    You agree not to use the service for any unlawful purpose or
                    in any way that could damage, disable, or impair the service
                    or interfere with other users&apos; access.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Copyright className="w-6 h-6 mr-3 text-purple-600" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Our Content
                  </h3>
                  <p className="text-gray-700">
                    All content on the StrengthAge website, including but not
                    limited to text, graphics, logos, images, software, and the
                    assessment methodology, is the property of StrengthAge and
                    is protected by copyright and other intellectual property
                    laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your Data
                  </h3>
                  <p className="text-gray-700">
                    You retain ownership of any personal information you
                    provide. By using our service, you grant us a limited
                    license to use this information to provide the assessment
                    and related services as described in our Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Service Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Guarantee of Availability
                  </h3>
                  <p className="text-gray-700">
                    While we strive to keep the service available 24/7, we do
                    not guarantee uninterrupted access. The service may be
                    temporarily unavailable due to maintenance, updates, or
                    technical issues.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Modifications to Service
                  </h3>
                  <p className="text-gray-700">
                    We reserve the right to modify, suspend, or discontinue any
                    aspect of the service at any time without prior notice. We
                    may also update these terms of service periodically.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Scale className="w-6 h-6 mr-3 text-indigo-600" />
                  Governing Law
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  These terms and conditions are governed by and construed in
                  accordance with the laws of the United States. Any disputes
                  arising under these terms shall be subject to the exclusive
                  jurisdiction of the courts located in the United States.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Changes to These Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms of Service from time to time. When
                  we do, we will post the updated terms on this page and update
                  the &ldquo;Last updated&rdquo; date. Your continued use of the
                  service after any changes constitutes acceptance of the new
                  terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Questions About These Terms?
                  </h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about these Terms of Service,
                    please don&apos;t hesitate to contact us.
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      By using StrengthAge, you acknowledge that you have read,
                      understood, and agree to be bound by these Terms of
                      Service.
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
