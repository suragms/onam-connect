import { internalMutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";

const HOURLY_LIMIT = Number(process.env.GENERATION_LIMIT_PER_HOUR) || 10;
const WINDOW_MS = 60 * 60 * 1000;

export const checkAndIncrement = internalMutation({
  args: { clientId: v.string() },
  handler: async (ctx: MutationCtx, { clientId }: { clientId: string }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("by_client", (q: { eq: (f: string, v: string) => unknown }) => q.eq("clientId", clientId))
      .first();

    if (!existing || now - existing.windowStart > WINDOW_MS) {
      if (existing) await ctx.db.delete(existing._id);
      await ctx.db.insert("rateLimits", {
        clientId,
        count: 1,
        windowStart: now,
      });
      return { allowed: true, remaining: HOURLY_LIMIT - 1 };
    }

    if (existing.count >= HOURLY_LIMIT) {
      return { allowed: false, remaining: 0 };
    }

    await ctx.db.patch(existing._id, { count: existing.count + 1 });
    return { allowed: true, remaining: HOURLY_LIMIT - existing.count - 1 };
  },
});
