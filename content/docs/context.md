---
title: Context
description: The Context object gives every route handler access to the request, response helpers, params, cookies, and typed variables.
layout: docs
section: Core
sectionOrder: 2
order: 2
---

Every route handler receives a `Context` object as its first argument. It wraps the raw `Request` and provides ergonomic helpers for reading input and sending responses.

## Request data

```typescript
app.get('/example', (ctx) => {
  ctx.method          // "GET"
  ctx.path            // "/example"
  ctx.url             // URL object
  ctx.params          // { [key: string]: string }
  ctx.query           // { [key: string]: string }
  ctx.req             // Raw Request object
});
```

### Query parameters

```typescript
app.get('/search', (ctx) => {
  const q = ctx.query.q;         // ?q=bueno
  const page = ctx.query.page;   // ?page=2
  return ctx.json({ q, page });
});
```

### Headers and cookies

```typescript
ctx.getHeader('content-type')   // string | undefined
ctx.getHeader('Authorization')  // "Bearer ..."

ctx.getCookie('session')        // string | undefined
ctx.cookies                     // { [name: string]: string }
```

### Request body

```typescript
// JSON body
const body = await ctx.body<{ name: string; email: string }>();

// Raw text
const text = await ctx.bodyText();

// Form data
const form = await ctx.formData();
const name = form.get('name');
```

## Response helpers

### JSON

```typescript
return ctx.json({ user: { id: 1, name: 'Alice' } });
return ctx.json({ error: 'Not found' }, 404);
```

### HTML

```typescript
return ctx.html('<h1>Hello</h1>');
return ctx.html(template, 200);
```

### Text

```typescript
return ctx.text('Hello, world!');
return ctx.text('Forbidden', 403);
```

### Redirect

```typescript
return ctx.redirect('/login');
return ctx.redirect('/dashboard', 302);
```

### Not found / errors

```typescript
return ctx.notFound();           // 404
return ctx.error('Bad input', 400);
```

## Typed variables

Store and retrieve typed values within a request's lifecycle — useful for passing data from middleware to handlers:

```typescript
// In middleware
ctx.set('user', { id: 1, role: 'admin' });

// In handler
const user = ctx.get<{ id: number; role: string }>('user');
```

Type parameters ensure you get back the right type without casting.

## Custom context

You can extend the context type to carry your application-specific variables:

```typescript
type AppVariables = {
  user: User;
  requestId: string;
};

const app = new Bueno<AppVariables>();

app.use(async (ctx, next) => {
  ctx.set('requestId', crypto.randomUUID());
  return next();
});

app.get('/me', (ctx) => {
  const user = ctx.get('user');  // typed as User
  return ctx.json(user);
});
```

## Raw response

When you need full control, return a standard `Response` object:

```typescript
app.get('/stream', () => {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('Hello'));
      controller.close();
    }
  });
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' }
  });
});
```
