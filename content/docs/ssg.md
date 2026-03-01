---
title: SSG
description: Generate static HTML from markdown files with frontmatter, custom layouts, and auto-built navigation.
layout: docs
section: Frontend
sectionOrder: 4
order: 2
---

Bueno's SSG module converts markdown files with YAML frontmatter into static HTML. It's what powers this documentation site.

## Quick start

```typescript
import { createSSG } from '@buenojs/bueno/ssg';

const ssg = createSSG(
  {
    contentDir: './content',
    outputDir: './dist',
    publicDir: './public',
    defaultLayout: 'default',
  },
  {
    title: 'My Site',
    description: 'Built with Bueno SSG',
    baseUrl: '/',
  }
);

ssg.registerLayout('default', (ctx) => `
  <!DOCTYPE html>
  <html>
  <head><title>${ctx.title}</title></head>
  <body>${ctx.content}</body>
  </html>
`);

await ssg.build();
```

## Configuration

```typescript
interface SSGConfig {
  contentDir: string;      // Directory containing .md files
  outputDir: string;       // Where to write HTML output
  publicDir?: string;      // Static files to copy to output
  defaultLayout?: string;  // Layout name to use when none specified
  baseUrl?: string;        // Base URL prefix (default: "/")
  minify?: boolean;        // Minify output HTML
}
```

## Frontmatter

Every markdown file can include YAML frontmatter at the top:

```markdown
---
title: My Page
description: A helpful description
layout: docs
date: 2025-01-01
slug: custom-url
---

# Page content here
```

Built-in frontmatter fields:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title |
| `description` | string | Meta description |
| `layout` | string | Layout to use |
| `date` | string | Publication date |
| `slug` | string | Override the URL path |

Custom fields are also supported — access them via `ctx.page.frontmatter`.

## Layout context

Your layout function receives a `LayoutContext`:

```typescript
interface LayoutContext {
  title?: string;        // From frontmatter.title
  description?: string;  // From frontmatter.description
  content: string;       // Rendered HTML from markdown
  page: Page;            // Full page object
  site: SiteConfig;      // Global site config
  [key: string]: unknown;
}
```

```typescript
ssg.registerLayout('docs', (ctx) => `
  <html>
    <head>
      <title>${ctx.title} | ${ctx.site.title}</title>
    </head>
    <body>
      <h1>${ctx.page.frontmatter.title}</h1>
      ${ctx.content}
    </body>
  </html>
`);
```

## Output structure

Files are output to match the content directory structure:

```
content/index.md          → dist/index.html
content/about.md          → dist/about/index.html
content/docs/router.md    → dist/docs/router/index.html
content/docs/index.md     → dist/docs/index.html
```

## Markdown features

The SSG parser handles:

- Headings (h1–h6) with auto-generated `id` attributes
- Bold (`**text**`) and italic (`*text*`)
- Links and images
- Fenced code blocks with language class
- Inline code
- Ordered and unordered lists
- Blockquotes
- Tables
- Horizontal rules

HTML inside markdown is passed through unchanged, enabling rich layouts within content files.

## Dev server

Run a development server that renders pages on demand:

```typescript
await ssg.serve(3000);
// SSG dev server running at http://localhost:3000
```

## Programmatic API

```typescript
const ssg = createSSG(config, siteConfig);

// Load and parse all markdown files
await ssg.loadContent();

// Get all pages
const pages = ssg.getPages();

// Get a specific page
const page = ssg.getPage('/docs/router');

// Render a page manually
const html = ssg.renderPage(page);

// Build everything to outputDir
await ssg.build();
```

## Multi-layout sites

Register as many layouts as needed:

```typescript
ssg.registerLayout('landing', renderLandingLayout);
ssg.registerLayout('docs', renderDocsLayout);
ssg.registerLayout('blog', renderBlogLayout);
```

Each markdown file selects its layout via frontmatter: `layout: docs`.
