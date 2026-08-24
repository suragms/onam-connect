import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    rateLimits: defineTable({
      clientId: v.string(),
      count: v.number(),
      windowStart: v.number(),
    }).index("by_client", ["clientId"]),
  },
  { schemaValidation: false },
);

export default schema;
