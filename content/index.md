---
title: Build fast. Run on Bun.
description: The high-performance Bun-native framework for TypeScript apps. Minimal overhead, maximum developer happiness.
layout: landing
---

<!-- Hero Section -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
  <div class="grid lg:grid-cols-2 gap-12 items-center">
    <div class="flex flex-col space-y-8">
      <div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
          v0.8 — Built for Bun
        </span>
        <h1 class="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] dark:text-white">
          Build fast.<br/>
          <span class="text-primary italic">Run on Bun.</span>
        </h1>
        <p class="mt-6 text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
          The high-performance framework for modern TypeScript apps. Minimal overhead, maximum developer happiness, powered by the fastest runtime.
        </p>
      </div>
      <div class="flex flex-wrap gap-4">
        <a href="/docs/getting-started" class="px-8 py-4 bg-primary hover:bg-primary/90 text-background-dark font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20">
          Get Started
        </a>
        <a href="/docs" class="px-8 py-4 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-all">
          Documentation
        </a>
      </div>
    </div>

    <!-- Terminal code snippet -->
    <div class="relative group">
      <div class="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      <div class="relative bg-slate-900 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div class="text-[10px] uppercase tracking-widest font-bold text-slate-500 font-mono">zsh — bun</div>
        </div>
        <div class="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
          <div class="flex gap-4">
            <span class="text-slate-600">1</span>
            <span><span class="text-purple-400">bunx</span> <span class="text-primary">create-bueno</span> <span class="text-slate-300">my-app</span></span>
          </div>
          <div class="flex gap-4 mt-2">
            <span class="text-slate-600">2</span>
            <span class="text-slate-500"># Scaffolding project...</span>
          </div>
          <div class="flex gap-4 mt-2">
            <span class="text-slate-600">3</span>
            <span class="text-slate-300">Success! Project ready in 42ms.</span>
          </div>
          <div class="flex gap-4 mt-4">
            <span class="text-slate-600">4</span>
            <span><span class="text-purple-400">bun</span> <span class="text-primary">dev</span></span>
          </div>
          <div class="mt-4 flex flex-col gap-1 text-xs text-slate-400">
            <span>[bueno] Server listening on http://localhost:3000</span>
            <span class="text-green-400/80">&#x2713; Routes compiled [12ms]</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features Grid -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-200 dark:border-slate-800">
  <div class="grid md:grid-cols-3 gap-8">
    <div class="p-8 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-3xl">bolt</span>
      </div>
      <h3 class="text-xl font-bold mb-3 dark:text-white">Bun-Native Performance</h3>
      <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
        Built from the ground up for Bun. No adapters, no overhead — just raw performance from the fastest JavaScript runtime.
      </p>
    </div>
    <div class="p-8 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-3xl">security</span>
      </div>
      <h3 class="text-xl font-bold mb-3 dark:text-white">Type-Safe by Default</h3>
      <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
        First-class TypeScript throughout. Typed routes, typed context, typed validators — your IDE knows everything.
      </p>
    </div>
    <div class="p-8 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-3xl">category</span>
      </div>
      <h3 class="text-xl font-bold mb-3 dark:text-white">Full-Stack in One Package</h3>
      <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
        Router, middleware, SSR, SSG, database, jobs, i18n, WebSockets — everything you need, zero external dependencies.
      </p>
    </div>
    <div class="p-8 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-3xl">auto_fix_high</span>
      </div>
      <h3 class="text-xl font-bold mb-3 dark:text-white">Instant Reloading</h3>
      <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
        Experience the fastest dev loop with built-in HMR that updates in milliseconds — no waiting, just building.
      </p>
    </div>
    <div class="p-8 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-3xl">public</span>
      </div>
      <h3 class="text-xl font-bold mb-3 dark:text-white">Edge Ready</h3>
      <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
        Deploy to the edge with zero configuration. Optimized for ultra-low latency and instant cold starts.
      </p>
    </div>
    <div class="p-8 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
      <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-3xl">schema</span>
      </div>
      <h3 class="text-xl font-bold mb-3 dark:text-white">Any Validator</h3>
      <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
        Standard Schema interface means Zod, Valibot, ArkType or any other validator works out of the box.
      </p>
    </div>
  </div>
</section>

<!-- Simple by Design section -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-slate-100/50 dark:bg-slate-900/20 rounded-3xl border border-slate-200 dark:border-slate-800/50 mb-20">
  <div class="grid lg:grid-cols-2 gap-16 items-center">
    <div>
      <h2 class="text-3xl font-black mb-6 dark:text-white">Simple by Design.</h2>
      <div class="space-y-6">
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">1</div>
          <div>
            <h4 class="font-bold dark:text-white">Create your app</h4>
            <p class="text-slate-600 dark:text-slate-400">One command scaffolds a fully-typed project with the batteries you choose.</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">2</div>
          <div>
            <h4 class="font-bold dark:text-white">Define your routes</h4>
            <p class="text-slate-600 dark:text-slate-400">Expressive API with a rich context object that handles requests and responses elegantly.</p>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">3</div>
          <div>
            <h4 class="font-bold dark:text-white">Run with Bun</h4>
            <p class="text-slate-600 dark:text-slate-400">Native integration takes full advantage of Bun's performance — no build step, instant startup.</p>
          </div>
        </div>
      </div>
      <a href="/docs/getting-started" class="mt-10 inline-flex items-center gap-2 text-primary font-bold hover:underline">
        Explore full API reference
        <span class="material-symbols-outlined">arrow_right_alt</span>
      </a>
    </div>
    <div class="relative">
      <div class="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
      <div class="relative bg-[#1e1e1e] p-6 rounded-xl border border-slate-700/50 font-mono shadow-2xl">
        <div class="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
          <span class="material-symbols-outlined text-blue-400 text-sm">description</span>
          <span class="text-xs text-slate-400">app.ts</span>
        </div>
        <pre class="text-sm overflow-x-auto leading-relaxed"><code><span class="text-accent-violet">import</span> { <span class="text-blue-300">Bueno</span> } <span class="text-accent-violet">from</span> <span class="text-emerald-400">'@buenojs/bueno'</span>;

<span class="text-slate-500">// Create app with auto-selecting router</span>
<span class="text-primary">const</span> app = <span class="text-accent-violet">new</span> <span class="text-blue-300">Bueno</span>();

<span class="text-slate-500">// Define a typed route with validation</span>
app.<span class="text-sky-400">get</span>(<span class="text-emerald-400">'/'</span>, (ctx) =&gt; {
  <span class="text-accent-violet">return</span> ctx.<span class="text-sky-400">json</span>({
    message: <span class="text-emerald-400">'Hello from Bueno!'</span>,
    runtime: <span class="text-emerald-400">'Bun'</span>,
  });
});

<span class="text-slate-500">// Start — zero config</span>
app.<span class="text-sky-400">listen</span>(<span class="text-amber-400">3000</span>);</code></pre>
      </div>
    </div>
  </div>
</section>
