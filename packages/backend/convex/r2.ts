import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {
    fileName: v.string(),
    fileSize: v.number(),
    contentType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const storageProvider = process.env.STORAGE_PROVIDER || 'R2';
    let uploadUrl: string;
    let storageId: string;
    
    if (storageProvider === 'GCP') {
      const requiredEnvVars = ['GCP_PROJECT_ID', 'GCP_BUCKET', 'GCP_CREDENTIALS_JSON'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing GCP environment variables: ${missingVars.join(', ')}. Please configure GCP storage in Convex Dashboard.`);
      }

      storageId = `gcp-${Date.now()}-${args.fileName}`;
      uploadUrl = `https://storage.googleapis.com/${process.env.GCP_BUCKET}/${storageId}`;
    } else {
      const requiredEnvVars = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing R2 environment variables: ${missingVars.join(', ')}. Please configure R2 storage in Convex Dashboard.`);
      }

      storageId = `r2-${Date.now()}-${args.fileName}`;
      uploadUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${storageId}`;
    }

    const fileId = await ctx.db.insert("files", {
      name: args.fileName,
      size: args.fileSize,
      type: args.contentType,
      storageId: storageId,
      storageProvider: storageProvider,
      uploadUrl: uploadUrl,
      uploadedAt: Date.now(),
      userId: identity.subject,
    });

    return {
      fileId: fileId,
      uploadUrl: uploadUrl,
      storageId: storageId,
    };
  },
});

export const getFiles = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("files")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file || file.userId !== identity.subject) {
      throw new Error("File not found or access denied");
    }

    await ctx.db.delete(args.fileId);
    return { success: true };
  },
});