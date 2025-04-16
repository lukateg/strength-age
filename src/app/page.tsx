import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import Link from "next/link";
import {
  PDFIcon,
  VoiceIcon,
  AIBrainIcon,
  NotesIcon,
  TestIcon,
  CollaborationIcon,
} from "@/components/feature-icons";

const features = [
  {
    icon: <PDFIcon className="h-12 w-12 text-primary" />,
    title: "Smart PDF Processing",
    description:
      "Upload and process learning materials with AI-powered analysis for enhanced comprehension.",
  },
  {
    icon: <VoiceIcon className="h-12 w-12 text-primary" />,
    title: "Voice-Powered Learning",
    description:
      "Convert your PDFs into natural-sounding audio for on-the-go learning experiences.",
  },
  {
    icon: <AIBrainIcon className="h-12 w-12 text-primary" />,
    title: "AI Study Assistant",
    description:
      "Get instant answers and explanations with our intelligent chat-based learning companion.",
  },
  {
    icon: <NotesIcon className="h-12 w-12 text-primary" />,
    title: "Smart Notes & Summarization",
    description:
      "Generate concise summaries and structured notes automatically from your materials.",
  },
  {
    icon: <TestIcon className="h-12 w-12 text-primary" />,
    title: "AI Test Generation",
    description:
      "Create custom quizzes and tests automatically from your study materials.",
  },
  {
    icon: <CollaborationIcon className="h-12 w-12 text-primary" />,
    title: "Class Collaboration",
    description:
      "Work together with classmates in real-time study sessions and shared workspaces.",
  },
];

const stats = [
  {
    number: "1200+",
    label: "Learning Materials",
    description: "Comprehensive collection of educational resources",
  },
  {
    number: "220",
    label: "AI Features",
    description: "Cutting-edge learning tools and features",
  },
  {
    number: "30K+",
    label: "Active Users",
    description: "Students and educators trust our platform",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Teach Anything
              <br />
              Learn Anytime
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the future of education with AI-powered learning tools,
              smart analytics, and collaborative features.
            </p>
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg font-medium mb-2">{stat.label}</div>
                <div className="text-muted-foreground text-sm">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Powerful Features for Modern Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card/50 hover:bg-card/80 transition-colors border-border/40"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Teach.me</span>
            </div>
            <div className="flex gap-8">
              <span
                // href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </span>
              <span
                // href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Features
              </span>
              <span
                // href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pricing
              </span>
              <span
                // href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </span>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            © 2024 Teach.me. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
