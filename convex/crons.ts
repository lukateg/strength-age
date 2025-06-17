import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete expired share links",
  { hours: 24 },
  internal.testReviews.deleteExpiredShareLinks,
  { batchSize: 100 }
);

export default crons;
