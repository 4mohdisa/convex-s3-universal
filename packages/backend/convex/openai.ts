import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateSummaryStatus = mutation({
  args: { 
    fileId: v.id("files"),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("failed")),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== identity.subject) {
      throw new Error("File not found or access denied");
    }

    const updateData: any = { summaryStatus: args.status };
    if (args.summary !== undefined) {
      updateData.summary = args.summary;
    }

    await ctx.db.patch(args.fileId, updateData);
    return { success: true };
  },
});


export const getFileForSummary = mutation({
  args: { 
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== identity.subject) {
      throw new Error("File not found or access denied");
    }

    return file;
  },
});

export const getSummary = mutation({
  args: { 
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== identity.subject) {
      throw new Error("File not found or access denied");
    }

    return {
      summary: file.summary,
      summaryStatus: file.summaryStatus,
    };
  },
});