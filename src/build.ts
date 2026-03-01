import { createSSG, type LayoutContext, type SiteConfig } from "@buenojs/bueno";
import { Header } from "./components/header.ts";
import { Footer } from "./components/footer.ts";
import { Sidebar, type NavSection, type NavItem } from "./components/sidebar.ts";

// ---------------------------------------------------------------------------
// Site config
// ---------------------------------------------------------------------------

const siteConfig: Partial<SiteConfig> = {
  title: "Bueno",
  description: "The high-performance Bun-native framework for TypeScript apps.",
  baseUrl: "/",
};

// ---------------------------------------------------------------------------
// Nav tree builder — scans content/docs/**/*.md for frontmatter
// ---------------------------------------------------------------------------

interface DocFrontmatter {
  title?: string;
  section?: string;
  sectionOrder?: number;
  order?: number;
}

function parseFrontmatterQuick(text: string): DocFrontmatter {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm: DocFrontmatter = {};
  for (const line of match[1].split("\n")) {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey || rest.length === 0) continue;
    const key = rawKey.trim();
    const value = rest.join(":").trim().replace(/^["']|["']$/g, "");

    if (key === "title") fm.title = value;
    else if (key === "section") fm.section = value;
    else if (key === "sectionOrder") fm.sectionOrder = Number(value);
    else if (key === "order") fm.order = Number(value);
  }
  return fm;
}

async function buildNavTree(): Promise<NavSection[]> {
  const glob = new Bun.Glob("**/*.md");
  const contentDocsDir = new URL("../content/docs", import.meta.url).pathname;

  const sectionMap = new Map<string, { order: number; items: NavItem[] }>();

  for await (const file of glob.scan(contentDocsDir)) {
    const filePath = `${contentDocsDir}/${file}`;
    const text = await Bun.file(filePath).text();
    const fm = parseFrontmatterQuick(text);

    const slug = file.replace(/\.md$/, "").replace(/\/index$/, "");
    const path = slug === "index" ? "/docs" : `/docs/${slug}`;

    const title = fm.title ?? slug.split("/").pop()!.replace(/-/g, " ");
    const section = fm.section ?? "Other";
    const sectionOrder = fm.sectionOrder ?? 99;
    const order = fm.order ?? 50;

    if (!sectionMap.has(section)) {
      sectionMap.set(section, { order: sectionOrder, items: [] });
    }
    sectionMap.get(section)!.items.push({ title, path, order });
  }

  // Sort items within each section
  for (const entry of sectionMap.values()) {
    entry.items.sort((a, b) => (a.order ?? 50) - (b.order ?? 50) || a.title.localeCompare(b.title));
  }

  // Sort sections
  return Array.from(sectionMap.entries())
    .map(([section, data]) => ({ section, order: data.order, items: data.items }))
    .sort((a, b) => a.order - b.order);
}

// ---------------------------------------------------------------------------
// TOC extractor — pulls h2/h3 headings from rendered HTML
// ---------------------------------------------------------------------------

function extractToc(html: string): Array<{ id: string; text: string; level: number }> {
  const toc: Array<{ id: string; text: string; level: number }> = [];
  const headingRe = /<h([23])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h[23]>/g;
  let match: RegExpExecArray | null;
  while ((match = headingRe.exec(html)) !== null) {
    toc.push({ level: Number(match[1]), id: match[2], text: match[3] });
  }
  return toc;
}

// ---------------------------------------------------------------------------
// HTML head — shared across layouts
// ---------------------------------------------------------------------------

const TAILWIND_CONFIG = `
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2badee",
        "accent-violet": "#8b5cf6",
        "background-light": "#f6f7f8",
        "background-dark": "#0f172a",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
};`;

function htmlHead(title: string, description: string): string {
  return `
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
<script id="tailwind-config">${TAILWIND_CONFIG}</script>
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="stylesheet" href="/styles/extra.css" />
<style>
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  body { font-family: 'Inter', sans-serif; }
  .bg-grid {
    background-image: radial-gradient(circle at 2px 2px, rgba(43, 173, 238, 0.05) 1px, transparent 0);
    background-size: 40px 40px;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #475569; }
</style>`;
}

// ---------------------------------------------------------------------------
// Landing layout
// ---------------------------------------------------------------------------

function renderLandingLayout(ctx: LayoutContext): string {
  const title = `${ctx.site.title} | Build fast. Run on Bun.`;
  const description = ctx.page.frontmatter.description ?? ctx.site.description;

  return `<!DOCTYPE html>
<html class="dark" lang="en">
<head>${htmlHead(title, description)}</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 selection:bg-primary/30">
<div class="relative min-h-screen flex flex-col overflow-x-hidden bg-grid">
  <!-- Decorative glow -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
  ${Header({ activePath: "/" })}
  <main class="flex-grow">
    ${ctx.content}
  </main>
  ${Footer()}
</div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Docs layout
// ---------------------------------------------------------------------------

function renderDocsLayout(navTree: NavSection[]) {
  return function (ctx: LayoutContext): string {
    const pageTitle = ctx.page.frontmatter.title ?? "Docs";
    const title = `${pageTitle} | ${ctx.site.title}`;
    const description = ctx.page.frontmatter.description ?? ctx.site.description;
    const activePath = ctx.page.path;
    const toc = extractToc(ctx.content);

    // Breadcrumb: path segments like /docs/router → ["Docs", "Router"]
    const segments = activePath.split("/").filter(Boolean);
    const breadcrumbs = segments
      .map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
        const isLast = i === segments.length - 1;
        if (isLast) {
          return `<span class="text-primary font-bold">${label}</span>`;
        }
        return `<a class="hover:text-primary transition-colors" href="${href}">${label}</a>
                 <span class="material-symbols-outlined text-[14px]">chevron_right</span>`;
      })
      .join("\n");

    // Prev/Next navigation within the flattened nav
    const allItems = navTree.flatMap((s) => s.items);
    const currentIdx = allItems.findIndex((item) => item.path === activePath);
    const prevItem = currentIdx > 0 ? allItems[currentIdx - 1] : null;
    const nextItem = currentIdx < allItems.length - 1 ? allItems[currentIdx + 1] : null;

    const pagination = `
<div class="grid md:grid-cols-2 gap-4 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
  ${
    prevItem
      ? `<a class="group p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/50" href="${prevItem.path}">
      <span class="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">arrow_back</span> Previous
      </span>
      <span class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">${prevItem.title}</span>
    </a>`
      : `<div></div>`
  }
  ${
    nextItem
      ? `<a class="group p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col items-end gap-2 bg-slate-50 dark:bg-slate-900/50" href="${nextItem.path}">
      <span class="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        Next <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </span>
      <span class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">${nextItem.title}</span>
    </a>`
      : `<div></div>`
  }
</div>`;

    const tocHtml =
      toc.length > 0
        ? `<h5 class="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">On this page</h5>
          <ul class="space-y-3 text-sm">
            ${toc
              .map(
                (h) =>
                  `<li style="padding-left:${(h.level - 2) * 12}px"><a class="text-slate-500 hover:text-primary transition-colors" href="#${h.id}">${h.text}</a></li>`
              )
              .join("\n")}
          </ul>`
        : "";

    return `<!DOCTYPE html>
<html class="dark" lang="en">
<head>${htmlHead(title, description)}</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen selection:bg-primary/30">
  ${Header({ activePath })}
  <div class="max-w-[1440px] mx-auto flex">
    ${Sidebar(navTree, activePath)}
    <!-- Main content -->
    <main class="flex-1 min-w-0 py-12 px-6 lg:px-16 xl:px-24">
      <div class="max-w-4xl mx-auto">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs font-medium text-slate-500 mb-8 uppercase tracking-widest">
          ${breadcrumbs}
        </nav>
        <article class="prose-bueno">
          <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">${pageTitle}</h1>
          ${ctx.content}
        </article>
        ${pagination}
        <footer class="mt-20 py-8 text-center border-t border-slate-200 dark:border-slate-800">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Released under the MIT License. Built with love by the Bueno Community.
          </p>
        </footer>
      </div>
    </main>
    <!-- Right TOC -->
    <aside class="hidden xl:block w-64 h-[calc(100vh-4rem)] sticky top-16 p-8">
      ${tocHtml}
    </aside>
  </div>
  <!-- Mobile nav FAB -->
  <button class="fixed bottom-6 right-6 lg:hidden size-14 bg-primary text-background-dark rounded-full shadow-lg flex items-center justify-center z-[60]" aria-label="Open menu">
    <span class="material-symbols-outlined">menu</span>
  </button>
</body>
</html>`;
  };
}

// ---------------------------------------------------------------------------
// Main build
// ---------------------------------------------------------------------------

const navTree = await buildNavTree();

const ssg = createSSG(
  {
    contentDir: "./content",
    outputDir: "./dist",
    publicDir: "./public",
    defaultLayout: "landing",
  },
  siteConfig
);

ssg.registerLayout("landing", renderLandingLayout);
ssg.registerLayout("docs", renderDocsLayout(navTree));

console.log("Building Bueno docs...");
await ssg.build();
console.log("Done.");
