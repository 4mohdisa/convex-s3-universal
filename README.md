# 🔄 convex-s3-universal

Universal S3 storage adapter for Convex apps - seamlessly switch between Cloudflare R2, AWS S3, Google Cloud Storage, and MinIO with just environment variables. No vendor lock-in, one unified API.

## 🎯 What It Solves

Traditional cloud storage integration locks you into a single provider's API and configuration. When you need to switch from AWS S3 to Cloudflare R2 or Google Cloud Storage, you typically need to rewrite significant portions of your storage logic, update API calls, and reconfigure your entire upload workflow.

**This project eliminates that friction** by creating a unified interface that abstracts away provider-specific differences, allowing you to switch between storage backends with just environment variable changes.

## ✨ Features

- **🔄 Universal Storage API** - One interface for all S3-compatible providers
- **🚀 Zero Code Changes** - Switch providers with environment variables only
- **📤 Direct Uploads** - Files upload directly to storage via signed URLs
- **🔒 Secure** - No files pass through your server, reducing bandwidth costs
- **⚡ Real-time** - Built on Convex for reactive data updates
- **🎨 Modern Stack** - Next.js 15, React 19, TypeScript, Tailwind CSS
- **🔐 Authentication** - Integrated Clerk auth system
- **📱 Responsive UI** - Beautiful components with shadcn/ui

## 🌐 Supported Providers

| Provider | Status | Configuration |
|----------|--------|---------------|
| **Cloudflare R2** | ✅ Ready | CORS setup for localhost:3000 |
| **AWS S3** | ✅ Ready | Bucket CORS and region config |
| **Google Cloud Storage** | ✅ Ready | HMAC keys with googleapis endpoint |
| **MinIO** | ✅ Ready | Local server with path-style URLs |

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Storage Provider
Choose your preferred storage provider and set up environment variables:

#### Cloudflare R2
```bash
# .env.local
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET=your-bucket-name
```

#### AWS S3
```bash
# .env.local
R2_ENDPOINT=https://s3.amazonaws.com
R2_ACCESS_KEY_ID=your_aws_access_key
R2_SECRET_ACCESS_KEY=your_aws_secret_key
R2_BUCKET=your-bucket-name
AWS_REGION=us-east-1
```

#### Google Cloud Storage
```bash
# .env.local
R2_ENDPOINT=https://storage.googleapis.com
R2_ACCESS_KEY_ID=your_hmac_access_id
R2_SECRET_ACCESS_KEY=your_hmac_secret
R2_BUCKET=your-bucket-name
```

#### MinIO (Local Development)
```bash
# .env.local
R2_ENDPOINT=http://localhost:9000
R2_ACCESS_KEY_ID=minioadmin
R2_SECRET_ACCESS_KEY=minioadmin
R2_BUCKET=test-bucket
FORCE_PATH_STYLE=true
```

### 3. Setup Convex Backend
```bash
npm run dev:setup
```
Follow the prompts to create your Convex project. See the [Convex + Clerk guide](https://docs.convex.dev/auth/clerk) for authentication setup.

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to see the application.

## 📁 Project Structure

```
convex-s3-universal/
├── apps/
│   └── web/                    # Next.js frontend application
│       ├── src/
│       │   ├── app/           # App Router pages
│       │   ├── components/    # React components
│       │   └── lib/          # Utilities
│       └── package.json
├── packages/
│   └── backend/               # Convex backend
│       ├── convex/
│       │   ├── r2.ts         # Universal storage functions
│       │   ├── schema.ts     # Database schema
│       │   └── auth.config.ts # Auth configuration
│       └── package.json
├── .env.local                 # Environment variables
└── package.json              # Root workspace config
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all applications in development mode |
| `npm run dev:web` | Start only the web application |
| `npm run dev:server` | Start only the Convex backend |
| `npm run dev:setup` | Setup and configure Convex project |
| `npm run build` | Build all applications for production |
| `npm run check-types` | Run TypeScript type checking |

## 🏗️ Architecture

### Upload Flow
1. **Frontend** requests upload URL from Convex function
2. **Convex** generates signed URL using provider-specific configuration
3. **File uploads directly** to storage provider (bypassing your server)
4. **Metadata syncs** back to Convex database for tracking
5. **Read URLs** generated on-demand with short expiration

### Provider Abstraction
The `@convex-dev/r2` component provides a unified API that works across all S3-compatible services:
- **Same client API** regardless of provider
- **Environment-based switching** without code changes
- **Automatic endpoint configuration** for different providers
- **Built-in CORS handling** for web uploads

## 🔐 Security & CORS Setup

Each provider requires specific CORS configuration for web uploads:

### Cloudflare R2
```json
[
  {
    "AllowedOrigins": ["http://localhost:3001", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"]
  }
]
```

### AWS S3
```json
[
  {
    "AllowedOrigins": ["http://localhost:3001", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack)
- Powered by [Convex](https://convex.dev) and [@convex-dev/r2](https://github.com/get-convex/r2)
- UI components from [shadcn/ui](https://ui.shadcn.com)
