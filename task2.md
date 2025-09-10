# R2 Component Integration Instructions

## 1. Installation & Setup
```bash
# Install R2 component in backend
cd packages/backend
npm install @convex-dev/r2

# Add component to convex.config.ts
```
- Add R2 component to your Convex configuration
- Install necessary dependencies for file upload handling

## 2. Backend Integration
- Configure R2 component in `convex.config.ts` with proper component settings
- Create `convex/r2.ts` file to expose R2 client API functions
- Implement `generateUploadUrl` function for secure file uploads
- Implement `syncMetadata` function for file tracking
- Add `getFileUrl` function for retrieving file URLs

## 3. Frontend Components
- Create upload UI component in `apps/web/src/components/`
- Use `useUploadFile` hook from @convex-dev/r2
- Build simple file picker with progress indicator
- Add upload status feedback (success/error states)
- Create file list component to display uploaded files

## 4. Environment Configuration
```bash
# Add to Convex Dashboard environment variables:
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET=your_bucket_name
```
- Set up placeholder environment variables for now
- Configure CORS settings preparation
- Test upload flow with mock data first
- Prepare for multi-provider switching later

**Goal**: Get basic file upload working within your existing Better T Stack project structure. Focus on integrating the R2 component properly - actual cloud provider setup comes next.