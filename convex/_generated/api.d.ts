/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as classes from "../classes.js";
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as materials from "../materials.js";
import type * as models_classesModel from "../models/classesModel.js";
import type * as models_lessonsModel from "../models/lessonsModel.js";
import type * as models_materialsModel from "../models/materialsModel.js";
import type * as models_testReviews from "../models/testReviews.js";
import type * as models_testsModel from "../models/testsModel.js";
import type * as pages_class from "../pages/class.js";
import type * as pages_classes from "../pages/classes.js";
import type * as pages_dashboard from "../pages/dashboard.js";
import type * as pages_generateTestPage from "../pages/generateTestPage.js";
import type * as pages_lesson from "../pages/lesson.js";
import type * as pages_test from "../pages/test.js";
import type * as pages_tests from "../pages/tests.js";
import type * as permissions from "../permissions.js";
import type * as stripe from "../stripe.js";
import type * as tests from "../tests.js";
import type * as uploadThingActions from "../uploadThingActions.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  classes: typeof classes;
  http: typeof http;
  lessons: typeof lessons;
  materials: typeof materials;
  "models/classesModel": typeof models_classesModel;
  "models/lessonsModel": typeof models_lessonsModel;
  "models/materialsModel": typeof models_materialsModel;
  "models/testReviews": typeof models_testReviews;
  "models/testsModel": typeof models_testsModel;
  "pages/class": typeof pages_class;
  "pages/classes": typeof pages_classes;
  "pages/dashboard": typeof pages_dashboard;
  "pages/generateTestPage": typeof pages_generateTestPage;
  "pages/lesson": typeof pages_lesson;
  "pages/test": typeof pages_test;
  "pages/tests": typeof pages_tests;
  permissions: typeof permissions;
  stripe: typeof stripe;
  tests: typeof tests;
  uploadThingActions: typeof uploadThingActions;
  users: typeof users;
  utils: typeof utils;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  migrations: {
    lib: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; names?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      migrate: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
  };
};
