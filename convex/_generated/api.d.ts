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
import type * as crons from "../crons.js";
import type * as customer from "../customer.js";
import type * as feedbacks from "../feedbacks.js";
import type * as http from "../http.js";
import type * as lemonSqueezy_subscriptions from "../lemonSqueezy/subscriptions.js";
import type * as lemonSqueezy_subscriptions_actions from "../lemonSqueezy/subscriptions_actions.js";
import type * as lemonSqueezy_subscriptions_model from "../lemonSqueezy/subscriptions_model.js";
import type * as lemonSqueezy_subscriptions_utils from "../lemonSqueezy/subscriptions_utils.js";
import type * as lessons from "../lessons.js";
import type * as materials from "../materials.js";
import type * as models_classesModel from "../models/classesModel.js";
import type * as models_lemonModel from "../models/lemonModel.js";
import type * as models_lessonPdfsModel from "../models/lessonPdfsModel.js";
import type * as models_lessonsModel from "../models/lessonsModel.js";
import type * as models_materialsModel from "../models/materialsModel.js";
import type * as models_permissionsModel from "../models/permissionsModel.js";
import type * as models_stripeModel from "../models/stripeModel.js";
import type * as models_testReviewsModel from "../models/testReviewsModel.js";
import type * as models_testsModel from "../models/testsModel.js";
import type * as models_tokensModel from "../models/tokensModel.js";
import type * as models_userModel from "../models/userModel.js";
import type * as pages_classPage from "../pages/classPage.js";
import type * as pages_classesPage from "../pages/classesPage.js";
import type * as pages_dashboardPage from "../pages/dashboardPage.js";
import type * as pages_generateTestPage from "../pages/generateTestPage.js";
import type * as pages_landingPage from "../pages/landingPage.js";
import type * as pages_lessonPage from "../pages/lessonPage.js";
import type * as pages_settingsPage from "../pages/settingsPage.js";
import type * as pages_testPage from "../pages/testPage.js";
import type * as pages_testReviewPage from "../pages/testReviewPage.js";
import type * as pages_testsPage from "../pages/testsPage.js";
import type * as permissions from "../permissions.js";
import type * as schemas_abacSchema from "../schemas/abacSchema.js";
import type * as stripe from "../stripe.js";
import type * as testReviews from "../testReviews.js";
import type * as tests from "../tests.js";
import type * as tokens from "../tokens.js";
import type * as uploadThing from "../uploadThing.js";
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
  crons: typeof crons;
  customer: typeof customer;
  feedbacks: typeof feedbacks;
  http: typeof http;
  "lemonSqueezy/subscriptions": typeof lemonSqueezy_subscriptions;
  "lemonSqueezy/subscriptions_actions": typeof lemonSqueezy_subscriptions_actions;
  "lemonSqueezy/subscriptions_model": typeof lemonSqueezy_subscriptions_model;
  "lemonSqueezy/subscriptions_utils": typeof lemonSqueezy_subscriptions_utils;
  lessons: typeof lessons;
  materials: typeof materials;
  "models/classesModel": typeof models_classesModel;
  "models/lemonModel": typeof models_lemonModel;
  "models/lessonPdfsModel": typeof models_lessonPdfsModel;
  "models/lessonsModel": typeof models_lessonsModel;
  "models/materialsModel": typeof models_materialsModel;
  "models/permissionsModel": typeof models_permissionsModel;
  "models/stripeModel": typeof models_stripeModel;
  "models/testReviewsModel": typeof models_testReviewsModel;
  "models/testsModel": typeof models_testsModel;
  "models/tokensModel": typeof models_tokensModel;
  "models/userModel": typeof models_userModel;
  "pages/classPage": typeof pages_classPage;
  "pages/classesPage": typeof pages_classesPage;
  "pages/dashboardPage": typeof pages_dashboardPage;
  "pages/generateTestPage": typeof pages_generateTestPage;
  "pages/landingPage": typeof pages_landingPage;
  "pages/lessonPage": typeof pages_lessonPage;
  "pages/settingsPage": typeof pages_settingsPage;
  "pages/testPage": typeof pages_testPage;
  "pages/testReviewPage": typeof pages_testReviewPage;
  "pages/testsPage": typeof pages_testsPage;
  permissions: typeof permissions;
  "schemas/abacSchema": typeof schemas_abacSchema;
  stripe: typeof stripe;
  testReviews: typeof testReviews;
  tests: typeof tests;
  tokens: typeof tokens;
  uploadThing: typeof uploadThing;
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
