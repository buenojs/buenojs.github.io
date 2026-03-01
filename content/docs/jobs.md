---
title: Jobs
description: Reliable background job queue for offloading slow tasks like email sending, image processing, and data exports.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 2
---

Bueno's job queue lets you run background tasks reliably, with retries, scheduling, and prioritization.

## Creating a job

```typescript
import { defineJob } from '@buenojs/bueno/jobs';

const sendWelcomeEmail = defineJob('send-welcome-email', async (payload: { userId: number }) => {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
  await mailer.send({
    to: user.email,
    subject: 'Welcome!',
    html: await templates.render('welcome', { name: user.name }),
  });
});
```

## Registering and starting the queue

```typescript
import { createQueue } from '@buenojs/bueno/jobs';

const queue = createQueue({
  concurrency: 5,
  redis: Bun.env.REDIS_URL,
});

queue.register(sendWelcomeEmail);
queue.register(processUpload);
queue.register(generateReport);

await queue.start();
```

## Enqueuing jobs

```typescript
// Enqueue immediately
await queue.enqueue('send-welcome-email', { userId: 42 });

// Enqueue with options
await queue.enqueue('generate-report', { reportId: 7 }, {
  priority: 10,         // Higher = processed first
  delay: 5000,          // Wait 5 seconds before processing
  maxRetries: 3,        // Retry up to 3 times on failure
  retryDelay: 10_000,   // Wait 10 seconds between retries
});
```

## Scheduled jobs (cron)

```typescript
import { scheduleCron } from '@buenojs/bueno/jobs';

// Run every day at 2am
scheduleCron('daily-cleanup', '0 2 * * *', async () => {
  await db.execute('DELETE FROM sessions WHERE expires_at < NOW()');
});

// Run every 5 minutes
scheduleCron('sync-inventory', '*/5 * * * *', async () => {
  await syncInventoryFromWarehouse();
});
```

## Job events

```typescript
queue.on('job:started', ({ name, payload }) => {
  console.log(`Starting ${name}`, payload);
});

queue.on('job:completed', ({ name, duration }) => {
  console.log(`Completed ${name} in ${duration}ms`);
});

queue.on('job:failed', ({ name, error, attempt }) => {
  console.error(`Failed ${name} (attempt ${attempt})`, error);
});
```

## Queue configuration

```typescript
interface QueueConfig {
  concurrency?: number;    // Max concurrent jobs (default: 10)
  redis?: string;          // Redis URL for persistence
  prefix?: string;         // Queue key prefix
  pollInterval?: number;   // MS between polling when idle
}
```

## Job retries

When a job handler throws, the job is retried up to `maxRetries` times with `retryDelay` between attempts. After all retries are exhausted, the job is moved to the dead-letter queue.

```typescript
const fragileJob = defineJob('fragile', async (payload) => {
  const res = await fetch(externalApi);
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  // ...
});

await queue.enqueue('fragile', payload, {
  maxRetries: 5,
  retryDelay: 30_000,  // 30 second backoff
});
```

## Graceful shutdown

```typescript
process.on('SIGTERM', async () => {
  await queue.stop();  // Wait for running jobs to finish
  process.exit(0);
});
```
