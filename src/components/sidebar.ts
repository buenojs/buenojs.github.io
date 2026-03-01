export interface NavItem {
  title: string;
  path: string;
  order?: number;
}

export interface NavSection {
  section: string;
  order: number;
  items: NavItem[];
}

export function Sidebar(navTree: NavSection[], activePath: string): string {
  const sections = navTree
    .map((section) => {
      const items = section.items
        .map((item) => {
          const isActive = item.path === activePath;
          return `<li><a class="block pl-4 py-1 text-sm ${
            isActive
              ? "font-semibold text-accent-violet border-l -ml-px border-accent-violet"
              : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors border-l -ml-px border-transparent"
          }" href="${item.path}">${item.title}</a></li>`;
        })
        .join("\n          ");

      return `
      <div>
        <h5 class="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider">${section.section}</h5>
        <ul class="space-y-2 border-l border-slate-200 dark:border-slate-800">
          ${items}
        </ul>
      </div>`;
    })
    .join("\n");

  return `
<aside class="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-slate-200 dark:border-slate-800 p-8">
  <nav class="space-y-8">
    ${sections}
  </nav>
</aside>`;
}
