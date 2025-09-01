"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Activity, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";

// Form validation schemas for each step
const step1Schema = z.object({
  age: z.number().min(50).max(100),
  sex: z.enum(["male", "female"]),
  height: z.number().min(130).max(210),
  waist: z.number().min(50).max(160),
});

const step2Schema = z.object({
  chairStand: z.number().min(0).max(40),
  singleLegBalance: z.number().min(0).max(30),
});

const step3Schema = z.object({
  restingHR: z.number().min(40).max(120),
  weeklyActivity: z.enum(["0", "1-2", "3-5", "6-7"]),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type FormData = z.infer<typeof fullSchema>;

interface StepProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: (data: FormData) => void;
  form: any;
}

function Step1({ currentStep, totalSteps, onNext, form }: StepProps) {
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const isValid = await form.trigger(["age", "sex", "height", "waist"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl">Basic Information</CardTitle>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Age (years)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Used to compare your results with age-matched norms.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseInt(value, 10)
                      );
                    }}
                    placeholder="e.g., 65"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Sex
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Strength & balance norms differ by sex.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value || ""}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Height (cm)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Used with waist measurement for Waist-to-Height Ratio
                          calculation.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseInt(value, 10)
                      );
                    }}
                    placeholder="e.g., 170"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="waist"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Waist Circumference (cm)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Waist-to-Height Ratio is a strong health indicator
                          linked to longevity.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseInt(value, 10)
                      );
                    }}
                    placeholder="e.g., 85"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Step2({ currentStep, totalSteps, onNext, onPrev, form }: StepProps) {
  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const isValid = await form.trigger(["chairStand", "singleLegBalance"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl">Fitness Tests</CardTitle>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="chairStand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  30-Second Chair Stand (reps)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Part of the Senior Fitness Test (Rikli & Jones).
                          Predicts strength & mobility.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseInt(value, 10)
                      );
                    }}
                    placeholder="e.g., 15"
                  />
                </FormControl>
                <FormDescription>
                  Sit in a chair, cross arms over chest, and count how many
                  times you can stand up and sit down in 30 seconds.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="singleLegBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Single-Leg Stance (seconds, max 30)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Simple balance screen linked to fall risk. Higher is
                          better.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseInt(value, 10)
                      );
                    }}
                    placeholder="e.g., 20"
                  />
                </FormControl>
                <FormDescription>
                  Stand on one leg with eyes open. Count how many seconds you
                  can maintain balance (stop at 30 seconds).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Step3({ currentStep, totalSteps, onPrev, onSubmit, form }: StepProps) {
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const isValid = await form.trigger(["restingHR", "weeklyActivity"]);
    if (isValid) {
      const data = form.getValues();
      onSubmit(data);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl">Health & Activity</CardTitle>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="restingHR"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Resting Heart Rate (bpm)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Lower resting heart rate generally indicates better
                          fitness.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseInt(value, 10)
                      );
                    }}
                    placeholder="e.g., 70"
                  />
                </FormControl>
                <FormDescription>
                  Measure your pulse for 15 seconds when relaxed, then multiply
                  by 4.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weeklyActivity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Weekly Activity Days
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Regular activity improves strength, balance, and heart
                          health.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value || ""}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select...</option>
                    <option value="0">0 days</option>
                    <option value="1-2">1-2 days</option>
                    <option value="3-5">3-5 days</option>
                    <option value="6-7">6-7 days</option>
                  </select>
                </FormControl>
                <FormDescription>
                  Days per week with at least 30 minutes of moderate physical
                  activity.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Calculate My Strength Age
            <Activity className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [strengthAge, setStrengthAge] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      age: undefined,
      sex: undefined,
      height: undefined,
      waist: undefined,
      chairStand: undefined,
      singleLegBalance: undefined,
      restingHR: undefined,
      weeklyActivity: undefined,
    },
  });

  const calculateStrengthAge = (data: FormData) => {
    let ageAdjustment = 0;
    const realAge = data.age;

    // WHtR calculation and adjustment
    const whtr = data.waist / data.height;
    if (whtr < 0.49) ageAdjustment -= 1;
    else if (whtr >= 0.55) ageAdjustment += 2;

    // Chair stand adjustment (using simplified norms)
    const chairNorms = { male: 14, female: 12 }; // simplified average norms
    const chairNorm = chairNorms[data.sex as keyof typeof chairNorms];
    if (data.chairStand > chairNorm + 2) ageAdjustment -= 2;
    else if (data.chairStand < chairNorm - 2) ageAdjustment += 2;

    // Balance adjustment
    if (data.singleLegBalance >= 20) ageAdjustment -= 1;
    else if (data.singleLegBalance < 10) ageAdjustment += 2;

    // Resting HR adjustment
    if (data.restingHR >= 50 && data.restingHR <= 60) ageAdjustment -= 1;
    else if (data.restingHR > 80) ageAdjustment += 2;

    // Activity adjustment
    if (data.weeklyActivity === "3-5" || data.weeklyActivity === "6-7")
      ageAdjustment -= 1;
    else if (data.weeklyActivity === "0") ageAdjustment += 1;

    // Cap at ±6 years
    ageAdjustment = Math.max(-6, Math.min(6, ageAdjustment));

    const strengthAgeMin = realAge + ageAdjustment - 1;
    const strengthAgeMax = realAge + ageAdjustment + 1;

    return {
      range: `${strengthAgeMin}-${strengthAgeMax}`,
      realAge,
      drivers: [
        {
          factor: "Chair Stand",
          impact:
            data.chairStand < chairNorm - 2
              ? "+2y"
              : data.chairStand > chairNorm + 2
                ? "-2y"
                : "0y",
        },
        {
          factor: "Balance",
          impact:
            data.singleLegBalance >= 20
              ? "-1y"
              : data.singleLegBalance < 10
                ? "+2y"
                : "0y",
        },
        {
          factor: "WHtR",
          impact: whtr < 0.49 ? "-1y" : whtr >= 0.55 ? "+2y" : "0y",
        },
        {
          factor: "Resting HR",
          impact:
            data.restingHR >= 50 && data.restingHR <= 60
              ? "-1y"
              : data.restingHR > 80
                ? "+2y"
                : "0y",
        },
        {
          factor: "Activity",
          impact:
            data.weeklyActivity === "3-5" || data.weeklyActivity === "6-7"
              ? "-1y"
              : data.weeklyActivity === "0"
                ? "+1y"
                : "0y",
        },
      ],
    };
  };

  const handleFormSubmit = (data: FormData) => {
    const result = calculateStrengthAge(data);
    setStrengthAge(result);
    setShowEmailGate(true);
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, strengthAge }),
      });

      if (response.ok) {
        setShowResults(true);
        setShowEmailGate(false);
      } else {
        alert("Failed to send report. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  if (showResults && strengthAge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">
                Your Strength Age Results
              </CardTitle>
              <CardDescription className="text-lg">
                Your fitness test for seniors is complete! This strength age
                assessment uses validated metrics including chair stand,
                balance, and resting heart rate. Report sent to {email} - check
                your inbox for your personalized strength plan discount.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  Strength Age: {strengthAge.range}
                </div>
                <div className="text-xl text-gray-600 mb-6">
                  (Real Age: {strengthAge.realAge})
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 text-lg">
                  What drives your Strength Age:
                </h3>
                <div className="space-y-3">
                  {strengthAge.drivers.map((driver: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="font-medium">{driver.factor}</span>
                      <span
                        className={`font-bold px-2 py-1 rounded ${
                          driver.impact.includes("+")
                            ? "bg-red-100 text-red-600"
                            : driver.impact.includes("-")
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {driver.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized offer based on results */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-green-800">
                  {strengthAge.drivers.some(
                    (d: any) =>
                      d.factor === "Chair Stand" && d.impact.includes("+")
                  )
                    ? "Leg Strength Starter Plan — 20% OFF Today"
                    : strengthAge.drivers.some(
                          (d: any) =>
                            d.factor === "Balance" && d.impact.includes("+")
                        )
                      ? "Balance & Fall-Prevention Plan — 20% OFF"
                      : "Complete Senior Strength Plan — 20% OFF"}
                </h3>
                <p className="text-gray-700 mb-4">
                  {strengthAge.drivers.some(
                    (d: any) =>
                      d.factor === "Chair Stand" && d.impact.includes("+")
                  )
                    ? "Your leg strength is below your age group. Improve it safely in 4 weeks."
                    : strengthAge.drivers.some(
                          (d: any) =>
                            d.factor === "Balance" && d.impact.includes("+")
                        )
                      ? "Focus on balance and stability to reduce fall risk and improve confidence."
                      : "A comprehensive plan to improve all aspects of senior fitness and longevity."}
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                  Start My 4-Week Plan
                </Button>
              </div>

              <div className="border-t pt-6 text-center">
                <p className="text-xs text-gray-500">
                  Based on validated senior fitness assessments (Rikli & Jones),
                  WHtR research, and WHO activity guidelines. Not medical
                  advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showEmailGate && strengthAge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">
                Your Strength Age is Ready!
              </CardTitle>
              <CardDescription className="text-lg">
                Enter your email to receive your full report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    className="bg-green-600 hover:bg-green-700 px-8"
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Get My Results"}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  We'll email your detailed results so you can keep and print
                  them—plus a limited-time 20% discount on your Senior Strength
                  Plan.
                </p>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs text-gray-500 text-center">
                  This tool uses validated senior fitness assessments and
                  population references. It is not medical advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Take the Strength Age Test - Free Senior Fitness Assessment"
        description="Take our free 2-minute strength age test for seniors. Chair stand test, balance assessment, heart rate check. No equipment needed. Get your results instantly."
        keywords="senior fitness test, chair stand test seniors, balance test for seniors, resting heart rate seniors, at home strength test seniors, functional fitness assessment"
        canonicalUrl="/test"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Take the Strength Age Test
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete this senior fitness test to discover your strength age.
              This fitness test for seniors uses validated metrics including
              chair stand, balance, and resting heart rate. All tests can be
              done at home with just a chair, timer, and tape measure.
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {currentStep === 1 && (
                <Step1
                  currentStep={currentStep}
                  totalSteps={3}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onSubmit={handleFormSubmit}
                  form={form}
                />
              )}
              {currentStep === 2 && (
                <Step2
                  currentStep={currentStep}
                  totalSteps={3}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onSubmit={handleFormSubmit}
                  form={form}
                />
              )}
              {currentStep === 3 && (
                <Step3
                  currentStep={currentStep}
                  totalSteps={3}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onSubmit={handleFormSubmit}
                  form={form}
                />
              )}
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
