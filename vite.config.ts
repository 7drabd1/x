import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * After the build, fill the service worker with the list of every emitted file
 * so the whole app (JS, CSS, fonts, icons) is cached on the first visit and works offline.
 * The cache name changes whenever any file changes, so updates roll out cleanly.
 */
function precacheServiceWorker(): Plugin {
  let root = process.cwd();
  let outDir = 'dist';
  return {
    name: 'sadaqah-precache',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },
    closeBundle() {
      const dir = join(root, outDir);
      const files: string[] = [];
      const walk = (d: string) => {
        for (const name of readdirSync(d)) {
          const p = join(d, name);
          if (statSync(p).isDirectory()) walk(p);
          else files.push(relative(dir, p).split(sep).join('/'));
        }
      };
      walk(dir);

      const hash = createHash('sha1');
      for (const f of files.sort()) hash.update(f).update(readFileSync(join(dir, f)));
      const buildId = hash.digest('hex').slice(0, 10);

      const skip = /(^|\/)(sw\.js|\.nojekyll)$|\.map$|\.woff$|(vietnamese|latin-ext|cyrillic|greek)/;
      const precache = ['', ...files.filter((f) => !skip.test(f))];

      const swPath = join(dir, 'sw.js');
      const sw = readFileSync(swPath, 'utf8')
        .replace("const BUILD_ID = 'dev';", `const BUILD_ID = '${buildId}';`)
        .replace('const PRECACHE = [];', `const PRECACHE = ${JSON.stringify(precache)};`);
      writeFileSync(swPath, sw);
    },
  };
}

export default defineConfig({
  // Relative base: the same build works at a domain root (Vercel) and under /repo-name/ (GitHub Pages).
  base: './',
  plugins: [react(), tailwindcss(), precacheServiceWorker()],
});
