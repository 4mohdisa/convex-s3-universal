# R2 Environment Variables Setup

## Required Environment Variables for Convex Dashboard

Go to your Convex dashboard: https://dashboard.convex.dev/d/striped-tern-54/settings/environment-variables

Add the following environment variables:

### For Cloudflare R2:
```
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET=your_r2_bucket_name
```

### For AWS S3:
```
R2_ENDPOINT=https://s3.amazonaws.com
R2_ACCESS_KEY_ID=your_aws_access_key_id
R2_SECRET_ACCESS_KEY=your_aws_secret_access_key
R2_BUCKET=your_s3_bucket_name
AWS_REGION=us-east-1
```

### For Google Cloud Storage:
```
R2_ENDPOINT=https://storage.googleapis.com
R2_ACCESS_KEY_ID=your_gcs_access_key_id
R2_SECRET_ACCESS_KEY=your_gcs_secret_access_key
R2_BUCKET=your_gcs_bucket_name
```

### For MinIO (Development):
```
R2_ENDPOINT=http://localhost:9000
R2_ACCESS_KEY_ID=minioadmin
R2_SECRET_ACCESS_KEY=minioadmin
R2_BUCKET=test-bucket
FORCE_PATH_STYLE=true
```

## Temporary Placeholder Values (for testing UI only)

If you want to test the UI before setting up actual storage, you can use these placeholder values:

```
R2_ENDPOINT=https://placeholder.example.com
R2_ACCESS_KEY_ID=placeholder_key
R2_SECRET_ACCESS_KEY=placeholder_secret
R2_BUCKET=placeholder_bucket
```

**Note**: With placeholder values, file uploads will fail, but you can test the UI components.

## CORS Configuration

For each storage provider, you'll need to configure CORS to allow uploads from your domain:

### Allowed Origins:
- `http://localhost:3001` (development)
- Your production domain

### Allowed Methods:
- GET
- PUT
- POST
- DELETE

### Allowed Headers:
- `*` (or specific headers like `content-type`, `authorization`)

## Next Steps

1. Choose your storage provider
2. Create bucket/container
3. Generate access keys
4. Configure CORS settings
5. Add environment variables to Convex dashboard
6. Test file upload functionality