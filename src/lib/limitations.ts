// Constants
export const LIMITATIONS = {
  free: {
    classes: 2,
    lessons: 3,
    tests: 3,
    materials: 10485760, // 10 MB in bytes (10 * 1024 * 1024)
    testShare: false,
    resultsShare: true,
  },
  starter: {
    classes: 3,
    lessons: 10,
    tests: 10,
    materials: 262144000, // 250 MB in bytes (250 * 1024 * 1024)
    testShare: true,
    resultsShare: true,
  },
  pro: {
    classes: 100,
    lessons: 100,
    tests: 100,
    materials: 524288000, // 500 MB in bytes (500 * 1024 * 1024)
    testShare: true,
    resultsShare: true,
  },
};
