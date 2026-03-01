---
title: CLI
description: Bueno's command-line tools for scaffolding, development, building, and database migrations.
layout: docs
section: Infrastructure
sectionOrder: 5
order: 15
---

Bueno ships with a CLI (`bueno`) that handles project creation, development, building, and database management.

## Installation

Install the CLI globally using Bun:

```bash
bun install -g @buenojs/bueno
```

Once installed, you can use the `bueno` command from anywhere in your terminal.

## Commands

### `bueno new <name>`

Create a new project with an interactive setup wizard:

```bash
bunx create-bueno my-app
# or equivalently
bunx bueno new my-app
```

Options:
- `--template` — Template to use (`default`, `minimal`, `api`, `fullstack`, `website`)
- `--frontend` — Frontend framework (`react`, `vue`, `svelte`, `solid`, `none`)
- `--database` — Database type (`sqlite`, `postgresql`, `mysql`, `none`)
- `--docker` — Include Docker configuration
- `--no-git` — Skip git initialization
- `--no-install` — Skip dependency installation

### `bueno dev`

Start the development server with hot reload:

```bash
bun dev
# Equivalent to: bun run --watch src/index.ts
```

### `bueno build`

Build the project for production:

```bash
bun build
```

Compiles TypeScript, bundles assets, and outputs to `dist/`.

### `bueno start`

Run the production build:

```bash
bun start
# Runs dist/index.js
```

### `bueno migration`

Database migration commands:

```bash
# Generate a migration from entity changes
bueno migration generate add-user-roles

# Run pending migrations
bueno migration run

# Rollback the last migration
bueno migration rollback

# Show migration status
bueno migration status

# Reset all migrations
bueno migration reset
```

Migrations are stored in the `migrations/` directory as timestamped SQL or TypeScript files.

### `bueno generate`

Code generation for common patterns:

```bash
# Generate a module (controller + service + entity)
bueno generate module users

# Generate a controller
bueno generate controller users

# Generate a service
bueno generate service email

# Generate an entity
bueno generate entity post
```

Generated files follow the project's existing conventions.

### `bueno add:frontend`

Add a frontend framework to an existing Bueno project:

```bash
# Interactive selection
bueno add:frontend

# Specify framework directly
bueno add:frontend react
bueno add:frontend vue
bueno add:frontend svelte
bueno add:frontend solid

# Skip dependency installation
bueno add:frontend react --skip-install
```

This command:
- Creates a `client/` directory with frontend scaffolding
- Sets up Tailwind CSS configuration
- Configures Bun bundler for the selected framework
- Adds frontend dependencies and development scripts
- Merges scripts into your `package.json` for running server and client together

After running, you can develop with:
```bash
# Terminal 1
bun run dev:server

# Terminal 2
bun run dev:client

# Or both together
bun run dev
```

### `bueno help`

Show help information:

```bash
bueno help
bueno help migration
```

## Scripts in package.json

A typical `package.json` from `create-bueno`:

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "build": "bun build ./src/index.ts --outdir ./dist --target bun",
    "start": "bun run dist/index.js",
    "test": "bun test",
    "db:migrate": "bueno migration run",
    "db:rollback": "bueno migration rollback",
    "db:generate": "bueno migration generate"
  }
}
```

## Environment

The CLI respects the `NODE_ENV` environment variable. In development mode, it enables:
- Source maps
- Verbose logging
- `.env` file loading
- Watch mode

In production mode (`NODE_ENV=production`):
- Minification
- No source maps
- Optimized output
