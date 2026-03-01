export interface HeaderOptions {
  activePath?: string;
}

export function Header({ activePath = "" }: HeaderOptions = {}): string {
  const isDocsActive = activePath.startsWith("/docs");

  return `
<header class="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
  <div class="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <a class="flex items-center group" href="/">
        <div class="size-8 flex items-center justify-center">
          <svg class="size-8" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 20V80L70 55L50 45L75 20H30Z" fill="#2badee"/>
            <path d="M30 20L20 30V70L30 80" stroke="#2badee" stroke-linecap="round" stroke-width="2"/>
          </svg>
        </div>
        <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">bueno</span>
      </a>
      <nav class="hidden lg:flex items-center gap-6">
        <a class="text-sm font-medium ${isDocsActive ? "text-primary" : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary"} transition-colors" href="/docs">Documentation</a>
        <a class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors" href="https://github.com/buenojs/bueno" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
        <a class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="https://github.com/buenojs/bueno" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg class="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>
        <button id="theme-toggle" class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" aria-label="Toggle theme">
          <span class="material-symbols-outlined theme-icon-dark hidden">dark_mode</span>
          <span class="material-symbols-outlined theme-icon-light">light_mode</span>
        </button>
      </div>
      <button class="md:hidden p-2 text-slate-500" id="mobile-menu-btn" aria-label="Open menu">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </div>
</header>
<script>
  (function() {
    var toggle = document.getElementById('theme-toggle');
    var html = document.documentElement;
    var darkIcon = document.querySelector('.theme-icon-dark');
    var lightIcon = document.querySelector('.theme-icon-light');

    function applyTheme(dark) {
      if (dark) {
        html.classList.add('dark');
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
      } else {
        html.classList.remove('dark');
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
      }
    }

    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ? saved === 'dark' : prefersDark);

    if (toggle) {
      toggle.addEventListener('click', function() {
        var isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        applyTheme(!isDark);
      });
    }
  })();
</script>`;
}
