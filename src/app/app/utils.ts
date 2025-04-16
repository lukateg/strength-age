import { type Doc } from "convex/_generated/dataModel";
import { BookOpen, FileText } from "lucide-react";

import { Brain } from "lucide-react";

import { Users } from "lucide-react";

export const generateStats = (
  classes?: Doc<"classes">[] | null,
  materials?: Doc<"pdfs">[] | null,
  allTests?: Doc<"tests">[] | null,
  testReviews?: Doc<"testReviews">[] | null
) => {
  if (!testReviews || !allTests || !materials || !classes) {
    return null;
  }
  const successRate = testReviews.reduce((acc, review) => {
    const score = review.questions.filter((q) => q.isCorrect).length;
    const total = review.questions.length;
    return acc + score / total;
  }, 0);
  const averageSuccessRate = testReviews.length
    ? Math.round((successRate / testReviews.length) * 100)
    : 0;
  return [
    {
      title: "Total Classes",
      icon: BookOpen,
      value: classes?.length,
      description: "Total number of classes",
    },
    {
      title: "Study Materials",
      icon: FileText,
      value: materials?.length,
      description: "Total number of study materials",
    },
    {
      title: "Tests Generated",
      icon: Brain,
      value: allTests?.length,
      description: "Total number of tests generated",
    },
    {
      title: "Global Success Rate",
      icon: Users,
      value: averageSuccessRate,
      description: "Total number of active students",
    },
  ];
};
