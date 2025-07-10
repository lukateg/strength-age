import { query } from "../_generated/server";
import { AuthenticationRequired } from "../utils";
import { hasPermission } from "../models/permissionsModel";
import {
  getClassesByUser,
  getClassesWithPermissions,
} from "../models/classesModel";
import {
  getMaterialsByUser,
  getTotalStorageUsage,
} from "../models/materialsModel";
import { getTestsByUser } from "../models/testsModel";
import {
  getTestReviewsByUser,
  getTestReviewsByClass,
} from "../models/testReviewsModel";
import { getLessonsByClass, getLessonsByUser } from "../models/lessonsModel";
import { getLessonMaterialsByClass } from "../models/lessonPdfsModel";
import { type QueryCtx } from "../_generated/server";

import { type Doc, type Id } from "../_generated/dataModel";
import { getMonthlyUsageRecord } from "../models/tokensModel";
import { stripeCustomerByUserId } from "convex/models/stripeModel";

export interface ClassWithPermissions extends Doc<"classes"> {
  canDeleteClass: boolean;
  canUpdateClass: boolean;
  canGenerateTest: boolean;
}

export interface DashboardData {
  classes: ClassWithPermissions[];
  materials: Doc<"materials">[];
  tests: Doc<"tests">[];
  testReviews: Doc<"testReviews">[];
  permissions: {
    canCreateClass: boolean;
  };
}

// Helper to get the start of a week
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

// --- Helper Functions ---

// function calculateGlobalSuccessRate(testReviews: Doc<"testReviews">[]) {
//   if (testReviews.length === 0) return 0;
//   const totalSuccessRate = testReviews.reduce((acc, review) => {
//     const successRate =
//       review.questions.length > 0
//         ? review.questions.filter((q) => q.isCorrect).length /
//           review.questions.length
//         : 0;
//     return acc + successRate;
//   }, 0);
//   return (totalSuccessRate / testReviews.length) * 100;
// }

function calculateWeeklyActivity(
  allClasses: Doc<"classes">[],
  allLessons: Doc<"lessons">[],
  allTests: Doc<"tests">[],
  allTestReviews: Doc<"testReviews">[]
) {
  const now = new Date();
  const startOfThisWeek = getStartOfWeek(now);
  const startOfLastWeek = new Date(
    startOfThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000
  );

  const filterByWeek = (
    items: (
      | Doc<"classes">
      | Doc<"tests">
      | Doc<"testReviews">
      | Doc<"lessons">
    )[],
    start: Date,
    end: Date
  ) =>
    items.filter(
      (item) =>
        item._creationTime >= start.getTime() &&
        item._creationTime < end.getTime()
    );

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return "higher";
    if (current < previous) return "lower";
    return "same" as const;
  };

  const classesThisWeek = filterByWeek(allClasses, startOfThisWeek, now).length;
  const classesLastWeek = filterByWeek(
    allClasses,
    startOfLastWeek,
    startOfThisWeek
  ).length;

  const lessonsThisWeek = filterByWeek(allLessons, startOfThisWeek, now).length;
  const lessonsLastWeek = filterByWeek(
    allLessons,
    startOfLastWeek,
    startOfThisWeek
  ).length;

  const testsThisWeek = filterByWeek(allTests, startOfThisWeek, now).length;
  const testsLastWeek = filterByWeek(
    allTests,
    startOfLastWeek,
    startOfThisWeek
  ).length;

  const testReviewsThisWeek = filterByWeek(
    allTestReviews,
    startOfThisWeek,
    now
  ).length;
  const testReviewsLastWeek = filterByWeek(
    allTestReviews,
    startOfLastWeek,
    startOfThisWeek
  ).length;

  return {
    classes: {
      count: classesThisWeek,
      trend: getTrend(classesThisWeek, classesLastWeek),
    },
    lessons: {
      count: lessonsThisWeek,
      trend: getTrend(lessonsThisWeek, lessonsLastWeek),
    },
    tests: {
      count: testsThisWeek,
      trend: getTrend(testsThisWeek, testsLastWeek),
    },
    testReviews: {
      count: testReviewsThisWeek,
      trend: getTrend(testReviewsThisWeek, testReviewsLastWeek),
    },
  };
}

