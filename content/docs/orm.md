---
title: ORM
description: Define entities, relationships, and query your database with Bueno's built-in object-relational mapper.
layout: docs
section: Data
sectionOrder: 3
order: 2
---

Bueno's ORM layer provides entity definition, relationship mapping, and a fluent query builder on top of the database module.

## Defining entities

```typescript
import { Entity, Column, PrimaryKey, HasMany, BelongsTo } from '@buenojs/bueno/orm';

@Entity('users')
class User {
  @PrimaryKey()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: () => new Date() })
  createdAt: Date;

  @HasMany(() => Post)
  posts: Post[];
}

@Entity('posts')
class Post {
  @PrimaryKey()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  userId: number;

  @BelongsTo(() => User)
  author: User;
}
```

## Repository pattern

```typescript
import { getRepository } from '@buenojs/bueno/orm';

const userRepo = getRepository(User);

// Find by primary key
const user = await userRepo.findById(1);

// Find with conditions
const admins = await userRepo.find({ role: 'admin' });

// Find one
const alice = await userRepo.findOne({ email: 'alice@example.com' });
```

## Creating and saving

```typescript
const user = userRepo.create({
  name: 'Bob',
  email: 'bob@example.com',
});

await userRepo.save(user);
// user.id is now set
```

## Updating

```typescript
await userRepo.update(1, { name: 'Robert' });

// Or via entity
user.name = 'Robert';
await userRepo.save(user);
```

## Deleting

```typescript
await userRepo.delete(1);
await userRepo.deleteWhere({ active: false });
```

## Query builder

For complex queries:

```typescript
const results = await userRepo
  .query()
  .where('active', true)
  .where('role', 'in', ['admin', 'editor'])
  .orderBy('createdAt', 'desc')
  .limit(20)
  .offset(0)
  .include('posts')
  .execute();
```

## Relations

### HasMany

```typescript
const user = await userRepo.findById(1, { include: ['posts'] });
user.posts;  // Post[]
```

### BelongsTo

```typescript
const post = await postRepo.findById(1, { include: ['author'] });
post.author;  // User
```

## Migrations

The ORM integrates with Bueno's migration system. See the [CLI](/docs/cli) docs for `bueno migration` commands.

## Schema

Entity definitions can export a schema for use with the `@buenojs/bueno/schema` module for consistent type definitions across your application.
