---
title: Router
description: Bueno's auto-selecting HTTP router with dynamic routes, route groups, and wildcard matching.
layout: docs
section: Core
sectionOrder: 2
order: 1
---

The Bueno router automatically selects the most efficient routing algorithm based on how many routes you define — keeping things fast at any scale.

## Auto-selection

| Route count | Algorithm | Complexity |
|-------------|-----------|------------|
| ≤ 10 routes | `LinearRouter` | O(n) array scan |
| 11–50 routes | `RegexRouter` | Compiled regex patterns |
| > 50 routes | `TreeRouter` | Radix tree — O(log n) |

You don't configure this — it happens automatically.

## Basic usage

```typescript
import { createRouter } from '@buenojs/bueno/router';
import { Bueno } from '@buenojs/bueno';

const app = new Bueno();

app.get('/', (ctx) => ctx.json({ ok: true }));
app.post('/users', (ctx) => ctx.json({ created: true }));
app.put('/users/:id', (ctx) => ctx.json({ id: ctx.params.id }));
app.delete('/users/:id', (ctx) => ctx.json({ deleted: true }));
```

## HTTP methods

All standard HTTP methods are supported:

```typescript
app.get(pattern, handler)
app.post(pattern, handler)
app.put(pattern, handler)
app.patch(pattern, handler)
app.delete(pattern, handler)
app.head(pattern, handler)
app.options(pattern, handler)
app.all(pattern, handler)   // matches any method
```

## Dynamic parameters

Use `:paramName` segments to capture path parameters:

```typescript
app.get('/users/:id', (ctx) => {
  const { id } = ctx.params;
  return ctx.json({ userId: id });
});

// /users/42 → { userId: "42" }
```

Parameters are always strings. Parse them as needed:

```typescript
const id = Number(ctx.params.id);
```

## Wildcard routes

Use `*` to match any remaining path segments:

```typescript
app.get('/files/*', (ctx) => {
  // ctx.params['*'] contains the wildcard portion
  return ctx.text(`File: ${ctx.params['*']}`);
});

// /files/images/logo.png → "File: images/logo.png"
```

## Route groups

Group related routes under a shared prefix:

```typescript
const users = app.group('/api/users');

users.get('/', listUsers);
users.post('/', createUser);
users.get('/:id', getUser);
users.put('/:id', updateUser);
users.delete('/:id', deleteUser);
```

Groups can be nested:

```typescript
const api = app.group('/api');
const v1 = api.group('/v1');

v1.get('/health', healthHandler);
```

## Route options

Pass options as the third argument to any route method:

```typescript
app.get('/protected', handler, {
  middleware: [authMiddleware],
  name: 'protected-route',
});
```

## Using the router standalone

You can use the router independently from the Bueno application class:

```typescript
import { createRouter } from '@buenojs/bueno/router';
import { Context } from '@buenojs/bueno/context';

const router = createRouter();

router.get('/hello', (ctx: Context) => ctx.text('Hello!'));

// Match a request
const match = router.match('GET', '/hello');
if (match) {
  const ctx = new Context(request, match.params);
  const response = await match.handler(ctx);
}
```

## Route naming

Named routes allow you to generate URLs programmatically:

```typescript
app.get('/posts/:slug', handler, { name: 'post.show' });

// Somewhere else:
const url = app.router.urlFor('post.show', { slug: 'hello-world' });
// → "/posts/hello-world"
```
