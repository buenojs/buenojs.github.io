---
title: RPC
description: Type-safe remote procedure calls between your Bueno server and any TypeScript client.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 6
---

Bueno's RPC module lets you define server-side procedures and call them from the client with full type safety — no code generation, no schema files.

## Defining procedures

```typescript
// src/rpc/router.ts
import { createRpcRouter } from '@buenojs/bueno/rpc';
import { z } from 'zod';

export const rpcRouter = createRpcRouter({
  users: {
    list: async () => {
      return await db.query('SELECT id, name, email FROM users');
    },

    getById: async ({ id }: { id: number }) => {
      const [user] = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return user ?? null;
    },

    create: async (input: { name: string; email: string }) => {
      const [user] = await db.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [input.name, input.email]
      );
      return user;
    },
  },
});

export type AppRouter = typeof rpcRouter;
```

## Mounting the server

```typescript
import { rpcHandler } from '@buenojs/bueno/rpc';
import { rpcRouter } from './rpc/router';

app.all('/rpc/*', rpcHandler(rpcRouter));
```

## Client usage

```typescript
// client.ts
import { createRpcClient } from '@buenojs/bueno/rpc';
import type { AppRouter } from '../server/rpc/router';

const rpc = createRpcClient<AppRouter>({
  baseUrl: 'http://localhost:3000/rpc',
});

// Fully typed — your IDE knows the return type
const users = await rpc.users.list();
const user = await rpc.users.getById({ id: 1 });
const newUser = await rpc.users.create({ name: 'Alice', email: 'alice@example.com' });
```

## Context

Procedures receive the request context as a second argument:

```typescript
export const rpcRouter = createRpcRouter({
  posts: {
    create: async (input: CreatePostInput, ctx: Context) => {
      const user = ctx.get('jwtPayload');
      if (!user) throw new RpcError('UNAUTHORIZED', 'Login required');
      // ...
    },
  },
});
```

## Error handling

```typescript
import { RpcError } from '@buenojs/bueno/rpc';

// Server-side
throw new RpcError('NOT_FOUND', 'User not found');
throw new RpcError('VALIDATION_ERROR', 'Invalid input', { field: 'email' });

// Client-side
try {
  const user = await rpc.users.getById({ id: 999 });
} catch (err) {
  if (err instanceof RpcError && err.code === 'NOT_FOUND') {
    console.log('User does not exist');
  }
}
```

## Middleware

Apply middleware to RPC procedures:

```typescript
export const rpcRouter = createRpcRouter(
  {
    admin: {
      deleteAll: async () => { /* ... */ },
    },
  },
  { middleware: [requireAdmin] }
);
```

## vs REST vs GraphQL

| | RPC | REST | GraphQL |
|---|-----|------|---------|
| Type safety | ✓ End-to-end | With codegen | With codegen |
| Flexibility | Procedures only | Resources | Any query shape |
| Learning curve | Minimal | Low | Higher |
| Best for | Internal, monorepo | Public APIs | Complex data graphs |
