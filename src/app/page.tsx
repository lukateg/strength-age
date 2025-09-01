"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ChevronDown,
  Clock,
  Heart,
  InfoIcon,
  Shield,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atom } from "lucide-react";

import Image from "next/image";

function TrustBadges() {
  return (
    <div className="flex text-[12px] text-gray-500 flex-wrap items-center gap-4">
      <div className="flex items-center text-black gap-1 ">
        <Atom className="w-4 h-4 text-green-600" />
        Science-based
      </div>
      <div className="flex items-center gap-1 text-black ">
        <TrendingUp className="w-4 h-4 text-green-600" />
        No equipment
      </div>
      <div className="flex items-center gap-1 text-black ">
        <Stethoscope className="w-4 h-4 text-green-600" />
        WHO-Guided
      </div>
    </div>
  );
}

function FAQSection() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqData = [
    {
      question: "What is a strength age test?",
      answer:
        "A strength age test is a fitness assessment that compares your functional strength and health metrics to others your age. Our test uses validated senior fitness tests including chair stands, balance, heart rate, and waist measurements to estimate your 'strength age' - which may be higher or lower than your actual age.",
    },
    {
      question: "Is this accurate for seniors?",
      answer:
        "Yes. Our strength age test uses validated assessments from senior fitness research, including the Rikli & Jones Senior Fitness Test protocols. These tests are specifically designed for adults 55+ and have been validated in research studies. However, this is not medical advice and should not replace professional health assessments.",
    },
    {
      question: "Do I need equipment?",
      answer:
        "No equipment needed! You can complete the entire at home strength test for seniors using just a chair, timer, and tape measure. All tests are designed to be done safely at home without any special fitness equipment.",
    },
    {
      question: "What does my result mean?",
      answer:
        "Your strength age result shows how your functional fitness compares to age norms. If your strength age is lower than your real age, you're performing above average for your age group. If it's higher, there may be areas for improvement. The test shows which specific factors (strength, balance, heart health) contribute most to your result.",
    },
    {
      question: "How accurate are senior fitness tests?",
      answer:
        "Senior fitness tests used in our assessment have been validated in research studies and are reliable predictors of functional independence and health outcomes. However, they provide estimates and trends rather than medical diagnoses. Results should be used for general fitness awareness, not medical decision-making.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-medium text-qa-neutral-dark mb-4">
            Frequently asked questions
          </h2>
        </div>

        <div className="border-t border-gray-200">
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium text-gray-900 text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-in-out ${
                    openItem === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItem === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTATestimonialSection() {
  const testimonials = [
    {
      company: "HelloFresh",
      logo: "🥗", // Using emoji as dummy logo
      quote:
        "By studying customers with Sprig, we're able to remove the risk around business decisions and new features.",
      author: "James Villacci",
      title: "Head of Research",
    },
    {
      company: "Square",
      logo: "⬜", // Using emoji as dummy logo
      quote:
        "Sprig has been extremely useful in scaling the research team's impact by providing highly relevant insights.",
      author: "Jewel Seperson",
      title: "Head of Research",
    },
    {
      company: "Figma",
      logo: "🎨", // Using emoji as dummy logo
      quote:
        "Sprig enables us to get a wealth of feedback from our users and understand how we can help them better use the tool.",
      author: "Rie McGwier",
      title: "UX Research Lead",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20"
      style={{
        backgroundImage: "url(/gradient.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-medium text-qa-neutral-dark mb-4">
            Powering enterprise companies, startups, and everything in between
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-sm p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Company Logo/Name */}
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-3">{testimonial.logo}</div>
                <h3 className="text-xl font-bold text-qa-neutral-dark">
                  {testimonial.company}
                </h3>
              </div>

              {/* Quote */}
              <blockquote className="text-slate-600 text-base leading-relaxed mb-8">
                {testimonial.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-qa-success to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.author
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-qa-neutral-dark">
                    {testimonial.author}
                  </div>
                  <div className="text-qa-neutral-medium text-sm">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  // FAQ Schema for structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a strength age test?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A strength age test is a fitness assessment that compares your functional strength and health metrics to others your age. Our test uses validated senior fitness tests including chair stands, balance, heart rate, and waist measurements to estimate your 'strength age' - which may be higher or lower than your actual age.",
        },
      },
      {
        "@type": "Question",
        name: "Is this accurate for seniors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Our strength age test uses validated assessments from senior fitness research, including the Rikli & Jones Senior Fitness Test protocols. These tests are specifically designed for adults 55+ and have been validated in research studies.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need equipment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No equipment needed! You can complete the entire at home strength test for seniors using just a chair, timer, and tape measure. All tests are designed to be done safely at home without any special fitness equipment.",
        },
      },
      {
        "@type": "Question",
        name: "What does my result mean?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your strength age result shows how your functional fitness compares to age norms. If your strength age is lower than your real age, you're performing above average for your age group. If it's higher, there may be areas for improvement.",
        },
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Discover Your Strength Age in 2 Minutes | Free Senior Fitness Test"
        description="Free strength age test for seniors 55+. Evidence-based fitness assessment you can do at home with no equipment. Test your strength age now!"
        keywords="strength age test, fitness age test, senior strength test, at home strength test seniors, senior fitness assessment, chair stand test seniors, balance test for seniors"
        canonicalUrl="/"
        faqSchema={faqSchema}
      />
      <div className="flex flex-col min-h-screen bg-[#edeef1]">
        <Header />

        {/* Hero Section */}
        <main>
          <section
            className="pt-20 pb-32 relative overflow-hidden"
            aria-labelledby="hero-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="text-left">
                  <h1
                    id="hero-heading"
                    className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-6 leading-tight"
                  >
                    Discover Your{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      Strength Age
                    </span>{" "}
                    in 2 Minutes
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                    Evidence-based fitness age test for seniors 55+. Test your
                    strength age with validated assessments - no equipment
                    required.
                  </p>
                  <div className="mb-8">
                    <TrustBadges />
                  </div>

                  <div className="mb-6 flex flex-col gap-4">
                    <Link href="/test">
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Clock className="w-5 h-5 mr-2" />
                        Take the Free Test
                      </Button>
                    </Link>
                  </div>

                  {/* Social Proof Component */}
                  <div className="flex items-center gap-4">
                    {/* Overlapping Avatars */}
                    <div className="flex items-center">
                      <div className="flex -space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                          M
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                          S
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                          J
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                          A
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                          L
                        </div>
                      </div>
                    </div>

                    {/* Rating and Text */}
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">500+</span> seniors
                        completed their assessment
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Content - Image Placeholder */}
                <div className="flex justify-center lg:justify-end">
                  {/* <div className="w-full max-w-lg h-96 bg-gray-200 rounded-2xl shadow-xl border border-gray-300 flex items-center justify-center"> */}
                  <Image
                    // src="/middle-aged-yoga-instructor.webp"
                    src="/man-squats.webp"
                    // src="/man-and-woman-plank.webp"
                    alt="Strength Age Test | Man doing squats"
                    className=" max-w-lg bg-gray-200 rounded-2xl shadow-xl border border-gray-300 flex items-center justify-center"
                    width={500}
                    height={570}
                  />
                  {/* </div> */}
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
              <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            </div>
          </section>

          {/* How the Strength Age Test Works */}
          <section
            className="py-20 bg-white"
            aria-labelledby="how-it-works-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2
                  id="how-it-works-heading"
                  className="text-3xl md:text-5xl font-normal text-gray-900 mb-6"
                >
                  How the Strength Age Test Works
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our fitness age test combines validated senior fitness
                  assessments with clinically referenced health metrics
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                <Card className="p-8 border-2 hover:border-blue-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      Chair Stand Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      30-second chair stand test measures lower body strength.
                      Count how many times you can stand up and sit down in 30
                      seconds.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-8 border-2 hover:border-green-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">Balance Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Single-leg balance test for seniors measures stability and
                      fall risk. See how long you can stand on one leg.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-8 border-2 hover:border-red-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      Resting Heart Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Resting heart rate for seniors indicates cardiovascular
                      fitness. Lower rates generally suggest better fitness.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-8 border-2 hover:border-purple-300 transition-colors">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      Waist-to-Height Ratio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">
                      Waist to height ratio for seniors is linked to longevity
                      and health outcomes. Better predictor than BMI for older
                      adults.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Seniors Should Track Their Strength Age */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                      Evidence-Based
                    </div>
                    <h2 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6 leading-tight">
                      Why Seniors Should Track Their{" "}
                      <span className="text-blue-600">Strength Age</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Understanding your strength age helps predict
                      independence, fall risk, and healthy aging. Take action
                      before issues develop.
                    </p>
                    <Link href="/test">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                        Test Your Strength Age
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Content - Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Fall Prevention */}
                  <Image
                    src="/man-woman-plank.webp"
                    className="rounded-2xl bg-white border-0 shadow-md w-full h-full object-cover"
                    alt="Senior Man and Woman doing plank"
                    width={500}
                    height={500}
                  />

                  {/* Independence */}
                  <Card className="p-6 bg-blue-100 border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Maintain Independence
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Track functional fitness to stay independent in daily
                      activities and maintain quality of life.
                    </p>
                  </Card>

                  {/* Longevity */}
                  <Card className="p-6 bg-green-100 border-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Healthy Aging
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Strength and cardiovascular health are key predictors of
                      longevity and healthy aging.
                    </p>
                  </Card>

                  {/* Early Detection */}
                  <Image
                    src="/man-in-forest.webp"
                    className="rounded-2xl bg-white border-0 shadow-md w-full h-full object-cover"
                    alt="Senior Man training in forest"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </section>

          <FAQSection />

          {/* Internal Linking CTA Section */}
          <section
            className="py-20 bg-white"
            aria-labelledby="resources-heading"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2
                  id="resources-heading"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                >
                  Explore Our Resources
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Learn more about senior fitness testing and discover
                  evidence-based health guidance.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="w-6 h-6 text-blue-600" />
                      Research & Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Discover the scientific research behind our strength age
                      assessment, including validated protocols and
                      peer-reviewed studies.
                    </p>
                    <Link
                      href="/methods"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Learn About Our Methods →
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="w-6 h-6 text-green-600" />
                      Expert Guides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Read evidence-based articles on senior fitness, including
                      detailed guides for chair stand tests, balance
                      assessments, and more.
                    </p>
                    <Link
                      href="/blog"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Browse Health Articles →
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Heart className="w-6 h-6 text-red-600" />
                      About Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Learn why we created this free assessment tool and how it
                      can help seniors maintain independence and healthy aging.
                    </p>
                    <Link
                      href="/about"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      About StrengthAge →
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
