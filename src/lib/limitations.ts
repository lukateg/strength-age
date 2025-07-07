// Constants
export const LIMITATIONS = {
  free: {
    classes: 3,
    materials: 10485760, // 10 MB in bytes (10 * 1024 * 1024)
    testShare: false,
    resultsShare: true,
    tokens: 300000,
  },
  // beta
  starter: {
    classes: 10,
    materials: 262144000, // 250 MB in bytes (250 * 1024 * 1024)
    testShare: true,
    resultsShare: true,
    tokens: 5000000,
  },
  // beta
  pro: {
    classes: 30,
    materials: 524288000, // 500 MB in bytes (500 * 1024 * 1024)
    testShare: true,
    resultsShare: true,
    tokens: 10000000,
  },
};
