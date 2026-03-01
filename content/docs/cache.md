---
title: Cache
description: Redis-based caching with pub/sub messaging using Bun's native Bun.redis client.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 7
---

Bueno's caching uses `Bun.redis` — Bun's native, high-performance Redis client — giving you both key-value caching and pub/sub messaging.

## Setup

```typescript
import { createCache } from '@buenojs/bueno';

const cache = createCache({
  url: Bun.env.REDIS_URL,
  keyPrefix: 'myapp:',
});
```

## Basic operations

```typescript
// Set with TTL (seconds)
await cache.set('user:1', JSON.stringify(user), 300);  // Expires in 5 minutes

// Get
const raw = await cache.get('user:1');
const user = raw ? JSON.parse(raw) : null;

// Delete
await cache.delete('user:1');

// Check existence
const exists = await cache.has('user:1');

// Clear all keys with prefix
await cache.clear('user:');
```

## Typed helpers

```typescript
// Set with automatic serialization
await cache.setJSON('user:1', user, 300);

// Get with automatic deserialization + type
const user = await cache.getJSON<User>('user:1');
```

## Caching middleware

Cache entire HTTP responses:

```typescript
import { cacheMiddleware } from '@buenojs/bueno/middleware';

app.get('/api/products', cacheMiddleware({ ttl: 60, cache }), async (ctx) => {
  const products = await db.query('SELECT * FROM products');
  return ctx.json(products);
});
```

The first request runs the handler; subsequent requests within 60 seconds return the cached response.

## Pub/Sub

```typescript
// Publisher
await cache.publish('notifications', JSON.stringify({
  type: 'order.created',
  orderId: 42,
}));

// Subscriber
const sub = cache.subscribe('notifications');
for await (const message of sub) {
  const event = JSON.parse(message);
  console.log('Event:', event);
}
```

## Cache-aside pattern

A common pattern: read from cache first, fetch from DB on miss, then populate cache:

```typescript
async function getUser(id: number): Promise<User> {
  const cacheKey = `user:${id}`;

  const cached = await cache.getJSON<User>(cacheKey);
  if (cached) return cached;

  const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  await cache.setJSON(cacheKey, user, 300);
  return user;
}
```

## Invalidation

Invalidate cache entries when data changes:

```typescript
app.put('/users/:id', async (ctx) => {
  const updated = await updateUser(ctx.params.id, await ctx.body());
  await cache.delete(`user:${ctx.params.id}`);
  return ctx.json(updated);
});
```

## Configuration

```typescript
interface CacheConfig {
  url: string;          // Redis connection URL
  keyPrefix?: string;   // Prefix for all keys
  defaultTtl?: number;  // Default TTL in seconds
  maxRetries?: number;  // Reconnection retries
}
```
