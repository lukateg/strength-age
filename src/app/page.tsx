"use client";

import HeroSection from "./components/hero-section";
import StatsSection from "./components/stats-section";
import FeaturesSection from "./components/features-section";
import PricingSection from "./components/pricing-section";
import CTA from "./components/cta-section";
import FooterSection from "./components/footer-section";
import RoadmapSection from "./components/roadmap-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <HeroSection />
      <StatsSection />
      <RoadmapSection />
      <FeaturesSection />
      <PricingSection />
      <CTA />
      <FooterSection />
    </div>
  );
}
