/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as classes from "../classes.js";
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as materials from "../materials.js";
import type * as tests from "../tests.js";
import type * as users from "../users.js";
import type * as utils_utils from "../utils/utils.js";

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
  tests: typeof tests;
  users: typeof users;
  "utils/utils": typeof utils_utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
