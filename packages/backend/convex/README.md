# 🔧 Convex Backend Functions

This directory contains the Convex backend functions for the universal S3 storage system. The functions provide a unified API for file uploads and storage operations across multiple cloud providers.

## 📁 Function Overview

### Core Functions

| File | Purpose | Description |
|------|---------|-------------|
| `r2.ts` | **Storage Operations** | Universal S3 storage functions using @convex-dev/r2 |
| `healthCheck.ts` | **System Status** | API health monitoring |
| `privateData.ts` | **Auth Demo** | Authentication-protected data access |
| `todos.ts` | **CRUD Demo** | Example CRUD operations |
| `schema.ts` | **Database Schema** | Table definitions and validation |
| `auth.config.ts` | **Authentication** | Clerk JWT configuration |

## 🚀 Storage Functions (r2.ts)

The main storage functionality will be implemented in `r2.ts` using the `@convex-dev/r2` component:

### Upload Flow Functions
```ts
// Generate signed upload URL
export const generateUploadUrl = mutation({
  args: { filename: v.string(), contentType: v.string() },
  handler: async (ctx, args) => {
    // Returns signed URL for direct upload to storage provider
  }
});

// Sync file metadata after upload
export const syncMetadata = mutation({
  args: { 
    fileId: v.string(),
    filename: v.string(),
    size: v.number(),
    contentType: v.string()
  },
  handler: async (ctx, args) => {
    // Store file metadata in Convex database
  }
});

// Get temporary read URL
export const getFileUrl = query({
  args: { fileId: v.string() },
  handler: async (ctx, args) => {
    // Returns short-lived read URL
  }
});
```

### Frontend Integration
```ts
// In your React components
import { useUploadFile } from "@convex-dev/r2/react";

function FileUploader() {
  const uploadFile = useUploadFile();
  
  const handleUpload = async (file: File) => {
    await uploadFile(file);
  };
}
```

## 🔐 Authentication Functions

### Private Data Access
```ts
// privateData.ts - Example of protected function
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return { message: "Not authenticated" };
    }
    return { message: "This is private data" };
  },
});
```

## 📊 Database Schema

### Current Tables
```ts
// schema.ts
export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  
  // Future: File metadata table
  files: defineTable({
    filename: v.string(),
    contentType: v.string(),
    size: v.number(),
    uploadedBy: v.string(),
    storageKey: v.string(),
    uploadedAt: v.number(),
  }).index("by_user", ["uploadedBy"]),
});
```

## 🛠️ Development Workflow

### Adding New Functions
1. Create function file in this directory
2. Export query/mutation functions with proper validation
3. Import and use in frontend with `useQuery`/`useMutation`
4. Functions auto-deploy on save during `convex dev`

### Function Types
- **Query**: Read-only operations (`useQuery` in React)
- **Mutation**: Write operations (`useMutation` in React)
- **Action**: External API calls, file operations

### Example Query Function
```ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getFiles = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    return await ctx.db
      .query("files")
      .withIndex("by_user", (q) => q.eq("uploadedBy", identity.subject))
      .collect();
  },
});
```

### Example Mutation Function
```ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const file = await ctx.db.get(args.fileId);
    if (!file || file.uploadedBy !== identity.subject) {
      throw new Error("File not found or unauthorized");
    }
    
    await ctx.db.delete(args.fileId);
    return { success: true };
  },
});
```

## 🔗 Frontend Usage

### In React Components
```ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex-s3-universal/backend/convex/_generated/api";

function FileManager() {
  // Query data
  const files = useQuery(api.r2.getFiles);
  
  // Mutations
  const deleteFile = useMutation(api.r2.deleteFile);
  const uploadFile = useUploadFile();
  
  const handleDelete = (fileId: string) => {
    deleteFile({ fileId });
  };
}
```

## 📚 Resources

- [Convex Functions Documentation](https://docs.convex.dev/functions)
- [Convex Database Operations](https://docs.convex.dev/database)
- [Convex Authentication](https://docs.convex.dev/auth)
- [@convex-dev/r2 Component](https://github.com/get-convex/r2)
- [Convex CLI Reference](https://docs.convex.dev/cli)

## 🚀 Next Steps

1. **Install @convex-dev/r2**: `npm install @convex-dev/r2`
2. **Configure component**: Add R2 component to `convex.config.ts`
3. **Implement storage functions**: Create universal upload/download functions
4. **Add file metadata schema**: Extend database schema for file tracking
5. **Build upload UI**: Create React components for file management
