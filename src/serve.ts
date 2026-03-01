/**
 * Static file server for the generated docs site.
 * Serves files from dist/ with clean URL support.
 *
 * Usage: bun run src/serve.ts
 */

const PORT = 3001;
const DIST_DIR = new URL("../dist", import.meta.url).pathname;

Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);
    let path = url.pathname;

    // Try exact path first
    if (path === "/") {
      path = "/index.html";
    }

    const tryFile = async (filePath: string): Promise<Response | null> => {
      const file = Bun.file(`${DIST_DIR}${filePath}`);
      if (await file.exists()) {
        return new Response(file);
      }
      return null;
    };

    // 1. Exact path
    let res = await tryFile(path);
    if (res) return res;

    // 2. Clean URL: /docs/router → /docs/router/index.html
    if (!path.includes(".")) {
      res = await tryFile(`${path}/index.html`);
      if (res) return res;

      res = await tryFile(`${path.replace(/\/$/, "")}/index.html`);
      if (res) return res;
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Docs site running at http://localhost:${PORT}`);
