---
title: Templates
description: Multi-channel template engine for rendering markdown, HTML, and text templates with variable interpolation and filters.
layout: docs
section: Frontend
sectionOrder: 4
order: 3
---

The Bueno template engine renders content templates for multiple channels — email, SMS, push notifications, and web — from a single source file.

## Quick start

```typescript
import { TemplateEngine } from '@buenojs/bueno/templates';

const engine = new TemplateEngine({
  basePath: './templates',
});

const html = await engine.renderToHtml('welcome', {
  name: 'Alice',
  confirmUrl: 'https://myapp.com/confirm/abc123',
});
```

## Template files

Templates live in the `basePath` directory. A template can contain multiple channel variants separated by `---`:

```markdown
---
subject: Welcome to {{ name }}!
---

## Email

Hello {{ name }},

Welcome! Please confirm your email:

[Confirm Email]({{ confirmUrl }})

---

## SMS

Hi {{ name }}! Confirm your email: {{ confirmUrl }}

---

## Push

Welcome to the app, {{ name }}!
```

## Syntax

### Variable interpolation

```
{{ variable }}
{{ user.name }}
```

### Filters

```
{{ name | uppercase }}
{{ title | trim | truncate:50 }}
{{ date | format:'YYYY-MM-DD' }}
```

### Conditionals

```
{{ if isPremium }}
  Premium content here
{{ endif }}

{{ if role == 'admin' }}
  Admin panel link
{{ else }}
  Regular user content
{{ endif }}
```

## Configuration

```typescript
interface TemplateEngineConfig {
  basePath: string;
  cache?: {
    enabled: boolean;
    ttl: number;      // seconds
    maxSize: number;  // number of templates
  };
  watch?: boolean;    // hot reload in development
  locale?: string;    // default locale
}
```

## Rendering methods

```typescript
// Render as HTML (default)
const html = await engine.renderToHtml('template-id', data);

// Render as plain text
const text = await engine.renderToText('template-id', data);

// Render a specific channel variant
const sms = await engine.render('template-id', data, { variant: 'sms' });
const push = await engine.render('template-id', data, { variant: 'push' });
```

## Markdown renderer

Use the `MarkdownRenderer` directly for one-off conversions:

```typescript
import { MarkdownRenderer } from '@buenojs/bueno/templates';

const html = MarkdownRenderer.toHtml('# Hello\n\nThis is **markdown**.');
const text = MarkdownRenderer.toText('# Hello\n\nThis is **markdown**.');
```

### Supported markdown features

- Headings (h1–h6)
- Bold and italic
- Lists (ordered and unordered)
- Links
- Blockquotes
- Horizontal rules
- Line breaks

## Custom filters

Register your own filters:

```typescript
engine.registerFilter('currency', (value: unknown) => {
  return `$${Number(value).toFixed(2)}`;
});

engine.registerFilter('pluralize', (value: unknown, singular: string, plural: string) => {
  return Number(value) === 1 ? singular : plural;
});
```

Use in templates:

```
{{ price | currency }}
{{ count | pluralize:'item':'items' }}
```

## Caching

Templates are cached in memory by default. In production, the cache is warm for the lifetime of the process. In development, enable `watch: true` to automatically reload changed templates.

```typescript
const engine = new TemplateEngine({
  basePath: './templates',
  watch: process.env.NODE_ENV === 'development',
  cache: {
    enabled: true,
    ttl: 300,       // 5 minutes
    maxSize: 100,
  },
});
```

## Integration with notifications

The template engine is used internally by Bueno's [notification module](/docs/notifications) to render multi-channel messages.
