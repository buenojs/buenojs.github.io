---
title: Logger
description: Structured, leveled logging with context, formatters, and transport adapters.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 10
---

Bueno's logger provides structured, leveled logging with context propagation, custom formatters, and transport adapters.

## Basic usage

```typescript
import { createLogger } from '@buenojs/bueno/logger';

const logger = createLogger({ name: 'myapp' });

logger.debug('Starting initialization');
logger.info('Server started', { port: 3000 });
logger.warn('Slow query detected', { duration: 1234, query: 'SELECT ...' });
logger.error('Database connection failed', { error: err.message });
```

## Log levels

| Level | When to use |
|-------|-------------|
| `debug` | Verbose development info |
| `info` | Normal operational events |
| `warn` | Something unexpected but non-fatal |
| `error` | Errors that need attention |
| `fatal` | Application cannot continue |

Set the minimum level via config or environment:

```typescript
const logger = createLogger({
  name: 'myapp',
  level: process.env.LOG_LEVEL ?? 'info',
});
```

## Structured context

Attach context that appears in every log message:

```typescript
const requestLogger = logger.child({
  requestId: ctx.get('requestId'),
  userId: ctx.get('user')?.id,
});

requestLogger.info('Processing payment', { amount: 42.5 });
// → { level: "info", name: "myapp", requestId: "...", userId: 1, amount: 42.5, message: "Processing payment" }
```

## Middleware integration

Log every request automatically:

```typescript
import { requestLogger } from '@buenojs/bueno/middleware';

app.use(requestLogger({ logger }));
```

Output format:

```
GET /api/users 200 12ms
POST /api/posts 201 45ms
GET /api/missing 404 3ms
```

## Formatters

### JSON (default, recommended for production)

```typescript
const logger = createLogger({
  name: 'myapp',
  formatter: 'json',
});
```

### Pretty (development)

```typescript
const logger = createLogger({
  name: 'myapp',
  formatter: 'pretty',  // Colorized, human-readable
});
```

### Custom

```typescript
const logger = createLogger({
  name: 'myapp',
  formatter: (entry) => `[${entry.level.toUpperCase()}] ${entry.message}`,
});
```

## Transports

Write logs to multiple destinations:

```typescript
const logger = createLogger({
  name: 'myapp',
  transports: [
    { type: 'console' },
    { type: 'file', path: './logs/app.log' },
    { type: 'file', path: './logs/error.log', level: 'error' },
  ],
});
```

## Error logging

Log errors with full stack traces:

```typescript
try {
  await riskyOperation();
} catch (err) {
  logger.error('Operation failed', {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
}
```
