---
title: GraphQL
description: Add a GraphQL endpoint to your Bueno application with schema definition, resolvers, and subscriptions.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 5
---

Bueno's GraphQL module integrates a GraphQL server into your application, supporting queries, mutations, subscriptions, and schema-first or code-first approaches.

## Basic setup

```typescript
import { createGraphQL } from '@buenojs/bueno/graphql';

const graphql = createGraphQL({
  schema: `
    type Query {
      hello: String
      user(id: ID!): User
    }

    type User {
      id: ID!
      name: String!
      email: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hello from Bueno!',
      user: async (_, { id }) => {
        return await db.query('SELECT * FROM users WHERE id = $1', [id]);
      },
    },
  },
});

app.use('/graphql', graphql.handler());
```

## Schema definition

```graphql
type Query {
  posts(page: Int, limit: Int): PostPage!
  post(id: ID!): Post
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}

type Subscription {
  postCreated: Post!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: String!
}

input CreatePostInput {
  title: String!
  content: String!
}
```

## Resolvers

```typescript
const resolvers = {
  Query: {
    posts: async (_, { page = 1, limit = 20 }) => {
      const offset = (page - 1) * limit;
      const posts = await db.query(
        'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return { items: posts, page, total: posts.length };
    },
  },
  Mutation: {
    createPost: async (_, { input }, ctx) => {
      const user = ctx.get('jwtPayload');
      if (!user) throw new Error('Unauthorized');
      const [post] = await db.query(
        'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
        [input.title, input.content, user.userId]
      );
      return post;
    },
  },
  Post: {
    author: async (post) => {
      return await db.query('SELECT * FROM users WHERE id = $1', [post.user_id]);
    },
  },
};
```

## Context

The GraphQL context receives the Bueno `Context` object, giving resolvers access to the request:

```typescript
const graphql = createGraphQL({
  schema,
  resolvers,
  context: (ctx) => ({
    user: ctx.get('jwtPayload'),
    db,
    loaders: createDataLoaders(),
  }),
});
```

## Subscriptions

WebSocket-based subscriptions:

```typescript
const graphql = createGraphQL({
  schema,
  resolvers: {
    Subscription: {
      postCreated: {
        subscribe: () => pubsub.asyncIterator('POST_CREATED'),
      },
    },
    Mutation: {
      createPost: async (_, { input }) => {
        const post = await createPost(input);
        pubsub.publish('POST_CREATED', { postCreated: post });
        return post;
      },
    },
  },
  subscriptions: { path: '/graphql/ws' },
});
```

## GraphQL Playground

Enable the built-in playground in development:

```typescript
const graphql = createGraphQL({
  schema,
  resolvers,
  playground: process.env.NODE_ENV === 'development',
});
```

Access it at `/graphql` in a browser.
