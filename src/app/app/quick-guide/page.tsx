"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Upload,
  Plus,
  AlertTriangle,
  CheckCircle,
  Users,
  Crown,
  Sparkles,
  Star,
  HardDrive,
} from "lucide-react";

export default function QuickGuidePage() {
  const subscriptionTiers = [
    {
      name: "Free",
      icon: Sparkles,
      classes: 2,
      lessons: 3,
      tests: 3,
      storage: "10 MB",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      name: "Starter",
      icon: Star,
      classes: 3,
      lessons: 10,
      tests: 10,
      storage: "250 MB",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      name: "Pro",
      icon: Crown,
      classes: 100,
      lessons: 100,
      tests: 100,
      storage: "500 MB",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Sign Up & Login",
      icon: Users,
      description: "Create your account and log in to access the app.",
      details: [
        "Click 'Sign In' to create your account",
        "Verify your email address",
        "Complete your profile setup",
        "You'll start with a Free tier account",
      ],
    },
    {
      number: 2,
      title: "Create Your First Class",
      icon: BookOpen,
      description:
        "Classes are containers for organizing your lessons and materials.",
      details: [
        "Go to 'My Classes' from the sidebar",
        "Click 'Create New Class'",
        "Enter a descriptive title and description",
        "Each class can contain multiple lessons",
      ],
    },
    {
      number: 3,
      title: "Add Lessons to Your Class",
      icon: FileText,
      description: "Lessons organize your study materials by topic or chapter.",
      details: [
        "Open your class and click 'Add New Lesson'",
        "Give your lesson a clear title and description",
        "You can add materials while creating the lesson",
        "Or add materials later from the lesson page",
      ],
    },
    {
      number: 4,
      title: "Upload Study Materials",
      icon: Upload,
      description: "Upload PDF documents and text files to your lessons.",
      details: [
        "Supported file types: PDF and TXT files",
        "Maximum file size: 16MB per file",
        "You can upload up to 10 files at once",
        "Materials can be linked to specific lessons",
      ],
    },
    {
      number: 5,
      title: "Generate Tests",
      icon: GraduationCap,
      description: "Create AI-powered tests from your study materials.",
      details: [
        "Select ONE class for test generation",
        "Choose specific lessons from that class",
        "Set question amount and difficulty",
        "Choose question types (Multiple Choice, True/False, etc.)",
        "Add custom instructions if needed",
      ],
    },
  ];

  const importantLimitations = [
    {
      title: "Class Selection for Tests",
      description:
        "You can only select materials from ONE class per test. You cannot mix materials from different classes.",
      type: "warning",
    },
    {
      title: "Storage Limits",
      description:
        "Each subscription tier has different storage limits. Free: 10MB, Starter: 250MB, Pro: 500MB.",
      type: "info",
    },
    {
      title: "File Requirements",
      description:
        "Materials must be PDF or TXT files. Other formats are not supported.",
      type: "warning",
    },
    {
      title: "Lesson Limits",
      description:
        "Free tier is limited to 3 lessons per class. Upgrade for more lessons.",
      type: "info",
    },
  ];

  const tips = [
    {
      title: "Organize Your Materials",
      description:
        "Use clear, descriptive names for your classes and lessons. This helps when generating tests later.",
    },
    {
      title: "Quality Over Quantity",
      description:
        "Upload well-structured, text-heavy PDFs for better test generation. Scan quality matters!",
    },
    {
      title: "Test Configuration",
      description:
        "Start with fewer questions (5-10) and moderate difficulty to get familiar with the system.",
    },
    {
      title: "Review and Share",
      description:
        "After taking a test, review your results and share them with others if needed.",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-bold text-primary">Quick Start Guide</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Learn how to use Teach.me effectively - from creating classes to
          generating AI-powered tests
        </p>
      </div>

      {/* Subscription Tiers Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Subscription Tiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionTiers.map((tier) => (
              <div key={tier.name} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <tier.icon className="h-4 w-4" />
                    {tier.name}
                  </h3>
                  <Badge className={tier.color}>{tier.name}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Classes:</span>
                    <span>{tier.classes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lessons:</span>
                    <span>{tier.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tests:</span>
                    <span>{tier.tests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage:</span>
                    <span>{tier.storage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Step-by-Step Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <step.icon className="h-4 w-4" />
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <ul className="space-y-1">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < steps.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Important Limitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Important Limitations & Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {importantLimitations.map((limitation, index) => (
            <Alert key={index}>
              <AlertTriangle
                className={`h-4 w-4 ${limitation.type === "warning" ? "text-warning" : "text-blue-500"}`}
              />
              <AlertDescription>
                <strong>{limitation.title}:</strong> {limitation.description}
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Tips & Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Tips & Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-primary">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File Upload Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            File Upload Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Supported Formats</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>PDF files (.pdf)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Text files (.txt)</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">File Limits</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Max file size: 16MB</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Max files per upload: 10</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Storage limits by tier</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Generation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Test Generation Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-200">
            <AlertTriangle className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              <strong>Single Class Rule:</strong> You can only generate tests
              from materials within ONE class. You cannot mix materials from
              different classes in the same test.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-semibold">Test Generation Process:</h4>
            <ol className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Select ONE class from your available classes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Choose specific lessons from that class</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>
                  Configure question settings (amount, difficulty, types)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span>Add any additional instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  5
                </span>
                <span>Generate your AI-powered test</span>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started CTA */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
          <p className="text-muted-foreground mb-4">
            Follow the steps above to create your first class, add lessons,
            upload materials, and generate your first AI-powered test!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Badge variant="outline" className="bg-background">
              Start with creating your first class
            </Badge>
            <Badge variant="outline" className="bg-background">
              Upload quality PDF materials
            </Badge>
            <Badge variant="outline" className="bg-background">
              Generate focused tests
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
