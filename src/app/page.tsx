"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Rocket,
  Search,
  Shield,
  TrendingDown,
  Wrench,
  Zap,
} from "lucide-react";
import { NewsletterSubscriptionForm } from "@/components/newsletter-subscription-form";

function TabbedSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "user-research",
      title: "User Research",
      icon: "📊",
      description: "Capture user feedback at scale",
      content:
        "Launch in-product studies in minutes with precise targeting that ensures you learn from the right users at the right time.",
    },
    {
      id: "design",
      title: "Design",
      icon: "🎨",
      description: "Say goodbye to manual analysis",
      content:
        "Let AI do the heavy lifting and surface the top actionable product opportunities from your user experience data.",
    },
    {
      id: "product-management",
      title: "Product Management",
      icon: "📋",
      description: "Save time and resources",
      content:
        "Do more research in less time by recruiting users right in your product and instantly analyzing their feedback with AI.",
    },
    {
      id: "marketing",
      title: "Marketing",
      icon: "📈",
      description: "Drive growth with insights",
      content:
        "Understand user behavior patterns and optimize your marketing campaigns with data-driven user research.",
    },
    {
      id: "engineering",
      title: "Engineering",
      icon: "⚙️",
      description: "Build better products",
      content:
        "Get technical insights from users to prioritize features and improvements that matter most to your product success.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#2B2D42] mb-6">
            Empower your org to create great experiences
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto ">
          <div className="bg-white rounded-t-xl border border-[#E0E4E7] border-b-0">
            <div className="flex overflow-x-auto">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === index
                      ? "border-[#4ECDC4] text-[#2B2D42] bg-white"
                      : "border-transparent text-[#6C757D] hover:text-[#2B2D42] hover:border-[#E0E4E7]"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-b-xl border border-[#E0E4E7] border-t-0 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                <h3 className="text-2xl font-bold text-[#2B2D42] mb-4">
                  {tabs[activeTab]?.description}
                </h3>
                <p className="text-lg text-[#6C757D] mb-6 leading-relaxed">
                  {tabs[activeTab]?.content}
                </p>
                <Button variant="ghost" className="text-[#2B2D42]">
                  Explore ClearAudit for {tabs[activeTab]?.title} Teams
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>

              {/* Right Content - Mockup */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#f8f6f3] to-[#ffffff] rounded-xl p-6 border border-[#E0E4E7]">
                  {/* Mini Dashboard Mockup */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#FF6B6B] rounded-full"></div>
                        <div className="w-2 h-2 bg-[#FFD23F] rounded-full"></div>
                        <div className="w-2 h-2 bg-[#4ECDC4] rounded-full"></div>
                      </div>
                      <div className="text-xs text-[#6C757D]">ClearAudit</div>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 0 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#2B2D42]">
                          SEO Research Dashboard
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-[#E0E4E7]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#6C757D]">
                              User Behavior
                            </span>
                            <span className="text-xs text-[#4ECDC4]">+23%</span>
                          </div>
                          <div className="h-12 bg-gradient-to-r from-[#4ECDC4] to-[#3BB8B5] rounded opacity-30"></div>
                        </div>
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#2B2D42]">
                          Design Analytics
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white rounded p-2 border border-[#E0E4E7]">
                            <div className="w-full h-6 bg-[#FFD23F] rounded opacity-40"></div>
                          </div>
                          <div className="bg-white rounded p-2 border border-[#E0E4E7]">
                            <div className="w-full h-6 bg-[#FF6B6B] rounded opacity-40"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#2B2D42]">
                          Product Roadmap
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#4ECDC4] rounded-full"></div>
                            <span className="text-xs text-[#6C757D]">
                              Meta descriptions optimized
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#FFD23F] rounded-full"></div>
                            <span className="text-xs text-[#6C757D]">
                              Page speed improvements
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 3 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#2B2D42]">
                          Marketing Insights
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-[#E0E4E7]">
                          <div className="text-xs text-[#6C757D] mb-2">
                            Conversion Rate
                          </div>
                          <div className="text-lg font-bold text-[#4ECDC4]">
                            4.2%
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 4 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-[#2B2D42]">
                          Technical SEO
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white rounded p-2 border border-[#E0E4E7] text-xs">
                            <span className="text-[#4ECDC4]">✓</span> Core Web
                            Vitals
                          </div>
                          <div className="bg-white rounded p-2 border border-[#E0E4E7] text-xs">
                            <span className="text-[#FFD23F]">◐</span> Schema
                            Markup
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const faqData = [
    {
      question: "Do I need to involve engineers to use session replays?",
      answer:
        "Only once for the initial SDK installation. After that, Sprig automatically captures sessions across your site or app where the SDK is installed. No custom event tagging or manual setup is required for replay collection.",
    },
    {
      question: "Will session replay affect site performance or page speed?",
      answer:
        "Our session replay technology is designed with performance in mind. The SDK has minimal impact on page load times and uses efficient compression and sampling techniques to ensure your site remains fast and responsive.",
    },
    {
      question:
        "How is Sprig Replays different from tools like FullStory or Hotjar?",
      answer:
        "Sprig Replays integrates seamlessly with our user research platform, allowing you to connect session recordings directly with user feedback and surveys. This unique combination provides deeper insights into user behavior and motivation that standalone replay tools cannot offer.",
    },
    {
      question: "Can I filter replays by user behavior or survey response?",
      answer:
        "Yes! You can filter session replays based on survey responses, user attributes, custom events, and specific behaviors. This makes it easy to focus on the most relevant user interactions and understand patterns in user experience.",
    },
    {
      question: "Do Replays work across mobile and desktop?",
      answer:
        "Absolutely! Sprig Replays work seamlessly across all devices and platforms, including web browsers, mobile apps (iOS and Android), and tablet devices. You'll get consistent replay quality regardless of how users access your product.",
    },
  ];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#2B2D42] mb-4">
            Frequently asked questions
          </h2>
        </div>

        <div className="border-t border-gray-200">
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium text-gray-900 text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openItems.has(index) ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openItems.has(index) && (
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              )}
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
      className="py-20"
      style={{
        backgroundImage: "url(/gradient.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* <section className="py-20 bg-gradient-to-r from-[#F5E6D3] via-[#F0D5D9] to-[#E8E9F3]"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#2B2D42] mb-4">
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
                <h3 className="text-xl font-bold text-[#2B2D42]">
                  {testimonial.company}
                </h3>
              </div>

              {/* Quote */}
              <blockquote className="text-[#4A5568] text-base leading-relaxed mb-8">
                {testimonial.quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4ECDC4] to-[#44B3AC] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.author
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-[#2B2D42]">
                    {testimonial.author}
                  </div>
                  <div className="text-[#6C757D] text-sm">
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
  const [showPositiveOutcome, setShowPositiveOutcome] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-[#2B2D42]">ClearAudit</div>
            <div className="hidden md:flex space-x-8">
              <Link
                href="#features"
                className="text-[#2B2D42] hover:text-[#4ECDC4] font-medium text-sm transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-[#2B2D42] hover:text-[#4ECDC4] font-medium text-sm transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#testimonials"
                className="text-[#2B2D42] hover:text-[#4ECDC4] font-medium text-sm transition-colors"
              >
                Reviews
              </Link>
            </div>
            <Button size="lg">Start Free Scan</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="pt-16 pb-24"
        style={{
          background:
            "radial-gradient(ellipse at bottom, #fed7aa 25%, #fef3c7 50%, #ffffff 75%, #f7f4f1 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> */}
            {/* Left Content */}
            <div className="">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#2B2D42] mb-6 leading-tight">
                The Modern Research Platform for UX Teams
              </h1>
              <p className="text-xl text-[#2B2D42] mb-8 leading-relaxed max-w-lg">
                ClearAudit takes the overwhelm out of SEO by giving you a
                guided, always-up-to-date checklist that checks your site for
                you.
              </p>

              {/* <ul className="space-y-2 pb-8 hidden md:block">
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-qa-success flex-shrink-0" />
                  <span className="text-qa-neutral-dark text-xs md:text-sm">
                    Full SEO audit in 5 minutes
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-qa-success flex-shrink-0" />
                  <span className="text-qa-neutral-dark text-xs md:text-sm">
                    5$ credits - no subscription
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-qa-success flex-shrink-0" />
                  <span className="text-qa-neutral-dark text-xs md:text-sm">
                    Plain-English explanations
                  </span>
                </li>
              </ul> */}

              <div className="flex flex-col sm:flex-col gap-2 mb-12 ">
                <NewsletterSubscriptionForm
                  utmCampaign="waitlist"
                  utmSource="website"
                  utmMedium="hero-form"
                  placeholder="Enter your email"
                  buttonText="Count Me In"
                />

                <p className="text-xs text-qa-neutral-medium">
                  {/* No credit card required • Emmediataly results */}
                  Early birds get{" "}
                  <a href="#pricing" className="underline">
                    additional discounts
                  </a>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-xs text-qa-neutral-medium">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-qa-success" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-qa-success" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-qa-success" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>

            {/* Right Content - Placeholder for Image/Mockup */}
            <div className="lg:order-2">
              <div className="p-8">
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-center  roadmap-step-1 relative">
                    <div className="w-12 h-12 bg-qa-neutral-medium rounded-full flex items-center justify-center flex-shrink-0 absolute -left-6">
                      <Wrench className="w-6 h-6 text-qa-neutral-white" />
                    </div>
                    <div className="flex-1 bg-transparent rounded-lg p-3 border-2 border-primary-foreground pl-10">
                      <span className="text-lg font-bold text-qa-neutral-medium">
                        You built your dream project
                      </span>
                    </div>
                  </div>

                  {/* Connector 1 */}
                  <div className="flex justify-center roadmap-connector-1">
                    <div className="w-1 h-8 border-l-2 border-dashed border-qa-neutral-medium/30"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center roadmap-step-2 relative">
                    <div className="w-12 h-12 bg-qa-blue rounded-full flex items-center justify-center flex-shrink-0 absolute -left-6">
                      <Rocket className="w-6 h-6 text-qa-neutral-white" />
                    </div>
                    <div className="flex-1 bg-transparent rounded-lg p-3 border-2 border-qa-blue/30 pl-10">
                      <span className="text-lg font-bold text-qa-blue">
                        You launched it, posted everywhere
                      </span>
                    </div>
                  </div>

                  {/* Connector 2 */}
                  <div className="flex justify-center roadmap-connector-2">
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-qa-blue/30"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    {!showPositiveOutcome ? (
                      <div
                        className={`flex items-center roadmap-step-3 relative ${showPositiveOutcome ? "slide-out-step" : ""}`}
                      >
                        <div className="w-12 h-12 bg-qa-error rounded-full flex items-center justify-center flex-shrink-0 absolute -left-6">
                          <TrendingDown className="w-6 h-6 text-qa-neutral-white" />
                        </div>
                        <div className="flex-1 bg-transparent rounded-lg p-3 border-2 border-qa-error/30 pl-10">
                          <span className="text-lg font-bold text-qa-error">
                            Your traffic graph is flat… or falling.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center slide-in-step relative">
                        <div className="w-12 h-12 bg-qa-success rounded-full flex items-center justify-center flex-shrink-0 absolute -left-6">
                          <CheckCircle2 className="w-6 h-6 text-qa-neutral-white" />
                        </div>
                        <div className="flex-1 bg-transparent rounded-lg p-3 border-2 border-qa-success/30 pl-10">
                          <span className="text-lg font-bold text-qa-success">
                            Steady organic growth, traffic graph is finally
                            climbing.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Refresh/New Trigger Button */}
                  <div className="flex justify-center pt-4 roadmap-button">
                    <button
                      onClick={() => {}}
                      className="flex items-center space-x-2 px-4 py-1 bg-qa-neutral-ultra-light text-qa-neutral-dark font-semibold rounded-lg shadow-qa-card hover:bg-qa-neutral-light/50 transition-all duration-200"
                    >
                      <Search className="w-4 h-4" />
                      <span>Run Audit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="relative px-72"> */}
            {/* <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 mb-4">
                  <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#4ECDC4] rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">
                        SEO Dashboard Mockup
                      </p>
                      <p className="text-gray-400 text-xs mt-1">Coming Soon</p>
                    </div>
                  </div>
                </div> */}

            {/* Floating card mockups */}
            {/* <div className="absolute left-40 top-12 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-48 transform -rotate-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#4ECDC4] rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-[#2B2D42]">
                      SEO Score
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#4ECDC4]">
                    85/100
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    +12 this week
                  </div>
                </div> */}

            {/* <div className="absolute right-40 bottom-12 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-52 transform rotate-3">
                  <div className="text-sm font-medium text-[#2B2D42] mb-2">
                    Next Steps
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-[#4ECDC4] rounded-full"></div>
                      <span className="text-gray-600">
                        Optimize meta descriptions
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-[#FFD23F] rounded-full"></div>
                      <span className="text-gray-600">Improve page speed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-600">Add schema markup</span>
                    </div>
                  </div>
                </div> */}
            {/* </div> */}
          </div>
        </div>
      </section>

      {/* Problem Pitch Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#2B2D42] mb-6">
              Most small site owners waste months chasing SEO advice that's
              outdated, incomplete, or just too technical to follow.
            </h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              You've got a site to run — but SEO feels like a moving target. One
              day it's about speed, the next it's schema, and next month it's a
              brand-new ranking factor. Meanwhile, your competitors keep showing
              up above you.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#f7f4f1] rounded-xl border border-[#E0E4E7]">
                <div className="relative">
                  <h3 className="relative text-2xl font-bold text-[#2B2D42] text-center py-3 px-6 rounded-t-lg bg-[#FF6B6B]/10 backdrop-blur-sm ">
                    Other Tools ❌
                  </h3>
                </div>
                <ul className="space-y-4 p-4">
                  {[
                    "Overwhelming dashboards",
                    "Jargon you need to Google",
                    "Requires juggling 5–10 tools",
                    "Monthly learning curve",
                    "Generic reports",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center text-[#6C757D]"
                    >
                      <span className="text-[#FF6B6B] mr-3">❌</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#f7f4f1] rounded-xl border border-[#E0E4E7]">
                <div className="relative">
                  <h3 className="relative text-2xl font-bold text-[#2B2D42] text-center py-3 px-6 rounded-t-lg bg-[#4ECDC4]/10 backdrop-blur-sm ">
                    Our Tool ✅
                  </h3>
                </div>
                <ul className="space-y-4 p-4">
                  {[
                    "Simple step-by-step roadmap",
                    "Plain English explanations",
                    "All checks in one place",
                    "Fixes you can do today",
                    "Action items for your site",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center text-[#6C757D]"
                    >
                      <span className="text-[#4ECDC4] mr-3">✅</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Intro Section */}
      <TabbedSection />

      {/* About me Section */}
      <section className="py-20 bg-primary-cream2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-12 flex">
            {/* Right Content - Story */}

            <div className="text-[#2B2D42]">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 bg-[#4ECDC4] m-2 rounded-full flex items-center justify-center">
                  <span className="text-[#2B2D42] text-2xl font-bold">LT</span>
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="text-[#2B2D42] text-lg font-medium">
                      SEO Warrior
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-[#4ECDC4] text-lg">Hey, </span>
                    <span className="text-[#2B2D42] text-lg font-medium">
                      SEO Warrior
                    </span>
                    <span className="text-[#4ECDC4] text-lg"> from </span>
                    <span className="text-[#2B2D42] text-lg font-medium">
                      Everywhere 🌍
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-[#2B2D42] leading-relaxed">
                <p>
                  I'm Luka, the creator of ClearAudit. I've also built{" "}
                  <span className="text-[#2B2D42] font-semibold">
                    12 successful websites
                  </span>{" "}
                  and helped businesses earn{" "}
                  <span className="text-[#2B2D42] font-semibold">
                    $10M+ through SEO
                  </span>
                  .
                </p>

                <p>
                  I learned that{" "}
                  <span className="text-[#2B2D42] font-semibold">
                    SEO is a goldmine of opportunities
                  </span>
                  . But most website owners just struggle with{" "}
                  <span className="text-[#2B2D42] italic">
                    confusing tools...
                  </span>
                </p>

                <p className="text-[#2B2D42] italic">
                  Meta tags, Core Web Vitals, schema markup... but do any of
                  these actually tell you{" "}
                  <span className="text-[#2B2D42]">
                    where your biggest SEO wins are hiding?
                  </span>
                </p>

                <p className="text-[#2B2D42] font-medium">
                  So I built ClearAudit for 3 reasons:
                </p>

                <div className="space-y-3 ml-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[#4ECDC4] font-bold">1.</span>
                    <p>
                      <span className="text-[#2B2D42] font-semibold">
                        Find SEO wins that drive REAL traffic
                      </span>
                      , not just vanity metrics.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4ECDC4] font-bold">2.</span>
                    <p>
                      <span className="text-[#2B2D42] font-semibold">
                        Discover what makes visitors convert
                      </span>{" "}
                      and turn more clicks into customers.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4ECDC4] font-bold">3.</span>
                    <p>
                      <span className="text-[#2B2D42] font-semibold">
                        Make data-driven SEO decisions
                      </span>{" "}
                      and work on the right optimizations.
                    </p>
                  </div>
                </div>

                <p className="text-[#2B2D42] pt-4">
                  I'm building ClearAudit in front of{" "}
                  <span className="text-[#2B2D42] font-semibold underline">
                    50,000+ SEO professionals
                  </span>{" "}
                  on Twitter. Let's rank! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl text-qa-neutral-dark tracking-tight leading-tight">
              Skip{" "}
              <span className="bg-qa-neutral-dark underline text-qa-neutral-white px-1">
                commitments
              </span>{" "}
              and subscriptions
            </h2>
            <p className="text-base md:text-xl text-qa-neutral-medium max-w-2xl mx-auto">
              Tired of committing to pricey monthly subscriptions just to use a
              tool once in a while?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 ">
            <div className="flex items-center space-x-3 p-4 mx-auto">
              <Zap className="w-6 h-6 text-qa-success" />
              <span className="text-qa-neutral-dark">1 free full audit</span>
            </div>
            <div className="flex items-center space-x-3 p-4 mx-auto">
              <CreditCard className="w-6 h-6 text-qa-blue" />
              <span className="text-qa-neutral-dark">
                Pay-as-you-need SEO audits
              </span>
            </div>
            <div className="flex items-center space-x-3 p-4 mx-auto">
              <Shield className="w-6 h-6 text-qa-success" />
              <span className="text-qa-neutral-dark">
                No obligations, no recurring bills
              </span>
            </div>
          </div>

          {/* Discount Notification Banner */}
          <div>
            <div className="bg-qa-neutral-custom-bg py-8 px-6 w-fit mx-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-qa-accent-pink rounded-2xl p-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">🍦</span>
                      <div className="text-qa-neutral-dark ">
                        <p className="text-base font-semibold">
                          All early waitlist users get promocodes for -10%
                          yearly plan or 5 free credits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="bg-qa-neutral-white rounded-xl p-6 shadow-qa-card">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-qa-neutral-dark">
                    Free Audit
                  </h3>
                  <div className="text-3xl font-bold text-qa-neutral-dark">
                    $0
                  </div>
                  <p className="text-qa-neutral-medium">Try it risk-free</p>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      1 full website audit
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Up to 20 pages scanned
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      PDF report download
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      No signup required
                    </span>
                  </li>
                </ul>
                <button className="w-full mt-6 px-4 py-3 border border-qa-blue text-qa-blue rounded-lg font-semibold hover:bg-qa-neutral-ultra-light transition-colors">
                  Start Free Audit
                </button>
              </div>

              {/* Credit Plan */}
              <div className="bg-qa-neutral-white rounded-xl p-6 shadow-qa-card border-2 border-qa-blue relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-qa-blue text-qa-neutral-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-qa-neutral-dark">
                    Credit Packs
                  </h3>
                  <div className="text-3xl font-bold text-qa-neutral-dark">
                    $5 - $25
                  </div>
                  <p className="text-qa-neutral-medium">Pay as you need</p>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      $5 = 3 audits
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      $12 = 10 audits
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      $25 = 25 audits
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Credits never expire
                    </span>
                  </li>
                </ul>
                <button className="w-full mt-6 px-4 py-3 bg-qa-blue text-qa-neutral-white rounded-lg font-semibold shadow-qa-button hover:bg-qa-blue-hover hover:shadow-qa-button-hover transition-all duration-200">
                  Buy Credits
                </button>
              </div>

              {/* Yearly Plan */}
              <div className="bg-qa-neutral-white rounded-xl p-6 shadow-qa-card">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-qa-neutral-dark">
                    Yearly Plan
                  </h3>
                  <div className="text-3xl font-bold text-qa-neutral-dark">
                    $99
                  </div>
                  <p className="text-qa-neutral-medium">For active users</p>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      120 audits per year
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Weekly auto-rescans
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Priority support
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Team features
                    </span>
                  </li>
                </ul>
                <button className="w-full mt-6 px-4 py-3 border border-qa-blue text-qa-blue rounded-lg font-semibold hover:bg-qa-neutral-ultra-light transition-colors">
                  Choose Yearly
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions section */}
      <FAQSection />

      {/* CTA Testimonial Section */}
      <CTATestimonialSection />

      {/* Final CTA Section */}
      {/* <section className="py-20 bg-[#2B2D42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Stop Guessing and Start Ranking?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of site owners who've transformed their SEO with
            ClearAudit's step-by-step approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="default"
              size="lg"
              className="bg-[#4ECDC4] hover:bg-[#3BB8B5] px-8 py-4 text-lg"
            >
              Scan My Site in 60 Seconds
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#2B2D42] px-8 py-4 text-lg"
            >
              See Why My Competitors Rank Higher
            </Button>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            ⚡ Spots in the Early Bird plan are limited
          </p>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-qa-neutral-footer border-t border-qa-neutral-border py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-qa-blue rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-qa-neutral-white" />
              </div>
              <span className="text-lg font-bold text-qa-neutral-dark">
                Quick-Audit
              </span>
            </div>
            <p className="text-sm text-qa-neutral-medium">
              The SEO audit tool for non-SEO experts. Get clear, actionable
              insights in plain English.
            </p>
            <p className="text-xs text-qa-neutral-light">
              © 2025 Quick-Audit. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-qa-neutral-dark uppercase tracking-wide">
              Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:tegeltijaformal@gmail.com"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Pricing
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Dashboard
                </a>
              </li> */}
              {/* <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Blog
                </a>
              </li> */}
              {/* <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Affiliates
                </a>
              </li> */}
            </ul>
          </div>

          {/* Legal */}
          {/* <div className="space-y-4">
            <h4 className="text-sm font-semibold text-qa-neutral-dark uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
