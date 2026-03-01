export function Footer(): string {
  const year = new Date().getFullYear();
  return `
<footer class="w-full border-t border-slate-200 dark:border-slate-800 py-12 mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-8">
      <div class="flex items-center">
        <div class="size-6 flex items-center justify-center">
          <svg class="size-6" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 20V80L70 55L50 45L75 20H30Z" fill="#a1a5ab"/>
            <path d="M30 20L20 30V70L30 80" stroke="#a1a5ab" stroke-linecap="round" stroke-width="2"/>
          </svg>
        </div>
        <span class="text-sm font-bold tracking-tight text-slate-500 italic">bueno</span>
        <span class="text-xs text-slate-400 ml-4">&copy; ${year} Bueno Framework. MIT License.</span>
      </div>
      <div class="flex items-center gap-8">
        <a class="text-xs font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest" href="https://github.com/buenojs/bueno" target="_blank" rel="noopener noreferrer">GitHub</a>
        <div class="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded border border-primary/20">
          <span class="text-[10px] font-black text-primary uppercase">Powered by</span>
          <svg class="w-4 h-4" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M31 0C13.88 0 0 13.88 0 31s13.88 31 31 31 31-13.88 31-31S48.12 0 31 0z" fill="#FBF0DF"/><path d="M44.2 27.4c-.6-1.4-1.8-2.4-3.4-2.4h-2.3l1.6-7.4c.2-.8-.4-1.6-1.2-1.6h-9.3c-.7 0-1.3.5-1.4 1.2l-2 12.4h-2.5c-.7 0-1.3.5-1.4 1.2l-2 12.4c-.2.8.4 1.6 1.2 1.6h5.7c.7 0 1.3-.5 1.4-1.2l.9-5.6h3.1c6.2 0 11.4-4.4 12.4-10.4.2-1.4.1-2.2-.3-3.2z" fill="#F472B6"/><path d="M28.1 35.6h-3.4l1-6.4h3.4c1.8 0 3.4 1.5 3.1 3.4-.3 1.7-1.9 3-4.1 3z" fill="#FBF0DF"/></svg>
          <span class="text-[10px] font-bold dark:text-white text-slate-700">Bun</span>
        </div>
      </div>
    </div>
  </div>
</footer>`;
}
