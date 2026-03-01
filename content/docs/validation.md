---
title: Validation
description: Validate request bodies, query strings, params, and headers using any Standard Schema-compatible library.
layout: docs
section: Core
sectionOrder: 2
order: 4
---

Bueno's validation module implements the [Standard Schema](https://standardschema.dev) interface, letting you use any compatible validation library — Zod, Valibot, ArkType, Typia, and more — with the same API.

## Basic validation

```typescript
import { validate } from '@buenojs/bueno/validation';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

const result = await validate(schema, data);

if (result.success) {
  console.log(result.data);  // typed as { name: string; email: string; age: number }
} else {
  console.log(result.issues);  // validation errors
}
```

## Request validation helpers

Validate specific parts of the incoming request:

```typescript
import {
  validateBody,
  validateQuery,
  validateParams,
  validateHeaders,
} from '@buenojs/bueno/validation';

app.post('/users', async (ctx) => {
  const body = await validateBody(ctx, z.object({
    name: z.string(),
    email: z.string().email(),
  }));

  if (!body.success) {
    return ctx.json({ errors: body.issues }, 422);
  }

  // body.data is fully typed
  return ctx.json({ user: body.data });
});
```

### validateQuery

```typescript
app.get('/search', async (ctx) => {
  const query = await validateQuery(ctx, z.object({
    q: z.string().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().max(100).default(20),
  }));

  if (!query.success) {
    return ctx.json({ errors: query.issues }, 400);
  }

  const { q, page, limit } = query.data;
  // ...
});
```

### validateParams

```typescript
app.get('/users/:id', async (ctx) => {
  const params = await validateParams(ctx, z.object({
    id: z.coerce.number().positive(),
  }));

  if (!params.success) {
    return ctx.notFound();
  }

  const userId = params.data.id;  // number
});
```

## Supported libraries

Any library implementing [Standard Schema](https://standardschema.dev):

| Library | Version | Notes |
|---------|---------|-------|
| [Zod](https://zod.dev) | 4+ | Most popular, excellent DX |
| [Valibot](https://valibot.dev) | v1+ | Smallest bundle size |
| [ArkType](https://arktype.io) | Latest | Fastest validation speed |
| [Typia](https://typia.io) | 7+ | Compile-time validation |

## Inline validation

For quick checks without importing a full schema library:

```typescript
import { validate } from '@buenojs/bueno/validation';

// Works with any Standard Schema-compliant object
const result = await validate(mySchema, data);
```

## Error format

Validation errors follow the Standard Schema issue format:

```typescript
interface ValidationIssue {
  message: string;
  path?: (string | number | symbol)[];
}
```

## Integration with modules

When using the DI module system, validation can be applied at the controller level:

```typescript
@Post('/users')
@UseGuards(ValidationGuard(CreateUserDto))
async createUser(@Body() body: CreateUserDto) {
  return this.userService.create(body);
}
```
