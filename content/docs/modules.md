---
title: Modules
description: Build large applications with Bueno's NestJS-inspired dependency injection and module system.
layout: docs
section: Core
sectionOrder: 2
order: 5
---

The Bueno module system provides a NestJS-inspired dependency injection container with decorators. It's ideal for larger applications that benefit from clear separation of concerns and testable, injectable services.

## Creating a module

```typescript
import { Module, Controller, Injectable, Get, Post } from '@buenojs/bueno/modules';

@Injectable()
class UserService {
  private users = [{ id: 1, name: 'Alice' }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find(u => u.id === id);
  }
}

@Controller('/api/users')
class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  list() {
    return this.userService.findAll();
  }

  @Get('/:id')
  get(ctx: Context) {
    const user = this.userService.findById(Number(ctx.params.id));
    if (!user) return ctx.notFound();
    return ctx.json(user);
  }
}

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

## Bootstrapping

```typescript
import { createApp } from '@buenojs/bueno/modules';

const app = createApp();
app.registerModule(UserModule);
await app.listen(3000);
```

## Decorators

### Class decorators

| Decorator | Purpose |
|-----------|---------|
| `@Module(meta)` | Declares a module |
| `@Controller(prefix)` | Declares a controller with a route prefix |
| `@Injectable()` | Marks a class as injectable |

### Method decorators

| Decorator | HTTP Method |
|-----------|-------------|
| `@Get(path)` | GET |
| `@Post(path)` | POST |
| `@Put(path)` | PUT |
| `@Patch(path)` | PATCH |
| `@Delete(path)` | DELETE |

### Parameter decorators

```typescript
@Get('/:id')
get(@Param('id') id: string, @Query('verbose') verbose: string) {
  // ...
}

@Post('/')
create(@Body() body: CreateUserDto) {
  // ...
}
```

## Guards

Guards run before a handler and can block access:

```typescript
@Injectable()
class AuthGuard implements CanActivate {
  canActivate(ctx: Context): boolean | Promise<boolean> {
    return !!ctx.getHeader('Authorization');
  }
}

@Controller('/api/admin')
@UseGuards(AuthGuard)
class AdminController {
  // All routes require auth
}
```

## Interceptors

Intercept the handler execution — useful for logging, caching, and response transformation:

```typescript
@Injectable()
class LoggingInterceptor implements NestInterceptor {
  async intercept(ctx: Context, next: CallHandler) {
    const start = Date.now();
    const result = await next.handle();
    console.log(`Duration: ${Date.now() - start}ms`);
    return result;
  }
}
```

## Lifecycle hooks

```typescript
@Injectable()
class DatabaseService implements OnModuleInit, OnApplicationBootstrap {
  async onModuleInit() {
    await this.connect();
  }

  async onApplicationBootstrap() {
    await this.runMigrations();
  }
}
```

## Module structure

For larger applications, organize modules by feature:

```
src/
├── app.module.ts
├── users/
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.entity.ts
└── posts/
    ├── post.module.ts
    ├── post.controller.ts
    └── post.service.ts
```

## Importing modules

```typescript
@Module({
  imports: [UserModule, PostModule],
  controllers: [AppController],
})
class AppModule {}
```

Providers exported from `UserModule` become available to `AppModule`'s controllers and providers.
