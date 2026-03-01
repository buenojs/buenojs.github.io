---
title: Introduction
description: Welcome to the Bueno framework documentation.
layout: docs
section: Getting Started
sectionOrder: 1
order: 1
---

Bueno is a high-performance, full-stack TypeScript framework built natively for [Bun](https://bun.sh). It provides everything you need to build modern web applications — from HTTP routing and middleware to databases, jobs, SSG, and beyond — with zero external runtime dependencies.

## Why Bueno?

Most frameworks were designed for Node.js and ported to Bun with adapters. Bueno is different: it was designed for Bun from day one, using Bun's native APIs throughout:

- `Bun.serve()` for HTTP — no `http` module, no adapter layer
- `bun:sql` for databases — native SQLite and PostgreSQL driver
- `Bun.redis` for caching
- `Bun.s3` for file storage
- `Bun.password` for secure hashing
- `Bun.Glob` for file scanning

The result is an application that starts in milliseconds and handles thousands of requests per second with minimal memory overhead.

## Core Principles

**Zero external dependencies.** The entire framework ships as a single package with no npm dependencies at runtime. Everything is implemented using Bun's native APIs and the TypeScript standard library.

**Type-safe by default.** Every API is fully typed. Routes, context, validators, database queries — your IDE has complete visibility.

**Progressive complexity.** Start with a simple router. Add middleware, validation, a database, and background jobs as your application grows. You never carry complexity you don't need.

**Convention over configuration.** Sensible defaults mean you spend time building features, not wiring up boilerplate.

## Framework Modules

Bueno is structured as a collection of modules, each with a focused purpose:

| Module | Import path | Purpose |
|--------|-------------|---------|
| Router | `@buenojs/bueno/router` | Auto-selecting HTTP router |
| Context | `@buenojs/bueno/context` | Request/response wrapper |
| Middleware | `@buenojs/bueno/middleware` | Koa-style pipeline |
| Modules | `@buenojs/bueno/modules` | NestJS-style DI system |
| Validation | `@buenojs/bueno/validation` | Standard Schema interface |
| Database | `@buenojs/bueno/database` | Connection pools and queries |
| ORM | `@buenojs/bueno/orm` | Object-relational mapping |
| Frontend | `@buenojs/bueno/frontend` | SSR, HMR, islands |
| SSG | `@buenojs/bueno/ssg` | Static site generation |
| Templates | `@buenojs/bueno/templates` | Template engine |
| Jobs | `@buenojs/bueno/jobs` | Background job queue |
| Security | `@buenojs/bueno/security` | JWT, CSRF, rate limiting |
| WebSocket | `@buenojs/bueno/websocket` | WebSocket server |
| i18n | `@buenojs/bueno/i18n` | Internationalization |
| Cache | `@buenojs/bueno` | Redis-based caching |
| Storage | `@buenojs/bueno` | S3-compatible file storage |
| GraphQL | `@buenojs/bueno/graphql` | GraphQL support |
| RPC | `@buenojs/bueno/rpc` | Type-safe RPC client |
| OpenAPI | `@buenojs/bueno/openapi` | OpenAPI/Swagger docs |
| Logger | `@buenojs/bueno/logger` | Structured logging |
| Health | `@buenojs/bueno/health` | Health check middleware |
| Testing | `@buenojs/bueno/testing` | Testing utilities |
| Config | `@buenojs/bueno/config` | Configuration management |
| CLI | `@buenojs/bueno/cli` | CLI tools |

## Requirements

- **Bun** >= 1.3.0
- **TypeScript** >= 5.3.0 (recommended)

## License

Bueno is released under the [MIT License](https://github.com/buenojs/bueno/blob/main/LICENSE).
