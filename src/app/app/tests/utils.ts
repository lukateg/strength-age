import { LIMITATIONS } from "@/shared/constants";
import { type Doc } from "convex/_generated/dataModel";
import {
  FileText,
  BookOpen,
  Brain,
  Users,
  HardDrive,
  GraduationCap,
} from "lucide-react";

export const generateStats = (
  testReviewsByUser?: Doc<"testReviews">[] | null,
  testsByUser?: Doc<"tests">[] | null
) => {
  if (!testReviewsByUser || !testsByUser) {
    return null;
  }

  const successRate = testReviewsByUser.reduce((acc, review) => {
    const score = review.questions.filter((q) => q.isCorrect).length;
    const total = review.questions.length;
    return acc + score / total;
  }, 0);

  const averageSuccessRate = testReviewsByUser.length
    ? Math.round((successRate / testReviewsByUser.length) * 100)
    : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyTestReviews = testReviewsByUser.filter(
    (review) => review._creationTime >= sevenDaysAgo.getTime()
  );

  const weeklySuccessRate = weeklyTestReviews.reduce((acc, review) => {
    const score = review.questions.filter((q) => q.isCorrect).length;
    const total = review.questions.length;
    return acc + score / total;
  }, 0);

  const averageWeeklySuccessRate = weeklyTestReviews.length
    ? Math.round((weeklySuccessRate / weeklyTestReviews.length) * 100)
    : 0;

  const totalTestLength = testsByUser.length;
  const weeklyTestLength = weeklyTestReviews.length;

  return [
    {
      title: "Total Tests",
      icon: BookOpen,
      value: totalTestLength,
      description: "Total number of tests taken",
    },
    {
      title: "Global Success Rate",
      icon: FileText,
      value: `${averageSuccessRate}%`,
      description: "Average success rate across all tests",
    },
    {
      title: "Weekly Streak",
      icon: Brain,
      value: weeklyTestLength,
      description: "Number of tests taken this week",
    },
    {
      title: "Weekly Success Rate",
      icon: Users,
      value: `${averageWeeklySuccessRate}%`,
      description: "Average success rate for this week",
    },
  ];
};

export const generateDashboardStats = (
  testsByUser: Doc<"tests">[],
  classesByUser: Doc<"classes">[],
  testReviewsByUser: Doc<"testReviews">[],
  totalStorageUsage?: number | null,
  subscriptionTier?: "free" | "starter" | "pro" | null
) => {
  // Calculate global success rate
  const successRate = testReviewsByUser.reduce((acc, review) => {
    const score = review.questions.filter((q) => q.isCorrect).length;
    const total = review.questions.length;
    return acc + score / total;
  }, 0);

  const averageSuccessRate = testReviewsByUser.length
    ? Math.round((successRate / testReviewsByUser.length) * 100)
    : 0;

  // Format storage usage
  const formatStorageUsage = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${Math.round(mb * 10) / 10}/${Math.round(
      LIMITATIONS[subscriptionTier ?? "free"].materials / 1024 / 1024
    )} MB`;
  };

  return [
    {
      title: "Classes",
      icon: GraduationCap,
      value: `${classesByUser.length}/${LIMITATIONS[subscriptionTier ?? "free"].classes}`,
      description: "Total number of classes",
    },
    {
      title: "Global Success Rate",
      icon: FileText,
      value: `${averageSuccessRate}%`,
      description: "Average success rate across all tests",
    },
    {
      title: "Tests",
      icon: BookOpen,
      value: `${testsByUser.length}/${LIMITATIONS[subscriptionTier ?? "free"].tests}`,
      description: "Total number of tests created",
    },
    {
      title: "Storage Used",
      icon: HardDrive,
      value: formatStorageUsage(totalStorageUsage ?? 0),
      description: "Total storage space used",
    },
  ];
};
