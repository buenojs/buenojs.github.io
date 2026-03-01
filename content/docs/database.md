---
title: Database
description: Connection pooling, query execution, and transactions using Bun's native database drivers.
layout: docs
section: Data
sectionOrder: 3
order: 1
---

Bueno's database module wraps Bun's native database drivers (SQLite via `bun:sqlite`, PostgreSQL, MySQL via `bun:sql`) with a unified interface for connection management, query execution, and transactions.

## Configuration

```typescript
import { Database } from '@buenojs/bueno/database';

const db = new Database({
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'secret',
  database: 'myapp',
});
```

### From a connection string

```typescript
const db = new Database({
  url: 'postgresql://postgres:secret@localhost:5432/myapp',
});
```

Connection string format auto-detects the database type.

### SQLite

```typescript
const db = new Database({
  type: 'sqlite',
  database: './data.db',  // or ':memory:'
});
```

## Supported databases

| Type | Value | Driver |
|------|-------|--------|
| PostgreSQL | `'postgresql'` | `bun:sql` |
| MySQL | `'mysql'` | `bun:sql` |
| SQLite | `'sqlite'` | `bun:sqlite` |

## Querying

### Parameterized queries

```typescript
const users = await db.query(
  'SELECT * FROM users WHERE email = $1',
  ['alice@example.com']
);
```

Use numbered placeholders (`$1`, `$2`, ...) for PostgreSQL and `?` for SQLite/MySQL.

### Execute (no result)

```typescript
await db.execute(
  'UPDATE users SET last_seen = NOW() WHERE id = $1',
  [userId]
);
```

### Insert and get ID

```typescript
const result = await db.query(
  'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
  ['Bob', 'bob@example.com']
);
const newId = result[0].id;
```

## Transactions

```typescript
const tx = await db.transaction();

try {
  await tx.query(
    'INSERT INTO orders (user_id, total) VALUES ($1, $2)',
    [userId, total]
  );
  await tx.query(
    'UPDATE inventory SET quantity = quantity - 1 WHERE product_id = $1',
    [productId]
  );
  await tx.commit();
} catch (err) {
  await tx.rollback();
  throw err;
}
```

## Connection pooling

Connections are pooled automatically. Configure the pool size:

```typescript
const db = new Database({
  type: 'postgresql',
  url: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 20,
    idleTimeoutMs: 30_000,
  },
});
```

## Closing the connection

```typescript
await db.close();
```

Call this during graceful shutdown.

## Environment variables

The conventional approach is to use an environment variable:

```bash
# .env
DATABASE_URL=postgresql://postgres:secret@localhost:5432/myapp
```

```typescript
const db = new Database({ url: Bun.env.DATABASE_URL! });
```
