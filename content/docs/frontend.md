---
title: Frontend
description: Server-side rendering, hot module replacement, islands architecture, and file-based routing for React, Vue, Svelte, and Solid.
layout: docs
section: Frontend
sectionOrder: 4
order: 1
---

Bueno's frontend module provides a complete development experience for building full-stack web applications. It supports multiple frontend frameworks and rendering strategies with zero additional tooling.

## Dev server

Start the dev server with hot module replacement:

```typescript
import { createDevServer } from '@buenojs/bueno/frontend';

const server = createDevServer({
  port: 3000,
  pagesDir: './src/pages',
  publicDir: './public',
  framework: 'react',  // 'react' | 'vue' | 'svelte' | 'solid'
});

await server.start();
```

The dev server provides:
- **HMR** — component updates without full page reload
- **Real-time console streaming** — server logs forwarded to the browser
- **File watching** — routes reload automatically when files change

## File-based routing

Place files in the `pages/` directory and routes are created automatically:

```
pages/
├── index.tsx          → GET /
├── about.tsx          → GET /about
├── blog/
│   ├── index.tsx      → GET /blog
│   └── [slug].tsx     → GET /blog/:slug
└── api/
    └── users.ts       → GET/POST /api/users
```

### Dynamic routes

Use `[param]` syntax for dynamic segments:

```typescript
// pages/users/[id].tsx
export default function UserPage({ params }: { params: { id: string } }) {
  return <div>User {params.id}</div>;
}
```

### Catch-all routes

```typescript
// pages/docs/[...slug].tsx — matches /docs/anything/nested
export default function DocsPage({ params }: { params: { slug: string[] } }) {
  return <div>{params.slug.join('/')}</div>;
}
```

## Server-side rendering

Export `getServerSideProps` from a page component to fetch data on the server:

```typescript
// pages/users/[id].tsx
import type { SSRContext } from '@buenojs/bueno/frontend';

export async function getServerSideProps(ctx: SSRContext) {
  const user = await fetchUser(ctx.params.id);
  return { props: { user } };
}

export default function UserPage({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

## Layouts

Create `_layout.tsx` files to wrap child routes in a shared layout:

```typescript
// pages/_layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>...</nav>
        <main>{children}</main>
        <footer>...</footer>
      </body>
    </html>
  );
}
```

Layouts nest automatically based on directory depth.

## Islands architecture

Opt individual components into client-side JavaScript while keeping the rest as static HTML:

```typescript
import { Island } from '@buenojs/bueno/frontend';

function StaticPage() {
  return (
    <div>
      <p>This is static HTML — no JS</p>
      <Island component={InteractiveCounter} hydrate="on-visible" />
    </div>
  );
}
```

### Hydration strategies

| Strategy | Description |
|----------|-------------|
| `"immediate"` | Hydrate as soon as the page loads |
| `"on-visible"` | Hydrate when the component enters the viewport |
| `"on-interaction"` | Hydrate on first user interaction (click, hover, focus) |

## Supported frameworks

| Framework | Import | Notes |
|-----------|--------|-------|
| React | Auto-detected | JSX, hooks, suspense |
| Vue | Auto-detected | SFC, Composition API |
| Svelte | Auto-detected | Compiled components |
| Solid | Auto-detected | Fine-grained reactivity |

## API routes

Export HTTP method handlers from files in `pages/api/`:

```typescript
// pages/api/users.ts
import type { APIRequest, APIResponse } from '@buenojs/bueno/frontend';

export async function GET(req: APIRequest): Promise<APIResponse> {
  const users = await db.query('SELECT * FROM users');
  return Response.json(users);
}

export async function POST(req: APIRequest): Promise<APIResponse> {
  const body = await req.json();
  // create user...
  return Response.json({ created: true }, { status: 201 });
}
```

## ISR (Incremental Static Regeneration)

Mark pages for background regeneration after a cache period:

```typescript
export const revalidate = 60;  // Regenerate after 60 seconds

export default function BlogIndex({ posts }) {
  return <PostList posts={posts} />;
}
```
