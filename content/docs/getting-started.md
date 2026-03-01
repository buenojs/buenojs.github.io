---
title: Getting Started
description: Install Bueno and build your first application in under a minute.
layout: docs
section: Getting Started
sectionOrder: 1
order: 2
---

Get up and running with Bueno in under a minute.

## Installation

The fastest way to scaffold a new project is with `create-bueno`:

```bash
bunx create-bueno my-app
cd my-app
bun dev
```

This launches an interactive prompt where you choose your project type, frontend framework, database, and optional features like Docker and deployment config.

### Manual installation

You can also install Bueno directly into an existing project:

```bash
bun add @buenojs/bueno
```

## Your first app

Create a file `src/index.ts`:

```typescript
import { Bueno } from '@buenojs/bueno';

const app = new Bueno();

app.get('/', (ctx) => {
  return ctx.json({ message: 'Hello from Bueno!' });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Run it:

```bash
bun run src/index.ts
```

## Project templates

`create-bueno` offers five templates:

| Template | Description |
|----------|-------------|
| `default` | Full-stack app with modules, DI, and database |
| `minimal` | Bare-minimum router + context setup |
| `api` | API-only, no frontend |
| `fullstack` | SSR frontend with React/Vue/Svelte/Solid |
| `website` | Static site with SSG and markdown |

## Dev server

All templates include a `bun dev` script that uses Bun's file watcher for instant reloads:

```bash
bun dev        # Start with hot reload
bun build      # Production build
bun start      # Run production build
```

## Project structure

A typical Bueno project looks like this:

```
my-app/
├── src/
│   ├── index.ts          # App entry point
│   ├── routes/           # Route handlers
│   ├── middleware/        # Custom middleware
│   └── modules/          # DI modules (if using modules template)
├── public/               # Static assets
├── package.json
└── tsconfig.json
```

## Next steps

- Learn about the [Router](/docs/router) to define your routes
- Understand the [Context](/docs/context) object available in every handler
- Add [Middleware](/docs/middleware) to your request pipeline
- Validate input with the [Validation](/docs/validation) module
