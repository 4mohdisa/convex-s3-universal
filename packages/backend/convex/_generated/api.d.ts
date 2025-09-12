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
import type * as healthCheck from "../healthCheck.js";
import type * as openai from "../openai.js";
import type * as pdfActions from "../pdfActions.js";
import type * as privateData from "../privateData.js";
import type * as r2 from "../r2.js";
import type * as todos from "../todos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  healthCheck: typeof healthCheck;
  openai: typeof openai;
  pdfActions: typeof pdfActions;
  privateData: typeof privateData;
  r2: typeof r2;
  todos: typeof todos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
