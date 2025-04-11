import { type Doc } from "convex/_generated/dataModel";
import { FileText, BookOpen, Brain, Users } from "lucide-react";

export const generateStats = (
  testReviewsByUser?: Doc<"testReviews">[],
  weeklyTestReviews?: Doc<"testReviews">[],
  testsByUser?: Doc<"tests">[]
) => {
  if (!testReviewsByUser || !weeklyTestReviews || !testsByUser) {
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
