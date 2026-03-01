---
title: Security
description: JWT authentication, CSRF protection, password hashing, and rate limiting built into Bueno.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 1
---

Bueno provides security primitives as first-class features, all implemented using Bun's native cryptographic APIs.

## JWT

Sign and verify JSON Web Tokens:

```typescript
import { signJwt, verifyJwt } from '@buenojs/bueno/security';

// Sign a token
const token = await signJwt(
  { userId: 1, role: 'admin' },
  { secret: process.env.JWT_SECRET!, expiresIn: '7d' }
);

// Verify and decode
const payload = await verifyJwt(token, process.env.JWT_SECRET!);
if (payload) {
  console.log(payload.userId);  // 1
}
```

### JWT middleware

```typescript
import { jwtMiddleware } from '@buenojs/bueno/security';

app.use(jwtMiddleware({
  secret: process.env.JWT_SECRET!,
  exclude: ['/auth/login', '/auth/register'],
}));

// In handlers, access the decoded payload
app.get('/me', (ctx) => {
  const user = ctx.get('jwtPayload');
  return ctx.json(user);
});
```

## Password hashing

Bueno delegates to `Bun.password` for secure bcrypt/argon2 hashing:

```typescript
import { hashPassword, verifyPassword } from '@buenojs/bueno/security';

// Hash during registration
const hash = await hashPassword('user-password');

// Verify during login
const valid = await verifyPassword('user-password', hash);
if (!valid) {
  return ctx.json({ error: 'Invalid credentials' }, 401);
}
```

Bun.password uses argon2id by default, which is resistant to GPU cracking.

## CSRF protection

```typescript
import { csrf } from '@buenojs/bueno/security';

app.use(csrf({
  secret: process.env.CSRF_SECRET!,
  cookie: 'csrf-token',
  header: 'x-csrf-token',
}));
```

The middleware:
1. Generates a signed token and sets it as a cookie on GET requests
2. Validates the token from the request header on state-mutating requests (POST, PUT, PATCH, DELETE)

## Rate limiting

Rate limiting is also available as security middleware:

```typescript
import { rateLimit } from '@buenojs/bueno/middleware';

// Global limit
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// Stricter limit on auth routes
app.post('/auth/login', loginHandler, {
  middleware: [rateLimit({ windowMs: 60_000, max: 5 })],
});
```

## Security headers

Apply a sensible set of security headers to all responses:

```typescript
import { securityHeaders } from '@buenojs/bueno/middleware';

app.use(securityHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.tailwindcss.com'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

Headers applied by default:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Restrictive defaults |

## API key authentication

```typescript
import { apiKeyAuth } from '@buenojs/bueno/security';

app.use('/api', apiKeyAuth({
  keys: new Set([process.env.API_KEY!]),
  header: 'x-api-key',
}));
```

## Best practices

1. Store secrets in environment variables, never in source code
2. Use `httpOnly` and `secure` flags on session cookies
3. Always validate and sanitize user input with the [validation module](/docs/validation)
4. Enable rate limiting on authentication endpoints
5. Use parameterized queries (never string concatenation) in database queries
