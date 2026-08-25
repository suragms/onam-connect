/* eslint-disable */
/**
 * Generated stub — run `bunx convex dev` to regenerate from deployment.
 */
import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as generateMessage from "../generateMessage.js";
import type * as rateLimit from "../rateLimit.js";

declare const fullApi: ApiFromModules<{
  generateMessage: typeof generateMessage;
  rateLimit: typeof rateLimit;
}>;

export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;
