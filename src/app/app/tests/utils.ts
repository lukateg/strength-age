import { type Doc } from "convex/_generated/dataModel";

export const calculateStats = (
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

  return {
    averageSuccessRate,
    averageWeeklySuccessRate,
    totalTestLength,
    weeklyTestLength,
  };
};
