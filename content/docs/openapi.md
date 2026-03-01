---
title: OpenAPI
description: Automatically generate OpenAPI 3.1 documentation from your route definitions and validation schemas.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 9
---

Bueno's OpenAPI module generates a spec from your existing routes and validation schemas — no separate documentation to maintain.

## Basic setup

```typescript
import { createOpenAPI } from '@buenojs/bueno/openapi';

const openapi = createOpenAPI({
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'Built with Bueno',
  },
  servers: [{ url: 'https://api.myapp.com' }],
});

// Mount spec and UI
app.get('/openapi.json', (ctx) => ctx.json(openapi.spec()));
app.get('/docs', (ctx) => ctx.html(openapi.swaggerUi('/openapi.json')));
```

## Documenting routes

Annotate routes with OpenAPI metadata:

```typescript
app.get('/users/:id', getUser, {
  openapi: {
    summary: 'Get a user by ID',
    tags: ['Users'],
    parameters: [
      { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
    ],
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' },
          },
        },
      },
      404: { description: 'User not found' },
    },
  },
});
```

## Schema inference from validators

When using validation schemas, Bueno can infer OpenAPI schemas automatically:

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});

app.post('/users', createUser, {
  openapi: {
    summary: 'Create a user',
    tags: ['Users'],
    requestBody: {
      schema: CreateUserSchema,  // Auto-converted to JSON Schema
    },
  },
});
```

## Components

Define reusable schemas:

```typescript
openapi.addSchema('User', {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name', 'email'],
});

openapi.addSchema('Error', {
  type: 'object',
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
  },
});
```

## Security schemes

```typescript
openapi.addSecurityScheme('BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Apply globally
openapi.requireSecurity('BearerAuth');

// Or per-route
app.get('/protected', handler, {
  openapi: {
    security: [{ BearerAuth: [] }],
  },
});
```

## Auto-collection from router

Auto-discover routes from your app and generate an initial spec:

```typescript
const spec = openapi.collect(app.router);
console.log(JSON.stringify(spec, null, 2));
```

## Redoc

Generate a Redoc UI instead of Swagger:

```typescript
app.get('/api-docs', (ctx) => ctx.html(openapi.redocUi('/openapi.json')));
```
