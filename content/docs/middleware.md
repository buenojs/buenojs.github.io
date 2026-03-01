---
title: Middleware
description: Compose reusable request/response logic with Bueno's Koa-style async middleware pipeline.
layout: docs
section: Core
sectionOrder: 2
order: 3
---

Bueno uses a Koa-style async/await middleware pipeline. Each middleware receives the context and a `next` function. Calling `next()` advances the pipeline; not calling it short-circuits it.

## Writing middleware

```typescript
import type { Middleware } from '@buenojs/bueno/middleware';

const logger: Middleware = async (ctx, next) => {
  const start = Date.now();
  const response = await next();
  console.log(`${ctx.method} ${ctx.path} — ${Date.now() - start}ms`);
  return response;
};
```

## Registering middleware

### Global middleware

Applied to every request:

```typescript
app.use(logger);
app.use(cors());
app.use(compression());
```

### Route-specific middleware

```typescript
app.get('/admin', adminHandler, { middleware: [requireAuth] });
```

### Group middleware

All routes in the group inherit the group's middleware:

```typescript
const api = app.group('/api', { middleware: [rateLimit({ max: 100 })] });
api.get('/users', listUsers);
```

## Built-in middleware

Import from `@buenojs/bueno/middleware`:

### Logger

```typescript
import { logger } from '@buenojs/bueno/middleware';
app.use(logger());
```

Logs method, path, status code, and duration.

### CORS

```typescript
import { cors } from '@buenojs/bueno/middleware';

app.use(cors({
  origin: ['https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
```

### Compression

```typescript
import { compression } from '@buenojs/bueno/middleware';
app.use(compression());
```

Gzip/Brotli response compression.

### Rate limiting

```typescript
import { rateLimit } from '@buenojs/bueno/middleware';

app.use(rateLimit({
  windowMs: 60_000,   // 1 minute
  max: 100,           // 100 requests per window
}));
```

### Security headers

```typescript
import { securityHeaders } from '@buenojs/bueno/middleware';
app.use(securityHeaders());
```

Sets `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and more.

## Composing middleware

Use `compose` to combine middleware functions into a single pipeline:

```typescript
import { compose } from '@buenojs/bueno/middleware';

const pipeline = compose([logger, cors(), rateLimit({ max: 50 })]);
```

## Short-circuiting

Return a response before calling `next()` to stop the pipeline:

```typescript
const requireAuth: Middleware = async (ctx, next) => {
  const token = ctx.getHeader('Authorization');
  if (!token) {
    return ctx.json({ error: 'Unauthorized' }, 401);
  }
  return next();
};
```

## Error handling

Wrap `next()` in a try/catch to handle errors from downstream middleware and handlers:

```typescript
const errorHandler: Middleware = async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    console.error(err);
    return ctx.json({ error: 'Internal server error' }, 500);
  }
};

// Register first so it wraps everything
app.use(errorHandler);
```

## Execution order

Middleware runs in registration order on the way in, and reverse order on the way out:

```
Request → [A enters] → [B enters] → handler → [B exits] → [A exits] → Response
```

This is identical to Koa's onion model.
