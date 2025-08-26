"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Atom,
  Brain,
  ChevronDown,
  Clock8,
  Cross,
  Eye,
  Feather,
  HeartPulse,
  Shield,
  ShieldPlus,
  Sun,
  Timer,
  View,
} from "lucide-react";
import { NewsletterSubscriptionForm } from "@/components/newsletter-subscription-form";
import Image from "next/image";

function TabbedSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "smart-tracking",
      title: "Smart Tracking",
      icon: <Clock8 />,
      description: "See exactly how long you’ve been working",
      content:
        "Time flies when you’re deep in work—and that’s when strain sneaks up. Smart Tracking keeps you aware of exactly how long you’ve been at it, so you don’t lose track of hours behind the screen. No timers to check, no mental math—just clear awareness of your work sessions.",
    },
    {
      id: "subtle-awareness",
      title: "Subtle Awareness",
      icon: <View />,
      description: "A warm screen glow nudges you before fatigue builds",
      content:
        "Most apps either nag you with popups or block your screen completely. This tool takes a different approach: a subtle warm screen cue that gently nudges you before fatigue sets in. It doesn’t stop your work—it helps you wrap up naturally, without breaking your flow.",
    },
    {
      id: "custom-intervals",
      title: "Custom Intervals",
      icon: <Timer />,
      description: "Choose work and rest times that match your rhythm",
      content:
        "Everyone works differently. Some focus best in 25-minute sprints, others in 90-minute deep work blocks. Set intervals that match your workflow, and the app will guide you to rest at the right time—whether you’re a sprinter or a marathoner.",
    },
    {
      id: "health-first",
      title: "Health-First",
      icon: <HeartPulse />,
      description: "Designed to protect your eyes, mind, and energy",
      content:
        "This isn’t just another productivity tracker. It’s built with your health in mind. By keeping breaks consistent and preventing overwork, it reduces eye strain, mental fatigue, and even the stress that builds up silently during long hours. Protect your energy, not just your output.",
    },
    {
      id: "light-and-simple",
      title: "Light & Simple",
      icon: <Feather />,
      description: "Runs quietly in the background, no clutter, no friction.",
      content:
        "Forget heavy, bloated apps that slow you down or force hard stops. This one runs quietly in the background—lightweight, distraction-free, and always there when you need it. No interruptions, no overengineering—just the right level of guidance to keep you on track.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-medium text-qa-neutral-dark mb-6">
            Must have features for hard workers
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto ">
          <div className="bg-primary-cream2 rounded-t-xl border border-qa-neutral-border border-b-0">
            <div className="flex overflow-x-auto">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === index
                      ? "border-qa-success text-qa-neutral-dark bg-primary-cream2"
                      : "border-transparent text-qa-neutral-medium hover:text-qa-neutral-dark hover:border-qa-neutral-border"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-primary-cream2 rounded-b-xl border border-qa-neutral-border border-t-0 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div>
                <h3 className="text-2xl font-bold text-qa-neutral-dark mb-4">
                  {tabs[activeTab]?.description}
                </h3>
                <p className="text-base text-qa-neutral-medium mb-6 leading-relaxed">
                  {tabs[activeTab]?.content}
                </p>
              </div>

              {/* Right Content - Mockup */}
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-cream to-white rounded-xl p-6 border border-qa-neutral-border">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-qa-danger rounded-full"></div>
                        <div className="w-2 h-2 bg-qa-warning rounded-full"></div>
                        <div className="w-2 h-2 bg-qa-success rounded-full"></div>
                      </div>
                    </div>

                    {activeTab === 0 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-qa-neutral-dark flex justify-between">
                          <div>Smart Tracking</div>

                          <div className="text-xs text-qa-neutral-medium">
                            Total: 4h 30m
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-qa-neutral-border space-y-3">
                          {/* X (Twitter) Progress Bar */}
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                𝕏
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: "68%" }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-qa-neutral-dark min-w-[32px]">
                              68%
                            </span>
                          </div>

                          {/* ChatGPT Progress Bar */}
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-sm flex items-center justify-center">
                              <span className="text-white text-xs">✦</span>
                            </div>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: "32%" }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-qa-neutral-dark min-w-[32px]">
                              32%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-qa-neutral-dark flex justify-between">
                          Subtle awareness
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white rounded p-2 border border-qa-neutral-border">
                            <div className="w-full h-6 bg-qa-warning rounded opacity-40"></div>
                          </div>
                          <div className="bg-white rounded p-2 border border-qa-neutral-border">
                            <div className="w-full h-6 bg-qa-danger rounded opacity-40"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-qa-neutral-dark">
                          Session Settings
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-qa-neutral-border space-y-3">
                          {/* Work Session Setting */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-qa-neutral-dark">
                                Work Session
                              </span>
                              <span className="text-xs text-qa-success font-semibold">
                                45 min
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-qa-neutral-dark text-sm font-bold transition-colors">
                                −
                              </button>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                                <div
                                  className="bg-gradient-to-r from-qa-success to-primary-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: "75%" }}
                                ></div>
                                <div className="absolute top-0 left-[75%] w-3 h-3 bg-white border-2 border-qa-success rounded-full transform -translate-x-1/2 -translate-y-0.5 cursor-pointer shadow-sm"></div>
                              </div>
                              <button className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-qa-neutral-dark text-sm font-bold transition-colors">
                                +
                              </button>
                            </div>
                            <div className="flex justify-between text-xs text-qa-neutral-medium">
                              <span>15 min</span>
                              <span>90 min</span>
                            </div>
                          </div>

                          {/* Break Session Setting */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-qa-neutral-dark">
                                Break Session
                              </span>
                              <span className="text-xs text-qa-danger font-semibold">
                                10 min
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-qa-neutral-dark text-sm font-bold transition-colors">
                                −
                              </button>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                                <div
                                  className="bg-gradient-to-r from-qa-danger to-danger-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: "33%" }}
                                ></div>
                                <div className="absolute top-0 left-[33%] w-3 h-3 bg-white border-2 border-qa-danger rounded-full transform -translate-x-1/2 -translate-y-0.5 cursor-pointer shadow-sm"></div>
                              </div>
                              <button className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-qa-neutral-dark text-sm font-bold transition-colors">
                                +
                              </button>
                            </div>
                            <div className="flex justify-between text-xs text-qa-neutral-medium">
                              <span>5 min</span>
                              <span>30 min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 3 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-qa-neutral-dark">
                          Science-backed
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-qa-neutral-border">
                          <div className="text-sm  text-qa-success">
                            Based on legitimate scientific studies, and backed
                            by the research
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 4 && (
                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-qa-neutral-dark">
                          Technical setup
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white rounded p-2 border border-qa-neutral-border text-xs">
                            <span className="text-qa-success">✓</span> Install
                            and forget
                          </div>
                          <div className="bg-white rounded p-2 border border-qa-neutral-border text-xs">
                            <span className="text-qa-warning">◐</span> Pause
                            when you want
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
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqData = [
    {
      question: "What is WarmView and how does it work?",
      answer:
        "WarmView is a lightweight tool that helps you stay mindful of your screen time. It quietly tracks how long you've been working and gives you subtle on-screen cues—like a warm glow—when it's time to step away. No distractions, no forced lockouts, just gentle awareness.",
    },
    {
      question: "Can I adjust my own work and break times?",
      answer:
        "Yes. You're in control. You can set custom work and rest intervals that match your rhythm—whether you prefer short sprints or longer focus sessions.",
    },
    {
      question: "What if my working time expires?",
      answer:
        "Nothing is blocked. WarmView simply makes you aware that you've gone past your chosen limit with a visual nudge. It's your choice whether to continue, wrap up, or take a break.",
    },
    {
      question: "How is WarmView different from other productivity apps?",
      answer:
        "Most apps either block your screen entirely or send occasional reminders you can easily dismiss. WarmView takes a balanced approach—constant, subtle awareness that keeps you mindful without interrupting your work.",
    },
    {
      question: "Is WarmView heavy on resources?",
      answer:
        "Not at all. It runs quietly in the background with minimal CPU or memory use. You won't even notice it—until it reminds you to pause.",
    },
    {
      question: "Does WarmView collect my data?",
      answer:
        "No. Your screen-time tracking stays on your device. WarmView does not collect browsing history, keystrokes, or personal data. Your privacy is fully protected.",
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
  const [showPositiveOutcome, setShowPositiveOutcome] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-medium text-qa-neutral-dark flex items-center gap-2">
              <Sun className="w-6 h-6 text-orange-300" />
              WarmView
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-qa-neutral-dark hover:text-qa-success font-medium text-sm transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-qa-neutral-dark hover:text-qa-success font-medium text-sm transition-colors"
              >
                About
              </a>
              <a
                href="#faq"
                className="text-qa-neutral-dark hover:text-qa-success font-medium text-sm transition-colors"
              >
                FAQ
              </a>
            </div>
            {/* <Button size="lg">Start Free Scan</Button> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-16 pb-24"
        style={{
          background:
            "radial-gradient(ellipse at bottom, #fed7aa 25%, #fef3c7 50%, #ffffff 75%, #f7f4f1 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> */}
            {/* Left Content */}
            <div className="px-32 text-center flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-qa-neutral-dark font-medium mb-6 leading-tight">
                The simplest way to prevent burnout
              </h1>
              <p className="text-xl text-qa-neutral-dark mb-8 leading-relaxed max-w-2xl">
                Be constantly aware of your screen time progressing, let the
                screen heath remind you that it&apos;s time for a cool off.
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

              <div className="flex flex-col items-start sm:flex-col gap-2 mb-12 ">
                <NewsletterSubscriptionForm
                  utmCampaign="waitlist"
                  utmSource="website"
                  utmMedium="hero-form"
                  placeholder="Join the waitlist"
                  buttonText="Count Me In"
                />

                <p className="text-xs text-qa-neutral-medium">
                  {/* No credit card required • Emmediataly results */}
                  Early birds get{" "}
                  {/* <a href="#pricing" className="underline"> */}
                  additional discounts
                  {/* </a> */}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-xs text-qa-neutral-medium">
                <div className="flex items-center space-x-1 text-qa-neutral-dark">
                  <Cross className="w-4 h-4 " />

                  <span>Health-oriented</span>
                </div>
                <div className="flex items-center space-x-1 text-qa-neutral-dark">
                  <Shield className="w-4 h-4 " />

                  <span>Privacy First</span>
                </div>
                <div className="flex items-center space-x-1 text-qa-neutral-dark">
                  <Atom className="w-4 h-4" />
                  <span>Science-backed</span>
                </div>
              </div>
            </div>

            {/* Right Content - Placeholder for Image/Mockup */}

            {/* <div className="relative"> */}
            <div className="relative px-72">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 mb-4">
                <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                  <video
                    className="hero-demo"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/poster.png"
                  >
                    <source src="/output.webm" type="video/webm" />
                    <source src="/output.mp4" type="video/mp4" />
                  </video>

                  {/* <div className="text-center">
                    <div className="w-16 h-16 bg-qa-success rounded-lg mx-auto mb-4 flex items-center justify-center">
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
                  </div> */}
                </div>
              </div>
              <p className="text-xs text-qa-neutral-dark mt-2 text-right italic">
                *Note: Warm effects are exaggerated for demonstration purposes.
              </p>

              {/* Floating card mockups */}
              {/* <div className="absolute -left-20 -bottom-12 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-48 transform -rotate-6"> */}
              <div className="absolute left-40 top-60 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-48 transform -rotate-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-qa-success rounded-full flex items-center justify-center">
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
                  <span className="text-sm font-medium text-qa-neutral-dark">
                    WarmView
                  </span>
                </div>
                <div className="text-2xl font-bold text-qa-success">
                  <span className="text-xs text-qa-neutral-medium">
                    Total time: 4h 30m
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">+12% this week</div>
              </div>

              {/* <div className="absolute -right-12 -top-12 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-52 transform rotate-3"> */}
              <div className="absolute right-40 -top-12 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-52 transform rotate-3">
                <div className="text-sm font-medium text-qa-neutral-dark mb-2">
                  Smart tracking
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">𝕏</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-qa-neutral-dark min-w-[32px]">
                      68%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs">✦</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: "32%" }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-qa-neutral-dark min-w-[32px]">
                      32%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Pitch Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-medium text-qa-neutral-dark mb-6">
              Working without a break has its consequences
            </h2>
            <p className="text-xl text-qa-neutral-medium max-w-3xl mx-auto">
              What feels like small sacrifices today turns into real health
              costs tomorrow
            </p>
          </div>

          {/* Three Column Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Column 1 */}
            <div className="text-left">
              <div className="text-left relative">
                <div
                  className="w-20 h-20 rounded-full mb-6"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(78, 205, 196, 0.5), transparent)",
                    filter: "blur(8px)",
                  }}
                ></div>
                <Brain className="w-10 h-10 text-qa-neutral-dark absolute top-[21px] left-[21px]" />
              </div>

              <h3 className="text-xl font-semibold text-qa-neutral-dark mb-4 text-left">
                Prevent Screen-Time Anxiety
              </h3>

              <p className="text-qa-neutral-medium leading-relaxed italic">
                “The relationship between screen time and mental health is
                dose-dependent—more time, worse outcomes.”
              </p>
              <p className="text-qa-neutral-medium  text-sm pt-4 leading-relaxed text-right">
                - Published via{" "}
                <span className="underline font-semibold">
                  ResearchGate, 2024
                </span>
              </p>
            </div>

            {/* Column 2 */}
            <div className="text-left">
              <div className="text-left relative">
                <div
                  className="w-20 h-20 rounded-full mb-6"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 217, 61, 0.5), transparent)",
                    filter: "blur(8px)",
                  }}
                ></div>
                <ShieldPlus className="w-10 h-10 text-qa-neutral-dark absolute top-[21px] left-[21px]" />
              </div>
              <h3 className="text-xl font-semibold text-qa-neutral-dark mb-4">
                Your Gut Feels Your Screen Hours
              </h3>
              <p className="text-qa-neutral-medium leading-relaxed">
                “Having high levels of LST (leisure sedentary behavior) is
                connected with an increased chance of developing IBS.”
              </p>
              <p className="text-qa-neutral-medium  text-sm pt-4 leading-relaxed text-right">
                - Published via{" "}
                <span className="underline font-semibold">
                  Scientific Reports, 2023
                </span>
              </p>
            </div>

            {/* Column 3 */}
            <div className="text-left">
              <div className="text-left relative">
                <div
                  className="w-20 h-20 rounded-full mb-6"
                  style={{
                    background:
                      "radial-gradient(circle, rgb(164,121,148), transparent)",
                    filter: "blur(8px)",
                  }}
                ></div>
                <Eye className="w-10 h-10 text-qa-neutral-dark absolute top-[21px] left-[21px]" />
              </div>
              <h3 className="text-xl font-semibold text-qa-neutral-dark mb-4">
                Science-Backed Eye Relief
              </h3>
              <p className="text-qa-neutral-medium leading-relaxed">
                “The findings suggest that lighting at 3000​K (warm light) is
                conducive to visual fatigue recovery.”
              </p>
              <p className="text-qa-neutral-medium  text-sm pt-4 leading-relaxed text-right">
                - Published via{" "}
                <span className="underline font-semibold">
                  Science Direct, 2024
                </span>
              </p>
            </div>
          </div>

          {/* Customer Testimonials Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Coinbase */}
            <div className="bg-primary-cream2 rounded-2xl p-8 shadow-sm border border-qa-neutral-border flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-qa-neutral-dark mb-2">
                    ResearchGate
                  </div>
                </div>
                <p className="text-qa-neutral-medium leading-relaxed">
                  The Associations Between Screen Time and Mental Health in
                  Adults: A Systematic Review.
                </p>
              </div>
              <Link
                href="https://www.researchgate.net/publication/378291048_The_Associations_Between_Screen_Time_and_Mental_Health_in_Adults_A_Systematic_Review"
                className="text-qa-neutral-dark font-medium hover:underline inline-flex items-center mt-auto"
                target="_blank"
              >
                Read Case Study →
              </Link>
            </div>

            {/* Ramp */}
            <div className="bg-primary-cream2 rounded-2xl p-8 shadow-sm border border-qa-neutral-border flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <div className="text-2xl  text-qa-neutral-dark mb-2">
                    <span className="font-bold">Scientific</span> Reports
                  </div>
                </div>
                <p className="text-qa-neutral-medium mb-6 leading-relaxed">
                  The causal effects of leisure screen time on irritable bowel
                  syndrome risk from a Mendelian randomization study.
                </p>
              </div>
              <Link
                href="https://www.nature.com/articles/s41598-023-40153-1"
                className="text-qa-neutral-dark font-medium hover:underline inline-flex items-center mt-auto"
                target="_blank"
              >
                Read Case Study →
              </Link>
            </div>

            {/* Square */}
            <div className="bg-primary-cream2 rounded-2xl p-8 shadow-sm border border-qa-neutral-border flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <div className="text-2xl text-qa-neutral-dark mb-2 flex items-center">
                    ScienceDirect
                  </div>
                </div>
                <p className="text-qa-neutral-medium mb-6 leading-relaxed">
                  Square uncovered 100+ actionable customer insights within the
                  first 6 months.
                </p>
              </div>
              <Link
                href="https://www.sciencedirect.com/science/article/pii/S2949782524000124?utm_source=chatgpt.com"
                target="_blank"
                className="text-qa-neutral-dark font-medium hover:underline inline-flex items-center"
              >
                Read Case Study →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Intro Section */}
      <TabbedSection />

      {/* About me Section */}
      <section id="about" className="py-20 bg-primary-cream2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-12 flex">
            {/* Right Content - Story */}

            <div className="text-qa-neutral-dark">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1 flex justify-center">
                  <Image
                    src="/LukaAvatar.webp"
                    className="w-24 h-24 m-2 rounded-full object-cover object-center"
                    alt="Luka's Avatar image"
                    width={96}
                    height={96}
                    quality={100}
                  />
                </div>
                <div className="col-span-3">
                  <div className="mb-6 space-y-4">
                    Hey, it&apos;s{" "}
                    <a
                      href="https://x.com/geopard__"
                      target="_blank"
                      className="underline"
                    >
                      Luka
                    </a>
                    <p>
                      <span className="text-qa-neutral-dark font-semibold">
                        Six months ago, I went on a chase of the solopreneur
                        dream while working full-time.
                      </span>{" "}
                      The result? Burnout, stomach issues, and an IBS diagnosis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-qa-neutral-dark leading-relaxed">
                {/* <p>
                  <span className="text-qa-neutral-dark font-semibold">
                    Six months ago, I went on a chase of the solopreneur dream
                    while working full-time.
                  </span>{" "}
                  The result? Burnout, stomach issues, and an IBS diagnosis.
                </p> */}

                <p>Doctors told me that each time I forced myself to:</p>

                <div className="space-y-2 ml-4">
                  <div className="flex items-start gap-3">
                    <span className="text-qa-danger">•</span>
                    <p className="text-qa-neutral-dark italic">
                      finish &quot;just one more thing&quot;
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-qa-danger">•</span>
                    <p className="text-qa-neutral-dark italic">
                      push through heavy tasks
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-qa-danger">•</span>
                    <p className="text-qa-neutral-dark italic">
                      avoid leaving work for tomorrow
                    </p>
                  </div>
                </div>

                <p className="text-qa-neutral-dark">
                  …I was{" "}
                  <span className="font-semibold">
                    stressing my body until it made me sick.
                  </span>
                </p>

                <p>
                  They insisted I limit screen time, split work into chunks, and
                  take real breaks.
                </p>

                <p className="text-qa-neutral-dark italic">
                  But every app I tried either{" "}
                  <span className="text-qa-danger font-semibold">
                    blocked me completely
                  </span>{" "}
                  or sent{" "}
                  <span className="text-qa-danger font-semibold">
                    weak reminders I ignored.
                  </span>
                </p>

                <p className="text-qa-neutral-dark font-semibold">
                  So I decided to build my own tool—one that keeps me aware when
                  I&apos;ve gone too far, without stopping me from getting
                  things done.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 
      <section id="pricing" className="py-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-medium text-qa-neutral-dark tracking-tight leading-tight">
              Try{" "}
              <span className="bg-qa-neutral-dark underline text-qa-neutral-white px-1">
                3 days free
              </span>{" "}
              then choose your plan
            </h2>
            <p className="text-base md:text-xl text-qa-neutral-medium max-w-2xl mx-auto">
              Start with a full trial, then pick the plan that works for you. No
              hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 ">
            <div className="flex items-center space-x-3 p-4 mx-auto">
              <Zap className="w-6 h-6 text-qa-success" />
              <span className="text-qa-neutral-dark">
                3-day full trial access
              </span>
            </div>
            <div className="flex items-center space-x-3 p-4 mx-auto">
              <Eye className="w-6 h-6 text-qa-blue" />
              <span className="text-qa-neutral-dark">
                Visual screen heat tracking
              </span>
            </div>
            <div className="flex items-center space-x-3 p-4 mx-auto">
              <Shield className="w-6 h-6 text-qa-success" />
              <span className="text-qa-neutral-dark">
                No forced breaks, just awareness
              </span>
            </div>
          </div>

          <div>
            <div className="py-8 px-6 w-fit mx-auto">
              <div className="max-w-4xl mx-auto">
                <div className="bg-primary/20 rounded-2xl p-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">💰</span>
                      <div className="text-qa-neutral-dark ">
                        <p className="text-base font-semibold">
                          Early Birds get a coupon code for 50% off for a
                          lifetime.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary-cream2 border-2 border-qa-neutral-dark m-2 rounded-xl p-6 shadow-qa-card">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-qa-neutral-dark">
                    3-Day Trial
                  </h3>
                  <div className="text-3xl font-bold text-qa-neutral-dark">
                    $0
                  </div>
                  <p className="text-qa-neutral-medium">
                    Try all features free
                  </p>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Visual heat overlay
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Time tracking dashboard
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Per-site multipliers
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Night-shift mode
                    </span>
                  </li>
                </ul>
                <a href="#hero">
                  <Button className="w-full mt-6">Notify me on launch</Button>
                </a>
              </div>

              <div className="bg-primary-cream2 border-2 border-qa-neutral-dark m-2 rounded-xl p-6 shadow-qa-card">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-qa-neutral-dark">
                    Pro Monthly
                  </h3>
                  <div className="text-3xl font-bold text-qa-neutral-dark">
                    $3.99
                  </div>
                  <p className="text-qa-neutral-medium">
                    Per month, cancel anytime
                  </p>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      All trial features included
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Unlimited time tracking
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Custom heat sensitivity
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Priority support
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Notify me on launch</Button>
              </div>

              <div className="bg-primary-cream2 border-2 border-primary m-2 rounded-xl p-6 shadow-qa-card relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-qa-neutral-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-qa-neutral-dark">
                    Pro Yearly
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="text-3xl font-bold text-qa-neutral-dark">
                      $29.99
                    </div>
                    <div className="text-sm text-qa-neutral-medium">
                      <div className="line-through">$47.88</div>
                      <div className="text-green-600 font-semibold">
                        Save 37%
                      </div>
                    </div>
                  </div>
                  <p className="text-qa-neutral-medium">Per year, best value</p>
                </div>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      All Pro features included
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Save $17.89 vs monthly
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Future updates included
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-qa-success" />
                    <span className="text-sm text-qa-neutral-dark">
                      Priority support
                    </span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Notify me on launch</Button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Frequently Asked Questions section */}
      <FAQSection />

      {/* CTA Testimonial Section */}
      {/* <CTATestimonialSection /> */}

      {/* Final CTA Section */}
      {/* <section className="py-20 bg-qa-neutral-dark">
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
              className="bg-qa-success hover:bg-primary-600 px-8 py-4 text-lg"
            >
              Scan My Site in 60 Seconds
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-qa-neutral-dark px-8 py-4 text-lg"
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
              <span className="text-lg font-bold text-qa-neutral-dark flex items-center gap-2">
                <Sun className="w-6 h-6 text-orange-300" />
                WarmView
              </span>
            </div>
            <p className="text-sm text-qa-neutral-medium">
              The chrome extension that helps you stay aware of your screen
              time.
            </p>
            <p className="text-xs text-qa-neutral-light">
              © 2025 WarmView. All rights reserved.
            </p>
          </div>

          {/* <div className="space-y-4">
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
              <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-qa-neutral-medium hover:text-qa-blue transition-colors"
                >
                  Affiliates
                </a>
              </li>
            </ul>
          </div> */}

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
