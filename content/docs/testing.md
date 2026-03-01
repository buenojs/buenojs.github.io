---
title: Testing
description: Testing utilities for unit tests, route testing, and mocking Bueno's services.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 14
---

Bueno integrates with Bun's built-in test runner and provides utilities for testing routes, middleware, and services.

## Route testing

Use `createTestApp` to create a lightweight test instance:

```typescript
import { test, expect } from 'bun:test';
import { createTestApp } from '@buenojs/bueno/testing';
import { app } from '../src/app';

test('GET /users returns a list', async () => {
  const testApp = createTestApp(app);

  const response = await testApp.request('GET', '/users');

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body).toBeArray();
});

test('POST /users creates a user', async () => {
  const testApp = createTestApp(app);

  const response = await testApp.request('POST', '/users', {
    body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status).toBe(201);
  const user = await response.json();
  expect(user.name).toBe('Alice');
});
```

## Request builder

A fluent builder for constructing test requests:

```typescript
import { testRequest } from '@buenojs/bueno/testing';

const response = await testRequest(app)
  .post('/api/posts')
  .header('Authorization', `Bearer ${token}`)
  .json({ title: 'Hello', content: 'World' })
  .send();

expect(response.status).toBe(201);
```

## Mocking services

```typescript
import { mock } from 'bun:test';
import { createTestApp } from '@buenojs/bueno/testing';

test('sends welcome email on registration', async () => {
  const mockSend = mock(async () => {});

  const testApp = createTestApp(app, {
    overrides: {
      NotificationService: {
        send: mockSend,
      },
    },
  });

  await testApp.request('POST', '/auth/register', {
    body: JSON.stringify({ email: 'alice@example.com', password: 'password' }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({ template: 'welcome' })
  );
});
```

## Test database

Use SQLite in-memory for fast, isolated tests:

```typescript
import { createTestDatabase } from '@buenojs/bueno/testing';
import { beforeAll, afterAll } from 'bun:test';

let db: ReturnType<typeof createTestDatabase>;

beforeAll(async () => {
  db = createTestDatabase();
  await db.runMigrations('./migrations');
  await db.seed('./tests/fixtures/users.json');
});

afterAll(async () => {
  await db.close();
});
```

## Testing middleware

Test middleware in isolation:

```typescript
import { createMiddlewareTest } from '@buenojs/bueno/testing';
import { requireAuth } from '../src/middleware/auth';

test('requireAuth blocks unauthenticated requests', async () => {
  const { ctx, next, response } = await createMiddlewareTest(requireAuth, {
    headers: {},  // No Authorization header
  });

  expect(response.status).toBe(401);
  expect(next).not.toHaveBeenCalled();
});

test('requireAuth allows valid JWT', async () => {
  const token = await signJwt({ userId: 1 }, { secret: 'test' });

  const { next } = await createMiddlewareTest(requireAuth, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(next).toHaveBeenCalled();
});
```

## Running tests

```bash
bun test                    # Run all tests
bun test --watch            # Watch mode
bun test src/routes/        # Run specific directory
bun test --coverage         # With coverage report
```

Bun's test runner is significantly faster than Jest or Vitest with no configuration needed.
