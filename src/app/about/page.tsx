"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Shield,
  Heart,
  TrendingUp,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header currentPage="about" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About the Strength Age Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A free, evidence-based strength test for seniors at home, designed
            to help older adults understand their functional fitness and take
            action for healthy aging.
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                We created this simple senior fitness test to make
                evidence-based health assessments accessible to everyone. Our 2
                minute strength test for seniors is completely free and can be
                completed safely at home with no special equipment.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Too many older adults don&apos;t know their functional fitness
                level until problems arise. Our strength test for seniors at
                home helps identify potential issues early, when interventions
                can still make a difference.
              </p>
            </CardContent>
          </Card>

          {/* Why We Built This */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Why We Built This Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Quick & Accessible
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Most fitness assessments require gym visits or special
                    equipment. Our 2 minute strength test seniors can complete
                    at home with just a chair and timer.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Evidence-Based
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Every component is based on validated research from senior
                    fitness studies, not generic fitness apps or unproven
                    methods.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Senior-Specific
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Designed specifically for adults 55+ using age-appropriate
                    norms and functional movements that matter for independence.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    Actionable Results
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Get specific feedback on what drives your strength age, so
                    you know exactly which areas to focus on for improvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Makes It Different */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                What Makes Our Assessment Different
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Functional Focus
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We test movements that predict real-world independence:
                    getting up from chairs, maintaining balance, and
                    cardiovascular health markers.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Conservative Estimates
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Our strength age ranges are conservative and based on
                    population norms, not inflated to make you feel better or
                    worse than reality.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Transparent Methodology
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We show exactly how your score is calculated and which
                    research supports each component. No black box algorithms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Foundation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Research Foundation</CardTitle>
              <CardDescription>
                Our assessment is built on decades of senior fitness research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Every component of our strength age assessment comes from
                peer-reviewed research on functional fitness in older adults. We
                use established protocols from the Rikli & Jones Senior Fitness
                Test, WHO physical activity guidelines, and validated health
                markers.
              </p>
              <Link href="/methods">
                <Button variant="outline" className="w-full md:w-auto">
                  View Research Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-800">
                Important Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-yellow-700 text-sm space-y-2">
                <li>• This is a screening tool, not a medical diagnosis</li>
                <li>
                  • Results may not apply to individuals with specific health
                  conditions
                </li>
                <li>
                  • Cannot replace professional fitness assessments or medical
                  advice
                </li>
                <li>
                  • Best used as a general awareness tool for functional fitness
                  trends
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Ready to Discover Your Strength Age?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take our free 2-minute assessment and get personalized insights into
            your functional fitness. All tests can be completed safely at home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Take the Free Test
              </Button>
            </Link>
            <Link href="/methods">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Learn About the Science
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
