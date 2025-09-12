import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  files: defineTable({
    name: v.string(),
    size: v.number(),
    type: v.string(),
    storageId: v.string(),
    storageProvider: v.string(),
    uploadUrl: v.string(),
    uploadedAt: v.number(),
    userId: v.string(),
    summary: v.optional(v.string()),
    summaryStatus: v.optional(v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed"))),
  }).index("by_user", ["userId"]),
});