function calculateDayStreak(
  activities: (
    | Doc<"classes">
    | Doc<"lessons">
    | Doc<"tests">
    | Doc<"testReviews">
  )[]
) {
  const uniqueDays = [
    ...new Set(activities.map((a) => new Date(a._creationTime).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDays.length === 0) return 0;

  const now = new Date();
  const today = new Date(now.toDateString()).getTime();
  const yesterday = new Date(now.setDate(now.getDate() - 1)).getTime();
  const mostRecentActivityTime = new Date(uniqueDays[0]!).getTime();

  if (
    mostRecentActivityTime !== today &&
    mostRecentActivityTime !== yesterday
  ) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const day = new Date(uniqueDays[i - 1]!);
    const prevDay = new Date(uniqueDays[i]!);
    if ((day.getTime() - prevDay.getTime()) / (1000 * 3600 * 24) === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

async function getMostActiveClassDetails(
  ctx: QueryCtx,
  userId: string,
  allTestReviews: Doc<"testReviews">[]
) {
  let mostActiveId: Id<"classes"> | null = null;

  if (allTestReviews.length > 0) {
    // Find most active class based on test reviews
    const classIdCounts = allTestReviews.reduce(
      (acc, review) => {
        const classIdStr = review.classId.toString();
        acc[classIdStr] = (acc[classIdStr] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const classIds = Object.keys(classIdCounts);
    if (classIds.length > 0) {
      const mostActiveIdString = classIds.reduce((a, b) =>
        classIdCounts[a]! > classIdCounts[b]! ? a : b
      );
      mostActiveId = mostActiveIdString as Id<"classes">;
    }
  }

  // If no test reviews or no class found, fall back to class with most lessons
  if (!mostActiveId) {
    const allClasses = await getClassesByUser(ctx, userId);
    if (allClasses.length === 0) return null;

    // Get lesson counts for each class
    const classLessonCounts = await Promise.all(
      allClasses.map(async (classItem) => {
        const lessons = await getLessonsByClass(ctx, classItem._id);
        return { classId: classItem._id, lessonCount: lessons.length };
      })
    );

    // Find class with most lessons, or most recent class if all have 0 lessons
    const classWithMostLessons = classLessonCounts.reduce((max, current) =>
      current.lessonCount > max.lessonCount ? current : max
    );

    mostActiveId = classWithMostLessons.classId;
  }

  const mostActiveClass = await ctx.db.get(mostActiveId);
  if (!mostActiveClass) return null;

  const [lessons, lessonMaterials, reviewsForClass] = await Promise.all([
    getLessonsByClass(ctx, mostActiveId),
    getLessonMaterialsByClass(ctx, mostActiveId),
    getTestReviewsByClass(ctx, mostActiveId),
  ]);

  const highestScore = Math.max(
    0,
    ...reviewsForClass.map((r: Doc<"testReviews">) =>
      r.questions.length > 0
        ? (r.questions.filter((q) => q.isCorrect).length / r.questions.length) *
          100
        : 0
    )
  );

  return {
    title: mostActiveClass.title,
    lessonsCount: lessons.length,
    materialsCount: lessonMaterials.length,
    testReviewsCount: reviewsForClass.length,
    highestScore: highestScore,
  };
}

export const getNewDashboardData = query({
  handler: async (ctx) => {
    const userId = await AuthenticationRequired({ ctx });

    // Fetch all necessary data in parallel
    const [
      allClasses,
      allTests,
      allTestReviews,
      allLessons,
      monthlyRecord,
      totalStorageUsage,
      stripeCustomer,
    ] = await Promise.all([
      getClassesByUser(ctx, userId),
      getTestsByUser(ctx, userId),
      getTestReviewsByUser(ctx, userId),
      getLessonsByUser(ctx, userId),
      getMonthlyUsageRecord(ctx, userId),
      getTotalStorageUsage(ctx, userId),
      stripeCustomerByUserId(ctx, userId),
    ]);

    const allActivity = [
      ...allClasses,
      ...allLessons,
      ...allTests,
      ...allTestReviews,
    ];

    const [weeklyActivity, streak, mostActiveClass] = await Promise.all([
      calculateWeeklyActivity(allClasses, allLessons, allTests, allTestReviews),
      calculateDayStreak(allActivity),
      getMostActiveClassDetails(ctx, userId, allTestReviews),
      getTotalStorageUsage(ctx, userId),
    ]);

    return {
      stripeCustomer,
      totalClasses: allClasses.length,
      totalTests: allTests.length,
      totalTestReviews: allTestReviews.length,
      streak,
      weeklyActivity,
      mostActiveClass,
      tokensUsedThisMonth: monthlyRecord?.monthlyTokensUsed ?? 0,
      totalStorageUsage,
    };
  },
});

// TODO: Remove this query
export const getDashboardPageData = query({
  handler: async (ctx): Promise<DashboardData> => {
    const userId = await AuthenticationRequired({ ctx });

    const canCreateClass = await hasPermission(
      ctx,
      userId,
      "classes",
      "create"
    );

    // Fetch all data in parallel using helper functions
    const [classes, materials, tests, testReviews] = await Promise.all([
      getClassesWithPermissions(ctx, userId),
      getMaterialsByUser(ctx, userId),
      getTestsByUser(ctx, userId),
      getTestReviewsByUser(ctx, userId),
    ]);

    return {
      classes,
      materials,
      tests,
      testReviews,
      permissions: {
        canCreateClass,
      },
    };
  },
});
