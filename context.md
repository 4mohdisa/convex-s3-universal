# Context for Windsurf

## About Project
**convex-s3-universal** - Universal S3 storage for Convex apps that works with R2, AWS, GCS, and MinIO

### What It Solves
Traditional cloud storage integration locks you into a single provider's API and configuration. When you need to switch from AWS S3 to Cloudflare R2 or Google Cloud Storage, you typically need to rewrite significant portions of your storage logic, update API calls, and reconfigure your entire upload workflow.

This project eliminates that friction by creating a unified interface that abstracts away provider-specific differences, allowing you to switch between storage backends with just environment variable changes.

### How It Works
The application leverages the @convex-dev/r2 component to create a standardized storage API that works across all S3-compatible services. Under the hood, it uses the AWS S3 SDK which provides broad compatibility with S3-compatible storage providers through endpoint configuration.

The architecture separates concerns cleanly:
- **Frontend**: React components with a simple upload interface for testing
- **Backend**: Convex functions that handle secure upload URL generation and metadata sync
- **Storage Layer**: Provider-agnostic wrapper that handles the complexity of different endpoints, authentication methods, and CORS configurations

### Stack
- Next.js app (frontend)
- Convex backend
- Clerk authentication
- @convex-dev/r2 for upload flows
- AWS S3 SDK under the hood

### Key Goals
- One config to switch between storage providers
- Same client and server API across all providers
- Simple upload widget for manual testing
- Clear setup documentation for CORS and API keys

## Core Features
### Upload Flow
- Frontend uses `useUploadFile` from @convex-dev/r2
- Backend exposes `generateUploadUrl` and `syncMetadata` from r2.clientApi
- Files upload directly to provider through signed URLs
- `r2.getUrl` returns short-lived read URLs

### Multi-Provider Support
- **Cloudflare R2**: Set CORS for localhost:3000 (allow GET/PUT)
- **Google Cloud Storage**: Use HMAC keys with storage.googleapis.com endpoint
- **AWS S3**: Configure bucket CORS and region
- **MinIO**: Local server with FORCE_PATH_STYLE=true and HTTP endpoint

## Project Structure
├── app/                    # Next.js pages and UI components
├── convex/                 # Server code and Convex functions
├── convex/r2.ts           # R2 wrapper and clientApi
└── convex/convex.config.ts # Component configuration

## Development Setup
### Required Environment Variables
```bash
R2_ENDPOINT=https://account.r2.cloudflarestorage.com  # or GCS/AWS/MinIO equivalent
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET=your_bucket_name

# Optional
AWS_REGION=us-east-1              # for AWS
FORCE_PATH_STYLE=true             # for MinIO