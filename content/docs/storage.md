---
title: Storage
description: S3-compatible file storage for uploads, assets, and data exports using Bun's native Bun.s3 client.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 8
---

Bueno's storage module wraps `Bun.s3` — Bun's native S3 client — for file uploads, downloads, and management across any S3-compatible service.

## Setup

```typescript
import { createStorage } from '@buenojs/bueno';

const storage = createStorage({
  bucket: 'my-uploads',
  region: 'us-east-1',
  credentials: {
    accessKeyId: Bun.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: Bun.env.AWS_SECRET_ACCESS_KEY!,
  },
  // For Cloudflare R2, Backblaze B2, MinIO, etc.:
  endpoint: Bun.env.S3_ENDPOINT,
});
```

## Uploading files

```typescript
// Upload from buffer
await storage.put('images/avatar.png', imageBuffer, {
  contentType: 'image/png',
  metadata: { userId: '42' },
});

// Upload from a web Request
app.post('/upload', async (ctx) => {
  const form = await ctx.formData();
  const file = form.get('file') as File;
  const buffer = await file.arrayBuffer();

  const key = `uploads/${Date.now()}-${file.name}`;
  await storage.put(key, buffer, { contentType: file.type });

  return ctx.json({ url: storage.publicUrl(key) });
});
```

## Downloading files

```typescript
// Get file as Blob
const blob = await storage.get('images/avatar.png');

// Get file as ArrayBuffer
const buffer = await storage.getBuffer('images/avatar.png');

// Get file as text
const text = await storage.getText('configs/settings.json');

// Stream response directly
app.get('/files/:key', async (ctx) => {
  const stream = await storage.getStream(ctx.params.key);
  if (!stream) return ctx.notFound();
  return new Response(stream);
});
```

## Listing files

```typescript
const files = await storage.list('uploads/');
// [{ key: 'uploads/photo.jpg', size: 12345, lastModified: Date }]

const all = await storage.list();
```

## Deleting files

```typescript
await storage.delete('uploads/old-photo.jpg');

// Delete multiple
await storage.deleteMany(['uploads/a.jpg', 'uploads/b.jpg']);
```

## Presigned URLs

Generate temporary signed URLs for direct browser uploads or downloads:

```typescript
// Upload URL (client uploads directly to S3)
const uploadUrl = await storage.presignUpload('uploads/photo.jpg', {
  expiresIn: 300,  // 5 minutes
  contentType: 'image/jpeg',
  maxSize: 5 * 1024 * 1024,  // 5MB
});

// Download URL
const downloadUrl = await storage.presignDownload('uploads/photo.jpg', {
  expiresIn: 3600,  // 1 hour
});
```

## Public URLs

```typescript
const url = storage.publicUrl('images/logo.png');
// "https://my-uploads.s3.amazonaws.com/images/logo.png"
```

## Compatible services

| Service | Notes |
|---------|-------|
| AWS S3 | Default, no extra config |
| Cloudflare R2 | Set `endpoint` to your R2 URL |
| Backblaze B2 | Set `endpoint` to B2 API URL |
| MinIO | Self-hosted, set `endpoint` to MinIO URL |
| DigitalOcean Spaces | S3-compatible |
