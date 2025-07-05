import {
  PDFIcon,
  TestIcon,
  CollaborationIcon,
  VoiceIcon,
  NotesIcon,
} from "@/components/feature-icons";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: <PDFIcon className="h-12 w-12 text-primary" />,
    title: "PDF Upload",
    description:
      "Upload and process learning materials with AI-powered analysis for enhanced comprehension.",
    available: true,
  },
  {
    icon: <TestIcon className="h-12 w-12 text-primary" />,
    title: "AI Test Generation",
    description:
      "Create custom quizzes and tests automatically from your study materials with intelligent question generation.",
    available: true,
  },
  {
    icon: <ArrowRight className="h-12 w-12 text-primary" />,
    title: "Dev Team Response",
    description:
      "Leave a feedback and get a response from the dev team in shortest possible time.",
    available: true,
  },
  {
    icon: <CollaborationIcon className="h-12 w-12 text-primary" />,
    title: "Class Collaboration",
    description:
      "Work together with classmates in a group, and share the tests and materials with them.",
    available: false,
    comingSoon: true,
  },
  {
    icon: <VoiceIcon className="h-12 w-12 text-primary" />,
    title: "Voice-Powered Learning",
    description:
      "Convert your PDFs into natural-sounding audio for convenient on-the-go learning experiences.",
    available: false,
    comingSoon: true,
  },
  {
    icon: <NotesIcon className="h-12 w-12 text-primary" />,
    title: "Smart Notes Summarization",
    description:
      "Generate concise summaries and structured notes automatically from your uploaded materials.",
    available: false,
    comingSoon: true,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 border-t border-border/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
          Powerful Features for Modern Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <Card
              key={index}
              className={`relative bg-card/50 hover:bg-card/80 transition-all duration-300 border-border/40 hover:border-primary/20 ${
                !feature.available ? "opacity-75" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {!feature.available && (
                    <Badge
                      variant="secondary"
                      className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    >
                      Coming Soon
                    </Badge>
                  )}
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
