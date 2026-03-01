---
title: Health
description: Health check endpoints for load balancers, Kubernetes probes, and monitoring systems.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 13
---

Bueno's health module exposes structured health check endpoints compatible with Kubernetes liveness/readiness probes and standard monitoring tools.

## Basic setup

```typescript
import { healthMiddleware } from '@buenojs/bueno/health';

app.use('/health', healthMiddleware({
  checks: {
    database: async () => {
      await db.query('SELECT 1');
      return { status: 'ok' };
    },
    redis: async () => {
      await cache.ping();
      return { status: 'ok' };
    },
  },
}));
```

A `GET /health` request returns:

```json
{
  "status": "ok",
  "checks": {
    "database": { "status": "ok", "duration": 3 },
    "redis": { "status": "ok", "duration": 1 }
  },
  "uptime": 12345,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Liveness vs readiness

Kubernetes uses two separate probes:

```typescript
// Liveness: Is the app alive? (should it be restarted?)
app.use('/health/live', healthMiddleware({
  checks: {
    // Just check the process is responding
    process: async () => ({ status: 'ok', memory: process.memoryUsage().heapUsed }),
  },
}));

// Readiness: Is the app ready to serve traffic?
app.use('/health/ready', healthMiddleware({
  checks: {
    database: dbCheck,
    cache: cacheCheck,
    externalApi: apiCheck,
  },
}));
```

Kubernetes probe config:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Check responses

A check function returns a `HealthCheckResult`:

```typescript
interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  message?: string;
  [key: string]: unknown;  // Extra metadata
}
```

| Status | HTTP status | Meaning |
|--------|-------------|---------|
| `ok` | 200 | Fully operational |
| `degraded` | 200 | Working but with issues |
| `error` | 503 | Check failed |

If any check returns `error`, the overall endpoint returns HTTP 503.

## Custom health endpoint

For full control:

```typescript
app.get('/health', async (ctx) => {
  const start = Date.now();

  try {
    await db.query('SELECT 1');
    return ctx.json({
      status: 'ok',
      db: 'connected',
      uptime: process.uptime(),
      responseTime: Date.now() - start,
    });
  } catch (err) {
    return ctx.json({
      status: 'error',
      db: 'disconnected',
      error: err instanceof Error ? err.message : 'unknown',
    }, 503);
  }
});
```

## Metrics integration

The health module works alongside the observability module:

```typescript
import { healthMiddleware } from '@buenojs/bueno/health';
import { metrics } from '@buenojs/bueno/observability';

app.use('/health', healthMiddleware({
  checks: { database: dbCheck },
  onCheck: (name, result, duration) => {
    metrics.recordGauge(`health.${name}`, result.status === 'ok' ? 1 : 0);
    metrics.recordHistogram(`health.${name}.duration`, duration);
  },
}));
```
