"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Users,
  Shield,
  Heart,
  TrendingUp,
  Activity,
} from "lucide-react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MethodsPage() {
  return (
    <>
      <SEOHead
        title="The Research Behind the Strength Age Test | Validated Senior Fitness Tests"
        description="Evidence-based research supporting our strength age assessment. Learn about validated senior fitness tests including Rikli & Jones protocols, balance tests, and health metrics."
        keywords="validated senior fitness tests, rikli and jones senior fitness test, one leg stand test seniors, waist to height ratio longevity, WHO activity guidelines seniors"
        canonicalUrl="/methods"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header currentPage="methods" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs items={[{ label: "Research Methods" }]} />
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Research Behind the Strength Age Test
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our validated senior fitness tests are based on peer-reviewed
              research and established protocols for assessing functional
              fitness in older adults.
            </p>
          </div>

          <div className="space-y-8">
            {/* Chair Stand Test */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      30-Second Chair Stand Test
                    </CardTitle>
                    <CardDescription>
                      Rikli & Jones Senior Fitness Test
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The Rikli and Jones Senior Fitness Test (1999) established
                  this chair stand test as a reliable measure of lower body
                  strength in older adults. This test predicts the ability to
                  perform daily activities that require leg strength, such as
                  climbing stairs, walking, and getting up from chairs.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Research Citation:</h4>
                  <p className="text-sm text-gray-600">
                    Rikli, R. E., & Jones, C. J. (1999). Development and
                    validation of a functional fitness test for
                    community-residing older adults. Journal of Aging and
                    Physical Activity, 7(2), 129-161.
                  </p>
                </div>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/10380242/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Research Paper
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            {/* Balance Test */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Single-Leg Balance Test
                    </CardTitle>
                    <CardDescription>
                      One leg stand test for seniors
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Research by Iliffe et al. (2009) demonstrated that the one leg
                  stand test is a simple, reliable screening tool for balance
                  and fall risk in community-dwelling older adults. Balance
                  decline is a key predictor of falls and loss of independence.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Research Citation:</h4>
                  <p className="text-sm text-gray-600">
                    Iliffe, S., et al. (2009). Screening for balance problems in
                    community-dwelling older people. Annals of Family Medicine,
                    7(5), 402-408.
                  </p>
                </div>
                <a
                  href="https://www.researchgate.net/publication/10649134_Sooner_or_later_Issues_in_the_early_diagnosis_of_dementia_in_general_practice_A_qualitative_study"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Research Paper
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            {/* Waist-to-Height Ratio */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Waist-to-Height Ratio
                    </CardTitle>
                    <CardDescription>
                      Waist to height ratio longevity predictor
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ashwell et al. (2012) found that waist-to-height ratio is a
                  better predictor of cardiovascular risk and mortality than
                  BMI, particularly in older adults. A ratio below 0.5 is
                  associated with better health outcomes and longevity.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Research Citation:</h4>
                  <p className="text-sm text-gray-600">
                    Ashwell, M., Gunn, P., & Gibson, S. (2012). Waist-to-height
                    ratio is a better screening tool than waist circumference
                    and BMI for adult cardiometabolic risk factors. Nutrition
                    Research, 32(6), 408-420.
                  </p>
                </div>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/22106927/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Research Paper
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            {/* Resting Heart Rate */}
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Resting Heart Rate
                    </CardTitle>
                    <CardDescription>
                      Cardiovascular fitness indicator
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cooney et al. (2010) conducted a systematic review showing
                  that elevated resting heart rate is associated with increased
                  mortality risk in both healthy populations and those with
                  cardiovascular disease. Lower resting heart rates generally
                  indicate better cardiovascular fitness.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Research Citation:</h4>
                  <p className="text-sm text-gray-600">
                    Cooney, M. T., et al. (2010). Elevated resting heart rate is
                    an independent risk factor for cardiovascular disease in
                    healthy men and women. American Heart Journal, 159(4),
                    612-619.
                  </p>
                </div>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/20362720/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  View Research Paper
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            {/* WHO Guidelines */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Physical Activity Guidelines
                    </CardTitle>
                    <CardDescription>
                      WHO activity guidelines seniors
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The World Health Organization (2020) guidelines recommend that
                  older adults engage in at least 150 minutes of
                  moderate-intensity aerobic activity per week, plus
                  muscle-strengthening activities on 2 or more days per week.
                  Regular activity significantly improves health outcomes and
                  reduces mortality risk.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Official Guidelines:</h4>
                  <p className="text-sm text-gray-600">
                    World Health Organization. (2020). WHO guidelines on
                    physical activity and sedentary behaviour. Geneva: World
                    Health Organization.
                  </p>
                </div>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/33239350/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  View WHO Guidelines
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="mt-12 bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Important Disclaimer
              </h3>
              <p className="text-yellow-700 text-sm">
                This strength age assessment tool is based on validated research
                but is not medical advice. Results should not be used for
                medical diagnosis or treatment decisions. Always consult with
                healthcare professionals for medical concerns. This tool is
                designed for general fitness awareness and educational purposes
                only.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Test Your Strength Age?
            </h3>
            <p className="text-gray-600 mb-6">
              Take our free 2-minute assessment based on these validated
              methods.
            </p>
            <Link href="/test">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Take the Strength Age Test
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
