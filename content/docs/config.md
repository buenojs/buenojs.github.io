---
title: Config
description: Type-safe configuration management with environment variables, defaults, and validation.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 12
---

Bueno's config module provides a structured, type-safe way to manage application configuration from environment variables.

## Defining config

```typescript
import { defineConfig } from '@buenojs/bueno/config';
import { z } from 'zod';

const config = defineConfig(
  z.object({
    nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
    port: z.coerce.number().default(3000),
    databaseUrl: z.string().url(),
    jwtSecret: z.string().min(32),
    redisUrl: z.string().url().optional(),
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  }),
  {
    // Map env var names to config keys
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    databaseUrl: 'DATABASE_URL',
    jwtSecret: 'JWT_SECRET',
    redisUrl: 'REDIS_URL',
    logLevel: 'LOG_LEVEL',
  }
);
```

## Using config

```typescript
// config is fully typed
config.port          // number
config.databaseUrl   // string
config.jwtSecret     // string
config.redisUrl      // string | undefined

// Use in your app
const app = new Bueno();
app.listen(config.port);

const db = new Database({ url: config.databaseUrl });
```

## Validation at startup

Config is validated at import time. If a required variable is missing or invalid, the process exits with a descriptive error:

```
Error: Configuration validation failed:
  - databaseUrl: Required (DATABASE_URL not set)
  - jwtSecret: String must contain at least 32 characters
```

This catches misconfigured deployments immediately, before any request is served.

## .env files

Bueno loads `.env` automatically in development (Bun's built-in `.env` support):

```bash
# .env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/myapp
JWT_SECRET=a-very-long-secret-key-that-is-at-least-32-chars
```

For production, use your platform's secrets manager or environment variable injection.

## Multiple environments

```bash
.env              # Defaults (committed)
.env.local        # Local overrides (gitignored)
.env.production   # Production values (deploy-time injection)
```

Bun loads these in priority order with `.env.local` winning.

## Config in modules

When using the DI system, inject config as a provider:

```typescript
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: config,
    },
    DatabaseService,
  ],
})
class AppModule {}

@Injectable()
class DatabaseService {
  constructor(@Inject('CONFIG') private config: AppConfig) {}

  async connect() {
    return new Database({ url: this.config.databaseUrl });
  }
}
```
