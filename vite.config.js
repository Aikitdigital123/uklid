import { defineConfig } from 'vite';
import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const htmlPages = [
  'index.html',
  'sluzby.html',
  'prezentace.html',
  'faq.html',
  'privacy.html',
  'terms.html',
  'impresum.html',
  '404.html',
];

const staticDirs = [
  '.well-known',
  'images',
  'before-after',
];

const staticFiles = [
  'Lesktop_Cleaning_Services.pdf',
  'favicon.ico',
  'site.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'humans.txt',
  'CNAME',
  'BingSiteAuth.xml',
  '.nojekyll',
];

function normalizeBase(rawBase) {
  if (!rawBase || rawBase === '/') return '/';
  const withLeadingSlash = rawBase.startsWith('/') ? rawBase : `/${rawBase}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    async closeBundle() {
      const distDir = resolve(__dirname, 'dist');

      for (const dir of staticDirs) {
        try {
          await cp(resolve(__dirname, dir), resolve(distDir, dir), {
            recursive: true,
            force: true,
          });
        } catch {}
      }

      for (const file of staticFiles) {
        const source = resolve(__dirname, file);
        const target = resolve(distDir, file);
        try {
          await mkdir(dirname(target), { recursive: true });
          await cp(source, target, { force: true });
        } catch {}
      }
    },
  };
}

export default defineConfig(() => {
  const base = normalizeBase(process.env.VITE_BASE_PATH || process.env.BASE_PATH || '/');

  return {
    base,
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: Object.fromEntries(
          htmlPages.map((page) => [page.replace(/\.html$/, ''), resolve(__dirname, page)])
        ),
      },
    },
    plugins: [copyStaticFiles()],
  };
});
